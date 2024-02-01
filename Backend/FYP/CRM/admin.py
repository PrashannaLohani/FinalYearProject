from django.contrib import admin
from .models import CustomUser
from .forms import CustomUserCreationForm

class CustomUserAdmin(admin.ModelAdmin):
    add_form = CustomUserCreationForm  # Use the CustomUserCreationForm for the add view
    form = CustomUserCreationForm  # Use the CustomUserCreationForm for the change view
    model = CustomUser
    

admin.site.register(CustomUser, CustomUserAdmin)