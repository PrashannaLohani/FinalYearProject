
from django.http import HttpResponse
import jwt
from rest_framework.renderers import JSONRenderer 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer,LoginSerializer , VerifySerializer,ChangePasswordSerializer
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from .models import Signup
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated



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
    if request.method == 'PUT':
             serializer = ChangePasswordSerializer(data = request.data, partial = True)
             if serializer.is_valid():
                 serializer.save()
                 res = {'msg':'data created'}
                 json_data = JSONRenderer().render(res)
                 return HttpResponse(json_data, content_type = 'application/json')
                 
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
class InfoAPI(APIView):
     def get(self, request):
        # Get the Authorization header from the request
        authorization_header = request.headers.get('Authorization')

        if authorization_header:
            try:
                # Split the Authorization header to get the token
                token = authorization_header.split(' ')[1]

                # Decode the token
                decoded_token = jwt.decode(token, 'secret', algorithms=['HS256'])

                # Return the decoded token as JSON response
                return Response(decoded_token, status=status.HTTP_200_OK)
            except jwt.ExpiredSignatureError:
                return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Authorization header missing'}, status=status.HTTP_400_BAD_REQUEST)
        
    
class LogoutAPI(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can log out

    def post(self, request):
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({'error': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Add the refresh token to the blacklist
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

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
        
class ChangePasswordView(APIView):
    def post(self,request, user_id):
        serializer = ChangePasswordSerializer(data= request.data)

        if serializer.is_valid():
            try:
                user = Signup.objects.get(pk = user_id)

            except Signup.DoesNotExist:
                return Response("User not found", status=status.HTTP_404_NOT_FOUND)
            

            user = serializer.update(user, serializer.validated_data)
            return Response("Password updated successfully", status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)