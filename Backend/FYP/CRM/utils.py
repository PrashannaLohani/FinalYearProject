from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    # Get the CSRF token from the cookie
    csrf_token = request.COOKIES.get('csrftoken', '')
    return JsonResponse({'csrf_token': csrf_token})