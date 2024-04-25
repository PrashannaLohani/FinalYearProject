from django.urls import path
from . import views

urlpatterns = [
    path('createroom/',views.RoomAPI.as_view(), name='CreateRoom'),
    path('joinroom/',views.JoinAPI.as_view(), name='JoinRoom'),
    path('Userinfo/',views.DecodeUserTokenAPI.as_view(), name='userInfo'),
    path('comments-count/', views.RoomCommentsCountAPI.as_view(), name='room-comments-count'),
    path('comments/',views.CommentAPI.as_view(), name='Comment'),
]
