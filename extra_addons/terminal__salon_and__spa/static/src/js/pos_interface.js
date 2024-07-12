// addons/custom_pos/static/src/js/pos_interface.js

odoo.define('terminal__salon_and__spa.pos_interface', function (require) {
    'use strict';

    var PosBaseWidget = require('point_of_sale.BaseWidget');

    // Add the product categories functionality
    PosBaseWidget.include({
        events: _.extend({}, PosBaseWidget.prototype.events, {
            'click .product-category': '_onClickCategory',
        }),
        show: function () {
            this._super();
            this.product_categories = this.el.querySelectorAll('.product-category');
        },
        _onClickCategory: function (event) {
            var category_id = parseInt(event.target.getAttribute('data-id'));
            this.pos.get_order().set_category_filter(category_id);
            this.pos.trigger('change:category_filter', category_id);
        },
    });

    // Add the customer search functionality
    PosBaseWidget.include({
        events: _.extend({}, PosBaseWidget.prototype.events, {
            'input .search-customer': '_onSearchCustomer',
        }),
        init: function (parent, options) {
            this._super.apply(this, arguments);
            this.customer = null;
        },
        show: function () {
            this._super();
            this.customer_list = [];
        },
        _onSearchCustomer: function (event) {
            var query = event.target.value.trim();
            var customers = this.pos.db.search_customer(query);
            this.pos.trigger('update:customer-list', customers);
        },
        set_customer: function (customer_id) {
            if (customer_id) {
                this.customer = this.pos.db.get_customer_by_id(customer_id);
                this.el.querySelector('.customer-name').textContent = 'Customer: ' + this.customer.name;
            } else {
                this.customer = null;
                this.el.querySelector('.customer-name').textContent = 'Customer: Guest';
            }
        },
    });

    // Add the appointment scheduling functionality
    PosBaseWidget.include({
        events: _.extend({}, PosBaseWidget.prototype.events, {
            'input .appointment-time': '_onSetAppointmentTime',
        }),
        show: function () {
            this._super();
            this.el.querySelector('.appointment-time').value = this.pos.get_order().get_appointment_time();
        },
        _onSetAppointmentTime: function (event) {
            var appointment_time = event.target.value.trim();
            this.pos.get_order().set_appointment_time(appointment_time);
            this.pos.trigger('change:appointment_time', appointment_time);
        },
    });

    return PosBaseWidget;
});
