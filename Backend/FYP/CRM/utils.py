from django.views.decorators.csrf import get_token
from django.http import JsonResponse

def get_csrf_token(request, token_type):
    
    if token_type == 'signup':
        csrf_token = get_token(request)  # Generate a new token for signup
    else:
        return JsonResponse({'error': 'Invalid token type'}, status=400)
    
    return JsonResponse({'csrf_token': csrf_token})

    
    # {"csrf_signup_token": "n4F78ipyzjrsYrVRXyEzhP7DJejweZR9"}
