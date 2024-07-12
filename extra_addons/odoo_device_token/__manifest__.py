# -*- coding: utf-8 -*-
{
    'name': "odoo_device_token",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, used as
        subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': "My Company",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Token',
    'version': '0.1',
    'sequence': 2,

    # any module necessary for this one to work correctly
    'depends': ['base', 'mail', 'base_setup', 'product', 'analytic', 'portal', 'web', 'hr', 'bus'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/js_script_token.xml',
        'views/odoo_define_token.xml',
        # 'socket_server.py',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
