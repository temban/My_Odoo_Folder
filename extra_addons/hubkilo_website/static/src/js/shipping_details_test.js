/** @odoo-module **/

import { _lt } from "@web/core/l10n/translation";

const {Component, Store, mount, QWeb} = owl;
//console.log("Nothing",owl)

 export class Show extends Component{
 setup(){
console.log(_lt("Nothing 28"))
    }

 fuck(){
console.log("Hello 28");
 }

 }

Show.template = "hubkilo_website.shipping_details_test"
const show = new Show()

function fuck() {
console.log("Hello Xavier");

}
//show.fuck()
//import { _lt } from "@web/core/l10n/translation";
//
//console.log(owl)
//
//const {Component,mount,xml,useState} = owl
//
//class Test extends Component{
//static template = xml
//
//}
//
//mount(Test,document.getElementById("beans"))
//
//function logHello() {
//    console.log(_lt);
//}
//    document.getElementById("beans").innerHTML = `<div class="btn btn-primary" onclick="logHello()">Click me</div>`

//odoo.define('hunkilo_website.shipping_details_test', function (require) {
//    "use strict";
//const {Component, Store, mount, QWeb} = owl;
//
// var publicWidget = require('web.public.widget');
//
// class Show extends Component{
// setup(){
//console.log("Nothing")
//    }
//
// fuck(){
//console.log("Hello Fuck");
// }
//
// }
//
//Show.template = "hubkilo_website.shipping_details_test"
//
////const show = new Show()
////    document.getElementById("beans").innerHTML = `<div class="btn btn-primary custom-hello-button" onclick="show.fuck()">Click me</div>`
//});
//
