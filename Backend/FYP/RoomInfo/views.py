
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Participant
from .serializers import RoomSerializer, ParticipantSerializer
from rest_framework.generics import ListCreateAPIView

class RoomAPI(APIView):
    def post(self, request, format=None):
        pass
    #     serializer = RoomSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ParticipantAPI(ListCreateAPIView):
    # queryset = Participant.objects.all()
    # serializer_class = ParticipantSerializer

    def post(self, request, *args, **kwargs):
        pass
    #     serializer = self.get_serializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

def CommentAPI(APIView):
    pass
