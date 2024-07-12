## ODOO IMPORT
from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


class rpnBase(models.Model):
    _name = "m0shrpn.base"
    # _auto = False
    _description = 'Management of the basic entities of RPN'

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

        return super(rpnBase, self).search(args=args, offset=offset, limit=limit, order=order, count=count)

    def test_delete(self):
        """
            Cette methode doit être redéfinie au niveau des enfants
            Ici c'est pour éviter les erreurs de la surcharge du unlink qui
            qui appelle à la place du self dans le super la methode test_delete
        """
        return self

    def unlink(self, force_context=None, force_delete=False):

        if not force_delete: return self.test_delete().toggle_active()

        return super(rpnBase, self.test_delete()).unlink()

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
    rpn_code = fields.Char(string="Unique code", readonly=True, )
