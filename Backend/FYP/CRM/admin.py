from django.contrib import admin
from .models import Signup

# Register your models here.


class CRMAdmin(admin.ModelAdmin):
    list_display = ['id','name']
class SignupAdmin(admin.ModelAdmin):
    list_display = ('id','fullname', 'email', 'password')
    readonly_fields = ('password',)
admin.site.register(Signup, SignupAdmin)
