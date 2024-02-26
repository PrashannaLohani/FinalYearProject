
from datetime import datetime
from django.forms import ValidationError
from rest_framework import serializers
from .models import Signup
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate

class SignupSerializer(serializers.Serializer):
    id = serializers.IntegerField(required = False)
    full_name = serializers.CharField(max_length = 300,required = False)
    email = serializers.EmailField(max_length = 100)
    password = serializers.CharField(max_length = 128)
    created_at = serializers.DateTimeField(read_only = True, default=datetime.now)

    
    def create(self,validate_data ):
        password = validate_data.pop('password')
        hashed_password = make_password(password)

        return Signup.objects.create(password=hashed_password,**validate_data)
    
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length = 100)
    password = serializers.CharField(max_length = 128)

    def check_user(self, clean_data):
        email = clean_data.get('email')
        password = clean_data.get('password')

        # Hash the password
        hashed_password = make_password(password)

        # Authenticate the user with the hashed password
        user = authenticate(email=email, password=hashed_password)

        if not user:
            raise ValidationError('User not found or invalid credentials')
        return user
    

class VerifySerializer(serializers.Serializer):
    email = serializers.EmailField(max_length = 100)

    def verify_user(self,clean_data):
        email = authenticate(email = clean_data['email'])

        if not email :
            raise ValidationError('Email not found')
        return email
class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length = 100)
    confirm_password = serializers.CharField(max_length = 100)

    def update(self,instance,validate_data):
        instance.set_password(validate_data.get('password'))
        instance.save()
        return instance