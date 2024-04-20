from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['room_id', 'room_name', 'limit_people_num']  
        read_only_fields = ['room_id']  # Make 'room_id' read-only

    def create(self, validated_data):
        return Room.objects.create(**validated_data)
    
class JoinSerializer(serializers.ModelSerializer):
    room_code = serializers.IntegerField()