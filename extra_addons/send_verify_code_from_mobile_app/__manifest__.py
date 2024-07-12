{
    'name': "send_verify_code_from_mobile_app",

    'summary': """
        Verified HubKilo new account""",

    'description': """
        Verify new account of HubKilo user
    """,

    'author': "Shintheo OÜ",
    'website': "https://shintheo.com/",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Auth',
    'version': '0.1',
    'sequence': 10,
    'images': ['static/description/icon.png'],
    # any module necessary for this one to work correctly
    'depends': ['base', 'mail', 'base_setup', 'product', 'analytic', 'portal', 'digest', 'web', 'hr'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
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
