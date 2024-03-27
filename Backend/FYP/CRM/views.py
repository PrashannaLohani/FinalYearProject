from datetime import datetime, timedelta, timezone
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
from rest_framework.decorators import api_view

from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from FYP import settings
from .models import Signup
from .serializers import SignupSerializer, LoginSerializer, ForgetPasswordSerializer,ChangePasswordSerializer

from django.contrib.auth.models import User

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
                # Define additional user information for token payload
                payload = {
                    'user_id': user.id,
                    'full_name': user.full_name,
                    'email': user.email,
                    'date_joined': user.date_joined.timestamp()
                    
                }
                # Update payload with token-specific information (expiration, issued at, etc.) if needed
                access_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                request.session['access_token'] = access_token
                return Response({
                    'message': 'Login successful',
                    'access_token': access_token,
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
        access_token = request.headers.get('Authorization')
        if access_token:
            try:
                # Extract the token from the Authorization header
                token = access_token.split()[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                
                user_id = decoded_token.get('user_id')
                full_name = decoded_token.get('full_name')
                email = decoded_token.get('email')
                date_joined = decoded_token.get('date_joined')

                # Check if date_joined is not None and is a valid timestamp
                if date_joined is not None and isinstance(date_joined, (int, float)):
                    date_joined_str = datetime.utcfromtimestamp(date_joined).isoformat()
                else:
                    date_joined_str = None  # Set to None if date_joined is not valid
                response_data = {
                    'user_id': user_id,
                    'full_name': full_name,
                    'email': email,
                    'date_joined': date_joined_str,
                }

                return Response(response_data, status=status.HTTP_200_OK)
            except jwt.ExpiredSignatureError:
                return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Authorization header not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        
    
class LogoutAPI(APIView):
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
        
        
class ForgetPasswordView(APIView):
     def post(self, request, uidb64, token):
        try:
            user_id = urlsafe_base64_decode(smart_str(uidb64))
            user = Signup.objects.get(pk=user_id)

            serializer = ForgetPasswordSerializer(data=request.data)

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
        

class ChangePasswordView(APIView):
    def post(self, request):
        try:
            access_token = request.headers.get('Authorization')
            if access_token:
                jwt_token = access_token.split()[1]

                decoded_token = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = decoded_token.get('user_id')

                user = Signup.objects.get(pk=user_id)

                serializer = ChangePasswordSerializer(data=request.data)
                if serializer.is_valid():
                    old_password = serializer.validated_data.get('old_password')
                    new_password = serializer.validated_data.get('new_password')

                    if not user.check_password(old_password):
                        return Response({"error": "Old Password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

                    user.set_password(new_password)
                    user.save()

                    return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Authorization header not found'}, status=status.HTTP_400_BAD_REQUEST)

        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        except Signup.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)