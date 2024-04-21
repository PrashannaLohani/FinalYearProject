
import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoomSerializer, JoinSerializer,CommentSerializer
from rest_framework import status
from FYP import settings
import random
import string
from .models import Room,Comments



class RoomAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = RoomSerializer(data=request.data)
            if serializer.is_valid():
                room_name = serializer.validated_data.get('room_name')
                limit_people_num=serializer.validated_data.get('limit_people_num')
                room_id = ''.join([str(random.randint(0, 9)) for _ in range(6)])  # Generate room ID
                room = Room.objects.create(room_id=room_id,room_name=room_name,limit_people_num=limit_people_num)
                room.save()
                total_rooms = Room.objects.count()

                token = jwt.encode({'room_id': room_id,'room_name':room_name,'limit_people_num':limit_people_num}, settings.SECRET_KEY, algorithm='HS256')
                return Response({'token': token, 'ID':room_id,'name':room_name,'People Limitation':limit_people_num, 'total_rooms': total_rooms}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        rooms = Room.objects.all()
        room_data = [{'room_id': room.room_id, 'room_name': room.room_name, 'num_of_comments': room.num_of_comments} for room in rooms]
        return Response(room_data, status=status.HTTP_200_OK)

        
class JoinAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = JoinSerializer(data=request.data)
            if serializer.is_valid():
                room_code = serializer.validated_data.get('room_code')
                try:
                    room = Room.objects.get(room_id=room_code)
                    username = self.generate_random_username()
                    # Room exists, do something with the room
                    Roomtoken = jwt.encode({'username': username,'room':room_code}, settings.SECRET_KEY, algorithm='HS256')
                    return Response({'token': Roomtoken, 'username':username,'room':room_code}, status=status.HTTP_201_CREATED)
                except Room.DoesNotExist:
                    # Room does not exist
                    return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def generate_random_username(self):
        # Generate a random string of 3 digits
        random_suffix = ''.join(random.choices(string.digits, k=4))
        # Combine with a base string 'user'
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
                comment = Comments.objects.create(user=user, room=room, message=message)  # Added 'room' field

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
                comments = Comments.objects.filter(room=room_code)
            else:
                comments = Comments.objects.all()
                serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
