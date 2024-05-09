from rest_framework import serializers
from .models import Poll

# Serializers define the API representation.

class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poll
        fields = ['question', 'options']  

    def create(self, validated_data):
        return Poll.objects.create(**validated_data)