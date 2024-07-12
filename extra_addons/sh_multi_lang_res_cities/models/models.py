from odoo import models, fields, api


class sh_multi_lang_res_cities(models.Model):
    _name = 'res.city'
    _inherit = 'res.city'

    ##--------------- FIELDS
    country_state_id = fields.Many2one('res.country.state', string="Country State", )

    country_name = fields.Char(compute='_compute_country_name', string="Country Name",
                               store=True, readonly=True, )

    name_fr = fields.Char(string='City (French)', translate=True)

    country_code = fields.Char(compute='_compute_code', string="Country code",
                               store=True, readonly=True, )


    ##---------------------- COMPUTED
    @api.depends('country_state_id', 'country_id')
    def _compute_country_name(self):
        for c in self:
            c['country_name'] = c.country_id.name

    @api.depends('country_state_id', 'country_id')
    def _compute_code(self):
        for c in self:
            c['country_code'] = c.country_id.code

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

