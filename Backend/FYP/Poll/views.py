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
import uuid
import re

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
            poll = serializer.validated_data['poll']
            questions = serializer.validated_data['questions']

            question_qid_map = {}
            options_instances = []
            for question_data in questions:
                question_text = question_data['question']
                if question_text not in question_qid_map:
                    existing_option = Option.objects.filter(poll=poll, question=question_text).first()
                    if existing_option:
                        qid = existing_option.qid
                    else:
                        qid = uuid.uuid4()
                    question_qid_map[question_text] = qid
                else:
                    qid = question_qid_map[question_text]

                for option_text in question_data['options']:
                    option_instance = Option(
                        qid=qid,
                        poll=poll,
                        question=question_text,
                        options=option_text
                    )
                    options_instances.append(option_instance)

            Option.objects.bulk_create(options_instances)

            poll_id = options_instances[0].poll if options_instances else None

            for question, qid in question_qid_map.items():
                self.notify_poll_created(poll_id, qid)

            return Response({
                'message': 'Poll created successfully',
                'poll_id': poll_id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        poll_id = request.query_params.get('poll_id')
        if not poll_id:
            return Response({'error': 'Poll ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            questions = Option.objects.filter(poll=poll_id).values('qid', 'question').distinct()
            return Response({'questions': list(questions)}, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Questions not found for this poll ID'}, status=status.HTTP_404_NOT_FOUND)

    def notify_poll_created(self, poll_id, qid):
        channel_layer = get_channel_layer()
        sanitized_qid = re.sub(r'\W+', '_', str(qid))
        async_to_sync(channel_layer.group_send)(
            f'poll_{poll_id}_{sanitized_qid}',
            {
                'type': 'poll_message',
                'message': {'status': 'created', 'poll_id': poll_id, 'qid': sanitized_qid}
            }
        )

class PresenterOption(APIView):
    def get(self, request):
        poll_id = request.query_params.get('poll_id')
        qid = request.query_params.get('qid')

        if poll_id and qid:
            options = Option.objects.filter(poll=poll_id, qid=qid).values('options', 'votes')
            return Response({'poll_options': list(options)}, status=status.HTTP_200_OK)
        return Response({'error': 'poll_id and qid are required'}, status=status.HTTP_400_BAD_REQUEST)

class ParticipantOption(APIView):
    def get(self, request):
        try:
            poll_id = request.query_params.get('poll_id')
            if not poll_id:
                return Response({'error': 'Poll ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            questions = Option.objects.filter(poll=poll_id).values('qid', 'question').distinct()
            if not questions:
                return Response({'error': 'No questions found for this poll ID'}, status=status.HTTP_404_NOT_FOUND)

            response_data = []
            for question in questions:
                qid = question['qid']
                question_text = question['question']
                poll_options = Option.objects.filter(poll=poll_id, qid=qid).values('options', 'votes')
                response_data.append({
                    'qid': qid,
                    'question': question_text,
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

            for vote in votes:
                question = vote.get('question')
                if question:
                    self.notify_votes_updated(poll, question)

            return Response({'message': 'Votes registered successfully'}, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def notify_votes_updated(self, poll_id, question):
        channel_layer = get_channel_layer()
        sanitized_question = re.sub(r'\W+', '_', question)
        options = Option.objects.filter(poll=poll_id, question=question).values('question', 'options', 'votes')
        options_list = list(options)

        async_to_sync(channel_layer.group_send)(
            f'poll_{poll_id}_{sanitized_question}',
            {
                'type': 'poll_message',
                'question': sanitized_question,
                'options': options_list
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
                polls = PollCode.objects.filter(user=user)

                total_polls = polls.count()
                total_votes = polls.aggregate(total_votes=Sum('votes'))['total_votes']
                if total_votes is None:
                    total_votes = 0
                
                poll_data =[poll.to_dict() for poll in polls]

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
