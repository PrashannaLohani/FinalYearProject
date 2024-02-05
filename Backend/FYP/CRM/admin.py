from django.contrib import admin
from .models import Signup
# Register your models here.


class CRMAdmin(admin.ModelAdmin):
    list_display = ['id','name']

    from .models import Signup

class SignupAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'email', 'password', 'Cpassword')
    writeonly_fields = ('password','Cpassword')
    # readonly_fields = ('password', 'Cpassword')
admin.site.register(Signup, SignupAdmin)