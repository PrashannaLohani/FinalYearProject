from rest_framework import serializers

# Serializers define the API representation.

class QuestionSerializer(serializers.Serializer):
    question = serializers.CharField()
    options = serializers.ListField(
        child=serializers.CharField()
    )

class PollSerializer(serializers.Serializer):
    poll = serializers.CharField()
    questions = QuestionSerializer(many=True)

class PollJoinSerializer(serializers.Serializer):
    poll_id = serializers.IntegerField()