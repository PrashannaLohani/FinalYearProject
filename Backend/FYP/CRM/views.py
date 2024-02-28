from datetime import datetime, timedelta
import jwt

from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.urls import reverse
from django.utils.encoding import force_bytes, smart_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from FYP import settings
from .models import Signup
from .serializers import SignupSerializer, LoginSerializer, ChangePasswordSerializer

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

# @api_view(['POST'])
# @permission_classes([AllowAny])
# @ensure_csrf_cookie
# def user_detail(request):
#     if request.method == 'POST':
#         serializer = LoginSerializer(data = request.data)
#         if serializer.is_valid():
#             serializer.save()
#             res = {'msg':'data created'}
#             json_data = JSONRenderer().render(res)
#             return HttpResponse(json_data, content_type = 'application/json')
#         else:
#             errors = serializer.errors
#             print(errors)
#             return JsonResponse({'error':errors}, status = 400) 

#     return HttpResponse(status=405, content="Method Not Allowed")

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
        


token_cache = {}
class VerifyAPI(APIView):
    user_id = None

    def post(self, request):
        email = request.data.get('email')
        full_name = request.data.get('full_name')
        try:
            user = Signup.objects.get(email=email)

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            expiry_time = datetime.now() + timedelta(minutes=1)

            token_cache[token] = expiry_time

            # Generate the URL without the '/accounts/reset/' part
            reset_password_url = reverse('password', kwargs={'uidb64': uid, 'token': token})
            reset_password_full_url = f'http://localhost:5173{reset_password_url}'

            subject = 'Reset your password'
            message = f'Hi {user.full_name},\n\nPlease click the following link to reset your password:\n{reset_password_full_url}'
            sender_email = settings.DEFAULT_FROM_EMAIL
            recipient_email = [email]

            send_mail(subject, message, sender_email, recipient_email)

            # Return uidb64 and token in the response
            return Response({'uidb64': uid, 'token': token}, status=status.HTTP_200_OK)
        except Signup.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        
class ChangePasswordView(APIView):
     def post(self, request, uidb64, token):
        try:
            user_id = urlsafe_base64_decode(smart_str(uidb64))
            user = Signup.objects.get(pk=user_id)

            serializer = ChangePasswordSerializer(data=request.data)

            if serializer.is_valid():
                new_password = serializer.validated_data.get('password')
                confirm_password = serializer.validated_data.get('confirm_password')

                if new_password != confirm_password:
                    return Response("New password and confirm password do not match", status=status.HTTP_400_BAD_REQUEST)

                # Hash the new password
                user.password = make_password(new_password)   
                user.save()

                return Response("Password updated successfully", status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, OverflowError, Signup.DoesNotExist):
            return Response("Invalid UID or token", status=status.HTTP_400_BAD_REQUEST)