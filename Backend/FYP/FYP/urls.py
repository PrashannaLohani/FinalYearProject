
from django.contrib import admin
from django.urls import path
from CRM import views
from CRM import utils

urlpatterns = [
    path('admin/', admin.site.urls),
    path('Signup/', views.user_create ),
    path('login/', views.LoginAPI.as_view(), name='login'),
    path('get-csrf-token/<str:token_type>/', utils.get_csrf_token, name='get_csrf_token'),
]
