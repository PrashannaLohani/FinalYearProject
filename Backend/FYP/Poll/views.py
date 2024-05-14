from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PollSerializer,PollJoinSerializer
import random
from .models import  PollCode,Option
import jwt
from FYP import settings
from CRM.models import Signup

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
            question = serializer.validated_data.get('question')
            options_str = serializer.validated_data.get('options')
            poll = serializer.validated_data.get('poll')

            if not question or not options_str:
                return Response({'error': 'Question and options are required'}, status=status.HTTP_400_BAD_REQUEST)

            options = options_str.split(",")  # Split options by comma

            # List to store tokens for each option
            tokens = []

            for option in options:
                # Create the poll object for each option
                new_option = Option.objects.create(poll=poll, question=question, options=option)
                
                # Generate JWT token for each option
                token = jwt.encode({'poll': poll, 'question': question, 'option': option}, settings.SECRET_KEY, algorithm='HS256')
                
                # Append token to list
                tokens.append(token)
            
            # Serialize response
            response_data = {
                'tokens': tokens,
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self,request):
        poll_id = request.query_params.get('poll_id')
        question = request.query_params.get('question')
        
        if not poll_id or not question:
            return Response({'error': 'Poll ID and question are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            poll_options = Option.objects.filter(poll=poll_id, question=question).values('options', 'votes')
            return Response({'poll_options': list(poll_options)}, status=status.HTTP_200_OK)
        except Option.DoesNotExist:
            return Response({'error': 'Poll options not found'}, status=status.HTTP_404_NOT_FOUND)
        

class JoinPollApi(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = PollJoinSerializer(data=request.data)
            if serializer.is_valid():
                poll_id = serializer.validated_data.get('poll_id')
                try:
                    poll = PollCode.objects.get(poll_id=poll_id)
                    
                    if poll.session:
                        return Response({'error': 'Session already ended'}, status=status.HTTP_403_FORBIDDEN)
                    
                    # Increment num_of_people
                    poll.num_of_people += 1
                    poll.save()
                    
                    return Response({'poll_id': poll.poll_id, 'num_of_people': poll.num_of_people}, status=status.HTTP_201_CREATED)
                
                except PollCode.DoesNotExist:
                    return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)