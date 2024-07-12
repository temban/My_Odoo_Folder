# -*- coding: utf-8 -*-
#################################################################################
# Author      : Webkul Software Pvt. Ltd. (<https://webkul.com/>)
# Copyright(c): 2015-Present Webkul Software Pvt. Ltd.
# License URL : https://store.webkul.com/license.html/
# All Rights Reserved.
#
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
# If not, see <https://store.webkul.com/license.html/>
#################################################################################

from odoo import http, tools
from odoo.http import route, request, Controller, Response
import logging
_logger = logging.getLogger(__name__)
from odoo.addons.im_livechat.controllers.main import LivechatController
 
class LivechatController(LivechatController):

    @http.route('/seller/remove/channel', type="json", auth='public', cors="*")
    def remove_channels(self,channel_id=None,**kwargs):
        mail_channel_id = request.env["mail.channel"].sudo().browse(int(channel_id))
        for channel_partner in mail_channel_id.channel_last_seen_partner_ids:
            if request.env.user.partner_id.id == channel_partner.partner_id.id:
                channel_partner.unlink()

        mail_channel_id.marketplace_seller_id = False
        mail_channel_id.portal_user_id = False
    
    @http.route('/seller/chat/history', type="http", auth='public', cors="*")
    def get_seller_history(self,seller_id=None,**kwargs):
        values = {}
        user_id = request.session.uid
        product_id = kwargs.get("product_id",False)
        product = False
        try:
            product = request.env['product.product'].sudo().browse(int(product_id))
        except Exception:
            pass
        
        if seller_id and user_id:
            if product and product.marketplace_seller_id.id != int(seller_id):
                product = False

            mail_channel_id = request.env["mail.channel"].sudo().search([('marketplace_seller_id','=',int(seller_id)),('portal_user_id','=',user_id)],limit=1)
            values={'mail_channel_id':mail_channel_id,'product_msg_id':product,'message_content':reversed(mail_channel_id.message_ids[:50])}

        else:
            return request.render("marketplace_seller_livechat.public_chat_box_form")

        return request.render("marketplace_seller_livechat.seller_history",values)

    @http.route('/seller/create/channel', type="http", auth='public', cors="*")
    def create_new_channel(self,seller_id,**kwargs):
        if request.session.uid:
            user_id = request.env.user
            replace,product,product_price = False,False,False
            message_content = ""
            product_id = kwargs.get("product_id",False) 
            operator = request.env['res.partner'].sudo().browse(int(seller_id))
            mail_channel = request.env["mail.channel"].sudo().search([('marketplace_seller_id','=',int(seller_id)),('portal_user_id','=',user_id.id)],limit=1)

            try:
                product = request.env['product.product'].sudo().browse(int(product_id))
                product_price = product._get_combination_info_variant(pricelist=request.env['website'].get_current_pricelist()).get('price','currently unavailable')
                message_content = "Product Name:- {}\nProduct Price:- {}".format(product.name,product_price)
            except Exception:
                message_content = request.env['ir.default'].sudo().get('res.config.settings', 'livechat_msg_content')
                if not message_content:
                    message_content = "Hi, thanks for contacting us and we appreciate you reaching out. How may we help you?"

            if not mail_channel and user_id:
                replace = True
                country_id = user_id.country_id.id
                anonymous_name = "User"

                channel_partner_to_add = [(4, operator.id)]

                visitor_user = user_id
                if visitor_user and visitor_user.active:  # valid session user (not public)
                    channel_partner_to_add.append((4, visitor_user.partner_id.id))

                vals = {
                    'marketplace_seller_id':operator.id,
                    'livechat_operator_id': operator.id,
                    'portal_user_id':visitor_user.id,
                    'livechat_active': True,
                    'channel_partner_ids': channel_partner_to_add,
                    'anonymous_name': False if user_id else anonymous_name,
                    'country_id': country_id,
                    'channel_type': 'livechat',
                    'name': visitor_user.display_name + ' ' + operator.display_name,
                    'public': 'private',
                }
                mail_channel = request.env["mail.channel"].with_context(mail_create_nosubscribe=False).sudo().create(vals)
            
                body = tools.plaintext2html(message_content)
                mail_channel.with_context(mail_create_nosubscribe=True).message_post(author_id=operator.id,
                                                                                       email_from=operator.email_formatted, body=body,
                                                                                       message_type='comment')

        else:
            return request.render("marketplace_seller_livechat.public_chat_box_form")
        
        if product and product.marketplace_seller_id.id != int(seller_id):
            product = False
            
        values = {"mail_channel_id":mail_channel,'product_msg_id':product,'message_content':reversed(mail_channel.message_ids[:50]),"replace":replace}

        return request.render("marketplace_seller_livechat.seller_history",values)
