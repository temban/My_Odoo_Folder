// addons/custom_pos/static/src/js/pos_interface_override.js

odoo.define('point_of_sale_custom.pos', function (require) {
    'use strict';

    var pos_screens = require('point_of_sale.screens');

    // Override the OrderScreen to display the product categories
    pos_screens.OrderWidget.include({
        renderElement: function () {
            this._super();
            this.product_categories = this.el.querySelector('.product-categories');
        },
        update_product_list: function () {
            var self = this;
            this.product_categories.innerHTML = '';
            this.pos.product_categories.forEach(function (category) {
                var category_button = document.createElement('button');
                category_button.classList.add('product-category');
                category_button.textContent = category.name;
                category_button.setAttribute('data-id', category.id);
                category_button.addEventListener('click', self._onClickCategory.bind(self));
                self.product_categories.appendChild(category_button);
            });
        },
    });

    // Override the OrderScreen to display the customer search results
    pos_screens.OrderWidget.include({
        renderElement: function () {
            this._super();
            this.customer_list = this.el.querySelector('.customer-list');
        },
        update_customer_list: function () {
            var self = this;
            this.customer_list.innerHTML = '';
            var customers = this.pos.get('customer_list') || [];
            customers.forEach(function (customer) {
                var customer_item = document.createElement('div');
                customer_item.classList.add('customer-item');
                customer_item.textContent = customer.name;
                customer_item.addEventListener('click', function () {
                    self.set_customer(customer.id);
                });
                self.customer_list.appendChild(customer_item
