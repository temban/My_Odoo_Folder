var authorization = localStorage.getItem("authorization")


var travel_id_detail = localStorage.getItem("travel_id_detail")
var shipping_id_detail = localStorage.getItem("shipping_id_detail"), deliv_id



function TravelDetails(){
 axios.get(`/api/v1/read/m1st_hk_roadshipping.shipping?ids=${shipping_id_detail}`, {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       })
       .then(response => {
 console.log("my reservations............")
  console.log(response.data)

Loader()

     const all_results = document.getElementById('all_results')
     var luggage_ids =response.data.map((table)=>table.luggage_ids[0])

// Check if emptyArray is empty
if (response.data.length === 0) {

//all_results.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:48px;color:#79a1de">No Shipping</h1>`

}
 else {


     //SHOW SHIPPING
   response.data.map((table)=>{


let datetime = table.create_date;
let time = datetime.split(" ")[1];

     localStorage.setItem("qrcode",table.name)
     var displayNegociation = table.state === "negotiating" ? 'inline' :'none';
     var displayChatButton = table.state === "received" || table.msg_shipping_accepted === false ? 'none' :'inline';
     var displayCodeButton = table.state === "paid" ? 'inline' :'none';
     var displayPayButton = table.state === "accepted" ? 'inline' :'none';
     var msg_shipping_accepted = table.msg_shipping_accepted === false ? 'inline' :'none';
     var displayTrans = table.state === "rejected" || table.state === "pending"  ? 'inline' :'none'
     var others = table.state === "rejected" || table.state === "pending" ? 'inline' :'none'

     var color = table.state === "rejected" && 'RGB(255,0,0)' || table.state === "received" && '#4472C4' || table.state === "accepted" && 'RGB(255,192,0)' || table.state === "paid" && 'RGB(0,176,80)'|| table.state === "pending" && 'RGB(165,165,165)'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'RGB(112,48,160)'
     var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'Received'

     var border = table.state === "rejected" ? 'solid red 1px' :'solid blue 1px'

     localStorage.setItem("qrcode",table.name)
     var displayReject = table.state === "pending" ? 'inline' :'none';
      var displayChatButton2 = table.state === "pending" ? 'inline' :'none';
      var displayConfirmShippingButton = table.state === "confirm"  ? 'inline' :'none';
      var displayConfirmShippingButton2 = table.state === "accepted" ? 'none' :'inline';
      var hide_reject = table.state === "accepted" ? 'none' :'inline';
     var invoiceId = localStorage.getItem("invoiceId")

      var displayParcelButton = table.state === "paid" && invoiceId === "paid"  ? 'inline' :'none';
           setTimeout(()=>{
          if(table.disagree === true){
     document.getElementById("shipping_info_state").innerHTML = `<div class="badge1 state" style="display:flex;background: red;color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">Rejected</div>`
     }else{
     document.getElementById("shipping_info_state").innerHTML = `<div class="badge1 state py-2" style="background:${color};border:1px solid ${color};color:white;position: relative;display: flex;justify-content: center;top: 60px;right: -10px;font-size:20px;font-weight: 800;width:350px;transform: rotate(45deg);text-transform: uppercase;">${content}</div>`
     }
     },1000)


      //STATE

      //ACTION BUTTONS
      document.getElementById("shipping_action_button").innerHTML = `

                     <button href="#" class="btn" style="margin:0 10px ;text-transform: capitalize;display:${msg_shipping_accepted};border:solid 2px #4fbf65;color:white;background:#4fbf65" data-bs-toggle="modal" data-bs-target="#setchat">
                      Accept Negotiation
                     </button>
                      <button onclick="myQrCode('${table.travel_code}',${table.id})" href="#" class="btn" style="margin:0 10px ;text-transform: capitalize;display:${displayConfirmShippingButton};border:solid 2px #4fbf65;color:white;background:#4fbf65" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                      Mark as delivered
                     </button>
                     <button onclick="mark_traveler_disagree(${table.id})" href="#" class="btn btn-danger " style="margin:0 10px ;text-transform: capitalize;display:${displayReject};color:white">
                      Reject
                     </button>
                    <button id="parcel" type="button" class="btn btn-primary" onclick="set_to_confirm(${table.id})" style="margin:0 10px ;text-transform: capitalize;display:none;color:white">
                     Parcel Received
                     </button>
                     <button onclick="storeBookingInfos(${table.id})" class="btn py-2 px-4" style="margin:0 10px ;background: #217aff;color:white;border-radius:5px;font-size:12px;display:${displayChatButton}">Negotiate
                     <i class='fas fa-comment-alt' style='color:white'></i>
                     </button>
                                        <!-- MODAL RECEIVED START -->

    <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title" id="exampleModalLabel">PLEASE ENTER THE TRANSACTION CODE GIVEN BY THE RECEIVER</h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
       </div>
       <div class="">
         <h2 style="text-align:center">Transaction Code: <input class="" id="transaction_code" type="text" placeholder="type here" required="required" style="color:green;text-align:center"/> </h2>
       </div>
       <div class="modal-footer">
         <button class="btn btn-primary" type="button" onclick="set_to_received(deliv_id)">Confirm</button>
       </div>
     </div>
   </div>
 </div>
        <!-- MODAL RECEIVED END -->

                                                <!-- MODAL NEGOTIATION START -->

    <div class="modal fade" id="setchat" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title" id="exampleModalLabel" style="text-transform:capitalize">PLEASE ENTER A PRICE AND SEND TO THE SHIPPER</h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body">
       </div>
       <div class="" style="padding: 0px 20px">
       <form style="border:1px solid #e9e9e9" class="d-flex align-items-center justify-content-end" action="javascript:void(0);">
        <input class="input form-control form-control-solid" style="border:none" oninput="checkValue(this.value)" id="montant" type="number" placeholder="Enter a price..." required="required"/>

          </form>
       </div>
       <div class="modal-footer">
        <button type="submit" onclick="sentNegociation(${table.id},${table.partner_id[0]},'${table.partner_id[1]}')" style="display:flex;justify-content:center;align-items:center;border:none" class="btn d-flex align-items-center p-2 mx-2" >
         <i class="fa fa-paper-plane-o" style="color:#1b5fe8"></i><span class=" ml-1" style="color:#1b5fe8">Send</span></button>
       </div>
     </div>
   </div>
 </div>
        <!-- MODAL NEGOTIATION END -->`


      //GENERAL INFOS
      document.getElementById("shipping_info_name").innerHTML = `${table.name}`
      document.getElementById("shipping_title_name").innerHTML = `${table.name}`
      document.getElementById("shipping_info_date").innerHTML = `${table.shipping_date}`
      document.getElementById("shipping_info_sender").innerHTML = `${table.partner_id[1]}`
      document.getElementById("shipping_info_weight").innerHTML =`${table.total_weight}`
      document.getElementById("shipping_info_travel_code").innerHTML = `${table.travelbooking_id[1]}`
      document.getElementById("shipping_info_travel_type").innerHTML = `${table.booking_type}`
      document.getElementById("shipping_info_lat").innerHTML = `${table.travel_partner_latitude}`
      document.getElementById("shipping_info_long").innerHTML = `${table.travel_partner_longitude}`


      //RECEIVER INFO
      document.getElementById("shipping_info_receiver_name").innerHTML = `${table.receiver_partner_id[1]}`
      document.getElementById("shipping_info_receiver_email").innerHTML = `${table.receiver_email}`
      document.getElementById("shipping_info_receiver_phone").innerHTML = `${table.receiver_phone_set}`
      document.getElementById("shipping_info_receiver_address").innerHTML = `${table.receiver_street_set}`

      //COST INFO
      document.getElementById("shipping_info_shipping_price").innerHTML = `<p>${table.shipping_price} €</p>`
      document.getElementById("shipping_info_luggage_cost").innerHTML = `<p>${table.luggage_cost} €</p>`
      document.getElementById("shipping_info_fees_cost").innerHTML = `<p>${table.amount_deducted} €</p>`
      document.getElementById("shipping_info_transaction_cost").innerHTML = `<p>${table.total_cost} €</p>`


      //LUGGAGE IMAGES
      document.getElementById("shipping_info_luggage_image").innerHTML = ` <div onclick="seeImage(1)" class="col-4">
                        <img class="attachment-img1" style="width: 100px;height: 100px;border-radius: 50%;"
                           src="/web/image/m1st_hk_roadshipping.luggage/${table.luggage_ids[0]}/luggage_image1" />
                     </div>
                     <div onclick="seeImage(2)" class="col-4">
                        <img class="attachment-img2" style="width: 100px;height: 100px;border-radius: 50%;"
                           src="/web/image/m1st_hk_roadshipping.luggage/${table.luggage_ids[0]}/luggage_image2" />

                     </div>
                     <div onclick="seeImage(3)" class="col-4">
                        <img class="attachment-img3" style="width: 100px;height: 100px;border-radius: 50%;"
                           src="/web/image/m1st_hk_roadshipping.luggage/${table.luggage_ids[0]}/luggage_image3" />
                     </div>`


     }).join("")


   setTimeout(()=>{
        //GET INVOICE
   if(response.data[0].move_id !== false){

   var move = response.data[0].move_id[0]
   var moveState = response.data[0].state

   verifyInvoice(move,moveState)

   }

   },2000)
}







            })
          .catch(function(error) {
              console.log(error);
          })
}

setTimeout(()=>{
TravelDetails()
},2000)


var confirmation_code


function seeLuggage1(luggage_ids){
console.log(luggage_ids)
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/m1st_hk_roadshipping.luggage?ids=${luggage_ids}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((luggages) => {
console.log(luggages.data)

var luggage_info = document.getElementById("luggage_info");

luggage_info.innerHTML = luggages.data.map((luggage)=>{

return `<div class="row">
                        <div class="col-4 d-flex justify-content-center">
                            <img id="image-colis2" src="/web/image/m1st_hk_roadshipping.luggage/${luggage.id}/luggage_image1" class="no-icon"
                                style="width: 150px;height: 150px;background-size: cover;" />
                        </div>
                        <div class="col-4 d-flex justify-content-center">
                            <img id="image-colis2" src="/web/image/m1st_hk_roadshipping.luggage/${luggage.id}/luggage_image2" class="no-icon"
                                style="width: 150px;height: 150px;background-size: cover;" />
                        </div>
                        <div class="col-4 d-flex justify-content-center">
                            <img id="image-colis2" src="/web/image/m1st_hk_roadshipping.luggage/${luggage.id}/luggage_image3" class="no-icon"
                                style="width: 150px;height: 150px;background-size: cover;" />
                        </div>
                    </div>
                    <div>
                        <div
                            style="display:flex;justify-content:start;align-items: center;gap:5px ;margin-top: 30px;">
                            <p style="font-size:18px;font-weight: 700;">Name:
                            </p>
                            <p style="font-size:18px;color: #217aff;">${luggage.luggage_model_id[1]}</p>
                        </div>
                        <div
                            style="display:flex;justify-content:start;align-items: center;gap:5px;">
                            <p style="font-size:18px;font-weight: 700;">Dimensions:
                            </p>
                            <p style="font-size:18px;color: #217aff;">${luggage.average_width} X ${luggage.average_height}</p>
                        </div>
                        <div
                            style="display:flex;justify-content:start;align-items: center;gap:5px;">
                            <p style="font-size:18px;font-weight: 700;">Average
                                Weight:</p>
                            <p style="font-size:18px;color: #217aff;">${luggage.average_weight}</p>
                        </div>
                    </div>`

})
}).catch((error) => {
  console.log(error);
});

}

function set_to_received(id){
  console.log(confirmation_code)
  console.log(transaction_code)
   var transaction_code =document.getElementById('transaction_code').value;
   var markShippingId = localStorage.getItem("markShippingId ")

    if (transaction_code === confirmation_code){
//    var raw = JSON.stringify({
//    "state": "received"
//           });
    let config = {
   method: 'post',
   maxBodyLength: Infinity,
    url: `/api/v1/call/m1st_hk_roadshipping.shipping/set_to_received/?ids=${id}`,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
//   alert("deliv_id livre")
//   window.location.href=""
TravelDetails()
 })
 .catch((error) => {
 alert(error.response.data.message)
   console.log(error.response.data.message);
 });

 } else {
 alert("wrong transaction code, please try again")
 }
 }

//NEGOTIATION
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
     localStorage.setItem("travel_departure_city_name",response.data[0].travel_departure_city_name)
     localStorage.setItem("travel_arrival_city_name",response.data[0].travel_arrival_city_name)
     localStorage.setItem("shipping_sender_name",response.data[0].partner_id[1])
     localStorage.setItem("shipping_traveler_name",response.data[0].travel_partner_name)
     localStorage.setItem("shipping_average_rating",response.data[0].average_rating)
     localStorage.setItem("shipping_display_name",response.data[0].display_name)

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

function mark_traveler_disagree(id){

   let config = {
  method: 'post',
  maxBodyLength: Infinity,
   url: `/api/v1/call/m1st_hk_roadshipping.shipping/mark_traveler_disagree/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
//  alert("rejected")

//  window.location.href=`/my/travel/details/${travel_id_detail}`
TravelDetails()

})
.catch((error) => {
  console.log(error);
});

}

function unmark_traveler_disagree(id){

   let config = {
  method: 'post',
  maxBodyLength: Infinity,
   url: `/api/v1/call/m1st_hk_roadshipping.shipping/unmark_traveler_disagree/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
//  alert("rejected")

  TravelDetails()
})
.catch((error) => {
  console.log(error);
});

}

function  goToTravelDetails(){
var id = localStorage.getItem("travelbooking_id")

window.location.href = `/my/travel/details/${id}`
}

 function myQrCode(code,id){
//    console.log(code+"-"+id)
    var code_id = document.getElementById("code_id")
    confirmation_code = code+"-"+id
    console.log(confirmation_code)
    localStorage.setItem("markShippingId ",id)
    deliv_id =id
 }

function set_to_confirm(id){   let config = {
  method: 'post',
  maxBodyLength: Infinity,
//  url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${id}`,
  url: `/api/v1/call/m1st_hk_roadshipping.shipping/set_to_confirm/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  TravelDetails()
//  alert("parcel received")
})
.catch((error) => {
  console.log(error);
});




}


         function seeImage(id) {
            console.log("ok")
            const attachmentImg = document.querySelector(`.attachment-img${id}`);
            const modalElement = document.getElementById("image-modal");
            const modalContent = modalElement.querySelector(".modal1-content");
            // Check if the "selected" class is present
            const isSelected = modalElement.classList.contains("active");

            if (isSelected) {
               modalElement.classList.remove("active");

            } else {
               modalContent.innerHTML = `<img src="${attachmentImg.src}" alt="Zoomed Attachment" class="zoomed-img"/>`;
               modalElement.classList.add("active");
            }

            modalElement.addEventListener("click", () => {
               modalElement.classList.remove("active");
            });
         }



       function seeImage(id) {
            console.log("ok")
            const attachmentImg = document.querySelector(`.attachment-img${id}`);
            const modalElement = document.getElementById("image-modal");
            const modalContent = modalElement.querySelector(".modal1-content");
            // Check if the "selected" class is present
            const isSelected = modalElement.classList.contains("active");

            if (isSelected) {
               modalElement.classList.remove("active");

            } else {
               modalContent.innerHTML = `<img src="${attachmentImg.src}" alt="Zoomed Attachment" class="zoomed-img"/>`;
               modalElement.classList.add("active");
            }

            modalElement.addEventListener("click", () => {
               modalElement.classList.remove("active");
            });
         }





function sentNegociation(shipping_id,receiver_id,receiver_name) {
  var comment = "Greetings, " + receiver_name + " I propose you ..."
  var user_id = localStorage.getItem("user_id")
var price = Number(document.getElementById("montant").value)

    var raw = JSON.stringify({
      "name": comment,
      "sender_partner_id": user_id,
      "receiver_partner_id": receiver_id,
      "shipping_id": shipping_id,
      "price": price
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `/api/v1/create/m1st_hk_roadshipping.travelmessage?values=${raw}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': authorization,
      }
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data);

        if(response.data){
        document.getElementById("montant").value = ""
        acceptNegotiation(shipping_id)

        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


function acceptNegotiation(id){

    var raw = JSON.stringify({
   "msg_shipping_accepted": true
           });

 let config = {
   method: 'put',
   maxBodyLength: Infinity,
   url:`/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${id}`,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
   console.log("MESSAGES ACTIVATED SUCCESSFULLY");
   window.location.href=""
 })
 .catch((error) => {
   console.log(error);
 });

}

function checkValue(value) {
var montant = document.getElementById("montant")
            if (value <0) {
                    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Price value must be greater than zero</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
                montant.value = ""
            }


        }

function verifyInvoice(move,moveState){

console.log("GETTING INVOICE")

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read?model=account.move&ids=%5B%22${move}%22%5D&fields=%5B%22payment_state%22%5D&with_context=%7B%7D&with_company=1`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
    localStorage.setItem("invoiceId",response.data[0].payment_state)

  if(moveState === "paid" && response.data[0].payment_state === "paid"){
  document.getElementById("parcel").style.display = "inline"
  }else{
    document.getElementById("parcel").style.display = "none"

  }

})
.catch((error) => {
  console.log(error);
});

}

function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}

