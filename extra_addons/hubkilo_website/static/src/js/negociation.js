console.log("negotiate")
var authorization = localStorage.getItem("authorization")

var lastprice, shipper_validate, message_id, display_validation_traveler, display_enter_price;

var my_negotiated_price = 0
var my_commission = 0
var allMessages
var travel_arrival_city_name = localStorage.getItem("travel_arrival_city_name")
var travel_departure_city_name = localStorage.getItem("travel_departure_city_name")
var shipping_display_name = localStorage.getItem("shipping_display_name")
var negociationClosed = false, last_msg_partner_id, last_msg_shipping_id, display_message_price, last_price_confirmed,last_accepted_id
var shipping_id = localStorage.getItem("shipping_id")

//SOCKET START
// Event handler for when the connection is established
const socketChat = new WebSocket(`wss://preprod.hubkilo.com:9090/room${shipping_id}`);

// Event handler for when the connection is established
socketChat.addEventListener("open", (event) => {
  console.log(`Connected to WebSocket server in room all_rooms`);
  console.log(event)
});

// Event handler for incoming messages from the server
socketChat.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  console.log(`Received message:`, message);
  allMessages.push(message.data)
  getShippingMessages()
  displayMessages()
console.log(allMessages)
});

// Event handler for when the connection is closed
socketChat.addEventListener("close", (event) => {
  if (event.wasClean) {
    console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  } else {
    console.error(`Connection abruptly closed`);
  }
});

// Event handler for connection errors
socketChat.addEventListener("error", (error) => {
  console.error(`WebSocket error:`, error);
});

//SOCKET END



window.onload = function(){
localStorage.removeItem("ValidateState")

}

function displayMontant() {
  document.getElementById('proposition').style.display = "inline";
  document.getElementById('confirm').style.display = "none";

}



//LIVE CALL FOR MESSAGES

 function getShippingMessages() {

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: '/api/v1/read/m1st_hk_roadshipping.shipping?ids=' + localStorage.getItem("shipping_id"),
    headers: {
      'Accept': 'application/json',
      'Authorization': authorization,
    }
  };

  axios.request(config)
    .then((response) => {

    console.log("this shippping",response.data)
     var displayPayButton = response.data[0].state === "accepted" ? 'inline' :'none';
     var displayInvoiceButton = response.data[0].move_id === false || response.data[0].state === "received" || response.data[0].state === "paid" || response.data[0].state === "confirm"  ? 'none' :'inline';
     var thisShippingId = response.data[0].id
     var thisShippingMoveId = response.data[0].move_id[0]
     var user_id = localStorage.getItem("user_id")

     if(Number(user_id) === Number(response.data[0].partner_id[0])){
          var invoiceSection = document.getElementById("invoiceSection")
      invoiceSection.innerHTML = `<button type="button" class="save-btn btn btn-primary" onclick="ProceedPayment(${thisShippingId})" style="text-transform: capitalize;display:none">
                                    Proceed To Pay
                                     </button>

                                     <button type="button" class="btn" onclick="window.location.href='${response.data[0].payment_link}'" style="text-transform: capitalize;display:${displayInvoiceButton};background:#217aff;color:white;font-weight:700">
                                    Proceed To Pay
                                     </button>`
     }



    setTimeout(()=>{


                 let config = {
                   method: 'get',
                   maxBodyLength: Infinity,
                   url: '/api/v1/read/m1st_hk_roadshipping.travelbooking?ids=' + response.data[0].travelbooking_id[0] ,
                   headers: {
                     'Accept': 'application/json',
                     'Authorization': authorization,
                   }
                 };

                 axios.request(config)
                 .then((response) => {

             localStorage.setItem("shipping_traveler_id",response.data[0].partner_id[0])

                 })
                 .catch((error) => {
                   console.log(error);
                 });


    },2000)


          //CODE NAME
          var shipping_name = document.getElementById("shipping_name")
          var shippingCode = Number(localStorage.getItem("shipping_traveler_id")) === Number(localStorage.getItem("user_id")) ? `<span onclick="my_bookingPage_shipping(${response.data[0].travelbooking_id[0]},'${response.data[0].booking_type}',${response.data[0].id})">${shipping_display_name}</span>` : `<span onclick="my_bookingPage_shippingShipper(${response.data[0].travelbooking_id[0]},'${response.data[0].booking_type}',${response.data[0].id})">${shipping_display_name}</span>`
          shipping_name.innerHTML = shippingCode


      var travelmessage_ids = response.data[0].travelmessage_ids

      //Display All Messages
      if (response.data[0].state !== "received") {

let data = JSON.stringify({
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "shipping_id": response.data[0].id
  }
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: '/m1st_hk_roadshipping/get_messages_by_shipping_id',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  data : data
};

        axios.request(config)
          .then((response) => {
            console.log(response);
            allMessages = response.data.result.messages
            displayMessages()

          })
          .catch((error) => {
            console.log(error);
          });
      } else {
      }
    })
    .catch((error) => {
      console.log(error);
    });




}

function displayMessages(){

Loader()
            var data = allMessages
            var shipping_validation_button = document.getElementById("shipping_validation_button")
            var ServiceFeesSection = document.getElementById("ServiceFeesSection")
            var netReceivedSection = document.getElementById("netReceivedSection")
            var totalPriceText = document.getElementById("totalPriceText")


          //LAST MESSAGE START
          var validateMessage = data.filter((item) => item.state === "validate")
          var validateMessagePrice = data.filter((item) => item.state === "validate").price
          var acceptedMessage = data.filter((item) => item.shipper_validate === true)

          var validateMessageIndex = data.findIndex(obj => obj.state === "validate");



          var lastMessage = data[data.length - 1];
          console.log("my last message", lastMessage);
          console.log("MY VALIDATE MESSAGE", validateMessage);


         //LIVE PRICE START
          var shipping_last_current_price = document.getElementById("shipping_last_current_price")
          var negotiated_price = document.getElementById("negotiated_price")

          if(validateMessage.length === 0){
            shipping_last_current_price.innerHTML = lastMessage.price
            my_negotiated_price = lastMessage.price
            negotiated_price.innerHTML = `${lastMessage.price} <span style="font-weight: normal;">EUR</span>`
            localStorage.setItem("ValidateState","notValid")
            checkValidation()
          }else{
          shipping_last_current_price.innerHTML = validateMessage[0].price
          localStorage.setItem("ValidateState",validateMessage[0].state)
           localStorage.setItem("lastNegotiatedPrice",validateMessage[0].price)

          checkValidation()
          my_negotiated_price = validateMessage[0].price
          negotiated_price.innerHTML = `${validateMessage[0].price} <span style="font-weight: normal;">EUR</span>`
          }
        //LIVE PRICE END

          //LAST MESSAGE END

            var x = data.length
            lastprice = data[x - 1].price
             last_price_confirmed = data[x - 1].price
             last_msg_shipping_id = data[x - 1].shipping_partner_id[0]
            last_msg_partner_id = data[x - 1].sender_partner_id[0]
//            last_price_to_validate
            if(acceptedMessage.length !== 0){
            last_accepted_id = acceptedMessage[acceptedMessage.length - 1].id
            }
            localStorage.setItem("last_price_to_validate",data[data.length - 1].price)
//            }
            shipper_validate = acceptedMessage.length === 0 ? data[x - 1].shipper_validate : acceptedMessage[acceptedMessage.length - 1].shipper_validate
            console.log("shipper validate? " , acceptedMessage)
            message_id = data[x - 1].id
            var container1 = document.getElementById('container1')
            var currentuser_id = Number(localStorage.getItem("currentPartner_ids"))


              shipping_traveler_id = Number(localStorage.getItem("shipping_traveler_id"))


            container1.innerHTML = ""
            container1.innerHTML = data.map((table,index) => {


          const displayProfile = table.sender_image === true ? `/web/image/res.partner/${table.sender_partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

                           let datetime = table.date;
              let date = datetime.split(" ")[0];
              let time = datetime.split(" ")[1].substring(0, 5);
              let date1 = new Date(date);

              let options = { day: 'numeric', month: 'short', year: 'numeric' };
              let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();
              var stature, name, display_validation, display_validation_traveler,shipperAcceptedButton;

              var shipperAcceptedButton =  currentuser_id === shipping_traveler_id || table.state === "validate"? "none" : "flex"

                 if(table.state === "validate"){
                negociationClosed = true
                 }
              if (currentuser_id === shipping_traveler_id) {
                totalPriceText.innerHTML = `<span>Total paid:</span>`

              if(validateMessage.length === 0){


              //verification of the last message
              if(data.length > 1){

               //BEFORE LAST MESSAGE
               var beforeLastMessage = data[data.length - 2];
                stature = "The is Traveler"
                name = table.sender_partner_id[1]
                if(acceptedMessage.length === 0){
                 beforeLastMessage.shipper_validate === false ? display_validation = `<button style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;">Waiting...</button>` : display_validation = `<button class="save-btn" style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;" id="confirm" onclick="set_to_validate(${last_accepted_id})">Confirm</button>`
                }else{
                 acceptedMessage[acceptedMessage.length - 1].shipper_validate === false ? display_validation = `<button style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;">Waiting...</button>` : display_validation = `<button class="save-btn" style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;" id="confirm" onclick="set_to_validate(${last_accepted_id})">Confirm</button>`
                }
//                beforeLastMessage.shipper_validate === false ? display_validation = `<button style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;">Waiting...</button>` : display_validation = `<button class="save-btn" style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;" id="confirm" onclick="set_to_validate(last_accepted_id)">Confirm</button>`
//                data[x - 1].shipper_validate === false ? display_validation = `<button style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;">Waiting...</button>` : display_validation = `<button class="save-btn" style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;" id="confirm" onclick="set_to_validate(${table.id}-1)">Confirm</button>`
                shipping_validation_button.innerHTML = display_validation
                ServiceFeesSection.style.display = "flex"
                netReceivedSection.style.display = "flex"
                totalPriceText.innerHTML = `<span>Total paid:</span>`
              }
              else{
                stature = "The is Traveler"
                name = table.sender_partner_id[1]
                data[x - 1].shipper_validate === false ? display_validation = `<button style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;">Waiting...</button>` : display_validation = `<button class="save-btn" style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;" id="validate" onclick="set_to_validate(last_accepted_id)">Confirm</button>`
                shipping_validation_button.innerHTML = display_validation
                ServiceFeesSection.style.display = "flex"
                netReceivedSection.style.display = "flex"
                totalPriceText.innerHTML = `<span>Total paid:</span>`

              }


              }
              else{
                 stature = "The is Traveler"
                name = table.sender_partner_id[1]
                display_validation = `<button type="button" style="background: #000000;color: orange;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;">Discussions Open</button>`
                shipping_validation_button.innerHTML = display_validation
                ServiceFeesSection.style.display = "flex"
                netReceivedSection.style.display = "flex"

                display_message_price = index > validateMessageIndex  ? "none" : "inline"
                shipperAcceptedButton = "none"



              }


              } else {
                totalPriceText.innerHTML = `<span>Total to pay:</span>`

              if(validateMessage.length === 0){

              if(data[data.length - 1].shipper_validate === false ){
               display_validation = `<button style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;" id="accept_validate"  onclick=" mark_shipper_validation(${table.id}, ${last_msg_partner_id}, ${last_msg_shipping_id})" >Accept</button>`
              }else{
               shipper_validate === true ? display_validation = `` : display_validation = `<button style="background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;" id="accept_validate"  onclick=" mark_shipper_validation(${table.id}, ${last_msg_partner_id}, ${last_msg_shipping_id})" >Accept</button>`

              }


                stature = "This is Shipper"
                name = table.sender_partner_id[1]
                shipping_validation_button.innerHTML = display_validation
                 ServiceFeesSection.style.display = "none"
                 netReceivedSection.style.display = "none"

              }
              else{
                stature = "This is Shipper"
                name = table.sender_partner_id[1]
                display_validation = `<button type="button" style="background: #000000;color:orange;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;">Discussions Open</button>`
                shipping_validation_button.innerHTML = display_validation
                ServiceFeesSection.style.display = "none"
                netReceivedSection.style.display = "none"

                display_message_price = index > validateMessageIndex  ? "none" : "inline"
                shipperAcceptedButton = "none"

              }

              }

              if (currentuser_id === table.sender_partner_id[0]) {

                return ` <div class="chat">
                                           <div class="chat-user">
                                             <a class="avatar m-0">
                                                <img src=${displayProfile} alt="avatar" class="avatar-35 ">
                                             </a>
                                          </div>
                                          <div class="chat-detail">
                                             <div class="chat-message" style="background-color:#1b5fe8;">
                                                <p class="send-message" style="width:100%;max-width:300px;text-align:left">${table.name}</p>
                                                <p  style="display:${display_message_price}" class="send-message"> ${table.price}  EUR</p>
                                                <p style="font-size:10px"  class="chat-time mt-1">${formattedDate} | ${time} </p>
                                             </div>

                                          </div>

                                       </div>`
              }
              else {
                return `<div class="chat chat-left">
                                           <div class="chat-user">
                                             <a class="avatar m-0">
                                                <img src=${displayProfile} alt="avatar" class="avatar-35 ">
                                             </a>
                                          </div>
                                          <div class="chat-detail">
                                             <div class="chat-message" style="background-color:#c4c4c4;">
                                                <p class="received-message" style="width:100%;max-width:300px">${table.name}</p>
                                                <p  style="display:${display_message_price}" class="received-message"> ${table.price}  EUR</h5>
                                                <p style="font-size:10px"  class="chat-time mt-1">${formattedDate} | ${time} </p>
                                                <div style="display:${display_message_price}">
                                                 <button class=" mt-4" style="display:${shipperAcceptedButton};background: #000000;color: #59cac6;border: 2px solid #2a2a2c;font-weight: 700;font-size: 18;border-radius: 30px;padding: 0 1rem;" id="accept_validate${table.id}"  onclick=" mark_shipper_validation2(${table.id}, ${table.sender_partner_id[0]}, ${table.shipping_partner_id[0]},${table.price})" >Accept</button>
                                                </div>
                                             </div>

                                          </div>


                                       </div>`
              }

            }).join("")


}

setTimeout(() => {
  var container = document.getElementById("container1");
  container.scrollTop = container.scrollHeight;
//  displayMessages()
  getShippingMessages()
}, 3000)
//setInterval(getShippingMessages, 1000)






function sentNegociation() {
  var comment = document.querySelector(".commentaire").value
  var shipper_sender_partner_id = localStorage.getItem("shipping_sender_id")
  var traveller_shipping_traveler_id = localStorage.getItem("shipping_traveler_id")
  var currentPartner_ids = localStorage.getItem("currentPartner_ids")
  var shipping_id = Number(localStorage.getItem("shipping_id"))
  var lastNegotiatedPrice = Number(localStorage.getItem("lastNegotiatedPrice"))
  var sender_id = 0, receiver_id = 0, price
  negociationClosed === true ? price = lastNegotiatedPrice : price = Number(document.getElementById("montant").value)

  if(comment.trim() === ""){
  comment = "I propose you ..."
  }

    if (currentPartner_ids === traveller_shipping_traveler_id) {
      receiver_id = shipper_sender_partner_id;
      sender_id = traveller_shipping_traveler_id;
    } else {
      receiver_id = traveller_shipping_traveler_id;
      sender_id = shipper_sender_partner_id;
    }
    console.log(" voyageur -> " + traveller_shipping_traveler_id)
    console.log(" expediteur -> " + shipper_sender_partner_id)
    console.log(" partner  -> " + currentPartner_ids)

    var raw = JSON.stringify({
      "name": comment,
      "sender_partner_id": sender_id,
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
        document.querySelector(".commentaire").value = ""
        document.getElementById("montant").value = ""
        document.getElementById("firstComment").value = ""
      })
      .catch((error) => {
        console.log(error);
      });
  }

function sentNegociationModal() {
  var comment = document.getElementById("firstComment").value
  var shipper_sender_partner_id = localStorage.getItem("shipping_sender_id")
  var traveller_shipping_traveler_id = localStorage.getItem("shipping_traveler_id")
  var currentPartner_ids = localStorage.getItem("currentPartner_ids")
  var shipping_id = Number(localStorage.getItem("shipping_id"))
  var sender_id = 0, receiver_id = 0, price
    var lastNegotiatedPrice = Number(localStorage.getItem("lastNegotiatedPrice"))
  negociationClosed === true ? price = lastNegotiatedPrice : price = Number(document.getElementById("montant").value)

  if(comment.trim() === ""){
  comment = "I propose you ..."
  }

    if (currentPartner_ids === traveller_shipping_traveler_id) {
      receiver_id = shipper_sender_partner_id;
      sender_id = traveller_shipping_traveler_id;
    } else {
      receiver_id = traveller_shipping_traveler_id;
      sender_id = shipper_sender_partner_id;
    }
    console.log(" voyageur -> " + traveller_shipping_traveler_id)
    console.log(" expediteur -> " + shipper_sender_partner_id)
    console.log(" partner  -> " + currentPartner_ids)

    var raw = JSON.stringify({
      "name": comment,
      "sender_partner_id": sender_id,
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
        document.getElementById("montant").value = ""
        document.getElementById("firstComment").value = ""
      })
      .catch((error) => {
        console.log(error);
      });
  }


function mark_shipper_validation(id, id2, id3) {
var current = Number(localStorage.getItem("currentPartner_ids"))
var accept_validate = document.getElementById("accept_validate")

    if (id2 === id3){
              var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">You cannot accept your own price</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
    } else {

       accept_validate.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
 let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `/api/v1/call/m1st_hk_roadshipping.travelmessage/mark_shipper_validation/?ids=${id}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': authorization,
    }
  };
  axios.request(config)
    .then((response) => {
    if(response.data === true){
          console.log(" You accepted the price")

                   var comment = "Price accepted. Please confirm the price by clicking on the button above"
                  var shipper_sender_partner_id = localStorage.getItem("shipping_sender_id")
                  //        var receiver_partner_id = localStorage.getItem("shipping_id")
                  var traveller_shipping_traveler_id = localStorage.getItem("shipping_traveler_id")
                  var currentPartner_ids = localStorage.getItem("currentPartner_ids")
                  var shipping_id = Number(localStorage.getItem("shipping_id"))
                  //  var price = Number(document.getElementById("montant").value)
                  // var sender_id = 0, receiver_id = 0, price
                  // negociationClosed === true ? price = 0 : price = Number(document.getElementById("montant").value)

                    if (currentPartner_ids === traveller_shipping_traveler_id) {
                      receiver_id = shipper_sender_partner_id;
                      sender_id = traveller_shipping_traveler_id;
                    } else {
                      receiver_id = traveller_shipping_traveler_id;
                      sender_id = shipper_sender_partner_id;
                    }
                    console.log(" voyageur -> " + traveller_shipping_traveler_id)
                    console.log(" expediteur -> " + shipper_sender_partner_id)
                    console.log(" partner  -> " + currentPartner_ids)

                    var raw = JSON.stringify({
                      "name": comment,
                      "sender_partner_id": sender_id,
                      "receiver_partner_id": receiver_id,
                      "shipping_id": shipping_id,
                      "price": last_price_confirmed
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
//                      localStorage.setItem("last_price_to_validate",last_price_confirmed)
                        console.log(response.data);
                             accept_validate.innerHTML = "Done "

                             setTimeout(()=>{
                              getShippingMessages()
                             },2000)


                      })
                      .catch((error) => {
                        console.log(error);
                      });

    }

      console.log(response)

    })
    .catch(error => {
//      alert("error! please try again");
          var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Something went wrong.Refresh and try again.</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
      console.log(error);
    })
}
}


function mark_shipper_validation2(id, id2, id3,price) {

console.log("SHIPPING SECOND")

var current = Number(localStorage.getItem("currentPartner_ids"))
var accept_validate = document.getElementById(`accept_validate${id}`)

    if (id2 === id3){
              var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">You cannot accept your own price</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
    } else {

       accept_validate.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
 let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `/api/v1/call/m1st_hk_roadshipping.travelmessage/mark_shipper_validation/?ids=${id}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': authorization,
    }
  };
  axios.request(config)
    .then((response) => {
    if(response.data === true){
          console.log(" You accepted the price")

                   var comment = "Price accepted. Please confirm the price by clicking on the button above"
                  var shipper_sender_partner_id = localStorage.getItem("shipping_sender_id")
                  //        var receiver_partner_id = localStorage.getItem("shipping_id")
                  var traveller_shipping_traveler_id = localStorage.getItem("shipping_traveler_id")
                  var currentPartner_ids = localStorage.getItem("currentPartner_ids")
                  var shipping_id = Number(localStorage.getItem("shipping_id"))

                    if (currentPartner_ids === traveller_shipping_traveler_id) {
                      receiver_id = shipper_sender_partner_id;
                      sender_id = traveller_shipping_traveler_id;
                    } else {
                      receiver_id = traveller_shipping_traveler_id;
                      sender_id = shipper_sender_partner_id;
                    }
                    console.log(" voyageur -> " + traveller_shipping_traveler_id)
                    console.log(" expediteur -> " + shipper_sender_partner_id)
                    console.log(" partner  -> " + currentPartner_ids)

                    var raw = JSON.stringify({
                      "name": comment,
                      "sender_partner_id": sender_id,
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
//                       localStorage.setItem("last_price_to_validate",price)

                        console.log(response.data);
                             accept_validate.innerHTML = "Done "

                             setTimeout(()=>{
                              getShippingMessages()
                             },2000)


                      })
                      .catch((error) => {
                        console.log(error);
                      });

    }

      console.log(response)

    })
    .catch(error => {
//      alert("error! please try again");
          var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Something went wrong.Refresh and try again.</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
      console.log(error);
    })
}
}


function set_to_validate(id) {
var save_btn = document.querySelector(".save-btn")
   save_btn.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`

  var shipping_id = Number(localStorage.getItem("shipping_id"))

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `/api/v1/call/m1st_hk_roadshipping.travelmessage/set_to_validate/?ids=${id}`,
    headers: {
      'Accept': 'application/json',
      'Authorization': authorization,
    }
  };
  axios.request(config)
    .then((response) => {
          var alert_success_message = document.getElementById("alert_success_message")
   alert_success_message.innerHTML = `<p style="text-transform:capitalize">The price has been confirmed by you successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();
                   var comment =  "Price confirmed. In order to confirm your shipment, I invite you to pay the invoice attached"
                  var shipper_sender_partner_id = localStorage.getItem("shipping_sender_id")
                  var traveller_shipping_traveler_id = localStorage.getItem("shipping_traveler_id")
                  var currentPartner_ids = localStorage.getItem("currentPartner_ids")
                  var shipping_id = Number(localStorage.getItem("shipping_id"))

                    if (currentPartner_ids === traveller_shipping_traveler_id) {
                      receiver_id = shipper_sender_partner_id;
                      sender_id = traveller_shipping_traveler_id;
                    } else {
                      receiver_id = traveller_shipping_traveler_id;
                      sender_id = shipper_sender_partner_id;
                    }
                    console.log(" voyageur -> " + traveller_shipping_traveler_id)
                    console.log(" expediteur -> " + shipper_sender_partner_id)
                    console.log(" partner  -> " + currentPartner_ids)
                    var last_price_to_validate = Number(localStorage.getItem("last_price_to_validate"))
                    var raw = JSON.stringify({
                      "name": comment,
                      "sender_partner_id": sender_id,
                      "receiver_partner_id": receiver_id,
                      "shipping_id": shipping_id,
                      "price": last_price_to_validate
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
                         save_btn.innerHTML = "Done "
                        console.log(response.data);

                          setTimeout(()=>{
                              getShippingMessages()
                             },2000)
                      })
                      .catch((error) => {
                        console.log(error);
                      });
      console.log(response)
    })
    .catch(error => {
//      alert("An error occurred please try again");
                          var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Something went wrong.Refresh and try again</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
      console.log(error);
    })
}


function seePartnerRatings() {
  var traveler_info_id = localStorage.getItem("shipping_traveler_id")
  var rating_view = document.getElementById("rating_view")

  let data = '{\r\n    "jsonrpc": 2.0\r\n}';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `/partner/get_ratings?rated_partner_id=${traveler_info_id}`,
    data: data
  };

  axios.request(config)
    .then((response) => {

      if (response.data.ratings.length === 0) {
        rating_view.innerHTML = "<h5 style='text-align:center'> No Rating Yet, be the first to rate!</h5>"

      } else {
        rating_view.innerHTML = response.data.ratings.map((rating) => {

          var ratingStar1 = rating.rating === "1" ? "flex" : "none"
          var ratingStar2 = rating.rating === "2" ? "flex" : "none"
          var ratingStar3 = rating.rating === "3" ? "flex" : "none"
          var ratingStar4 = rating.rating === "4" ? "flex" : "none"
          var ratingStar5 = rating.rating === "5" ? "flex" : "none"


          var rater_image = rating.rater_image === false ? "/hubkilo_website/static/src/img/avatar-profile.png" : `/web/image/res.partner/${rating.rater_id}/image_1920`

          let date1 = new Date(rating.rating_date);

          let options = { day: 'numeric', month: 'short', year: 'numeric' };
          let formattedDate = date1.toLocaleDateString('en-GB', options);


          return `  <div>
    <div class="row" style="border-radius:0px 30px 30px 30px;background-color: rgb(70, 144, 190);padding:5px 0px;display: flex;justify-content: space-between;">
      <div class="col-md-12 col-sm-12" style="display: flex;align-items: center;gap:30px;">
        <img src=${rater_image} alt="Your Image" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;" />
        <div >
    <h5 style="font-weight:700;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;">${rating.rater_name}</h5>
    <p class="col-12" style="margin-top:10px ;color:white;font-size:10px">${rating.comment}</p>
        </div>
      </div>

        <div id="ratingStar5" class="col-md-12 col-sm-12" style="display:${ratingStar5};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

        <div id="ratingStar1" class="col-md-6 col-sm-12" style="display:${ratingStar1};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

        <div id="ratingStar2" class="col-md-6 col-sm-12" style="display:${ratingStar2};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

        <div id="ratingStar3" class="col-md-6 col-sm-12" style="display:${ratingStar3};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

        <div id="ratingStar4" class="col-md-6 col-sm-12" style="display:${ratingStar4};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

    </div>
    <div style="display: flex;justify-content: end;">
      <p style="margin-bottom:30px;font-size:10px">${formattedDate}</p>
    </div>
  </div>`

        }).join("")

      }

    })
    .catch((error) => {
      console.log(error);
    });


}


function checkValue(value) {
var montant = document.getElementById("montant")
var my_comment_activation = document.getElementById("my_comment_activation")
            if (value <0) {
                    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Price value must be greater than zero</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
                montant.value = ""
            }

            if(!(value === "")){
            my_comment_activation.style.background = "black"
            my_comment_activation.style.color = "white"
            }else{
            my_comment_activation.style.background = "#929292"
            my_comment_activation.style.color = "#bfbfbf"
            }
        }

//GO TO SHIPPING TRAVEL PAGE
function my_bookingPage_shippingShipper(id,type,my_shipping_id){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)
localStorage.setItem("travel_id_detail",id)
localStorage.setItem("shipping_id_detail",my_shipping_id)

window.location.href = "/my/shipping/details"

console.log(id,type)
}


function getCommission(){

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '/api/v1/search_read?model=res.config.settings&fields=%5B%22hk_base_config_percentage%22%5D&with_context=%7B%7D&with_company=1\n',
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  my_commission = response.data[0].hk_base_config_percentage
})
.catch((error) => {
  console.log(error);
});

}
setInterval(getCommission, 2000)



//TVA CALCULATIONS
function calTVA(){

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '/api/v1/read?model=account.tax&ids=%5B1%5D&fields=%5B%22name%22%2C%22amount%22%5D&with_context=%7B%7D&with_company=1\n',
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
//  console.log(JSON.stringify(response.data));

var TVA_PRICE
var tvaName = document.getElementById("tvaName")
var tvaPrice = document.getElementById("tvaPrice")
var totalPrice = document.getElementById("totalPrice")
var ServiceFees = document.getElementById("ServiceFees")
var netReceived = document.getElementById("netReceived")


var tvaPercentage = response.data[0].amount/100

tvaName.innerHMTL = `<span>${response.data[0].name}:</span>`
TVA_PRICE = (my_negotiated_price * tvaPercentage )

tvaPrice.innerHTML = `${Number(TVA_PRICE.toFixed(3))} <span style="font-weight: normal;">EUR</span>`
var totalPriceAmount = my_negotiated_price + TVA_PRICE
totalPrice.innerHTML = `${Number(totalPriceAmount.toFixed(3))} <span style="font-weight: normal;">EUR</span>`

var serviceFee = (totalPriceAmount * my_commission)/100
ServiceFees.innerHTML = ` ${Number(serviceFee.toFixed(3))} <span style="font-weight: normal;">EUR</span>`

var netReceivedPrice = totalPriceAmount - serviceFee
netReceived.innerHTML = `<span style="color:#1b5fe8">${Number(netReceivedPrice.toFixed(3))}</span> <span style="font-weight: normal;">EUR</span>`

})
.catch((error) => {
  console.log(error);
});

}
setInterval(calTVA, 2000)

//verify image
async function checkProfilePicStatus() {
  var shipping_sender_id = localStorage.getItem("shipping_sender_id")
  var currentPartner_ids = localStorage.getItem("currentPartner_ids")
  var shipping_sender_name = localStorage.getItem("shipping_sender_name")
  var shipping_traveler_name = localStorage.getItem("shipping_traveler_name")
  var shipping_traveler_id = localStorage.getItem("shipping_traveler_id")
  var profile_chat = document.getElementById("profile_chat")
  var average_rating = localStorage.getItem("shipping_average_rating")


  try {
    const response1 = await axios.get(`/check_profile_pic/${shipping_traveler_id}`);
    console.log(response1.data)
    const displayTravelerProfile = response1.data === "True" ? `/web/image/res.partner/${shipping_traveler_id}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    profile_chat.innerHTML = `   <div>
                               <div class="d-flex align-items-center">
                                 <div class="avatar chat-user-profile m-0 mr-3">
                                             <img src=${displayTravelerProfile} alt="avatar" class="avatar-50 "/>
                                          </div>
                                 <div class="chat-caption">
                                    <h5 class="mb-0">${shipping_traveler_name}</h5>
                                     <div style="display: flex;gap: 5px;flex-direction:column">
                                        <p class="mb-0" style="font-size:16px;font-weight:700"><i class="fa fa-star" style="color: gold;font-size:16px"></i>${average_rating}</p>
                                          <a class="" onclick="seePartnerRatings()" style="text-decoration:none;color:#217aff;font-weight:700" data-toggle="collapse" href="#viewRating" role="button" aria-expanded="false" aria-controls="collapseExample">
                                       View all reviews
                                      </a>

                                    </div>
                                 </div>
                                 <button type="submit" class="close-btn-res p-3"><i class="ri-close-fill"></i></button>
                              </div>

                               <div class="collapse" id="viewRating">
                                <div class="card card-body" id="rating_view">


                                </div>
                                </div>

                               </div>`

    return response1.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
  } catch (error) {
    console.error('Error checking profile picture status:', error);
    return null;
  }
}
setTimeout(() => {
  checkProfilePicStatus()
}, 2000)

function checkValidation(){
    var ValidateState = localStorage.getItem("ValidateState")
if(ValidateState === "validate"){
document.getElementById("montant").style.display = "none"
document.getElementById("my_comment_activation").style.display = "none"
document.getElementById("secondComment").style.display = "flex"
}else{
document.getElementById("montant").style.display = "flex"
document.getElementById("my_comment_activation").style.display = "flex"
document.getElementById("secondComment").style.display = "none"
}

}

 function ProceedPayment(id){
 var save_btn = document.querySelector(".save-btn")
   save_btn.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
  var button = document.querySelector(".save-btn");
  button.disabled = true;
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
      save_btn.innerHTML = "Done"
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

//GO TO SHIPPING TRAVEL PAGE
function my_bookingPage_shipping(id,type,my_shipping_id){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)
localStorage.setItem("travel_id_detail",id)
localStorage.setItem("shipping_id_detail",my_shipping_id)

window.location.href = "/my/traveler/shipping/details"

console.log(id,type)
}

function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}
