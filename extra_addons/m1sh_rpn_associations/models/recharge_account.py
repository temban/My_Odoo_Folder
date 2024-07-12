from odoo import fields, models, api, _
from odoo.exceptions import UserError


class AccountMoveInherit(models.Model):
    _inherit = 'account.move'

    partner_id = fields.Many2one('res.partner', string='Member', readonly=True)

    payment_link = fields.Char(string="Payement Link", readonly=True, )

    recharge = fields.One2many('account.recharge', inverse_name='move_id', readonly=True)

    added_to_account_balance = fields.Selection([
        ('not_added', 'Not Added'),
        ('added', 'Added')
    ], string='Was this invoice added to Accounted balance?', default='not_added')

    contribution_type = fields.Selection([
        ('first_recharge', 'Membership fee and Recharge'),
        ('other_recharge', 'Normal Recharge'),
        ('re_activation', 'Account Re-activation'),
    ], string='Type of Recharges')

    currency_id = fields.Many2one(
        'res.currency',
        string='Currency:',
        compute='_compute_currency',
        store=True  # Store the computed value in the database for real-time display
    )

    @api.depends('partner_id')  # Adjust the dependency as per your logic
    def _compute_currency(self):
        resconfigvalues = self.env['res.config.settings'].sudo().get_values()
        currency_id = resconfigvalues['rpn_base_config_currency_id']
        self.currency_id = currency_id

    def _force_to_generate_payment_link(self):
        plwiz_obj = self.env.get('payment.link.wizard')
        ctx = dict(self._context, active_id=self.id, active_model='account.move')
        fields_list = ['res_model', 'res_id', 'amount', 'amount_max',
                       'currency_id', 'partner_id', 'description', 'acquirer_id']

        plwiz_vals = plwiz_obj.with_context(ctx).default_get(fields=fields_list)
        plwiz_rec = plwiz_obj.create(plwiz_vals)

        if not plwiz_rec.link: plwiz_rec._compute_values()

        self.payment_link = plwiz_rec.link

        # print("plzzzz", plwiz_rec.link)
        # print("pay link", self.payment_link)


class RechargeAccount(models.Model):
    _name = 'account.recharge'
    _inherit = "m0shrpn.base"

    @api.model
    def _get_default_partner(self):
        partner_obj = self.env.get('res.partner')
        return partner_obj.search([('related_user_id', '=', self.env.user.id)], limit=1)

    partner_id = fields.Many2one('res.partner', string='Member', default=_get_default_partner, required=True)

    move_id = fields.Many2one('account.move', string='Related Invoice', readonly=True)

    amount = fields.Float(string='Enter Recharge Amount')  # New field for recharge amount

    account_balance = fields.Float(
        string='Debt',
        compute='_compute_account_balance',
        store=True, readonly=True  # Store the computed value in the database for real-time display
    )

    total = fields.Float(
        string='Total amount',
        compute='_compute_total',
        store=True, readonly=True  # Store the computed value in the database for real-time display
    )

    total_recharge = fields.Float(
        string='Total recharge amount',
        compute='_compute_total_recharge',
        store=True, readonly=True  # Store the computed value in the database for real-time display
    )

    membership_fee = fields.Float(
        string='Membership Fee',
        compute='_compute_membership_fee', store=True, readonly=True
    )

    re_activation_fee = fields.Float(
        string='Re-activation Fee',
        compute='_compute_re_activation_fee', store=True, readonly=True
    )

    total_re_activation_fee = fields.Float(
        string='Total recharge amount',
        compute='_compute_total_re_activation_fee',
        store=True, readonly=True  # Store the computed value in the database for real-time display
    )

    min_recharge = fields.Float(
        string='Minimum Recharge Amount',
        compute='_compute_min_recharge', store=True, readonly=True
    )

    currency_id = fields.Many2one(
        'res.currency',
        string='Currency:',
        compute='_compute_currency',
        store=True  # Store the computed value in the database for real-time display
    )

    @api.depends('partner_id')  # Adjust the dependency as per your logic
    def _compute_currency(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        currency_id = resconfigvalues['rpn_base_config_currency_id']
        self.currency_id = currency_id

    @api.depends('amount', 'membership_fee')
    def _compute_total(self):
        for record in self:
            record.total = record.amount + record.membership_fee

    @api.depends('amount', 'partner_id', 're_activation_fee')
    def _compute_account_balance(self):
        for record in self:
            # Check if account_balance is less than 0
            if float(record.partner_id.account_balance) > 0:
                record.account_balance = 0
            else:
                record.account_balance = abs(record.partner_id.account_balance)


    @api.depends('amount', 'membership_fee')
    def _compute_total_recharge(self):
        for record in self:
            record.total_recharge = record.amount + record.min_recharge

    @api.depends('amount', 're_activation_fee')
    def _compute_total_re_activation_fee(self):
        for record in self:
            record.total_re_activation_fee = abs(record.amount + abs(record.re_activation_fee) + abs(record.account_balance))

    @api.depends('partner_id')  # If these values depend on the partner, adjust the dependency accordingly
    def _compute_membership_fee(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        self.membership_fee = resconfigvalues['rpn_base_config_min_membership_amount']

    @api.depends('partner_id')  # If these values depend on the partner, adjust the dependency accordingly
    def _compute_min_recharge(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        self.min_recharge = resconfigvalues['rpn_base_config_min_account_balance']

    @api.depends('partner_id')  # If these values depend on the partner, adjust the dependency accordingly
    def _compute_re_activation_fee(self):
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        self.re_activation_fee = resconfigvalues['rpn_base_config_re_activation_fee']

    def member_first_recharge(self, amount=None, partner_id=None):
        amount = amount or self.amount
        partner_id = partner_id or self.partner_id
        # get settings for min recharge and membership fee
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        min_recharge = resconfigvalues['rpn_base_config_min_account_balance']
        membership_fee = resconfigvalues['rpn_base_config_min_membership_amount']

        rpn_base_config_percentage = resconfigvalues['rpn_base_config_percentage']
        administrative_fee_unit_price = float(float(rpn_base_config_percentage) / 100) * (amount + float(membership_fee))

        total_required_amount = float(membership_fee) + float(min_recharge)

        if float(amount) < float(min_recharge):
            raise UserError(
                _(u"The recharge amount %s must be greater than %s which is the minimum amount you can recharge your account with." % (
                    self.amount, min_recharge)))

        # accessing all odoo models for invoices and payment
        obj_list = ['account.move', 'account.move.line', 'res.partner', 'product.product',
                    'account.payment.register', 'account.payment']
        inv_obj, invl_obj, prt_obj, product_obj, \
            preg_obj, accpay_obj = self.get_model_pool(obj_list)

        # accessing corncern product details and user info for invoice genaration
        pbank_ids = partner_id.mapped('bank_ids')
        membership_fee_product = product_obj.search([('default_code', '=', 'RPNMS-FEES')], limit=1)
        recharge_product = product_obj.search([('default_code', '=', 'RPNM-RECHARGE')], limit=1)
        recharge_product_taxes_ids = recharge_product.mapped('taxes_id.id')
        membership_fee_product_taxes_ids = membership_fee_product.mapped('taxes_id.id')
        administrative_fee_product = product_obj.search([('default_code', '=', 'RPN-ADMIN-FEE')], limit=1)
        administrative_fee_product_taxes_ids = administrative_fee_product.mapped('taxes_id.id')

        if membership_fee_product and recharge_product:
            journal_id = self.env['account.journal'].sudo().search([('type', '=', 'sale')], limit=1)
            # print(journal_id)
            if not journal_id:
                return False

            invoice = {
                'move_type': 'out_invoice',
                'narration': u"RPN Fees for membership",
                'partner_id': partner_id,  # Assuming you want the current user as the customer
                'invoice_date': fields.Date.today(), 'invoice_date_due': fields.Date.today(),
                'invoice_origin': "RPN Association",
                'contribution_type': 'first_recharge',
                'invoice_payment_term_id': partner_id.property_payment_term_id.id or False,
                'currency_id': self.currency_id.id,
                'invoice_line_ids': [(0, 0, {
                    'name': membership_fee_product.name,
                    'quantity': 1,
                    'price_unit': membership_fee,
                    'account_id': membership_fee_product.property_account_income_id.id,
                }), (0, 0, {
                    'name': recharge_product.name,
                    'quantity': 1,
                    'price_unit': amount,
                    'account_id': recharge_product.property_account_income_id.id,
                }), (0, 0, {
                    'name': administrative_fee_product.name,
                    'quantity': 1,
                    'price_unit': administrative_fee_unit_price,
                    'account_id': administrative_fee_product.property_account_income_id.id,
                })]
            }
            rpn_inv = inv_obj.create(invoice)
            self.move_id = rpn_inv.id  # Assigning the move_id field with the ID of the created invoice
            rpn_inv.sudo().action_post()
            link = rpn_inv.sudo()._force_to_generate_payment_link()
            # print("invoice payment link", link)
            # self.delete_invalid_attachments()

            return rpn_inv
        else:
            return False

    def member_other_recharge(self, amount=None, partner_id=None):
        amount = amount or self.amount
        partner_id = partner_id or self.partner_id
        # get settings for min recharge and membership fee
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        min_recharge = resconfigvalues['rpn_base_config_min_account_balance']
        rpn_base_config_percentage = resconfigvalues['rpn_base_config_percentage']
        administrative_fee_unit_price = float(float(rpn_base_config_percentage) / 100) * amount

        if float(amount) < float(min_recharge):
            raise UserError(
                _(u"The recharge amount %s must be greater than %s which is the minimum amount you can recharge your account with." % (
                    self.amount, min_recharge)))

        # accessing all odoo models for invoices and payment
        obj_list = ['account.move', 'account.move.line', 'res.partner', 'product.product',
                    'account.payment.register', 'account.payment']
        inv_obj, invl_obj, prt_obj, product_obj, \
            preg_obj, accpay_obj = self.get_model_pool(obj_list)

        # accessing corncern product details and user info for invoice genaration
        pbank_ids = partner_id.mapped('bank_ids')
        recharge_product = product_obj.search([('default_code', '=', 'RPNM-RECHARGE')], limit=1)
        recharge_product_taxes_ids = recharge_product.mapped('taxes_id.id')
        administrative_fee_product = product_obj.search([('default_code', '=', 'RPN-ADMIN-FEE')], limit=1)
        administrative_fee_product_taxes_ids = administrative_fee_product.mapped('taxes_id.id')

        if recharge_product:
            journal_id = self.env['account.journal'].sudo().search([('type', '=', 'sale')], limit=1)
            # print(journal_id)
            if not journal_id:
                return False

            invoice = {
                'move_type': 'out_invoice',
                'narration': u"RPN Account Recharged",
                'partner_id': partner_id,  # Assuming you want the current user as the customer
                'invoice_date': fields.Date.today(), 'invoice_date_due': fields.Date.today(),
                'invoice_origin': "RPN Association",
                'contribution_type': 'other_recharge',
                'invoice_payment_term_id': partner_id.property_payment_term_id.id or False,
                'currency_id': self.currency_id.id,
                'invoice_line_ids': [(0, 0, {
                    'name': recharge_product.name,
                    'quantity': 1,
                    'price_unit': amount,
                    'account_id': recharge_product.property_account_income_id.id,
                }), (0, 0, {
                    'name': administrative_fee_product.name,
                    'quantity': 1,
                    'price_unit': administrative_fee_unit_price,
                    'account_id': administrative_fee_product.property_account_income_id.id,
                })]
            }
            rpn_inv = inv_obj.create(invoice)
            self.move_id = rpn_inv.id  # Assigning the move_id field with the ID of the created invoice
            rpn_inv.sudo().action_post()
            link = rpn_inv.sudo()._force_to_generate_payment_link()
            # print("invoice payment link", link)
            # self.delete_invalid_attachments()
            return rpn_inv
        else:
            return False

    def member_re_activation_recharge(self, amount=None, partner_id=None):
        amount = amount or self.amount
        partner_id = partner_id or self.partner_id
        # get settings for min recharge and membership fee
        resconfigvalues = self.get_model_pool('res.config.settings').get_values()
        min_recharge = resconfigvalues['rpn_base_config_min_account_balance']
        re_activation_fee = resconfigvalues['rpn_base_config_re_activation_fee']
        rpn_base_config_percentage = resconfigvalues['rpn_base_config_percentage']

        account_balance = float(partner_id.account_balance)
        # Check if account_balance is less than 0
        if account_balance > 0:
            debt = 0
        else:
            debt = abs(account_balance)

        administrative_fee_unit_price = float(float(rpn_base_config_percentage) / 100) * (
                float(re_activation_fee) + debt + amount)

        if float(amount) < float(min_recharge):
            raise UserError(
                _(u"The recharge amount %s must be greater than %s which is the minimum amount you can recharge your account with." % (
                    self.amount, min_recharge)))

        # accessing all odoo models for invoices and payment
        obj_list = ['account.move', 'account.move.line', 'res.partner', 'product.product',
                    'account.payment.register', 'account.payment']
        inv_obj, invl_obj, prt_obj, product_obj, \
            preg_obj, accpay_obj = self.get_model_pool(obj_list)

        # accessing corncern product details and user info for invoice genaration
        pbank_ids = partner_id.mapped('bank_ids')
        re_activation_fee_product = product_obj.search([('default_code', '=', 'RPN-REACT-FEE')], limit=1)
        debt_fee_product = product_obj.search([('default_code', '=', 'RPN-DEBT-FEE')], limit=1)
        recharge_product = product_obj.search([('default_code', '=', 'RPNM-RECHARGE')], limit=1)
        administrative_fee_product = product_obj.search([('default_code', '=', 'RPN-ADMIN-FEE')], limit=1)
        recharge_product_taxes_ids = recharge_product.mapped('taxes_id.id')
        re_activation_fee_product_taxes_ids = re_activation_fee_product.mapped('taxes_id.id')
        debt_fee_product_taxes_ids = debt_fee_product.mapped('taxes_id.id')
        administrative_fee_product_taxes_ids = administrative_fee_product.mapped('taxes_id.id')

        if debt_fee_product and recharge_product and re_activation_fee_product and administrative_fee_product:
            journal_id = self.env['account.journal'].sudo().search([('type', '=', 'sale')], limit=1)
            # print(journal_id)
            if not journal_id:
                return False

            invoice = {
                'move_type': 'out_invoice',
                'narration': u"RPN Fees for Account Re-activation",
                'partner_id': partner_id,  # Assuming you want the current user as the customer
                'invoice_date': fields.Date.today(), 'invoice_date_due': fields.Date.today(),
                'invoice_origin': "RPN Association",
                'contribution_type': 're_activation',
                'invoice_payment_term_id': partner_id.property_payment_term_id.id or False,
                'currency_id': self.currency_id.id,
                'invoice_line_ids': [(0, 0, {
                    'name': re_activation_fee_product.name,
                    'quantity': 1,
                    'price_unit': re_activation_fee,
                    'account_id': re_activation_fee_product.property_account_income_id.id,
                }), (0, 0, {
                    'name': debt_fee_product.name,
                    'quantity': 1,
                    'price_unit': debt,
                    'account_id': debt_fee_product.property_account_income_id.id,
                }), (0, 0, {
                    'name': recharge_product.name,
                    'quantity': 1,
                    'price_unit': amount,
                    'account_id': recharge_product.property_account_income_id.id,
                }),  (0, 0, {
                    'name': administrative_fee_product.name,
                    'quantity': 1,
                    'price_unit': administrative_fee_unit_price,
                    'account_id': administrative_fee_product.property_account_income_id.id,
                })]
            }
            rpn_inv = inv_obj.create(invoice)
            self.move_id = rpn_inv.id  # Assigning the move_id field with the ID of the created invoice
            self.amount += debt
            rpn_inv.sudo().action_post()
            link = rpn_inv.sudo()._force_to_generate_payment_link()
            # print("invoice payment link", link)
            # self.delete_invalid_attachments()

            return rpn_inv
        else:
            return False

    def delete_invalid_attachments(self):
        attachments = self.env['ir.attachment'].sudo().search([
            ('attach_custom_type', '=', False)
        ])

        # Loop through and delete the found attachments
        for attachment in attachments:
            attachment.unlink()

        return True
