from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer 
from rest_framework.parsers import JSONParser 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer
import io
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Signup
from .serializers import LoginSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def user_create(request):
    if request.method =='POST':
        # json_data = request.body
        # stream = io.BytesIO(request.body)
        # pythondata = JSONParser().parse(stream)
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            res = {'msg':'data created'}
            json_data = JSONRenderer().render(res)
            return HttpResponse(json_data, content_type = 'application/json')
        else:
            errors = serializer.errors
            print(errors)
            return JsonResponse({'error':errors}, status = 400) 

    return HttpResponse(status=405, content="Method Not Allowed")

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def user_detail(request):
    if request.method == 'POST':
        serializer = LoginSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            res = {'msg':'data created'}
            json_data = JSONRenderer().render(res)
            return HttpResponse(json_data, content_type = 'application/json')
        else:
            errors = serializer.errors
            print(errors)
            return JsonResponse({'error':errors}, status = 400) 

    return HttpResponse(status=405, content="Method Not Allowed")