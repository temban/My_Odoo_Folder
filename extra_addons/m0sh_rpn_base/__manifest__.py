# -*- coding: utf-8 -*-
{
    'name': 'ShinTheo RPN Base',
    'version': '2.0.0',
    'summary': 'Provides basic menu utilities',
    'sequence': 0,
    'description': """
    Provides basic menu utilities
    ====================
    - Remove links in user menu.
    - Management of the basic entities of RPN
""",
    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO SHIPPING',
    'website': 'https://shintheo.com/',
    'images': ['static/description/icon.png'],

    # any module necessary for this one to work correctly
    'depends': ['base', 'web', 'website', 'hr', 'op_res_city'],

    # always loaded
    'data': [
        # SECURITY
        'security/security.xml',
        'security/ir.model.access.csv',

        # view
        'data/send_attachment_expiry_notification.xml',
        'views/partner.xml',
        'views/res_config_settings.xml',

        # cron
        'views/cron.xml',

        # menus
        'm0sh_rpn_base_menus.xml',
    ],
    # 'assets': {
    #     'web.assets_backend': [
    #         'm0sh_rpn_base/static/src/js/*',
    #     ],
    #     'web.assets_qweb': [
    #         'm0sh_rpn_base/static/src/xml/user_menu.xml',
    #     ],
    # },
    # only loaded in demonstration mode
    'installable': True,
    'application': True,
    'auto_install': True,
    'license': 'LGPL-3',
    'post_init_hook': '_add_rpn_implied_groups',
}
