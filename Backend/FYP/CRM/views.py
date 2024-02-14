from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer,LoginSerializer , VerifySerializer
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from .models import Signup
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status



@api_view(['POST'])
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

class LoginAPI(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = Signup.objects.get(email=serializer.validated_data['email'])
            except Signup.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            if check_password(serializer.validated_data['password'], user.password):
                # User authenticated successfully
                 refresh = RefreshToken.for_user(user)
                 return Response({
                    'message': 'Login successful',
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh)
                }, status=status.HTTP_200_OK)
            else:
                # Incorrect password
                return Response({'error': 'Incorrect password'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            # Invalid serializer data
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class VerifyAPI(APIView):
    def post(self,request):
        serializer = VerifySerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = Signup.objects.get(email=serializer.validated_data['email'])
                # Return a success response if the user is found
                return Response({'message': 'User found', 'user_id': user.id}, status=status.HTTP_200_OK)
            except Signup.DoesNotExist:
                # Return a 404 response if the user is not found
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Invalid serializer data
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)