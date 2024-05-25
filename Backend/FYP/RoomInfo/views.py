import jwt
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoomSerializer, JoinSerializer, CommentSerializer, PollSerializer
from rest_framework import status
from FYP import settings
import random
import string
from .models import Room, Comment, RoomPoll
from CRM.models import Signup
from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class Stats(APIView):
    def get(self, request):
        token = request.headers.get('Authorization')
        if token:
            try:
                token = token.split()[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                email = decoded_token.get('email')
                user = Signup.objects.get(email=email)
                rooms = Room.objects.filter(user=user).order_by('-created_at')  # Order by created_at descending

                total_rooms = rooms.count()
                room_data = [room.to_dict() for room in rooms]
                total_participants = sum(room.num_of_people for room in rooms)
                total_comments = sum(room.num_of_comments for room in rooms)

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
                limit_people_num = serializer.validated_data.get('limit_people_num')
                token = token.split()[1]
                decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

                # Extract user_id from the token
                full_name = decoded_token.get('full_name')

                # Fetch the user associated with the token
                user = Signup.objects.get(full_name=full_name)

                room_id = ''.join([str(random.randint(1, 9)) for _ in range(6)])  # Generate room ID
                room = Room.objects.create(room_id=room_id, user=user, room_name=room_name, limit_people_num=limit_people_num)
                
                room.save()

                token = jwt.encode({'room_id': room_id, 'room_name': room_name, 'limit_people_num': limit_people_num}, settings.SECRET_KEY, algorithm='HS256')

                return Response({'token': token, 'ID': room_id, 'name': room_name, 'People Limitation': limit_people_num}, status=status.HTTP_201_CREATED)
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

                    # Send WebSocket notification
                    self.notify_room_update(room_code)

                    return Response({'token': Roomtoken, 'username': username, 'room': room_code}, status=status.HTTP_201_CREATED)
                except Room.DoesNotExist:
                    return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def generate_random_username(self):
        random_suffix = ''.join(random.choices(string.digits, k=4))
        return f"User{random_suffix}"

    def notify_room_update(self, room_code):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "room_updates",
            {
                'type': 'room_update',
                'room_id': room_code
            }
        )



class CommentAPI(APIView):
    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            room = serializer.validated_data['room']
            user = serializer.validated_data.get('user')
            message = serializer.validated_data['message']

            # Save the comment to the database
            comment = Comment.objects.create(user=user, room=room, message=message)

            # Update the room's number of comments
            room_obj = Room.objects.get(room_id=room)
            room_obj.num_of_comments += 1
            room_obj.save()

            # Notify via WebSocket
            self.notify_room_update(room, message, user)

            # Return a success response
            return Response({'message': 'Comment posted successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        room_code = request.query_params.get('room_code')
        if room_code:
            comments = Comment.objects.filter(room=room_code).order_by('-vote')
        else:
            comments = Comment.objects.all().order_by('-vote')

        comment_data = [{'room': comment.room, 'user': comment.user, 'message': comment.message, 'vote': comment.vote} for comment in comments]

        return JsonResponse(comment_data, safe=False)

    def notify_room_update(self, room_code, message, user):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'room_{room_code}',
            {
                'type': 'comment_message',
                'room': room_code,
                'user': user,
                'message': message
            }
        )

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

            # Notify via WebSocket
            self.notify_room_update(room_id)

            return Response({'message': 'Upvote successful'}, status=status.HTTP_200_OK)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def notify_room_update(self, room_code):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "room_updates",
            {
                'type': 'room_update',
                'room_id': room_code
            }
        )


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

            # Notify via WebSocket
            self.notify_room_update(room_id)

            return Response({'message': 'Room deactivated successfully', 'room_id': room_id}, status=status.HTTP_200_OK)
    
    def notify_room_update(self, room_code):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "room_updates",
            {
                'type': 'room_update',
                'room_id': room_code
            }
        )


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
                
            return Response({'message': 'Poll created successfully'}, status=status.HTTP_201_CREATED)
        else:
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

                # Get the selected option from the database
                options = RoomPoll.objects.filter(poll=poll, question=question, options=selected_option)
                for option in options:
                    # Increment the vote count for each option
                    option.votes += 1
                    option.save()

                # Notify via WebSocket
                self.notify_poll_update(poll)

            return Response({'message': 'Votes registered successfully'}, status=status.HTTP_200_OK)
        except RoomPoll.DoesNotExist:
            return Response({'error': 'Option not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def notify_poll_update(self, poll_id):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "poll_updates",
            {
                'type': 'poll_update',
                'poll_id': poll_id
            }
        )