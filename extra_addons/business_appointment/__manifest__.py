# -*- coding: utf-8 -*-
{
    "name": "Universal Appointments and Time Reservations",
    "version": "15.0.1.2.12",
    "category": "Extra Tools",
    "author": "faOtools",
    "website": "https://faotools.com/apps/15.0/universal-appointments-and-time-reservations-607",
    "license": "Other proprietary",
    "application": True,
    "installable": True,
    "auto_install": False,
    "depends": [
        "product",
        "resource",
        "calendar",
        "sms",
        "phone_validation",
        "rating"
    ],
    "data": [
        "security/security.xml",
        "security/ir.model.access.csv",
        "data/data.xml",
        "reports/business_appointment_report.xml",
        "reports/action_business_appointment_report.xml",
        "data/templates.xml",
        "data/cron.xml",
        "views/rating_rating.xml",
        "views/business_appointment.xml",
        "views/res_config_settings.xml",
        "views/appointment_day_limit.xml",
        "views/appointment_product.xml",
        "views/business_resource.xml",
        "views/business_resource_type.xml",
        "views/business_appointment_core.xml",
        "views/business_appointment_custom_search.xml",
        "views/appointment_alarm.xml",
        "views/mail_template.xml",
        "views/sms_template.xml",
        "views/alarm_task.xml",
        "views/res_partner.xml",
        "views/resource_calendar.xml",
        "wizard/make_business_appointment.xml",
        "wizard/choose_appointment_customer.xml",
        "reports/appointment_analytic.xml",
        "views/menu.xml"
    ],
    "assets": {
        "web.assets_backend": [
                "business_appointment/static/src/css/business_appointment_calendar.css",
                "business_appointment/static/src/js/time_slots.js",
                "business_appointment/static/src/css/kanban_style.css",
                "business_appointment/static/src/js/resource_many2many.js",
                "business_appointment/static/src/js/business_appointment_formcontroller.js",
                "business_appointment/static/src/js/business_appointment_formview.js",
                "business_appointment/static/src/js/business_appointment_list_controller.js",
                "business_appointment/static/src/js/business_appointment_listview.js",
                "business_appointment/static/src/js/business_appointment_calendarcontroller.js",
                "business_appointment/static/src/js/business_appointment_calendarrenderer.js",
                "business_appointment/static/src/js/business_appointment_calendarmodel.js",
                "business_appointment/static/src/js/business_appointment_calendarview.js",
                "business_appointment/static/src/js/ba_popups.js"
        ],
        "web.assets_common": [
                "business_appointment/static/src/css/business_appointment.css",
                "business_appointment/static/src/js/slots_widget_core.js"
        ],
        "web.assets_qweb": [
                "business_appointment/static/src/xml/*.xml"
        ]
},
    "demo": [
        
    ],
    "external_dependencies": {},
    "summary": "The tool for time-based service management from booking appointments to sales and reviews. Portal reservations. Website reservations. Appointment calendar. Online bookings. Website bookings. Portal appointments. Booking calendar. Slot Booking. Website calendar. Book facility. Reserve room. Schedule meeting. Service Management. Rental management. Doctor appointments. Clinic appointments. Dental appointments. Beauty salon appointments. Lawyer services. Book consultations. Online lessons. Field service. Sell services. Time management. Resource allocation. Resource booking. Website appointments. Scheduling system. Appointments online. Book online",
    "description": """For the full details look at static/description/index.html
* Features * 
- Innovative backend scheduling
- &lt;i class=&#39;fa fa-globe&#39;&gt;&lt;/i&gt; Universal website bookings
- Structured service management
- Sale and upsell services
- Flexible configuration and automatization
- Complementary features
- Secured appointments
- &lt;i class=&#39;fa fa-gears&#39;&gt;&lt;/i&gt; Custom fields
#odootools_proprietary""",
    "images": [
        "static/description/main.png"
    ],
    "price": "399.0",
    "currency": "EUR",
    "live_test_url": "https://faotools.com/my/tickets/newticket?&url_app_id=129&ticket_version=15.0&url_type_id=3",
}