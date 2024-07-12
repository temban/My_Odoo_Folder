from odoo import models, fields, api

class MessageRoom(models.Model):
    _name = 'message.room'
    _description = 'Message Room'

    name = fields.Char(string='Room Name', required=True)
    members = fields.Many2many('res.users', string='Members')
    messages = fields.One2many('message.room.message', 'room_id', string='Messages')

class MessageRoomMessage(models.Model):
    _name = 'message.room.message'
    _description = 'Message Room Message'

    room_id = fields.Many2one('message.room', string='Room', ondelete='cascade')
    author_id = fields.Many2one('res.users', string='Author', required=True)
    message = fields.Text(string='Message', required=True)
    date = fields.Datetime(string='Date', default=fields.Datetime.now, required=True)
