
from django.forms import ValidationError
from rest_framework import serializers
from .models import Signup
from django.contrib.auth import authenticate

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

    def check_user(self,clean_data):
        user = authenticate(username = clean_data['email'], password = clean_data['password'])
        
        if not user:
            raise ValidationError('user not found')
        return user