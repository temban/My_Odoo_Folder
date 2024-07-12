# -*- coding: utf-8 -*-
#################################################################################
# Author      : Webkul Software Pvt. Ltd. (<https://webkul.com/>)
# Copyright(c): 2015-Present Webkul Software Pvt. Ltd.
# All Rights Reserved.
#
#
#
# This program is copyright property of the author mentioned above.
# You can`t redistribute it and/or modify it.
#
#
# You should have received a copy of the License along with this program.
# If not, see <https://store.webkul.com/license.html/>
#################################################################################
{
  "name"                 :  "Marketplace Buyer Seller Live Chat",
  "summary"              :  """With this module, the customers can chat with their sellers in the Odoo marketplace.""",
  "category"             :  "Website",
  "version"              :  "1.1.0",
  "sequence"             :  1,
  "author"               :  "Webkul Software Pvt. Ltd.",
  "license"              :  "Other proprietary",
  "website"              :  "https://store.webkul.com/",
  "description"          :  """
                            Marketplace Buyer Seller Live Chat
                            LiveChat
                            Live Chat
                            Seller Buyer Live Chat
                            """,
  "live_test_url"        :  "http://odoodemo.webkul.com/?module=marketplace_seller_livechat&lifetime=120&lout=1&custom_url=/",
  "depends"              :  ['odoo_marketplace','website_livechat','mail'],
  "data"                 :  [
        'security/ir.model.access.csv',
        'views/inherit_website_templates.xml',
        'views/res_config_view.xml',
        'data/data_config.xml',
                            ],
  "assets"            : {
                          'web.assets_frontend':[
                              'marketplace_seller_livechat/static/src/scss/marketplace_livechat.scss',
                              'marketplace_seller_livechat/static/src/js/history.js',
                              'marketplace_seller_livechat/static/src/js/emojis.js'
                          ]
                        },
  "images"               :  ['static/description/Banner.gif'],
  "application"          :  True,
  "installable"          :  True,
  "auto_install"         :  False,
  "price"                :  99,
  "currency"             :  "EUR",
  "pre_init_hook"        :  "pre_init_check",
}
