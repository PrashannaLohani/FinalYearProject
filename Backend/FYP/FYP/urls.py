
from django.contrib import admin
from django.urls import path , include
from CRM import views
from CRM import utils

urlpatterns = [
    path('admin/', admin.site.urls),
    path('Signup/', views.user_create ),
    path('login/', views.LoginAPI.as_view(), name='login'),
    path('logout/', views.LogoutAPI.as_view(), name='info'),
    
    path('verify-email/', views.VerifyAPI.as_view(), name='verify'),
    path('update-password/<uidb64>/<token>/', views.ChangePasswordView.as_view(), name='password'),
    path('info/', views.InfoAPI.as_view(), name='info'),

    path('get-csrf-token/<str:token_type>/', utils.get_csrf_token, name='get_csrf_token'),
    path('accounts/', include('django.contrib.auth.urls')),
]

