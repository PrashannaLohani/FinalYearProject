
from django.contrib import admin
from django.urls import path , include
from CRM import views
from CRM import utils

urlpatterns = [
    ## Sign Up and login URLS
    path('admin/', admin.site.urls),
    path('Signup/', views.user_create ),
    path('login/', views.LoginAPI.as_view(), name='login'),
    path('delete/',views.DeleteAPI.as_view(), name = 'delete'),
    
    # API for user information 
    path('verify-email/', views.VerifyAPI.as_view(), name='verify'),
    path('update-password/<uidb64>/<token>/', views.ForgetPasswordView.as_view(), name='password'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('change-name/', views.ChangeName.as_view(), name='change_name'),
    path('info/', views.InfoAPI.as_view(), name='info'),

    ## Account handling
    path('get-csrf-token/<str:token_type>/', utils.get_csrf_token, name='get_csrf_token'),
    path('accounts/', include('django.contrib.auth.urls')),
]

