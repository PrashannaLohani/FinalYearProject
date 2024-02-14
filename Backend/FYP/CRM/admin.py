from django.contrib import admin
from .models import Signup

# Register your models here.


class CRMAdmin(admin.ModelAdmin):
    list_display = ['id','name']
class SignupAdmin(admin.ModelAdmin):
    list_display = ('id','fullname', 'email', 'password','created_at')
    readonly_fields = ('password',)
admin.site.register(Signup, SignupAdmin)
