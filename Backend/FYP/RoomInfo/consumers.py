import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'room_{self.room_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        room = text_data_json['room']
        user = text_data_json['user']
        vote = text_data_json.get('vote', 0)  # Ensure vote is handled

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'comment_message',
                'room': room,
                'user': user,
                'message': message,
                'vote': vote,
            }
        )

    async def comment_message(self, event):
        message = event['message']
        room = event['room']
        user = event['user']
        vote = event['vote']

        await self.send(text_data=json.dumps({
            'room': room,
            'user': user,
            'message': message,
            'vote': vote,
        }))
class PollConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.poll_id = self.scope['url_route']['kwargs']['poll_id']
        self.poll_group_name = f'poll_{self.poll_id}'

        # Join poll group
        await self.channel_layer.group_add(
            self.poll_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave poll group
        await self.channel_layer.group_discard(
            self.poll_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        question = text_data_json['question']
        options = text_data_json['options']

        # Send message to poll group
        await self.channel_layer.group_send(
            self.poll_group_name,
            {
                'type': 'poll_message',
                'question': question,
                'options': options
            }
        )

    # Receive message from poll group
    async def poll_message(self, event):
        question = event['question']
        options = event['options']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'question': question,
            'options': options
        }))