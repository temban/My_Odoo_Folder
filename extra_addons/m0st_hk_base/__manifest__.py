# -*- coding: utf-8 -*-
{
    'name' : 'ShinTheo HubKilo Base',
    'version' : '2.0.1',
    'summary': 'Provides basic menu utilities',
    'sequence': 4,
    'description': """
        Provides basic menu utilities
        ====================
        - Remove links in user menu.
        - Management of the basic entities of HUB KILO
    """,
    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO SHIPPING',
    'website': 'https://shintheo.com/',
    'images' : ['static/description/icon.png'],
    'depends' : ['base', 'web', 'op_res_city', 'hr'],
    'data': [
        #SECURITY
        'security/security.xml',
        'security/ir.model.access.csv',

        #DATA
        'data/m0sthk_data.xml',
        'data/m1sthk_data.xml',
        'data/send_attachment_expiry_notification.xml',

        #VIEWS
        'views/hkbase_view.xml',
        'views/res_config_settings_view.xml',
        'views/partner_view.xml',

        #MENUS
        'm0st_hk_base_menus.xml',
    ],

    # 'assets': {
    #     'web.assets_backend': [
    #         'm0st_hk_base/static/src/js/*',
    #     ],
    #     'web.assets_qweb': [
    #         'm0st_hk_base/static/src/xml/user_menu.xml',
    #     ],
    # },
    'installable': True,
    'application': True,
    'auto_install': True,
    'license': 'LGPL-3',
    'post_init_hook' : '_add_implied_groups',

}
