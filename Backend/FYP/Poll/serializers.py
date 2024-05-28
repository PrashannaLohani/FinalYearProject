from rest_framework import serializers
from .models import Option

class QuestionSerializer(serializers.Serializer):
    question = serializers.CharField()
    options = serializers.ListField(
        child=serializers.CharField()
    )

class PollSerializer(serializers.Serializer):
    poll = serializers.CharField()
    questions = QuestionSerializer(many=True)

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['qid', 'poll', 'question', 'options', 'votes']
        read_only_fields = ['qid']

class PollJoinSerializer(serializers.Serializer):
    poll_id = serializers.IntegerField()