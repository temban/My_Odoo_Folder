import base64
import json
from odoo import http
from odoo.http import request


class MyAttachmentController(http.Controller):
    @http.route('/rpn/attachment/image/<int:attachment_id>', type='http', auth="none", csrf=False, website=True,
                methods=['GET'], cors='*')
    def get_attachment_image(self, attachment_id):
        attachment = request.env['ir.attachment'].sudo().browse(attachment_id)
        if attachment:
            headers = [('Content-Type', 'image/png')]  # Change the content type based on your attachment type
            image_data = base64.b64decode(attachment.datas)
            return request.make_response(image_data, headers=headers)
        else:
            return request.not_found()


class AssociationMemberController(http.Controller):

    @http.route('/rpn/manager/get_association_members/<int:manager_id>', auth='none', type='http', website=True,
                csrf=False, methods=['GET'], cors='*')
    def get_association_members(self, manager_id=None, **kwargs):
        AssociationMember = http.request.env['rpn.association.member']

        if manager_id:
            # Find records filtered by manager_id
            association_members = AssociationMember.sudo().search([('manager_id', '=', int(manager_id))])
        else:
            # If no manager_id provided, get all records
            return json.dumps({'message': 'Manager does not exist.'})

        # Prepare data in JSON format
        data = {
            'association_members': [
                {
                    'id': member.id,
                    'association_member': [
                        {'association_member_id': member.partner_id.id,
                         'association_member_name': member.partner_id.name,
                         'association_member_email': member.partner_id.email,
                         'association_state': member.partner_id.state,
                         'association_member_account_balance': member.partner_id.account_balance,
                         'association_member_image_1920': bool(member.partner_id.image_1920)}],
                    'status': member.status,
                    # Add other fields you want to include
                }
                for member in association_members
            ]
        }

        # Return JSON response
        return json.dumps(data)


class PartnerController(http.Controller):

    @http.route('/rpn/get_all_partners', auth='public', cors='*', type='http', csrf=False, methods=['GET'], website=True)
    def get_all_partners(self, **kwargs):
        partners = request.env['res.partner'].sudo().search([])
        partner_data = []
        for partner in partners:
            has_image_1920 = bool(partner.image_1920)  # Check if image_1920 exists
            partner_data.append({
                'id': partner.id,
                'name': partner.name,
                'email': partner.email,
                'image_1920': has_image_1920,  # Adding the 'image_1920' field based on existence
                'phone': partner.phone,
                'mobile': partner.mobile,
                'website': partner.website,
                'street': partner.street,
                'street2': partner.street2,
                'city': partner.city,
                'zip': partner.zip,
                'country_id': partner.country_id.name,
                'state_id': partner.state_id.name,
                'vat': partner.vat,
                'function': partner.function,
                'title': partner.title.name,
                'category_id': [category.name for category in partner.category_id],
                'gender': partner.gender,
                'sex': partner.sex,
                'is_member': partner.is_member,
                'member_diseased': partner.member_diseased,
                'related_user_id': partner.related_user_id.name if partner.related_user_id else False,
                'residence_city_id': partner.residence_city_id.name if partner.residence_city_id else False,
                'birth_city_id': partner.birth_city_id.name if partner.birth_city_id else False,
                'is_internal_user': partner.is_internal_user,
                'state': partner.state,  # Adding the new field 'state'
                'partner_attachment_ids': [attachment.id for attachment in partner.partner_attachment_ids],
                # Adjust as required
                'accounts': [account.amount for account in partner.accounts],  # Adjust as required
                'account_balance': partner.account_balance,  # Adding the new field 'account_balance'
                # Add other desired fields from the 'res.partner' model
            })
        return json.dumps(partner_data)

    @http.route('/rpn/members', auth='public', type='http', cors='*', csrf=False, methods=['GET'], website=True)
    def get_members(self, **kwargs):
        partners = request.env['res.partner'].sudo().search(
            [('is_member', '=', True)])
        active_member_data = []
        for partner in partners:
            has_image_1920 = bool(partner.image_1920)  # Check if image_1920 exists
            active_member_data.append({
                'id': partner.id,
                'name': partner.name,
                'email': partner.email,
                'image_1920': has_image_1920,  # Adding the 'image_1920' field based on existence
                'phone': partner.phone,
                'mobile': partner.mobile,
                'website': partner.website,
                'street': partner.street,
                'street2': partner.street2,
                'city': partner.city,
                'zip': partner.zip,
                'country_id': partner.country_id.name,
                'state_id': partner.state_id.name,
                'vat': partner.vat,
                'function': partner.function,
                'title': partner.title.name,
                'category_id': [category.name for category in partner.category_id],
                'gender': partner.gender,
                'sex': partner.sex,
                'is_member': partner.is_member,
                'member_diseased': partner.member_diseased,
                'related_user_id': partner.related_user_id.name if partner.related_user_id else False,
                'residence_city_id': partner.residence_city_id.name if partner.residence_city_id else False,
                'birth_city_id': partner.birth_city_id.name if partner.birth_city_id else False,
                'is_internal_user': partner.is_internal_user,
                'state': partner.state,  # Adding the new field 'state'
                'partner_attachment_ids': [attachment.id for attachment in partner.partner_attachment_ids],
                # Adjust as required
                'accounts': [account.amount for account in partner.accounts],  # Adjust as required
                'account_balance': partner.account_balance,  # Adding the new field 'account_balance'
                # Add other desired fields from the 'res.partner' model
            })
        return json.dumps(active_member_data)

    @http.route('/rpn/get_active_members', auth='public', type='http', cors='*', csrf=False, methods=['GET'], website=True)
    def get_active_members(self, **kwargs):
        partners = request.env['res.partner'].sudo().search(
            [('is_member', '=', True), ('state', '=', 'active')])
        active_member_data = []
        for partner in partners:
            has_image_1920 = bool(partner.image_1920)  # Check if image_1920 exists
            active_member_data.append({
                'id': partner.id,
                'name': partner.name,
                'email': partner.email,
                'image_1920': has_image_1920,  # Adding the 'image_1920' field based on existence
                'phone': partner.phone,
                'mobile': partner.mobile,
                'website': partner.website,
                'street': partner.street,
                'street2': partner.street2,
                'city': partner.city,
                'zip': partner.zip,
                'country_id': partner.country_id.name,
                'state_id': partner.state_id.name,
                'vat': partner.vat,
                'function': partner.function,
                'title': partner.title.name,
                'category_id': [category.name for category in partner.category_id],
                'gender': partner.gender,
                'sex': partner.sex,
                'is_member': partner.is_member,
                'member_diseased': partner.member_diseased,
                'related_user_id': partner.related_user_id.name if partner.related_user_id else False,
                'residence_city_id': partner.residence_city_id.name if partner.residence_city_id else False,
                'birth_city_id': partner.birth_city_id.name if partner.birth_city_id else False,
                'is_internal_user': partner.is_internal_user,
                'state': partner.state,  # Adding the new field 'state'
                'partner_attachment_ids': [attachment.id for attachment in partner.partner_attachment_ids],
                # Adjust as required
                'accounts': [account.amount for account in partner.accounts],  # Adjust as required
                'account_balance': partner.account_balance,  # Adding the new field 'account_balance'
                # Add other desired fields from the 'res.partner' model
            })
        return json.dumps(active_member_data)

    @http.route('/rpn/managers', auth='public', type='http', cors='*', csrf=False, methods=['GET'], website=True)
    def get_active_managers(self, **kwargs):
        partners = request.env['res.partner'].sudo().search(
            [('is_manager', '=', True)])
        active_member_data = []
        for partner in partners:
            has_image_1920 = bool(partner.image_1920)  # Check if image_1920 exists
            active_member_data.append({
                'id': partner.id,
                'name': partner.name,
                'email': partner.email,
                'image_1920': has_image_1920,  # Adding the 'image_1920' field based on existence
                'phone': partner.phone,
                'mobile': partner.mobile,
                'website': partner.website,
                'street': partner.street,
                'street2': partner.street2,
                'city': partner.city,
                'zip': partner.zip,
                'country_id': partner.country_id.name,
                'state_id': partner.state_id.name,
                'vat': partner.vat,
                'function': partner.function,
                'title': partner.title.name,
                'category_id': [category.name for category in partner.category_id],
                'gender': partner.gender,
                'sex': partner.sex,
                'is_member': partner.is_member,
                'member_diseased': partner.member_diseased,
                'related_user_id': partner.related_user_id.name if partner.related_user_id else False,
                'residence_city_id': partner.residence_city_id.name if partner.residence_city_id else False,
                'birth_city_id': partner.birth_city_id.name if partner.birth_city_id else False,
                'is_internal_user': partner.is_internal_user,
                'state': partner.state,  # Adding the new field 'state'
                'partner_attachment_ids': [attachment.id for attachment in partner.partner_attachment_ids],
                # Adjust as required
                'accounts': [account.amount for account in partner.accounts],  # Adjust as required
                'account_balance': partner.account_balance,  # Adding the new field 'account_balance'
                # Add other desired fields from the 'res.partner' model
            })
        return json.dumps(active_member_data)

    @http.route('/rpn/member_diseased', auth='public', type='http', cors='*', csrf=False, methods=['GET'], website=True)
    def get_active_state(self, **kwargs):
        partners = request.env['res.partner'].sudo().search(
            [('state', '=', 'is_death')])
        active_member_data = []
        for partner in partners:
            has_image_1920 = bool(partner.image_1920)  # Check if image_1920 exists
            active_member_data.append({
                'id': partner.id,
                'name': partner.name,
                'email': partner.email,
                'image_1920': has_image_1920,  # Adding the 'image_1920' field based on existence
                'phone': partner.phone,
                'mobile': partner.mobile,
                'website': partner.website,
                'street': partner.street,
                'street2': partner.street2,
                'city': partner.city,
                'zip': partner.zip,
                'country_id': partner.country_id.name,
                'state_id': partner.state_id.name,
                'vat': partner.vat,
                'function': partner.function,
                'title': partner.title.name,
                'category_id': [category.name for category in partner.category_id],
                'gender': partner.gender,
                'sex': partner.sex,
                'is_member': partner.is_member,
                'member_diseased': partner.member_diseased,
                'related_user_id': partner.related_user_id.name if partner.related_user_id else False,
                'residence_city_id': partner.residence_city_id.name if partner.residence_city_id else False,
                'birth_city_id': partner.birth_city_id.name if partner.birth_city_id else False,
                'is_internal_user': partner.is_internal_user,
                'state': partner.state,  # Adding the new field 'state'
                'partner_attachment_ids': [attachment.id for attachment in partner.partner_attachment_ids],
                # Adjust as required
                'accounts': [account.amount for account in partner.accounts],  # Adjust as required
                'account_balance': partner.account_balance,  # Adding the new field 'account_balance'
                # Add other desired fields from the 'res.partner' model
            })
        return json.dumps(active_member_data)

    @http.route('/rpn/get_contributor_records/<int:contributor_id>', auth='public', type='http', cors='*', website=True,
                csrf=False, methods=['GET'])
    def get_contributor_records(self, contributor_id, **kwargs):
        DeathNotice = http.request.env['rpn.death.notice.initial']
        contributor_records = DeathNotice.sudo().search([('contributor_partner_id', '=', contributor_id)])

        # Convert the records to a JSON format
        records_list = []
        for record in contributor_records:
            record_data = {
                'id': record.id,
                'contributor_partner_id': record.contributor_partner_id.id,
                'member_id': record.member_id.id,
                'move_id': record.move_id.id,
                'manager_name': record.manager_name,
                'manager_id': record.manager_id.id,
                'code': record.code,
                'date_of_death': record.date_of_death.strftime('%Y-%m-%d') if record.date_of_death else False,
                'cause_of_death': record.cause_of_death,
                'description': record.description,
                'related_member': record.related_member.id,
                'color': record.color,
                'total_contribution': record.total_contribution,
                'contribution_per_member': record.contribution_per_member,
                'currency_id': record.currency_id.id,
                'number_of_active_members': record.number_of_active_members,
                'member_is': record.member_is,
                'create_date': record.create_date.strftime('%Y-%m-%d %H:%M:%S'),
            }
            records_list.append(record_data)

        # Return the records in JSON format
        return json.dumps(records_list)
