
from rest_framework import serializers
from .models import Signup

class SignupSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField(max_length = 100)
    email = serializers.EmailField(max_length = 100)
    password = serializers.CharField(max_length = 30)
    Cpassword = serializers.CharField(max_length = 30)
    
    def create(self,validate_data ):
        return Signup.object.create(**validate_data)