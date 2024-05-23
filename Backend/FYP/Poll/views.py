from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PollSerializer, PollJoinSerializer
import random
from .models import PollCode, Option
import jwt
from FYP import settings
from CRM.models import Signup
from django.db.models import Sum
from django.db import transaction
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your views here.
class PollCodeCreateAPI(APIView):
    def post(self, request):
        authorization_header = request.headers.get('Authorization')
        if not authorization_header or 'Bearer' not in authorization_header:
            return Response({'error': 'Authorization header is missing or invalid.'}, status=status.HTTP_401_UNAUTHORIZED)

        usertoken = authorization_header.split()[1]
        try:
            decoded_token = jwt.decode(usertoken, settings.SECRET_KEY, algorithms=['HS256'])
            email = decoded_token.get('email')
            user = Signup.objects.get(email=email)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired.'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        poll_id = ''.join([str(random.randint(1, 9)) for _ in range(6)])
        poll = PollCode.objects.create(poll_id=poll_id, user=user)
        return Response({'poll_id': poll_id}, status=status.HTTP_201_CREATED)
    

class PollCreateAPI(APIView):
    def post(self, request):
        serializer = PollSerializer(data=request.data)
        if serializer.is_valid():
            poll_id = serializer.validated_data['poll']
            questions_data = serializer.validated_data['questions']
            
            with transaction.atomic():
                for question_data in questions_data:
                    question_text = question_data['question']
                    options_list = question_data['options']
                    for option_text in options_list:
                        Option.objects.create(
                            poll=poll_id,
                            question=question_text,
                            options=option_text
                        )

                # Notify via WebSocket
                self.notify_poll_created(poll_id)
            
            return Response({'message': 'Poll created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        poll_id = request.query_params.get('poll_id')
        question = request.query_params.get('question')
        if not poll_id or not question:
            return Response({'error': 'Poll ID and question are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            poll_options = Option.objects.filter(poll=poll_id, question=question).values('options', 'votes').distinct('options')
            return Response({'poll_options': list(poll_options)}, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Poll options not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def notify_poll_created(self, poll_id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'poll_{poll_id}',
            {
                'type': 'poll_message',
                'message': {'status': 'created', 'poll_id': poll_id}
            }
        )


class ParticipantOption(APIView):
    def get(self, request):
        try:
            poll_id = request.query_params.get('poll_id')
            if not poll_id:
                return Response({'error': 'Poll ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            questions = Option.objects.filter(poll=poll_id).values_list('question', flat=True).distinct()
            if not questions:
                return Response({'error': 'No questions found for this poll ID'}, status=status.HTTP_404_NOT_FOUND)

            response_data = []
            for question in questions:
                poll_options = Option.objects.filter(poll=poll_id, question=question).values('options', 'votes')
                response_data.append({
                    'question': question,
                    'poll_options': list(poll_options)
                })

            return Response(response_data, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Poll options not found'}, status=status.HTTP_404_NOT_FOUND)


class VoteOption(APIView):
    def post(self, request):
        poll = request.data.get('poll')
        votes = request.data.get('votes')
        
        if not poll or not votes:
            return Response({'error': 'Poll ID and votes are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            for vote in votes:
                question = vote.get('question')
                selected_option = vote.get('selected_option')
                if not question or not selected_option:
                    continue

                options = Option.objects.filter(poll=poll, question=question, options=selected_option)
                for option in options:
                    option.votes += 1
                    option.save()

            # Notify via WebSocket
            self.notify_votes_updated(poll)

            return Response({'message': 'Votes registered successfully'}, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)
    
        
    def notify_votes_updated(self, poll_id):
        channel_layer = get_channel_layer()
        options = Option.objects.filter(poll=poll_id).values('question', 'options', 'votes')

        # Process options to ensure distinct options per question
        distinct_options = {}
        for option in options:
            question = option['question']
            if question not in distinct_options:
                distinct_options[question] = []
            # Check if the option is already added
            if not any(opt['options'] == option['options'] for opt in distinct_options[question]):
                distinct_options[question].append(option)

        # Convert the distinct options dictionary to a list of options per question
        distinct_options_list = []
        for question, opts in distinct_options.items():
            distinct_options_list.extend(opts)

        async_to_sync(channel_layer.group_send)(
            f'poll_{poll_id}',
            {
                'type': 'poll_message',
                'question': 'all',  # This could be more specific if needed
                'options': distinct_options_list
            }
        )


class JoinPollApi(APIView):
    def post(self, request):
        serializer = PollJoinSerializer(data=request.data)
        if serializer.is_valid():
            poll_id = serializer.validated_data.get('poll_id')
            try:
                poll = PollCode.objects.get(poll_id=poll_id)
                if not poll.active:
                    return Response({'error': 'Session already ended'}, status=status.HTTP_403_FORBIDDEN)
                
                poll.num_of_people += 1
                poll.save()
                
                option = Option.objects.filter(poll=poll_id).first()
                if option:
                    return Response({'poll_id': poll.poll_id}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'No options found for this poll. Please wait for the presenter to set up options.'}, status=status.HTTP_400_BAD_REQUEST)
            except PollCode.DoesNotExist:
                return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserJoin(APIView):
    def get(self, request):
        try:
            poll_id = request.query_params.get('poll_id')
            if not poll_id:
                return Response({'error': 'Poll ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            num_of_people = PollCode.objects.filter(poll_id=poll_id).aggregate(total_people=Sum('num_of_people'))['total_people']
            if num_of_people is None:
                num_of_people = 0

            return Response({'num_of_people': num_of_people}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeactivatePollAPI(APIView):
    def post(self, request):
        poll_id = request.data.get('poll_id')
        try:
            poll = PollCode.objects.get(poll_id=poll_id)
            poll.active = False
            poll.save()
            
            # Notify via WebSocket
            self.notify_poll_deactivated(poll_id)

            return Response({'message': 'Poll deactivated successfully', 'poll_id': poll_id}, status=status.HTTP_200_OK)
        except PollCode.DoesNotExist:
            return Response({'error': 'Poll not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def notify_poll_deactivated(self, poll_id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'poll_{poll_id}',
            {
                'type': 'poll_message',
                'message': {'status': 'deactivated', 'poll_id': poll_id}
            }
        )


class Stats(APIView):
    def get(self, request):
        token = request.headers.get('Authorization')
        if token:
            try:
                token = token.split()[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                email = decoded_token.get('email')
                user = Signup.objects.get(email=email)

                total_polls = PollCode.objects.filter(user=user).count()
                total_votes = Option.objects.aggregate(total_votes=Sum('votes'))['total_votes']
                if total_votes is None:
                    total_votes = 0

                poll_data = Option.objects.all().values('poll', 'question', 'options', 'votes')

                return Response({
                    'total_polls': total_polls,
                    'total_votes': total_votes,
                    'poll_data': list(poll_data)
                }, status=status.HTTP_200_OK)
            except jwt.ExpiredSignatureError:
                return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            except Signup.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Authorization header not found'}, status=status.HTTP_400_BAD_REQUEST)
