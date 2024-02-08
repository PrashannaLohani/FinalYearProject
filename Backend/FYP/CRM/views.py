from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer 
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import SignupSerializer
import io,jwt,datetime
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from .serializers import LoginSerializer
from rest_framework.views import APIView
from .models import Login, Signup
from django.contrib.auth.hashers import check_password as django_check_password



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
@permission_classes([AllowAny])
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            # Check if email exists in both Signup and Login models
            signup_user = Signup.objects.filter(email=email).first()
            login_user = Login.objects.filter(email=email).first()

            if signup_user and django_check_password(password, signup_user.password):
                user = signup_user
            elif login_user and django_check_password(password, login_user.password):
                user = login_user
            else:
                raise AuthenticationFailed("Invalid email or password")

            payload ={
                'id':user.id,
                'exp': datetime.datetime.utcnow()+ datetime.timedelta(minutes=60),
                'iat':datetime.datetime.utcnow()
            }
            
            # Encoding the payload into a JWT token
            token = jwt.encode(payload, 'secret', algorithm='HS256')
        
            user_serializer = SignupSerializer(user)

            # Set the JWT token in a cookie
            response = Response({'message': "Login success", 'user': user_serializer.data})
            response.set_cookie('jwt', token, httponly=True)
            
            return response
        else:
            return Response(serializer.errors, status=400)
        
@permission_classes([AllowAny])
class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        user_id = payload['id']
        user = Signup.objects.get(id=user_id)

        serializer = SignupSerializer(user)
        
        # Include the token in the response data
        response_data = {
            'user': serializer.data,
            'token': token  # Include the token here
        }

        return Response(response_data)
