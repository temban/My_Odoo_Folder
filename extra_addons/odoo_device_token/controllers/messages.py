from odoo import http
from odoo.http import request
import json

class MessageRoomController(http.Controller):

    @http.route('/message_room/<int:room_id>', type='http', auth='none', website=True)
    def get_message_room_data(self, room_id):
        # Find the message room based on the provided room_id
        room = request.env['message.room'].sudo().browse(room_id)

        if not room:
            return json.dumps({'error': 'Message room not found'})

        # Prepare a dictionary with room data
        room_data = {
            'name': room.name,
            'members': [member.name for member in room.members],
            'messages': [{'author': message.author_id.name, 'message': message.message, 'date': message.date} for
                         message in room.messages],
        }

        # Return the data as JSON
        return json.dumps(room_data)

    @http.route('/api/send_message', type='json', auth='public', methods=['POST'], cors='*')
    def send_message(self, **kw):
        request_data = http.request.jsonrequest  # Parse JSON request data
        room_id = request_data.get('room_id')
        author_id = request_data.get('author_id')
        message_content = request_data.get('message_content')

        # Validate required fields
        if not room_id or not author_id or not message_content:
            return json.dumps({'error': 'Missing required fields'})

        # Check if the room and author exist
        room = http.request.env['message.room'].sudo().browse(room_id)
        author = http.request.env['res.users'].sudo().browse(author_id)

        if not room or not author:
            return json.dumps({'error': 'Invalid room or author'})

        # Create a new message
        message = http.request.env['message.room.message'].sudo().create({
            'room_id': room.id,
            'author_id': author.id,
            'message': message_content,
        })

        # Return a success response
        return {'success': 'Message sent successfully'}
