from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PollSerializer
import random
from .models import Poll
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
            full_name = decoded_token.get('full_name')
            user = Signup.objects.get(full_name=full_name)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired.'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate random poll_id
        poll_id = ''.join([str(random.randint(1, 9)) for _ in range(6)])
        
        # Create the poll object with only poll_id
        poll = Poll.objects.create(poll_id=poll_id,user=user)
        
        # Return the poll_id
        return Response({'poll_id': poll_id}, status=status.HTTP_201_CREATED)
    
class PollCreateAPI(APIView):
    def post(self, request):
        

        serializer = PollSerializer(data=request.data)
        if serializer.is_valid():
            question = serializer.validated_data.get('question')
            options = serializer.validated_data.get('options')
            
            poll_id = request.data.get('poll_id') 
            user = request.data.get('user') 

            # Create the poll object
            poll = Poll.objects.create(poll_id=poll_id, user=user, question=question, options=options)
            
            # Generate JWT token
            token = jwt.encode({'poll_id': poll_id, 'question': question, 'options': options}, settings.SECRET_KEY, algorithm='HS256')
            
            # Serialize response
            response_data = {
                'token': token,
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)