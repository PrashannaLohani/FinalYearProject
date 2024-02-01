from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    password1 = forms.CharField(label='Password' , widget = forms.PasswordInput)
    password2 = forms.CharField(label='Confirm Password' , widget = forms.PasswordInput)

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('username', 'email', 'password1', 'password2')