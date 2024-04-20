
import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoomSerializer, JoinSerializer
from rest_framework import status
from FYP import settings
import random
from .models import Room



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
        if request.method == 'GET':
            rooms = Room.objects.all()
            room_data = [{'room_id': room.room_id, 'room_name': room.room_name} for room in rooms]
            return Response(room_data, status=status.HTTP_200_OK)
        else:
            return Response( status=status.HTTP_400_BAD_REQUEST)
        
class JoinAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = JoinSerializer(data=request.data)
            if serializer.is_valid():
                room_code = serializer.validated_data.get('room_code')
                try:
                    room = Room.objects.get(room_id=room_code)
                    # Room exists, do something with the room
                    return Response({'message': 'Room exists'}, status=status.HTTP_200_OK)
                except Room.DoesNotExist:
                    # Room does not exist
                    return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    