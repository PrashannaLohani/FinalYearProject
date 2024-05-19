from rest_framework import serializers
from .models import Option

# Serializers define the API representation.

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'poll', 'question', 'options', 'votes']
        read_only_fields = ['id', 'votes']

class QuestionSerializer(serializers.Serializer):
    question_text = serializers.CharField()
    options = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField())
    )

class PollSerializer(serializers.Serializer):
    poll = serializers.CharField()
    questions = serializers.ListField(child=QuestionSerializer())

    def create(self, validated_data):
        poll_id = validated_data.get('poll')
        questions_data = validated_data.get('questions')

        created_data = []

        for question_data in questions_data:
            question_text = question_data.get('question_text')
            options_data = question_data.get('options')

            question_entry = {
                'question_text': question_text,
                'options': []
            }

            for option_data in options_data:
                option_text = option_data['option_text']
                new_option = Option.objects.create(
                    poll=poll_id,
                    question=question_text,
                    options=option_text
                )

                question_entry['options'].append({
                    'option_text': option_text,
                    'id': new_option.id
                })

            created_data.append(question_entry)

        return {
            'poll': poll_id,
            'questions': created_data,
        }
class PollJoinSerializer(serializers.Serializer):
    poll_id = serializers.IntegerField()