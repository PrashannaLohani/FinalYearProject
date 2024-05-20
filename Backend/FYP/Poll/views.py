from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PollSerializer,PollJoinSerializer
import random
from .models import  PollCode,Option
import jwt
from FYP import settings
from CRM.models import Signup
from django.db.models import Sum

# Create your views here.
class PollCodeCreateAPI(APIView):
    def post(self, request):
        # Get the authorization token from the header
        authorization_header = request.headers.get('Authorization')
        
        # Check if the authorization header exists and contains the token
        if not authorization_header or 'Bearer' not in authorization_header:
            return Response({'error': 'Authorization header is missing or invalid.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Extract the token from the header
        usertoken = authorization_header.split()[1]
        
        try:
            # Decode the token to get user information
            decoded_token = jwt.decode(usertoken, settings.SECRET_KEY, algorithms=['HS256'])
            email = decoded_token.get('email')
            user = Signup.objects.get(email=email)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired.'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate random poll_id
        poll_id = ''.join([str(random.randint(1, 9)) for _ in range(6)])
        
        # Create the poll object with only poll_id
        poll = PollCode.objects.create(poll_id=poll_id,user=user)
        
        # Return the poll_id
        return Response({'poll_id': poll_id}, status=status.HTTP_201_CREATED)
    
class PollCreateAPI(APIView):
    
    def post(self, request):
        serializer = PollSerializer(data=request.data)
        if serializer.is_valid():
            # Retrieve validated data from serializer
            poll_id = serializer.validated_data['poll']
            questions_data = serializer.validated_data['questions']
            
            # Save each question and its options
            for question_data in questions_data:
                question_text = question_data['question']
                options_list = question_data['options']
                
                # Create an Option instance for each option in options_list
                for option_text in options_list:
                    Option.objects.create(
                        poll=poll_id,
                        question=question_text,
                        options=option_text
                    )
                
            # Return a success response
            return Response({'message': 'Poll created successfully'}, status=status.HTTP_201_CREATED)
        else:
            # If serializer validation fails, return error response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
    def get(self, request):
        poll_id = request.query_params.get('poll_id')
        question = request.query_params.get('question')
        
        if not poll_id or not question:
            return Response({'error': 'Poll ID and question are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            poll_options = Option.objects.filter(poll=poll_id, question=question).values('options', 'votes').distinct()
            return Response({'poll_options': list(poll_options)}, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Poll options not found'}, status=status.HTTP_404_NOT_FOUND)
        
class ParticipantOption(APIView):
    def get(self, request):
        try:
            poll_id = request.query_params.get('poll_id')
            if not poll_id:
                return Response({'error': 'Poll ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Get the most recent question and its options for the specified poll ID
            most_recent_question = Option.objects.filter(poll=poll_id).order_by('-id').first()
            if not most_recent_question:
                return Response({'error': 'No questions found for this poll ID'}, status=status.HTTP_404_NOT_FOUND)

            poll_options = Option.objects.filter(poll=poll_id, question=most_recent_question.question).values('options', 'votes')

            return Response({'question': most_recent_question.question, 'poll_options': list(poll_options)}, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Poll options not found'}, status=status.HTTP_404_NOT_FOUND)
        
class VoteOption(APIView):
    def post(self, request):
        poll_id = request.data.get('poll_id')
        question = request.data.get('question')
        selected_option = request.data.get('selected_option')
        
        if not poll_id or not question or not selected_option:
            return Response({'error': 'Poll ID, question, and selected_option are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get the selected option from the database
            option = Option.objects.get(poll=poll_id, question=question, options=selected_option)
            # Increment the vote count for the selected option
            option.votes += 1
            option.save()
            return Response({'message': 'Vote registered successfully'}, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)
        

class JoinPollApi(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = PollJoinSerializer(data=request.data)
            if serializer.is_valid():
                poll_id = serializer.validated_data.get('poll_id')
                try:
                    poll = PollCode.objects.get(poll_id=poll_id)
                    
                    if not poll.active:
                        return Response({'error': 'Session already ended'}, status=status.HTTP_403_FORBIDDEN)
                    
                    # Increment num_of_people
                    poll.num_of_people += 1
                    poll.save()
                    
                    option = Option.objects.filter(poll=poll_id).first()
                    if option:
                        question = option.question
                        return Response({
                            'poll_id': poll.poll_id, 
                            'num_of_people': poll.num_of_people,
                            'question': question  
                        }, status=status.HTTP_201_CREATED)
                    else:
                        return Response({'error': 'No options found for this poll. Please wait for the presenter to set up options.'}, status=status.HTTP_400_BAD_REQUEST)
                
                except PollCode.DoesNotExist:
                    return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid HTTP method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        

class UserJoin(APIView):
    def get(self, request):
        try:
            poll_id = request.query_params.get('poll_id')
            if not poll_id:
                return Response({'error': 'Poll ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Query to get the number of people for the specific poll ID
            num_of_people = PollCode.objects.filter(poll_id=poll_id).aggregate(total_people=Sum('num_of_people'))['total_people']

            # If no people found, return 0
            if num_of_people is None:
                num_of_people = 0

            return Response({'num_of_people': num_of_people}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeactivatePollAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            poll_id = request.data.get('poll_id')  # Assuming 'room_id' is passed in the request data

            try:
                poll = PollCode.objects.get(poll_id=poll_id)
            except poll.DoesNotExist:
                return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

            # Deactivate the room
            poll.active = False
            poll.save()

            return Response({'message': 'Room deactivated successfully', 'poll_id': poll_id}, status=status.HTTP_200_OK)