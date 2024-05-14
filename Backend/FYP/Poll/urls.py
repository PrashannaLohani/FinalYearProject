from django.urls import path
from . import views

urlpatterns = [
    path('createcode/',views.PollCodeCreateAPI.as_view(), name='CreateCode'),
    path('create/',views.PollCreateAPI.as_view(), name='CreatePoll'),
    path('options/', views.PollCreateAPI.as_view(), name='poll-options'),
    path('joinpoll/', views.JoinPollApi.as_view(), name='poll-join'),
    path('vote/', views.VoteOption.as_view(), name='vote-option'),
]
