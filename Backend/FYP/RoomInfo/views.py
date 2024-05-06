
import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoomSerializer, JoinSerializer,CommentSerializer
from rest_framework import status
from FYP import settings
import random
import string
from .models import Room,Comment,Upvote
from CRM.models import Signup

class RoomAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = RoomSerializer(data=request.data)
            if serializer.is_valid():
                room_name = serializer.validated_data.get('room_name')
                limit_people_num=serializer.validated_data.get('limit_people_num')
                room_id = ''.join([str(random.randint(1, 9)) for _ in range(6)])  # Generate room ID
                room = Room.objects.create(room_id=room_id, room_name=room_name, limit_people_num=limit_people_num)
                room.save()
                

                token = jwt.encode({'room_id': room_id, 'room_name': room_name, 'limit_people_num': limit_people_num}, settings.SECRET_KEY, algorithm='HS256')
                return Response({'token': token, 'ID': room_id, 'name': room_name, 'People Limitation': limit_people_num, }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def get(self, request):
        rooms = Room.objects.all()
        room_data = [{'room_id': room.room_id, 'room_name': room.room_name, 'limit_people_num': room.limit_people_num, 'num_of_people': room.num_of_people, 'num_of_comments': room.num_of_comments} for room in rooms]
        return Response(room_data, status=status.HTTP_200_OK)

class Stats(APIView):
    def get(self, request):
        token = request.headers.get('Authorization')
        if token:
            try:
                # Extract the token from the Authorization header
                token = token.split()[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

                # Extract user_id from the token
                full_name = decoded_token.get('full_name')

                # Fetch the user associated with the token
                user = Signup.objects.get(full_name=full_name)

                # Fetch the rooms associated with the user
                rooms = Room.objects.filter(user=user)

                # Count the total number of rooms created by the user
                total_rooms = rooms.count()
                
                # Serialize the room data
                room_data = [room.to_dict() for room in rooms]

                total_participants = sum(room.num_of_people for room in rooms)

                total_comments = sum(room.num_of_comments for room in rooms)

                return Response({'room_data': room_data, 'total_rooms': total_rooms,"total_participants":total_participants,"total_comments":total_comments}, status=status.HTTP_200_OK)
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
        
class JoinAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = JoinSerializer(data=request.data)
            if serializer.is_valid():
                room_code = serializer.validated_data.get('room_code')
                try:
                    room = Room.objects.get(room_id=room_code)
                    username = self.generate_random_username()
                    
                    # Increment num_of_people
                    room.num_of_people += 1
                    room.save()
                    
                    # Generate token
                    Roomtoken = jwt.encode({'username': username, 'room': room_code}, settings.SECRET_KEY, algorithm='HS256')
                    
                    return Response({'token': Roomtoken, 'username': username, 'room': room_code}, status=status.HTTP_201_CREATED)
                except Room.DoesNotExist:
                    return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def generate_random_username(self):
        random_suffix = ''.join(random.choices(string.digits, k=4))
        return f"User{random_suffix}"
    
class DecodeUserTokenAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            token = request.data.get('token')
            if not token:
                return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                username = decoded_token.get('username')
                room_code = decoded_token.get('room')
                # Additional information from the token can be extracted here
                return Response({'username': username, 'room': room_code}, status=status.HTTP_200_OK)
            except jwt.ExpiredSignatureError:
                return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            

class CommentAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                room = serializer.validated_data['room']  # Use square brackets to access dictionary key
                user = serializer.validated_data.get('user')
                message = serializer.validated_data['message']  # Use square brackets to access dictionary key
                
                # Save the comment to the database
                comment = Comment.objects.create(user=user, room=room, message=message)  # Added 'room' field

                room_obj = Room.objects.get(room_id=room)
                room_obj.num_of_comments += 1
                room_obj.save()
                
                # Return a success response
                return Response({'message': 'Comment posted successfully'}, status=status.HTTP_201_CREATED)
            else:
                # Return validation errors
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def get(self, request):
        if request.method == 'GET':
            if request.method == 'GET':
                room_code = request.query_params.get('room_code')
            if room_code:
                comments = Comment.objects.filter(room=room_code)
            else:
                comments = Comment.objects.all()
                serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
class RoomCommentsCountAPI(APIView):
    def post(self, request):
        try:
            room_id = request.data.get('room_id')
            room = Room.objects.get(room_id=room_id)
            return Response({
                'num_of_comments': room.num_of_comments,
                'num_of_people': room.num_of_people
            }, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        
class UpvoteCommentAPI(APIView):
    def post(self, request):
        # Assuming 'room' and 'message' are provided in the request data
        room = request.data.get('room')
        message = request.data.get('message')
        user = request.data.get('user')  # Assuming 'user' is provided in the request data
        
        try:
            comment = Comment.objects.get(room=room, message=message)
            
            # Check if the user has already upvoted this comment
            if Upvote.objects.filter(user=user, comment=comment).exists():
                return Response({'error': 'User has already upvoted this comment'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create the upvote
            upvote = Upvote.objects.create(user=user, comment=comment, comment_identifier=comment.get_unique_identifier())
            
            return Response({'success': 'Upvote created successfully'}, status=status.HTTP_201_CREATED)
        
        except Comment.DoesNotExist:
            return Response({'error': 'Comment does not exist'}, status=status.HTTP_404_NOT_FOUND)
