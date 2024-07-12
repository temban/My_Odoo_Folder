 var authorization = localStorage.getItem("authorization")
 console.log("my voyages")

 var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

 var voyages = [];
 var confirmation_code

           setTimeout(()=>{
    const phoneInputField = document.getElementById("phone");
const phoneInput = window.intlTelInput(phoneInputField, {
      initialCountry: "fr",
      utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
},5000)

 function upload(event){
     let fileinput = document.getElementById('file-input').files[0];
     let formData = new FormData();
     formData.append('image_1920_doc', fileinput);
     let config = {
       method: 'post',
       maxBodyLength: Infinity,
       url: 'image_1920/update',
       headers: {
    //'Cookie': 'frontend_lang=en_US; session_id=9302b29ad28f9e41ef9d83aa872ddbb1a4db990f',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    },
       data : formData
     };
     axios.request(config)
     .then((response) => {
       console.log(JSON.stringify(response.data));
       window.location.href = "/profile";
       window.location.href = "/profile";
     })
     .catch((error) => {
       console.log(error);
     });
    }

   //USER INFO
   axios
   .get("/api/res_partner/")
   .then((response) => {
   console.log("user Info")
     var userId = response.data.partner.id
         console.log(response.data.partner);
      localStorage.setItem("user_id",userId);
      localStorage.setItem("currentPartner_ids",userId);
      if(response.data){

  axios.get('/api/v1/read/res.partner?ids=' + userId.toString() , {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       }).then(response => {

  console.log("my Specific partner")
  console.log(response.data)
  console.log("partner_attachment_ids --> " + response.data[0].partner_attachment_ids)
  response.data[0].partner_attachment_ids.length >= 1 ? localStorage.setItem("partner_attachment_ids", response.data[0].partner_attachment_ids) : localStorage.setItem("partner_attachment_ids", 0)



//document.getElementById("username").value = response.data[0].name;
  response.data.map((travel)=>localStorage.setItem("myTravels",travel.travelbooking_ids) )
  response.data.map((travel)=>localStorage.setItem("myShipping",travel.shipping_ids) )
  response.data.map((travel)=>localStorage.setItem("average_rating",travel.average_rating) )

  response.data.map((image)=>{
      var profile_pic = document.getElementById("profile_pic")

    if(image.image_1920 === false){

    profile_pic.innerHTML= `<div class="avatar-edit">
            <input id="file-input" type="file" style="display: none;" onchange="upload(event)"/>
            <label for="file-input"></label>
        </div>
        <div class="avatar-preview">
          <img src="/hubkilo_website/static/src/img/avatar-profile.png" class="rounded-circle img-fluid" id="output"  style="border-radius: 160px;image-resolution: 3000000dpi;background-color: #fff; background-position: center;background-size: cover;background-repeat: no-repeat;max-width: 100%;max-height: 100%;height: 210px;width: 210px;"/>
        </div>`
    }else{

    profile_pic.innerHTML=`<div class="avatar-edit">
            <input id="file-input" type="file" style="display: none;" onchange="upload(event)"/>
            <label for="file-input"></label>
        </div>
        <div class="avatar-preview">
          <img src="/web/image/res.partner/${userId}/image_1920" class="rounded-circle img-fluid" id="output"  style="border-radius: 160px;image-resolution: 3000000dpi;background-color: #fff; background-position: center;background-size: cover;background-repeat: no-repeat;max-width: 100%;max-height: 100%;height: 210px;width: 210px;"/>
        </div>`
    }
  })




            })
          .catch(function(error) {
              console.log(error);
          })

      }else{
      console.log("Was not successful")
      }

   })
   .catch(function (error) {
     console.log(error);
   });



 //VERIFY CONFORMITY START
 function verifyConformity(){
   var partner_attachment_ids = (localStorage.getItem("partner_attachment_ids"))
      let config = {
 method: 'get',
 maxBodyLength: Infinity,
 url: `/api/v1/read/ir.attachment?ids=[${partner_attachment_ids}]&fields=%5B%22conformity%22%2C%22name%22%2C%22date_start%22%2C%22date_end%22%2C%22duration%22%2C%22duration_rest%22%2C%22validity%22%2C%22conformity%22%2C%22attach_custom_type%22%5D&with_context=%7B%7D`,
 headers: {
   'Authorization': authorization,
 }
};

axios.request(config)
.then((response) => {
console.log("my attachments")
 console.log(response.data)
var badge = document.getElementById("badge"), conformity = false
response.data.map((partner_attachment_verification)=>{
if (localStorage.getItem("partner_attachment_ids") === 0){
badge.innerHTML=`<img style="width:30px;height:30px" src="/hubkilo_website/static/src/img/warning-comic-sign.png" alt="check verify" data-bs-toggle="tooltip" data-bs-placement="top" title="unverified"/>`

} else if (partner_attachment_verification.conformity === true){
 conformity = true
setTimeout(()=>{
 var add_attachment_button = document.getElementById("add_attachment_button")
 add_attachment_button.style.display = "none"
},2000)
}
})

if (conformity === false ){
 badge.innerHTML=`<img style="width:30px;height:30px" src="/hubkilo_website/static/src/img/warning-comic-sign.png" alt="check verify" data-bs-toggle="tooltip" data-bs-placement="top" title="unverified"/>`

 } else {
 badge.innerHTML=`<img style="width:30px;height:30px" src="/hubkilo_website/static/src/img/verified.png" alt="verified"/>`

 }

})
.catch((error) => {
 console.log(error);
});
 }
setInterval(verifyConformity,2000)

 //VERIFY CONFORMITY END



 //PARTIR A MODIFIER VOYAGES
 function updateVoyage(id,type){
 localStorage.setItem("updateType",type)
 window.location.href = "/modifier/" + id.toString()
 }

 //PARTIR A MODIFIER BOKING
 function updateShipping(id){
 window.location.href = "modifier_ma_reservation/" + id.toString()
 }
 //PARTIR A MODIFIER BOKING
 function ProceedPayment(id){

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/m1st_hk_roadshipping.shipping/set_to_paid/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));

if(response.data){
//GO TO INVOICE
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/m1st_hk_roadshipping.shipping?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  response.data.map((invoice)=>{
  window.location.href=`/my/invoices/${invoice.move_id[0]}`
  })
})
.catch((error) => {
  console.log(error);
});
}




})
.catch((error) => {
  console.log(error);
});

 }



 //Transférer LA RESERVATION ROAD
    function Transferer(id,type,travelbooking_id){
    localStorage.setItem("shippingId",id)
    localStorage.setItem("shippingtype",type)

        axios.get('/api/v1/search_read/m1st_hk_roadshipping.travelbooking', {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       }).then(response => {
       console.log("search......")
               const search_info = document.getElementById('search_row');
  search_info.innerHTML = response.data.map((item)=>{
 var my_user_id = localStorage.getItem("user_id")

     var display = item.booking_type === "road" ? "none" : "flex"
     var displayAir = item.booking_type === "air" ? "none" : "flex"
     var displayExpedition = item.partner_id[0] === Number(my_user_id) || travelbooking_id === item.id ? "none" : "flex"
     var background = travelbooking_id === item.id ? "solid 3px #217aff" : ""
     var hideButtonTrans = travelbooking_id === item.id ? "none" : "inline"

 if(item.state==="negotiating"){
  return `<div class="col-12 col-md-6 col-lg-4 mt-3" >
                             <div class="my_card" style="border:${background}">
                                 <div class="card_country">
                                     <h3 data-bs-toggle="popover" data-bs-trigger="focus" title="${item.departure_city_id[1]}" style='font-size:24px'>${item.departure_city_id[1]}</h3>
                                        <div style="display:flex;margin-left:5px;margin-right:5px;justify-content: center;margin-bottom:10px">
                                            <i class='fas fa-caret-square-right' style='font-size:24px;color:#21ff37'></i>
                                            <i class='fas fa-caret-square-right' style='font-size:24px;color:#21ff37'></i>
                                        </div>
                                        <h3 data-bs-toggle="popover" data-bs-trigger="focus" title="${item.arrival_city_id[1]}"  style='font-size:24px'>${item.arrival_city_id[1]}</h3>
                                 </div>
                                 <div class="price" style="display:${display}">
                                     <p style="font-size: 24px;" class="card-title">Pour: </p>
                                     <p class="card-title" style='font-size:24px;color:#ff2176'>${item.price_per_kilo}$</p>
                                 </div>
                                 <div class="type">
                                     <span id="status"  style='font-size:20px;font-weight: 500;display:${display}'><i class="fa fa-plane" style="font-size:48px;color:#217aff"></i></span>
                                     <span id="status"  style='font-size:20px;font-weight: 500;display:${displayAir}'><i class="fa fa-car" style="font-size:48px;color:#217aff"></i></span>
                                 </div>
                                 <div class="type">
                                 <span  style='font-size:20px'>${item.departure_date}</span>
                                 </div>
                                 <div class="card_country1">
                                        <button onclick="completeTransfer(${item.id},'${item.booking_type}')" style="display:${displayExpedition}" class="btn btn-primary">Transfer</button>
                                 </div>
                             </div>

                            </div>`
 }else{
 return ``
 }

    } ).join("")
            })
          .catch(function(error) {
              console.log(error);
          })




   }

 //Transférer LA RESERVATION ROAD
    function Transferer1(bookingId,departure_town,arrival_town,travel_type,TravelIdOfCurrentBooking){
        console.log("......road booking id", bookingId);
        console.log(travel_type);
        const search_url = '/road/search/travel';
       const jsonData = JSON.stringify({
       "jsonrpc": "2.0",
       "method": "call",
       "params": {
       "travel_type": travel_type ,
        "departure_town": departure_town ,
        "arrival_town": arrival_town,
       }
       });
       axios.post(search_url, jsonData, {
         headers: {
           'Content-Type': 'application/json',
         }
       })
       .then(response => {
           if(Boolean(response.data.result.response)){

 //         var all_results= document.getElementById('all_results');
 //         all_results.style.display = "none";
          const search_info = document.getElementById('search_row1');
          search_info.innerHTML = response.data.result.response.map((item) => {
          console.log("..............." + TravelIdOfCurrentBooking)
          //Color of current travel of booking
          const backgroundColor = TravelIdOfCurrentBooking === item.id ? '#8eb2e8' : 'transparent';

          return ` <div class="col-12 col-md-6 col-lg-4 mt-3" >
                             <div class="my_card" style="background-color: ${backgroundColor};">
                                 <div class="card_country">
                                     <h3  style='font-size:24px'>${item.departure_town}</h3>
                                        <div>
                                            <i class='fas fa-caret-square-right' style='font-size:24px;color:#21ff37'></i>
                                            <i class='fas fa-caret-square-right' style='font-size:24px;color:#21ff37'></i>
                                        </div>
                                        <h3  style='font-size:28px'>${item.arrival_town}</h3>
                                 </div>

                                 <div class="type">
                                     <span  style='font-size:17px;font-weight: 500;'>${item.travel_type}</span>
                                 </div>
                                 <div class="card_country1">
                                     <span  style='font-size:17px'>${item.departure_date}</span>
                                        <Button onclick="completeTransfer1(${item.id},${bookingId})" class="btn btn-primary" >Transférer</button>
                                 </div>
                             </div>

                            </div>`}).join("")

         console.log(response.data.result.response);
         console.log('search continue')
           }else{
           const search_info = document.getElementById('search_row');
           search_info.innerHTML = `<h1 style="text-align:center">No Result!!</h1>`

           }
       })
       .catch(error => {
         console.log(error);
       })

   }


 //complete air
   function completeTransfer(currentTravelId){
 console.log(currentTravelId)
 var shippingId = localStorage.getItem("shippingId")
 var raw = JSON.stringify({
   "travelbooking_id": Number(currentTravelId)
           });

 let config = {
   method: 'put',
   maxBodyLength: Infinity,
   url:`/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${shippingId}`,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
   window.location.href=""
 })
 .catch((error) => {
   console.log(error);
 });


   }

 //complete road
   function completeTransfer1(currentTravelId,currentBookingId){
     console.log("road")
   console.log(currentTravelId)

   console.log("bookingid road.....",currentBookingId)
   var result = confirm("Êtes-vous sûr de vouloir transférer?");
   if (result) {
         // User clicked "OK"
         console.log("User confirmed. Performing the action...");
         // Perform the desired action here
         let data = JSON.stringify({
   "jsonrpc": "2.0",
   "params": {
     "new_travel_id": Number(currentTravelId)
   }
 });

 let config = {
   method: 'put',
   maxBodyLength: Infinity,
   url: '/road/current/user/transfer/booking/' + currentBookingId.toString(),
   headers: {
     'Content-Type': 'application/json',
   },
   data : data
 };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
   console.log("Transfer done");
   alert("Transférer avec succès")
   window.location.href = "/profile";
 })
 .catch((error) => {
   console.log(error);
 });
       } else {
         // User clicked "Cancel"
         console.log("User cancelled. Action aborted.");
         // Perform alternative action or do nothing
       }

   }

   // Generate QR code
   function qrCode(code){
    console.log(code)
    var code_id = document.getElementById("code_id")
    code_id.innerHTML = code
    var qrCodeDiv = document.getElementById('qrcode');
    qrCodeDiv.innerHTML = " "
     var qrCode = new QRCode(qrCodeDiv, {
       text: code, // Specify the content for the QR code
       width: 200, // Set the width and height of the QR code
       height: 200
     });
 }
 function qrCode1(code){
    console.log(code)
    var code_id = document.getElementById("code_id")
    code_id.innerHTML = code
    confirmation_code = code
 }
 function myQrCode(code){
    console.log(code)
    var code_id = document.getElementById("code_id")
    confirmation_code = code
 }


 function qrCode2(code){
    console.log(code)
    var code_id = document.getElementById("code_id2")
    code_id.innerHTML = code
      var qrCodeDiv = document.getElementById('qrcode2');
    qrCodeDiv.innerHTML = " "
     var qrCode = new QRCode(qrCodeDiv, {
       text: code, // Specify the content for the QR code
       width: 200, // Set the width and height of the QR code
       height: 200
     });

 }
 function qrCode3(code){
    console.log(code)
    var code_id = document.getElementById("code_id3")
    code_id.innerHTML = code

 }

 function storeBookingInfos(id){
 console.log("STORE BOOKING INFOS TRAVEL PARTNER_ID -> " + id)
 let config = {
   method: 'get',
   maxBodyLength: Infinity,
   url: '/api/v1/read/m1st_hk_roadshipping.shipping?ids=' + id ,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
  console.log("STORE BOOKING INFOS SHIPPING")
     console.log( " booking_id " + response.data[0].id)
     console.log(" sender_id " + response.data[0].partner_id[0])
     localStorage.setItem("shipping_id",response.data[0].id)
     localStorage.setItem("shipping_sender_id",response.data[0].partner_id[0])

     let travel_booking_id = response.data[0].travelbooking_id[0]

             let config = {
                   method: 'get',
                   maxBodyLength: Infinity,
                   url: '/api/v1/read/m1st_hk_roadshipping.travelbooking?ids=' + travel_booking_id ,
                   headers: {
                     'Accept': 'application/json',
                     'Authorization': authorization,
                   }
                 };

                 axios.request(config)
                 .then((response) => {

                   console.log("STORE BOOKING INFOS TRAVEL PARTNER_ID")
             console.log( " shipping_traveller_id " + response.data[0].partner_id[0])

             localStorage.setItem("shipping_traveler_id",response.data[0].partner_id[0])

                 })
                 .catch((error) => {
                   console.log(error);
                 });


   })
   .catch(function (error) {
     console.log(error);
   });
   setTimeout(()=>{
   window.location.href = "/my_negotiation"
   },1000)
 }

  function setNegotiation(id){
 var partner_attachment_ids = localStorage.getItem("partner_attachment_ids")
 if(Number(partner_attachment_ids) === 0 ){
 console.log("partner attachment id = 0")
// alert("please access to identification menu and upload your identity card")
//   var result = confirm("Please access to identification menu and upload your identity card");
    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Please access to identification menu and upload your identity card <a href="/profile" style="font-weight:700;font-size:14px">HERE</a></p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

//if (result) {
//      window.location.href = "/profile"
//} else {
//    console.log("")
//}

 } else {
    let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/ir.attachment?ids=[${partner_attachment_ids}]&fields=%5B%22conformity%22%2C%22name%22%2C%22date_start%22%2C%22date_end%22%2C%22duration%22%2C%22duration_rest%22%2C%22validity%22%2C%22conformity%22%2C%22attach_custom_type%22%5D&with_context=%7B%7D`,
  headers: {
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log("confirmity is --> " + response.data);
  var conformity = false
        response.data.map((partner_attachment_verification)=>{
        if (partner_attachment_verification.conformity === true){
        conformity = true
        }
        })
  if (conformity === false){
//  alert ("your identity has not been confirmed")
     var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">your identity has not been confirmed</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

  } else {
   var raw = JSON.stringify({
    "state": "negotiating"
           });
    let config = {
   method: 'put',
   maxBodyLength: Infinity,
   url: `/api/v1/write/m1st_hk_roadshipping.travelbooking?values=${raw}&ids=${id}`,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
     window.location.href = "";
     window.location.href = "";
 })
 .catch((error) => {
// alert(error.response.data.message)
   console.log(error.response.data.message);
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

 });

  }



})
.catch((error) => {
  console.log(error);
});

 }


 }

  function markShippingReceived(id){
   var transaction_code =document.getElementById('transaction_code').value;
    console.log("code1= " + transaction_code)
    console.log("code2= " + confirmation_code)
    console.log("shipping_id= " + id)
    if (transaction_code === confirmation_code){
    var raw = JSON.stringify({
    "state": "received"
           });
    let config = {
   method: 'put',
   maxBodyLength: Infinity,
   url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${id}`,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
//   alert("received !!")
       var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Received successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

   window.location.href="/profile"
 })
 .catch((error) => {
 alert(error.response.data.message)
   console.log(error.response.data.message);
 });

 } else {
 alert("wrong transaction code, please try again")
 }
 }


function cancelTravel(id){
    console.log("travel_id= " + id)
    var raw = JSON.stringify({
    "state": "rejected"
           });
    let config = {
   method: 'put',
   maxBodyLength: Infinity,
   url: `/api/v1/write/m1st_hk_roadshipping.travelbooking?values=${raw}&ids=${id}`,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
//   alert("canceled !!")
       var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Canceled successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

   window.location.href="/profile"
 })
 .catch((error) => {
// alert(error.response.data.message)
   console.log(error.response.data.message);
       var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

 });



 }


function newAttachment(){
var attachment1 = document.getElementById("attachment1")
var attachment2 = document.getElementById("attachment2")
attachment1.style.display = "none"
attachment2.style.display = "block"
}
function seeAttachment(){
var attachment1 = document.getElementById("attachment1")
var attachment2 = document.getElementById("attachment2")
attachment2.style.display = "none"
attachment1.style.display = "block"
}

function editProfile(){

var updateButton = document.getElementById("updateButton")
var editProfile = document.getElementById("editProfile")
var phone2 = document.getElementById("phone22")
var phone = document.getElementById("phone11")

document.getElementById("gender").disabled = false
document.getElementById("email").disabled = false
document.getElementById("birth_city").disabled = false
document.getElementById("birthdate").disabled = false
document.getElementById("residence_city").disabled = false
document.getElementById("username_edit").disabled = false

updateButton.style.display ="block"
editProfile.style.display ="none"
phone2.style.display ="none"
phone.style.display ="block"
}
