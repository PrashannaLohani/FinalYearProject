from django.urls import path
from . import views

urlpatterns = [
    path('createcode/',views.PollCodeCreateAPI.as_view(), name='CreateCode'),
    path('create/',views.PollCreateAPI.as_view(), name='CreatePoll'),
    path('questions/', views.PollCreateAPI.as_view(), name='poll-questions'),
    path('options/', views.PresenterOption.as_view(), name='poll-options'),
    path('joinpoll/', views.JoinPollApi.as_view(), name='poll-join'),
    path('participantoption/',views.ParticipantOption.as_view(), name = 'participant-option'),
    path('vote/', views.VoteOption.as_view(), name='vote-option'),
    path('totaluser/', views.UserJoin.as_view(), name='total-user'),
    path('deactivate/', views.DeactivatePollAPI.as_view(), name='deactivate-poll'),
    path('stats/', views.Stats.as_view(), name='Stats'),
]
