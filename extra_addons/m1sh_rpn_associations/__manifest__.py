# -*- coding: utf-8 -*-
{
    'name': "Shintheo RPN Associations",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, used as
        subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': u'SHINTHEO OÜ',
    'category': 'SHINTHEO RPN',
    'website': 'https://shintheo.com/',
    'images': ['static/description/icon.png'],

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'sequence': 0,
    'version': '2.0.2',

    # any module necessary for this one to work correctly
    'depends': ['base', 'web', 'website', 'm0sh_rpn_base', 'mail', 'payment', 'l10n_fr', 'account', 'sale_management',
                'pits_fcm_notifications'],

    # always loaded
    'data': [
        # security
        'security/ir.model.access.csv',

        # view
        'views/member_creation_form.xml',
        'views/partners_members_managers.xml',
        'views/partner_recharch.xml',
        'views/death_notice.xml',
        'views/res_config_notification.xml',
        'views/rpn_notifications_log.xml',
        # 'views/test.xml',

        # data
        'data/activated_membership.xml',
        'data/activation_email_to_staff.xml',
        'data/confirm_paid_recharge.xml',
        'data/account_re_activation.xml',
        'data/debite_member_account.xml',
        'data/member_selected_as_manager.xml',
        'data/managers_member_account_sold_reminder.xml',
        'data/member_account_sold_reminder_mail.xml',
        'data/account_dis_activated.xml',
        'data/managers_members_account_dis_activated.xml',
        'data/member_set_to_dormant.xml',
        'data/managers_member_set_to_dormant.xml',
        'data/account_set_to_supended.xml',
        'data/account_set_to_active.xml',
        'data/cron.xml',

        # menu
        'rpn_association_menus.xml',
    ],
    # only loaded in demonstration mode
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
    'post_init_hook': '_create_rpn_products',
}
