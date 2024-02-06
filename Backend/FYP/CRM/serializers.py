
from rest_framework import serializers
from .models import Signup
from .models import Login


class SignupSerializer(serializers.Serializer):
    id = serializers.IntegerField(required = False)
    fullname = serializers.CharField(max_length = 300,required = False)
    email = serializers.EmailField(max_length = 100)
    password = serializers.CharField(max_length = 128)

    
    def create(self,validate_data ):
        return Signup.objects.create(**validate_data)
    
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length = 100)
    password = serializers.CharField(max_length = 128)
    def create(self,validate_data ):
        return Login.objects.create(**validate_data)

