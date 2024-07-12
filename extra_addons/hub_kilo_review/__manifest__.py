# -*- coding: utf-8 -*-
{
    'name': "hubkilo_reviews",

    'summary': """
        HubKilo Review Module""",

    'description': """
        HubKilo Review Module for a res partner
    """,

    'author': "Shintheo OÜ",
    'website': "https://shintheo.com/",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Shipping',
    'version': '0.2',
    'sequence': 10,
    # any module necessary for this one to work correctly
    'depends': ['base', 'mail', 'base_setup', 'product', 'analytic', 'portal', 'digest', 'contacts', 'm0st_hk_base', 'm1st_hk_roadshipping'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'license': 'LGPL-3',
    'installable': True,
    'application': True,
    'auto_install': False
}
