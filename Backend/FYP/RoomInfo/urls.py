from django.urls import path
from . import views

urlpatterns = [
    path('room/',views.RoomAPI.as_view(), name='CreateRoom'),
    path('stats/',views.Stats.as_view(), name='Stats'),
    path('joinroom/',views.JoinAPI.as_view(), name='JoinRoom'),
    path('Userinfo/',views.DecodeUserTokenAPI.as_view(), name='userInfo'),
    path('comments-count/', views.RoomCommentsCountAPI.as_view(), name='room-comments-count'),
    path('comments/',views.CommentAPI.as_view(), name='Comment'),
    path('upvote/',views.CommentUpVote.as_view(), name='Vote'),
    path('deactivate/',views.DeactivateRoomAPI.as_view(), name='Room-end'),
    path('options/',views.RoomPollAPI.as_view(), name='Poll-option'),
]
