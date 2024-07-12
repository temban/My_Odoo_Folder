odoo.define('rpn_website.member_portal', function (require) {
  "use strict";

  var core = require('web.core');


  // Function to execute on page load
  function onPageLoad() {
//    localStorage.setItem("authorization",'eGF2aWVybGFtYXIxN0BnbWFpbC5jb206MTIzNA==\'')
      console.log("Page has loaded");
      // Additional actions on page load
  }

  function getCurrentUser(){
var requestOptions = {
method: 'GET',
};

fetch("/api/current/user", requestOptions)
.then(response => response.text())
.then(result => {
var partnerInfo = JSON.parse(result)
//    console.log('partnerInfo', partnerInfo.partner)
     localStorage.setItem("userId",partnerInfo.partner.id)

     //   CURRENT SPECIFIC
var authorization = localStorage.getItem("authorization")

     var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", authorization);

var requestOptions = {
method: 'GET',
headers: myHeaders,
};

var myUrl = `/api/v1/read/res.partner?ids=${partnerInfo.partner.id}`

fetch(myUrl, requestOptions)
.then(response => response.text())
.then(result =>{
  var partnerCurrentInfo = JSON.parse(result)
//  console.log(partnerCurrentInfo)
localStorage.setItem("isMember",partnerCurrentInfo[0].is_member)
localStorage.setItem("memberActive",partnerCurrentInfo[0].member_active)

})
.catch(error => console.log('error', error));

})
.catch(error => console.log('error', error));

  }

  function getAuthorizationKey(){

var requestOptions = {
method: 'GET',
};

fetch("/rpn/last/get_authorization_key", requestOptions)
.then(response => response.text())
.then(result => {

var authorizationKey = "Basic"+" "+JSON.parse(result).authorization_key

//console.log("resulting", authorizationKey)

localStorage.setItem("authorization",authorizationKey)
getCurrency()
})}


  function getCurrency(){

var authorization = localStorage.getItem("authorization")

var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", authorization);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
};

fetch("/api/v1/search_read?model=res.currency", requestOptions)
  .then(response => response.text())
  .then(result => {
//  console.log("Currency", JSON.parse(result)[JSON.parse(result).length - 1].symbol)
  localStorage.setItem("currency",JSON.parse(result)[JSON.parse(result).length - 1].symbol)
  })
  .catch(error => console.log('error', error));
}



  $(document).ready(function () {
     var currentPath = window.location.pathname;

      // Check if the current URL path is /my/home or /my
      if (currentPath === '/my/home' || currentPath === '/my') {
          onPageLoad(); // Execute the function on matching URL paths
      }
      //My functions
      getCurrentUser()
      getCurrency()
      getAuthorizationKey()
//      setInterval(getAuthorizationKey,2000)
//      setInterval(getCurrentUser,1000)


      $('.member-portal-link').on('click', function(e) {
          e.preventDefault();
          console.log("Clicked on Member Portal");
          console.log(localStorage.getItem("isMember"))
          if(localStorage.getItem("memberActive") === "false"){
          window.location.href = '/member/add/new'
          }else{
          window.location.href = '/rpn/portal/profile'
          }
          // Other actions or logging here
      });
  });
});
