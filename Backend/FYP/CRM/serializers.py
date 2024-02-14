
from datetime import datetime
from django.forms import ValidationError
from rest_framework import serializers
from .models import Signup
from django.contrib.auth import authenticate

class SignupSerializer(serializers.Serializer):
    id = serializers.IntegerField(required = False)
    fullname = serializers.CharField(max_length = 300,required = False)
    email = serializers.EmailField(max_length = 100)
    password = serializers.CharField(max_length = 128)
    created_at = serializers.DateTimeField(read_only = True, default=datetime.now)

    
    def create(self,validate_data ):
        return Signup.objects.create(**validate_data)
    
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length = 100)
    password = serializers.CharField(max_length = 128)

    def check_user(self,clean_data):
        user = authenticate(email = clean_data['email'], password = clean_data['password'])
        
        if not user:
            raise ValidationError('user not found')
        return user
    

class VerifySerializer(serializers.Serializer):
    email = serializers.EmailField(max_length = 100)

    def verify_user(self,clean_data):
        email = authenticate(email = clean_data['email'])

        if not email :
            raise ValidationError('Email not found')
        return email