from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.renderers import JSONRenderer 
from rest_framework.parsers import JSONParser 

from .serializers import SignupSerializer
import io
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie



@ensure_csrf_cookie
def user_create(request):
    if request.method =='POST':
        json_data = request.body
        stream = io.BytesIO(json_data)
        pythondata = JSONParser().parse(stream)
        serializer = SignupSerializer(data=pythondata)
        if serializer.is_valid():
            serializer.save()
            res = {'msg':'data created'}
            json_data = JSONRenderer().render(res)
            return HttpResponse(json_data, content_type = 'application/json')
        else:
            errors = serializer.errors
            return JsonResponse({'error':errors}, status = 400) 

    return HttpResponse(status=405, content="Method Not Allowed")