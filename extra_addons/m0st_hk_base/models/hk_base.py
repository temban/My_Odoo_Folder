# -*- coding: utf-8 -*-
## PYTHON BUILT_IN IMPORT
from datetime import datetime, date

## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


class hkBase(models.Model):
    _name = "m0sthk.base"
    # _auto = False
    _description = 'Management of the basic entities of HUB KILO'

    @api.model
    def _get_default_company(self):
        return self.env.user.company_id

    # --------------------------------------- FIEDLS -------------------------------------------
    computed = fields.Integer(string="Technical feature", size=1, default=1,
                              help="This field is used to force the calculation of the stored values", )

    active = fields.Boolean(string="Active", help="This field allows you to deactivate the record without deleting it",
                            required=False, readonly=True, default=True, )

    company_id = fields.Many2one(comodel_name='res.company', string='Company', readonly=False, required=False,
                                 ondelete='set null', default=_get_default_company)

    ##--------------------- ORM
    @api.model
    def search(self, args, offset=0, limit=None, order=None, count=False):
        if args is None: args = []
        allfields = self.fields_get()
        flag = False

        ##        mydict = {}
        ##        mydict.items()
        if len(args) != 0:
            for a in args:
                if not isinstance(a, tuple): continue
                x, y, z = a
                if x == 'active':  # si un active existe je ne le rajoute pas
                    flag = True
                    break

        if not flag:
            for key, value in allfields.items():
                if key == 'active':  ##Ici je vérifie que la vhamp active existe pour ce modèle pour ne pas générer d'erreurs
                    args.append(('active', '=', True))
                    break

        return super(hkBase, self).search(args=args, offset=offset, limit=limit, order=order, count=count)

    def test_delete(self):
        """
            Cette methode doit être redéfinie au niveau des enfants
            Ici c'est pour éviter les erreurs de la surcharge du unlink qui
            qui appelle à la place du self dans le super la methode test_delete
        """
        return self

    def unlink(self, force_context=None, force_delete=False):

        if not force_delete: return self.test_delete().toggle_active()

        return super(hkBase, self.test_delete()).unlink()

    ##--------------------- MISC
    def action_in_update(self):
        self.computed = int(not bool(self.computed))
        return self

    def in_update(self):
        self.mapped(lambda y: y.action_in_update())
        return True

    @api.model
    def get_model_pool(self, model_name):
        """
        :param model_name: @list, or @string
        :return: Model instance list
        """

        base_model_name = model_name

        if isinstance(base_model_name, str):  # or isinstance (model_name, unicode)
            model_name = [model_name]

        res_model_pool = []

        for modelname in model_name:
            model_pool = self.env.get(modelname, None)

            if model_pool is None:
                text = _(u"This object model [%s] do not exists") % modelname
                raise UserError(text)

            res_model_pool.append(model_pool)

        if isinstance(base_model_name, str):
            return res_model_pool[0]

        return res_model_pool

    @api.model
    def format_date(self, mydate, is_datetime=False, separateur='-', sep_return='/'):
        if not mydate: return ''
        res = {}

        if is_datetime:
            msplit = mydate.split(' ')
            tdate = msplit[0].split(separateur)
            ttime = msplit[1].split(':')
        else:
            tdate = mydate.split(separateur)
            ttime = ["00", "00", "00"]

        res1 = {'jour': tdate[2], 'mois': tdate[1], 'annee': tdate[0],
                'jour_mois': tdate[2] + sep_return + tdate[1],
                'mois_annee': tdate[1] + sep_return + tdate[0],
                'jour_mois_annee': tdate[2] + sep_return + tdate[1] + sep_return + tdate[0],
                'heure': ttime[0], 'minute': ttime[1], 'seconde': ttime[2],
                'heure_minute': ttime[0] + ":" + ttime[1],
                'complet': tdate[2] + sep_return + tdate[1] + sep_return + tdate[0] + " " + ttime[0] + ":" + ttime[
                    1] + ":" + ttime[2],
                }

        res2 = {'day': tdate[2], 'month': tdate[1], 'year': tdate[0],
                'day_month': tdate[1] + sep_return + tdate[2],
                'month_year': tdate[1] + sep_return + tdate[0],
                'day_month_year': tdate[1] + sep_return + tdate[2] + sep_return + tdate[0],
                'hour': ttime[0], 'minute': ttime[1], 'seconde': ttime[2],
                'hour_minute': ttime[0] + ":" + ttime[1],
                'full': tdate[2] + sep_return + tdate[1] + sep_return + tdate[0] + " " + ttime[
                    0] + ":" + ttime[1] + ":" + ttime[2],
                }

        res.update({'fr': res1, 'en': res2})

        return res

    @api.model
    def related_partner_to_user(self):
        self.get_model_pool('res.partner').search([('active', '=', True)]).in_update()


class LuggageType(models.Model):
    _name = 'm0sthk.luggage_type'
    _inherit = 'm0sthk.base'
    _description = "Allow you to manage Luggages by category"

    ##------------------- COMPUTED
    @api.depends('type')
    def _compute_code(self):
        for r in self:
            code = ""

            if r.type == 'envelope':
                code = u"ENV - %s" % r.id
            elif r.type == 'briefcase':
                code = u"BRB - %s" % r.id
            elif r.type == 'suitcase':
                code = u"STC - %s" % r.id

            r['code'] = code

    ##----------------- FIELDS
    name = fields.Char(string="Luggage category name", required=True, )

    code = fields.Char(compute='_compute_code', readonly=True, string="Code", )

    type = fields.Selection([('envelope', "Envelope"),
                             ('briefcase', "Backpack / Briefcase"),
                             ('suitcase', "Suitcase / Box"),
                             ], string="Type of luggage", required=True,
                            help="The type of luggage.\
                            \n--> Envelope : These are small packages such as letters or envelopes. the average format allowed here is an A4 envelope.\
                            \n--> Backpack / Briefcase : These are medium packages such bags or briefcase. The average size is backpack\
                            \n--> Suitcase : These are suitcases or Boxes.", )

    ##------------------ ORM
    def name_get(self):
        res = []

        for x in self:
            data = [x.id, u"%s (%s)" % (x.code, x.name)]
            res.append(tuple(data))

        return res


class LuggageModel(models.Model):
    _name = 'm0sthk.luggage_model'
    _inherit = 'm0sthk.base'
    _description = "Allow you to manage Luggages Model"

    ##----------------- CONSTRAINS
    @api.constrains('luggage_type_id', 'nature')
    def _check_conformity(self):
        for r in self:
            if r.luggage_type_id.type == 'envelope' and r.nature not in ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6']:
                text = u"Configuration error : The nature and type do not match.\
                Envelope type can only be matched with 'A0','A1','A2','A3','A4','A5','A6'"
                raise ValidationError(_(text))

            if r.luggage_type_id.type == 'briefcase' and r.nature not in ['little_size', 'medium_size']:
                text = u"Configuration error : The nature and type do not match.\
                Briefcase / Backpack  type can only be matched with 'Little size','Medium size'"
                raise ValidationError(_(text))

            if r.luggage_type_id.type == 'suitcase' and r.nature not in ['large_size']:
                text = u"Configuration error : The nature and type do not match.\
                Suitcase / Box type can only be matched with 'Large size'"
                raise ValidationError(_(text))

        return True

    @api.constrains('average_width', 'average_height', 'average_weight', 'max_width', 'max_height', 'max_weight')
    def _ckeck_maximum_values(self):
        for r in self:
            if r.average_width > r.max_width:
                text = u"Configuration error : The average width cannot be higher than maximum width"
                raise ValidationError(_(text))

            if r.average_height > r.max_height:
                text = u"Configuration error : The average height cannot be higher than maximum height"
                raise ValidationError(_(text))

            if r.average_weight > r.max_weight:
                text = u"Configuration error : The average weight cannot be higher than maximum weight"
                raise ValidationError(_(text))

        return True

    ##------------------- COMPUTE
    @api.depends('amount_to_deduct', 'computed')
    def _compute_currency(self):
        obj_list = ['res.currency', 'res.company']
        currency_obj, company_obj = self.get_model_pool(obj_list)
        company_def = company_obj.search([('name', '=', 'HUBKILO')], limit=1)
        resconfigvalues = self.env.get('res.config.settings').get_values()
        val = resconfigvalues['hk_base_config_currency_id']
        curr = currency_obj.browse(int(val))
        for r in self:
            r.currency_id = company_def.currency_id == curr and curr.id or company_def.currency_id.id

    ##            r.currency_id = resConfigValues['hk_base_config_currency_id'] #or self.env.user.company_id.currency_id.id

    ##----------------- FIELDS
    name = fields.Char(string="Luggage name", required=True, )

    nature = fields.Selection(
        [('A0', "A0"), ('A1', "A1"), ('A2', "A2"), ('A3', "A3"), ('A4', "A4"), ('A5', "A5"), ('A6', "A6"),
         ('little_size', 'Little size'), ('medium_size', "Medium size"), ('large_size', "Large size")],
        string="Nature of luggage", required=True, )

    luggage_type_id = fields.Many2one(comodel_name='m0sthk.luggage_type',
                                      string="Luggage Category", required=True, )

    type = fields.Selection([('envelope', "Envelope"),
                             ('briefcase', "Backpack / Briefcase"),
                             ('suitcase', "Suitcase / Box"), ],
                            string="Type of luggage", readonly=True,
                            related='luggage_type_id.type', store=True,
                            help="The type of luggage.\
                               \n--> Envelope : These are small packages such as letters or envelopes. the average format allowed here is an A4 envelope.\
                               \n--> Backpack / Briefcase : These are medium packages such bags or briefcase. The average size is backpack\
                               \n--> Suitcase : These are suitcases or Boxes.", )

    average_width = fields.Float(string="average width",
                                 help="This is the average width for a type of luggage expressed in centimeters")

    average_height = fields.Float(string="average height",
                                  help="This is the average height for a type of luggage expressed in centimeters")

    average_weight = fields.Float(string="Average weight", help="This is the average weight expressed in kg")

    average_size = fields.Float(string="average size",
                                help="This is the average size for a type of luggage expressed in centimeters")

    max_width = fields.Float(string="Max width",
                             help="This is the maximum width for a type of luggage expressed in centimeters")

    max_height = fields.Float(string="Max height",
                              help="This is the maximum height for a type of luggage expressed in centimeters")

    max_weight = fields.Float(string="Max weight", help="This is the maximum weight expressed in kg")

    max_size = fields.Float(string="Max size", help="This is the maximum size expressed in kg")

    description = fields.Text(string="Description", )

    amount_to_deduct = fields.Monetary(string="Amount to be withdrawn", digits=(16, 2),
                                       currency_field='currency_id',
                                       help="This is the amount to be retreived for Hubkilo fees")

    currency_id = fields.Many2one(comodel_name='res.currency', string="Default currency",
                                  help="This is the local currency for financial transactions",
                                  compute='_compute_currency', store=True,
                                  )

    ##------------------ MISC
    @api.onchange('nature')
    def onchange_nature(self):
        if not self.nature: return None

        lugtype_obj = self.env.get('m0sthk.luggage_type')

        if self.nature in ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6']:
            lugtype = lugtype_obj.search([('type', '=', 'envelope')], limit=1)

        elif self.nature in ['little_size', 'medium_size']:
            lugtype = lugtype_obj.search([('type', '=', 'briefcase')], limit=1)

        else:
            lugtype = lugtype_obj.search([('type', '=', 'suitcase')], limit=1)

        self.luggage_type_id = lugtype.id

        if self.nature == 'A0':
            self.average_width = 84.1
            self.average_size = 1.50
            self.average_height = 118.9
            self.amount_to_deduct = 4.0

        if self.nature == 'A1':
            self.average_width = 59.4
            self.average_size = 1.50
            self.average_height = 84.1
            self.amount_to_deduct = 3.5

        if self.nature == 'A2':
            self.average_width = 42.0
            self.average_size = 1.50
            self.average_height = 59.4
            self.amount_to_deduct = 3.0

        if self.nature == 'A3':
            self.average_width = 29.7
            self.average_size = 1.50
            self.average_height = 42.0
            self.amount_to_deduct = 2.5

        if self.nature == 'A4':
            self.average_width = 21.0
            self.average_size = 1.50
            self.average_height = 29.7
            self.amount_to_deduct = 2.0

        if self.nature == 'A5':
            self.average_width = 14.8
            self.average_size = 1.50
            self.average_height = 21.0
            self.amount_to_deduct = 1.5

        if self.nature == 'A6':
            self.average_width = 10.5
            self.average_size = 1.50
            self.average_height = 14.8
            self.amount_to_deduct = 1.0

        if self.nature == 'little_size':
            self.average_width = 16.0
            self.average_size = 8.0
            self.average_height = 20.0
            self.average_weight = 7.0
            self.amount_to_deduct = 7.0

        if self.nature == 'medium_size':
            self.average_width = 20.0
            self.average_size = 10.0
            self.average_height = 25.0
            self.average_weight = 10.0
            self.amount_to_deduct = 10.0

        if self.nature == 'large_size':
            self.average_width = 40.0
            self.average_size = 20.0
            self.average_height = 55.0
            self.average_weight = 22.0
            self.amount_to_deduct = 12.5

    @api.onchange('luggage_type_id')
    def onchange_type(self):
        if not self.luggage_type_id: return None

        if self.luggage_type_id.type == 'envelope':
            self.max_width = 84.1
            self.max_size = 42.05
            self.max_height = 118.9
            self.max_weight = 0.99

            self.average_weight = 0.05

        if self.luggage_type_id.type == 'briefcase':
            self.max_width = 25.0
            self.max_size = 12.25
            self.max_height = 27.0
            self.max_weight = 15.0

        if self.luggage_type_id.type == 'suitcase':
            self.max_width = 40.0
            self.max_size = 20.0
            self.max_height = 56.0
            self.max_weight = 25.0


class ResCity(models.Model):
    _name = 'res.city'
    _inherit = 'res.city'

    ##--------------- FIELDS
    country_state_id = fields.Many2one('res.country.state', string="Country State", )

    country_name = fields.Char(compute='_compute_country_name', string="Country Name",
                               store=True, readonly=True, )

    ##---------------------- COMPUTED
    @api.depends('country_state_id', 'country_id')
    def _compute_country_name(self):
        for c in self:
            c['country_name'] = c.country_id.name

    ##------------------ ORM
    def name_get(self):
        res = []

        for x in self:
            data = [x.id, u"%s (%s)" % (x.name, x.country_id.name)]
            res.append(tuple(data))

        return res

    ##----------------- MISC
    @api.onchange('country_state_id')
    def onchange_country_state(self):
        if not self.country_state_id: return None

        self.country_id = self.country_state_id.country_id.id


class ir_cron(models.Model):
    _name = "ir.cron"
    _inherit = 'ir.cron'

    ##---------------------------- FIELDS
    hk_code = fields.Char(string="Unique code", readonly=True, )
