from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Signup

class CustomUserAdmin(UserAdmin):
    model = Signup
    list_display = ('id','email', 'full_name', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login')
    search_fields = ('email', 'full_name')
    readonly_fields = ('date_joined', 'last_login')

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

admin.site.register(Signup, CustomUserAdmin)