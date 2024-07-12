odoo.define('website_axis_helpdesk_advance.HelpdeskAction',  function (require) {
"use strict";
var AbstractAction = require('web.AbstractAction');
var core = require('web.core');
var rpc = require('web.rpc');
var view_registry = require('web.view_registry');
var Widget = require('web.Widget');
var ajax = require('web.ajax');
var session = require('web.session');
var web_client = require('web.web_client');
var _t = core._t;
var QWeb = core.qweb;

var HelpdeskAction = AbstractAction.extend({
    template: 'HelpdeskDashboardView',
    jsLibs: [
        '/website_axis_helpdesk_advance/static/src/js/Chart.js',
    ],
     events: {
        'click .urgent-tickets': 'action_urgent_tickets',
        'click .high-priority-tickets': 'action_high_priority_tickets',
        'click .medium-tickets': 'action_medium_tickets',
        'click .law-tickets': 'action_law_tickets',

        'click .open-tickets': 'action_open_tickets',
        'click .pending-tickets': 'action_pending_tickets',
        'click .close-tickets': 'action_close_tickets',
        'click .success-tickets': 'action_success_tickets',

        'click .more-today-tickets': 'action_today_tickets',
        'click .last-week-tickets': 'action_last_week_tickets',
        'click .last-month-booking': 'action_last_month_tickets',
        'click .more-total-tickets': 'action_total_tickets',

        'click .sla-complete': 'action_sla_complete_tickets',
        'click .sla-pending': 'action_sla_pending_tickets',
        'click .sla-missed': 'action_sla_missed_tickets',
    },

    init: function(parent, context) {
        this._super(parent, context);
        var self = this;
    },

    start: function() {
        var self = this;
        self.render_dashboards();
        self.render_graphs();
        return this._super();
    },

     reload: function () {
            window.location.href = this.href;
    },
     render_dashboards: function(value) {
        var self = this;
        var helpdesk_ticket_dashboard = QWeb.render('HelpdeskDashboardView', {
            widget: self,
        });

        rpc.query({
                model: 'axis.helpdesk.ticket',
                method: 'get_helpdesk_ticket_all',
                args: []
            })
            .then(function (result){
                    self.$el.find('.total-ticket').text(result['total_ticket'])
                    self.$el.find('.last-week-ticket').text(result['last_week_ticket'])
                    self.$el.find('.last-month-ticket').text(result['last_month_ticket'])
                    self.$el.find('.today-ticket').text(result['today_ticket'])
            });

         rpc.query({
                model: 'axis.helpdesk.ticket.team',
                method: 'filter_stage_data_dashboard',
                args: []
            })
            .then(function (result){
                    self.$el.find('.my_all_tickets').text(result['my_all_tickets']['count'])
                    self.$el.find('.my_all').text(result['my_all']['count'])
                    self.$el.find('.my_closed_tickets').text(result['my_closed_tickets']['count'])
                    self.$el.find('.today').text(result['today']['success'])


                    self.$el.find('.year').text(result['year']['count'])
                    self.$el.find('.month').text(result['month']['count'])
                    self.$el.find('.7days').text(result['7days']['count'])
                    self.$el.find('.yesterday').text(result['yesterday']['count'])
                    self.$el.find('.today_due').text(result['today']['count'])

                    self.$el.find('.my_urgent').text(result['my_urgent']['count'])
                    self.$el.find('.my_high').text(result['my_high']['count'])
                    self.$el.find('.my_medium').text(result['my_medium']['count'])
                    self.$el.find('.my_low').text(result['my_low']['count'])

                    self.$el.find('.len_sla_complete').text(result['len_sla_complete'])
                    self.$el.find('.len_sla_pending').text(result['len_sla_pending'])
                    self.$el.find('.len_sla_missed').text(result['len_sla_missed'])
            });

        return helpdesk_ticket_dashboard
    },

     action_urgent_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'kanban,tree,form',
            view_type: 'kanban',
            views: [[false, 'kanban'],[false, 'list'],[false, 'form']],
            views: [[false, 'kanban'],[false, 'list'],[false, 'form']],
            context: {
                        'default_priority': '3',
                        'search_default_is_open': true,
                        'search_default_my_ticket': true
                    },
            domain: [['priority', '=', '3']],
            target: 'current'
        },)
    },
     action_high_priority_tickets:function(event){
      var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
           view_mode: 'kanban,tree,form',
            view_type: 'kanban',
            views: [[false, 'kanban'],[false, 'list'],[false, 'form']],
            views: [[false, 'kanban'],[false, 'list'],[false, 'form']],
            context: {
                        'default_priority': '2',
                        'search_default_is_open': true,
                        'search_default_my_ticket': true
                    },
            domain: [['priority', '=', '2']],
            target: 'current'
        },)
     },
     action_medium_tickets:function(event){
      var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'kanban,tree',
            view_type: 'kanban',
            views: [[false, 'kanban'],[false, 'list'],],
            views: [[false, 'kanban'],[false, 'list'],],
            context: {
                        'default_priority': '1',
                        'search_default_is_open': true,
                        'search_default_my_ticket': true
                    },
            domain: [['priority', '=', '1']],
            target: 'current'
        },)
     },
     action_law_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'kanban,tree,form',
            view_type: 'kanban',
            views: [[false, 'kanban'],[false, 'list'],[false, 'form']],
            views: [[false, 'kanban'],[false, 'list'],[false, 'form']],
            context: {
                        'default_priority': '0',
                        'search_default_is_open': true,
                        'search_default_my_ticket': true
                    },
            domain: [['priority', '=', '0']],
            target: 'current'
        },)
    },


     action_open_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_my_ticket':true,
                        'search_default_is_open': false,
                    },
//            domain: [['attendee_ids.state','in',['declined']]],
            target: 'current'
        },)


    },

     action_pending_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_my_ticket':true,
                        'search_default_is_open': true,
                    },
//            domain: [['attendee_ids.state','in',['declined']]],
            target: 'current'
        },)


    },
     action_sla_complete_tickets:function(event){
        var date = new Date();
	    var date_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate() +" "+ date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_my_ticket':true,
                    },
            domain: [['helpdesk_stage_id.name','in',['Done'],['helpdesk__sla_deadline','<=',date_time]]],
            target: 'current'
        },)


    },
     action_sla_pending_tickets:function(event){
        var date = new Date();
	    var date_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate() +" "+ date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_my_ticket':true,
                    },
            domain: [['helpdesk_stage_id.name','not in',['Done'],['helpdesk__sla_deadline','>=',date_time]]],
            target: 'current'
        },)


    },
     action_sla_missed_tickets:function(event){
        var date = new Date();
	    var date_time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate() +" "+ date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_my_ticket':true,
                    },
            domain: [['helpdesk_stage_id.name','not in',['Done'],['helpdesk__sla_deadline','<=',date_time]]],
            target: 'current'
        },)


    },

     action_close_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_my_ticket':true,
                        'search_default_is_close': true,
                    },
//            domain: [['attendee_ids.state','in',['declined']]],
            target: 'current'
        },)


    },

     action_success_tickets:function(event){
        var self = this;
        var timeElapsed = Date.now();
        var today = new Date(timeElapsed)
        console.log('today:', today)
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_is_close': true,
                        'search_default_my_ticket': true,
                        'search_default_not_sla_failed': true,
                    },
            domain: [['closed_date', '>=', today]],
            target: 'current'
        },)


    },



     action_today_tickets:function(event){
        var self = this;

         var timeElapsed = Date.now();
        var today = new Date(timeElapsed)
        // today =today.toLocaleDateString();

        var domain =  [['date', 'in', [today]]]

        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_total':true,
                    },
//            domain: [['attendee_ids.state','in',['declined']]],
            domain: domain,
            target: 'current'
        },)


    },
     action_last_week_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();

          rpc.query({
                model: 'axis.helpdesk.ticket',
                method: 'get_helpdesk_ticket_all',
            })
            .then(function (result) {
                var domain = [['date', 'in', result.last_week_ticket]]
                    self.do_action({
                    name: _t("Helpdesk Ticket"),
                    type: 'ir.actions.act_window',
                    res_model: 'axis.helpdesk.ticket',
                    view_mode: 'tree,form',
                    view_type: 'list',
                    views: [[false, 'list'],[false, 'form']],
                    views: [[false, 'list'],[false, 'form']],
                    context: {
                                'search_default_total':true,
                            },
                    domain: domain,
                    target: 'current'
                },)


            });
    },
     action_last_month_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();

        rpc.query({
                model: 'axis.helpdesk.ticket',
                method: 'get_helpdesk_ticket_all',
                })
                .then(function (result) {
                    var domain = [['date', 'in', result.last_month_ticket]]
                        self.do_action({
                            name: _t("Helpdesk Ticket"),
                            type: 'ir.actions.act_window',
                            res_model: 'axis.helpdesk.ticket',
                            view_mode: 'tree,form',
                            view_type: 'list',
                            views: [[false, 'list'],[false, 'form']],
                            views: [[false, 'list'],[false, 'form']],
                            context: {
                                        'search_default_total':true,
                                    },
                            domain: domain,
                            target: 'current'
                        },)
                 });



    },
     action_total_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_total':true,
                    },
//            domain: [['attendee_ids.state','in',['declined']]],
            target: 'current'
        },)


    },


    getRandomColor: function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    render_graphs: function(){
        var self = this;
        self.weeklytickets();
        self.monthlytickets();
    },

    // Here we are plotting bar,pie chart

    weeklytickets: function() {
        var self = this;
        var ctx = this.$el.find('#WeeklyTickets')
        Chart.plugins.register({
          beforeDraw: function(chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
          }
        });
        var bg_color_list = []
        for (var i=0;i<=12;i++){
            bg_color_list.push(self.getRandomColor())
        }
        rpc.query({
                model: 'axis.helpdesk.ticket',
                method: 'get_helpdesk_ticket_week_wise',
                
            })
            .then(function (result) {
                var data = result.data;
                var day = ["Monday", "Tuesday", "Wednesday", "Thursday", 
                         "Friday", "Saturday", "Sunday"]
                var week_data = [];
                if (data){
                    for(var i = 0; i < day.length; i++){
                        day[i] == data[day[i]]
                        var day_data = day[i];
                        var day_count = data[day[i]];
                        if(!day_count){
                                day_count = 0;
                        }
                        week_data[i] = day_count

                    }
                }

                var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: day ,
                    datasets: [{
                        label: ' Tickets',
                        data: week_data,
                        backgroundColor: bg_color_list,
                        borderColor: bg_color_list,
                        borderWidth: 1,
                        pointBorderColor: 'white',
                        pointBackgroundColor: 'red',
                        pointRadius: 5,
                        pointHoverRadius: 10,
                        pointHitRadius: 30,
                        pointBorderWidth: 2,
                        pointStyle: 'rectRounded'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,
                                max: Math.max.apply(null,week_data),
                              }
                        }]
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                    leged: {
                        display: true,
                        labels: {
                            fontColor: 'black'
                        }
                    },
                },
            });
        });
    },

    monthlytickets: function() {
        var self = this;
        var ctx = this.$el.find('#MonthlyTickets')
        Chart.plugins.register({
          beforeDraw: function(chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
          }
        });
        var bg_color_list = []
        for (var i=0;i<=12;i++){
            bg_color_list.push(self.getRandomColor())
        }
        rpc.query({
                model: 'axis.helpdesk.ticket',
                method: 'get_helpdesk_ticket_month_wise',
            })
            .then(function (result) {
                var data = result.data
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                                'August', 'September', 'October', 'November', 'December']

                var month_data = [];
                if (data){
                    for(var i = 0; i < months.length; i++){
                        months[i] == data[months[i]]
                        var day_data = months[i];
                        var month_count = data[months[i]];
                        if(!month_count){
                                month_count = 0;
                        }
                        month_data[i] = month_count
                    }
                }
                var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: ' Tickets',
                        data: month_data,
                        backgroundColor: bg_color_list,
                        borderColor: bg_color_list,
                        borderWidth: 1,
                        pointBorderColor: 'white',
                        pointBackgroundColor: 'red',
                        pointRadius: 1,
                        pointHoverRadius: 10,
                        pointHitRadius: 30,
                        pointBorderWidth: 1,
                        pointStyle: 'rectRounded'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                min: 0,
                                max: Math.max.apply(null,month_data),
                              }
                        }]
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                    leged: {
                        display: true,
                        labels: {
                            fontColor: 'black'
                        }
                    },
                },
            });
        });
    },

    action_sla_start_tickets:function(event){
        var self = this;
        event.stopPropagation();
        event.preventDefault();
        this.do_action({
            name: _t("Helpdesk Ticket"),
            type: 'ir.actions.act_window',
            res_model: 'axis.helpdesk.ticket',
            view_mode: 'tree,form',
            view_type: 'list',
            views: [[false, 'list'],[false, 'form']],
            context: {
                        'search_default_my_ticket':true,
                        'search_default_is_open': false,
                    },
            target: 'current'
        },)


    },
});


core.action_registry.add("helpdesk_ticket_dashboard", HelpdeskAction);
return HelpdeskAction
});
