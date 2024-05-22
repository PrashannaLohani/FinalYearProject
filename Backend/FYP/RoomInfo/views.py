import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoomSerializer, JoinSerializer,CommentSerializer,PollSerializer
from rest_framework import status
from FYP import settings
import random
import string
from .models import Room,Comment,RoomPoll
from CRM.models import Signup
from django.http import JsonResponse

class Stats(APIView):
    def get(self, request):
        token = request.headers.get('Authorization')
        if token:
            try:
                # Extract the token from the Authorization header
                token = token.split()[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

                # Extract user_id from the token
                email = decoded_token.get('email')

                # Fetch the user associated with the token
                user = Signup.objects.get(email=email)

                # Fetch the rooms associated with the user
                rooms = Room.objects.filter(user=user)

                # Count the total number of rooms created by the user
                total_rooms = rooms.count()
                
                # Serialize the room data
                room_data = [room.to_dict() for room in rooms]

                total_participants = sum(room.num_of_people for room in rooms)
                total_comments = sum(room.num_of_comments for room in rooms)

                # Fetch poll data for the rooms
                polls = RoomPoll.objects.all()
                poll_data = [poll.to_dict() for poll in polls]

                return Response({
                    'room_data': room_data,
                    'total_rooms': total_rooms,
                    "total_participants": total_participants,
                    "total_comments": total_comments,
                    "poll_data": poll_data
                }, status=status.HTTP_200_OK)
            except jwt.ExpiredSignatureError:
                return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            except Signup.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Authorization header not found'}, status=status.HTTP_400_BAD_REQUEST)
class RoomAPI(APIView):
    def post(self, request):
        token = request.headers.get('Authorization')
        
        if request.method == 'POST':
            serializer = RoomSerializer(data=request.data)
            if serializer.is_valid():
                room_name = serializer.validated_data.get('room_name')
                limit_people_num=serializer.validated_data.get('limit_people_num')
                token = token.split()[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                

                # Extract user_id from the token
                full_name = decoded_token.get('full_name')

                # Fetch the user associated with the token
                user = Signup.objects.get(full_name=full_name)

                room_id = ''.join([str(random.randint(1, 9)) for _ in range(6)])  # Generate room ID
                room = Room.objects.create(room_id=room_id,user=user, room_name=room_name, limit_people_num=limit_people_num)
                
                
                
                room.save()
                

                token = jwt.encode({'room_id': room_id, 'room_name': room_name, 'limit_people_num': limit_people_num}, settings.SECRET_KEY, algorithm='HS256')
                return Response({'token': token, 'ID': room_id, 'name': room_name, 'People Limitation': limit_people_num, }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def get(self, request):
        rooms = Room.objects.all()
        room_data = [{'room_id': room.room_id, 'room_name': room.room_name, 'limit_people_num': room.limit_people_num, 'num_of_people': room.num_of_people, 'num_of_comments': room.num_of_comments} for room in rooms]
        return Response(room_data, status=status.HTTP_200_OK)
        
class JoinAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = JoinSerializer(data=request.data)
            if serializer.is_valid():
                room_code = serializer.validated_data.get('room_code')
                try:
                    room = Room.objects.get(room_id=room_code)

                    if not room.active:
                        return Response({'error': 'Session already ended'}, status=status.HTTP_403_FORBIDDEN)
                    
                    username = self.generate_random_username()
                    
                    # Increment num_of_people
                    room.num_of_people += 1
                    room.save()
                    
                    # Generate token
                    Roomtoken = jwt.encode({'username': username, 'room': room_code}, settings.SECRET_KEY, algorithm='HS256')
                    
                    return Response({'token': Roomtoken, 'username': username, 'room': room_code}, status=status.HTTP_201_CREATED)
                except Room.DoesNotExist:
                    return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def generate_random_username(self):
        random_suffix = ''.join(random.choices(string.digits, k=4))
        return f"User{random_suffix}"
    
class DecodeUserTokenAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            token = request.data.get('token')
            if not token:
                return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                username = decoded_token.get('username')
                room_code = decoded_token.get('room')
                # Additional information from the token can be extracted here
                return Response({'username': username, 'room': room_code}, status=status.HTTP_200_OK)
            except jwt.ExpiredSignatureError:
                return Response({'error': 'Token has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            except jwt.InvalidTokenError:
                return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
            

class CommentAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                room = serializer.validated_data['room']  # Use square brackets to access dictionary key
                user = serializer.validated_data.get('user')
                message = serializer.validated_data['message']  # Use square brackets to access dictionary key
                
                # Save the comment to the database
                comment = Comment.objects.create(user=user, room=room, message=message)  # Added 'room' field

                room_obj = Room.objects.get(room_id=room)
                room_obj.num_of_comments += 1
                room_obj.save()
                
                # Return a success response
                return Response({'message': 'Comment posted successfully'}, status=status.HTTP_201_CREATED)
            else:
                # Return validation errors
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def get(self, request):
        if request.method == 'GET':
            room_code = request.query_params.get('room_code')
            if room_code:
                # Filter comments by room_code and order by vote in descending order
                comments = Comment.objects.filter(room=room_code).order_by('-vote')
            else:
                # Get all comments and order by vote in descending order
                comments = Comment.objects.all().order_by('-vote')
            
            # Manually construct the response data
            comment_data = []
            for comment in comments:
                comment_data.append({
                    'room': comment.room,
                    'user': comment.user,
                    'message': comment.message,
                    'vote': comment.vote,
                })
            
            # Return JsonResponse with the constructed comment data
            return JsonResponse(comment_data, safe=False)
        
class RoomCommentsCountAPI(APIView):
    def post(self, request):
        try:
            room_id = request.data.get('room_id')
            room = Room.objects.get(room_id=room_id)
            return Response({
                'num_of_comments': room.num_of_comments,
                'num_of_people': room.num_of_people
            }, status=status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        

class CommentUpVote(APIView):
    def post(self, request):
        room_id = request.data.get('room_id')
        message = request.data.get('message')
        try:
            comment = Comment.objects.get(room=room_id, message=message)
            comment.vote += 1
            comment.save()
            return Response({'message': 'Upvote successful'}, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        
class DeactivateRoomAPI(APIView):
    def post(self, request):
        if request.method == 'POST':
            room_id = request.data.get('room_id')  # Assuming 'room_id' is passed in the request data

            try:
                room = Room.objects.get(room_id=room_id)
            except Room.DoesNotExist:
                return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

            # Deactivate the room
            room.active = False
            room.save()

            return Response({'message': 'Room deactivated successfully', 'room_id': room_id}, status=status.HTTP_200_OK)
        
class RoomPollAPI(APIView):
    def post(self, request):
        serializer = PollSerializer(data=request.data)
        if serializer.is_valid():
            # Retrieve validated data from serializer
            poll_id = serializer.validated_data['poll']
            questions_data = serializer.validated_data['questions']
            
            # Save each question and its options
            for question_data in questions_data:
                question_text = question_data['question']
                options_list = question_data['options']
                
                # Create an Option instance for each option in options_list
                for option_text in options_list:
                    RoomPoll.objects.create(
                        poll=poll_id,
                        question=question_text,
                        options=option_text
                    )
                
            # Return a success response
            return Response({'message': 'Poll created successfully'}, status=status.HTTP_201_CREATED)
        else:
            # If serializer validation fails, return error response
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
    def get(self, request):
        poll_id = request.query_params.get('poll_id')
        question = request.query_params.get('question')
        
        if not poll_id or not question:
            return Response({'error': 'Poll ID and question are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            poll_options = RoomPoll.objects.filter(poll=poll_id, question=question).values('options', 'votes').distinct()
            return Response({'poll_options': list(poll_options)}, status=status.HTTP_200_OK)
        except RoomPoll.DoesNotExist:
            return Response({'error': 'Poll options not found'}, status=status.HTTP_404_NOT_FOUND)

class ParticipantOption(APIView):
    def get(self, request):
        try:
            poll_id = request.query_params.get('poll_id')
            if not poll_id:
                return Response({'error': 'Poll ID is required'}, status=status.HTTP_400_BAD_REQUEST)

            # Get all distinct questions for the specified poll ID
            questions = RoomPoll.objects.filter(poll=poll_id).values_list('question', flat=True).distinct()
            if not questions:
                return Response({'error': 'No questions found for this poll ID'}, status=status.HTTP_404_NOT_FOUND)

            response_data = []
            for question in questions:
                poll_options = RoomPoll.objects.filter(poll=poll_id, question=question).values('options', 'votes')
                response_data.append({
                    'question': question,
                    'poll_options': list(poll_options)
                })

            return Response(response_data, status=status.HTTP_200_OK)
        except RoomPoll.DoesNotExist:
            return Response({'error': 'Poll options not found'}, status=status.HTTP_404_NOT_FOUND)

class VoteOption(APIView):
    def post(self, request):
        poll = request.data.get('poll')
        votes = request.data.get('votes')
        
        if not poll or not votes:
            return Response({'error': 'Poll ID and votes are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            for vote in votes:
                question = vote.get('question')
                selected_option = vote.get('selected_option')
                if not question or not selected_option:
                    continue
                print(f"Processing vote for question: {question}, selected option: {selected_option}")
                # Get the selected option from the database
                options = RoomPoll.objects.filter(poll=poll, question=question, options=selected_option)
                for option in options:
                    # Increment the vote count for each option
                    option.votes += 1
                    option.save()
                print(f"Vote count incremented for option: {option}")
            
            return Response({'message': 'Votes registered successfully'}, status=status.HTTP_200_OK)
        except RoomPoll.DoesNotExist:
            return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)