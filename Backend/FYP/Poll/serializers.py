from rest_framework import serializers
from .models import Option

# Serializers define the API representation.

class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['poll','question', 'options']  

    def create(self, validated_data):
        return Option.objects.create(**validated_data)

class PollJoinSerializer(serializers.Serializer):
    poll_id = serializers.IntegerField()