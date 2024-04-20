from django.urls import path
from . import views

urlpatterns = [
    path('createroom/',views.RoomAPI.as_view(), name='CreateRoom'),
    path('joinroom/',views.JoinAPI.as_view(), name='JoinRoom'),
]
