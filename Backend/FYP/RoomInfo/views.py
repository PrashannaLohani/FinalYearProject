
import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoomSerializer
from rest_framework import status
from FYP import settings
import random
from .models import Room

class RoomAPI(APIView):
    def post(self, request, format=None):
        if request.method == 'POST':
            serializer = RoomSerializer(data=request.data)
            if serializer.is_valid():
                room_name = serializer.validated_data.get('room_name')
                limit_people_num=serializer.validated_data.get('limit_people_num')
                room_id = ''.join([str(random.randint(0, 9)) for _ in range(6)])  # Generate room ID
                room = Room.objects.create(room_id=room_id,room_name=room_name,limit_people_num=limit_people_num)
                room.save()

                token = jwt.encode({'room_id': room_id}, settings.SECRET_KEY, algorithm='HS256')
                return Response({'token': token, 'ID':room_id,'name':room_name}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)