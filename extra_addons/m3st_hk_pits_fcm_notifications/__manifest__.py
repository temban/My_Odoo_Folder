# -*- coding: utf-8 -*-
{
    'name' : 'ShinTheo HubKilo Pits FCM Notifications',
    'version' : '2.0.8',
    'summary': 'Extends Push notifications utilities',
    'sequence': 100,
    'description': """
        Extends Push notifications utilities
        - Generate a push notification for every action triggered in the system by HUBKILO.
        - This module must be installed at last
    """,
    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO SHIPPING',
    'website': 'https://shintheo.com/',
    'images' : ['static/description/icon.png'],
    # 'depends' : ['m1st_hk_roadshipping', 'HubKilo_Notifications', 'pits_fcm_notifications', 'hub_kilo_review' ],
    'depends': ['m1st_hk_roadshipping', 'm0st_hk_base', 'account', 'hub_kilo_review'],

    'data': [
        #SECURITY


        #DATA

        #VIEWS
        'security/ir.model.access.csv',
        'views/res_config_settings_view.xml',
        'views/notifications_log.xml',

        #MENUS

    ],

    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',

}
