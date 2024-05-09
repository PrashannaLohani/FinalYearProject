from django.urls import path
from . import views

urlpatterns = [
    path('createCode/',views.PollCodeCreateAPI.as_view(), name='CreateCode'),
    path('create/',views.PollCreateAPI.as_view(), name='CreatePoll')
]
