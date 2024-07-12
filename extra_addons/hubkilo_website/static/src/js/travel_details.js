  var authorization = localStorage.getItem("authorization")
  var url = window.location.href;
  var urlParts = url.split("/");
  var elementId = urlParts[urlParts.length - 1];


function travelDetails(){
    var travelbooking_id = localStorage.getItem("travelbooking_id")
   axios.get(`/api/v1/read/m1st_hk_roadshipping.travelbooking?ids=${travelbooking_id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        },
      })
    .then((response) => {


   localStorage.setItem("Bookings",JSON.stringify(response.data) )

//MY TRAVEL DETAILS
    response.data.map((myItem)=>{
    console.log(myItem)
    localStorage.setItem("travelbooking_id",myItem.id)
      const travel_info_details = document.getElementById("travel_info_details");
      const travel_info_state = document.getElementById("travel_info_state");
      const travel_info_buttons = document.getElementById("travel_info_buttons");
      const travel_info_total_price = document.getElementById("travel_info_total_price");


      //for display for update
        document.getElementById("ville_depart").value = myItem.departure_city_id[1]
  document.getElementById("ville_arrivee").value = myItem.arrival_city_id[1]
  document.getElementById("date_de_depart").value = myItem.departure_date
  document.getElementById("date_de_arrivee").value = myItem.arrival_date

   localStorage.setItem("selectedDepartCityId",myItem.departure_city_id[0])
   localStorage.setItem("selectedArriveCityId",myItem.arrival_city_id[0])

  //shipping list function
  allShippingOffers(myItem.departure_city_id[0],myItem.departure_city_id[0])



//           const all_results = document.getElementById('all_results')
var my_user_id = localStorage.getItem("user_id")


    var display = myItem.booking_type === "road" ? "none" : "flex"
    var displayAir = myItem.booking_type === "air" ? "none" : "flex"
    var displayExpedition = myItem.partner_id[0] === Number(my_user_id) ? "none" : "flex"
    var color = myItem.state === "rejected" && 'RGB(255,0,0)' || myItem.state === "completed" && '#4472C4' || myItem.state === "accepted" && '#FFC000' || myItem.state === "negotiating" && '#00B050'|| myItem.state === "pending" && 'RGB(165,165,165)'
    var content = myItem.state === "rejected" && 'Rejected' || myItem.state === "completed" && 'Complete' || myItem.state === "accepted" && 'Running' || myItem.state === "negotiating" && 'Published'|| myItem.state === "pending" && 'Pending'

    var display1 = myItem.state === "pending" ? 'inline' : 'none'
    var displayNegotiationButton = myItem.state === "pending" ? 'inline' : 'none'
    var viewShipping = myItem.state === "rejected" ? 'none' : 'inline'
    var border = myItem.state === "rejected" ? 'solid red 1px' :'solid blue 1px'



///D DATE
let datetime = myItem.departure_date;
let date = datetime.split(" ")[0];
let dtime = datetime.split(" ")[1];
let date1 = new Date(date);

let options = { day: 'numeric', month: 'long', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options);

//A DATE
let adatetime = myItem.arrival_date;
let adate = adatetime.split(" ")[0];
let atime = adatetime.split(" ")[1];

//DEPARTURE CITY
let str = myItem.departure_city_id[1];
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = myItem.arrival_city_id[1];
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);

var display = myItem.state === "negotiating" ? "inline" : "none"
var displayCloseNegotiation = myItem.state === "negotiating" ? "inline" : "none"
var displayAccepted = myItem.state === "accepted" ? "inline" : "none"


 travel_info_details.innerHTML = `<h5 class="d-flex justify-content-md-start justify-content-center" style="font-weight:800; font-size:22px;color: black; margin-top: 20px; margin-bottom: 1px;">
                  ${myItem.code}
               </h5>
               <div class="d-flex justify-content-md-start justify-content-center" style="display: flex;gap:2px;align-items: center;">
                  <img src="/hubkilo_website/static/src/media/road-trip.gif" alt="road trip" style="width:100px;height:100px"/>
                  <div class="heading "
                     style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                     <h6 class="text-center"
                        style="font-weight:700;color:#217aff;font-size:18px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px">
                        ${departure_city}</h6>
                     <p style="white-space: nowrap;overflow: hidden;;font-size:17px;text-overflow: ellipsis;width:120px"
                        class="heading text-center">${departure_country}</p>
                  </div>
                  <div style="display: flex;align-items: center;">
                     <i class='fas fa-arrow-right' style='font-size:24px; color: black;'></i>
                  </div>
                  <div class="heading "
                     style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                     <h6 class="text-center"
                        style="font-weight:700;color:#217aff;font-size:18px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px">
                        ${arrival_city}</h6>
                     <p style="white-space: nowrap;overflow: hidden;font-size:17px;text-overflow: ellipsis;width:120px"
                        class="heading text-center">${arrival_country}</p>
                  </div>
               </div>`;

travel_info_state.innerHTML = `<button class="btn state " style="width:150px;font-weight:700;background:white;border:1px solid ${color};color:${color};font-size:16px;border-radius:30px;">${content}</button>`

travel_info_total_price.innerHTML = `<h4  style="font-weight:900; font-size:22px;text-align: center;">${myItem.booking_price} EUR</h4>`

travel_info_buttons.innerHTML = ` <div class="" style="display:flex;justify-content:center;gap:20px">
                                  <button type="button" class="btn" onclick="setNegotiation(${myItem.id})" style="text-transform: capitalize;background: #217aff;color:white;border-radius:10px;display:${displayNegotiationButton};font-size:12px;font-weight:600"><i class='fas fa-upload'></i> Publish</button>
                                  <button type="button" onclick="seeShippingOffers()" class="btn btn-primary" style="text-transform:capitalize;font-size:12px;font-weight:600;display:${displayCloseNegotiation}" data-toggle="modal" data-target="#shipping_offers_list_modal">
                                   Add Shipping Offers
                                   </button>

                                    <button class="btn" onclick="cancelTravel(${myItem.id})"
                                        style="background-color: #fa234f;text-transform: capitalize;border:solid 2px #fa234f;color:white;border-radius:5px;display:${display1};font-size:12px;font-weight:600"><i class="fa fa-close" style="color:white" aria-hidden="true"> </i> Cancel</button>

                                        <button type="button" style="text-transform: capitalize;border-radius:5px;display:${display1};font-size:12px;border:solid 2px #141519;background:#141519;color:white;font-weight:600" class="btn btn-primary" data-toggle="modal" data-target="#EditModal">
                                        <i class="far fa-edit" style="color:white" aria-hidden="true"> </i>
                                          Edit
                                        </button>

                                        <button  class="btn btn-success" onclick="setAccepted(${myItem.id})" style="text-transform: capitalize;border-radius:5px;display:${displayCloseNegotiation};font-size:12px;font-weight:600">Close negotiation </button>
                                        <button onclick="setComplete(${myItem.id})"  class="btn "  style="background-color:rgb(127, 16, 231);color:white;text-transform: capitalize;border-radius:5px;display:${displayAccepted};font-size:12px;font-weight:600">Set travel to complete </button>
                                </div>
                                `


    })

//MY TRAVEL SHIPPING LIST START
var shippingIds = response.data.map((item) => item.shipping_ids)

 axios.get(`/api/v1/read/m1st_hk_roadshipping.shipping?ids=${shippingIds}`, {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
         },
       }).then(response => {
 console.log("my reservations")
  console.log(response.data)

     const my_all_results = document.getElementById('my_all_results')

     // Check if emptyArray is empty
if (response.data.length === 0) {
Loader()
var my_all_results_alert = document.getElementById("my_all_results_alert")
my_all_results_alert.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:40px;color:#79a1de">No Expeditions On My Travel</h1>`
} else {
Loader()
     response.data.map((item)=> shipping.push(item))

     my_all_results.innerHTML = response.data.map((table)=>{

let datetime = table.create_date;
let time = datetime.split(" ")[1];

     localStorage.setItem("qrcode",table.name)
     var displayNegociation = table.state === "negotiating" ? 'inline' :'none';
     var displayChatButton = table.state === "pending" ? 'inline' :'none';
     var displayCodeButton = table.state === "paid" ? 'inline' :'none';
     var displayPayButton = table.state === "accepted" ? 'inline' :'none';
     var displayTrans = table.state === "rejected" || table.state === "pending"  ? 'inline' :'none'
     var others = table.state === "rejected" || table.state === "pending" ? 'inline' :'none'
var color = table.state === "rejected" && 'RGB(255,0,0)' || table.state === "received" && '#4472C4' || table.state === "accepted" && 'RGB(255,192,0)' || table.state === "paid" && 'RGB(0,176,80)'|| table.state === "pending" && 'RGB(165,165,165)'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'RGB(112,48,160)'
var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending' || table.state === "confirm" && 'Received'


     var border = table.state === "rejected" ? 'solid red 1px' :'solid blue 1px'

     localStorage.setItem("qrcode",table.name)
     var displayReject = table.state === "pending" ? 'inline' :'none';
      var displayChatButton2 = table.state === "pending" ? 'inline' :'none';
      var displayConfirmShippingButton = table.state === "paid" && table.parcel_received === true ? 'inline' :'none';
      var displayConfirmShippingButton2 = table.state === "accepted" ? 'none' :'inline';
      var hide_reject = table.state === "accepted" ? 'none' :'inline';

           var displayParcelButton = table.state === "paid" && table.parcel_received === false ? 'inline' :'none';


        //GET LUGGAGE FOR SHIPPING

//DEPARTURE CITY
let str = table.travel_departure_city_name;
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = table.travel_arrival_city_name;
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);

//DATE

let date1 = new Date(table.shipping_date);

let options = { day: 'numeric', month: 'short', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();


 if(table.disagree === true){
  return ``

 }else{
 return `  <tr style="background-color: white">

                       <td style="background-color: white">${table.display_name}</td>
                       <td style="background-color: white">${table.partner_id[1]}</td>
                       <td style="background-color: white">${table.receiver_partner_id[1]}</td>
                       <td style="background-color: white">${table.shipping_price} EUR</td>
                       <td style="background-color: white">
                         <button class="btn state" style="width:140px;font-family:'Obitron',sans-serif ;font-weight:700;background:white;border:1px solid ${color};color:${color};font-size:14px;border-radius:30px;">${content}</button>
                       </td>

                       <td style="background-color: white">${formattedDate}</td>
                       <td style="background-color: white">

                     <button onclick="my_bookingPage_shipping(${table.travelbooking_id[0]},'${table.booking_type}',${table.id})" class="btn " style="background:#2fb9ee;color:white;border-radius:30px;font-size:12px;text-transform:capitalize">More Info
                      <i class='fas fa-arrow-right' style='color:white;margin-left:5px'></i>
                    </button>
                        </td>
                   </tr>

                           <!-- MODAL LUGGAGE START -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Luggage Info</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body" id="luggage_info">

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"
                        data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL LUGGAGE END -->
 `
 }


     }).join("")
}


            })
          .catch(function(error) {
              console.log(error);
          })

//MY TRAVEL SHIPPING LIST END


    })
    .catch(function (error) {
      console.log(error);
    });
}

setTimeout(()=>{
travelDetails()
},2000)

var shippingOffers = []
function allShippingOffers(){
 axios.get(`/api/v1/search_read/m1st_hk_roadshipping.shipping`, {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       })
       .then(response => {
 console.log("shipping offers............")
  console.log(response.data)

     const shipping_offers_list = document.getElementById('shipping_offers_list')
     var luggage_ids =response.data.map((table)=>table.luggage_ids[0])

// Check if emptyArray is empty
if (response.data.length === 0) {
shipping_offers_list.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:48px;color:#79a1de">No Shipping</h1>`


}
else {
     //SHOW SHIPPING

   shipping_offers_list.innerHTML=response.data.map((table)=>{


let datetime = table.create_date;
let time = datetime.split(" ")[1];

     localStorage.setItem("qrcode",table.name)
     var displayNegociation = table.state === "negotiating" ? 'inline' :'none';
     var displayChatButton = table.state === "received" || table.msg_shipping_accepted === false ? 'none' :'inline';
     var displayCodeButton = table.state === "paid" ? 'inline' :'none';
     var displayPayButton = table.state === "accepted" ? 'inline' :'none';
     var displayInvoiceButton = table.move_id === false ? 'none' :'inline';
     var displayTrans = table.state === "rejected" || table.state === "pending"  ? 'inline' :'none'
     var others = table.state === "rejected" || table.state === "pending" ? 'inline' :'none'

var color = table.state === "rejected" && 'RGB(255,0,0)' || table.state === "received" && '#4472C4' || table.state === "accepted" && 'RGB(255,192,0)' || table.state === "paid" && 'RGB(0,176,80)'|| table.state === "pending" && 'RGB(165,165,165)'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'RGB(112,48,160)'
var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'Received'

var selectedArriveCityId = Number(localStorage.getItem("selectedArriveCityId"))
var selectedDepartCityId = Number(localStorage.getItem("selectedDepartCityId"))

//if(table.travelbooking_id === false && table.state == "pending" && table.shipping_departure_city_id[0] === selectedDepartCityId  && table.shipping_arrival_city_id[0] === selectedArriveCityId ){
if(table.travelbooking_id === false && table.state == "pending"){
//DEPARTURE CITY
let str = table.shipping_departure_city_id[1];
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = table.shipping_arrival_city_id[1];
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);


//DATE

let date1 = new Date(table.shipping_date);

let options = { day: 'numeric', month: 'short', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();

var my_state_content = table.disagree === true ? `<div class="badge1 state" style="display:flex;background: red;color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">Rejected</div>` : `<div class="badge1 state" style="background:${color};border:1px solid ${color};color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>`


 return ` <div class="col-lg-6 col-md-6 pt-4 wow fadeInUp" data-wow-delay="0.1s">

         <div id="shippingOffer${table.id}" class="room-item shadow overflow-hidden" onclick="selectShippingOffer(${table.id})" style="border-radius:30px;position: relative;">

                                               <div id="disagree_badge" class="container_badge" style="position: absolute;top: -30px;right: -20px;height: 50px; width: 250px">
                                               ${my_state_content}
                                               </div>


                              <div class="pb-4 mt-4" style="padding-left:10px;padding-right:20px">
                                <div style="display: flex;justify-content:space-between;align-items: center;">
                                    <div class="" style="display:flex;align-items:center;justify-content:center;gap:10px">
                                        <i class='fas fa-bus-alt' style='font-size:28px;color:#dde3ea'></i>
                                        <div style="display:flex;gap:5px">
                                         <h6 class="text-center" style="font-size:14px;font-weight: 400;white-space: nowrap;overflow: hidden;font-size:12px;text-overflow: ellipsis;width:60px">${departure_city}</h6>
                                        <h6 class="text-center" style="font-size:14px;font-weight: 400;">></h6>
                                        <h6 class="text-center" style="font-size:14px;font-weight: 400;white-space: nowrap;overflow: hidden;font-size:12px;text-overflow: ellipsis;width:60px">${arrival_city}</h6>
                                        </div>

                                    </div>
                                    <div style="display: flex;justify-content: end;flex-direction: column;padding-right:30px">
                                        <h6 class="mb-0" style="font-weight: 700;color: #021531;font-size:12px">${table.display_name}</h6>
                                        <h6 class="mb-0" style="color:#217aff;font-size:12px;">${formattedDate}</h6>
                                    </div>
                                </div>

                                <div style="display: flex;justify-content:space-between;gap: 40px;margin-top:20px">
                                    <button onclick="storeBookingInfos(${table.id})" class="btn py-2 px-4"
                                        style="z-index:200;background: white;color:black;border: 1px solid black;text-transform: capitalize;border-radius:5px;font-size:12px;display:${displayChatButton};">Negotiate
                                        <i class='fas fa-comment-alt' style='color:#000000'></i>
                                    </button>
                                <div class="" style="display:none;justify-content:start;gap: 10px;">
                                    <span onclick="my_bookingPage_shipping(${table.travelbooking_id[0]},'${table.booking_type}',${table.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none" class="mt-2  py-2">More info ></span>
                                </div>

                                </div>


                            </div>
                        </div>
                               <!-- MODAL LUGGAGE START -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Luggage Info</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body" id="luggage_info">
                    <div style="display:flex;justify-content:center;align-item:center">
                                   <div class="spinner-grow text-primary" style="margin-top:100px;margin-bottom:200px;text-align:center;width: 10rem; height: 10rem;" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary"
                        data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL LUGGAGE END -->

                    </div>`

}
else{
shipping_offers_list.innerHTML = `<h1 style="text-align:center;margin-top:20px;margin-bottom:20px;font-size:48px;color:#79a1de">No Shipping</h1>`
}

     }).join("")
}


            })
          .catch(function(error) {
              console.log(error);
          })
}
allShippingOffers()


function seeShippingOffers(){


}

var selectedOfferIds = []
function selectShippingOffer(id){
var shippingOfferId = document.getElementById(`shippingOffer${id}`)
var isSelected = shippingOfferId.classList.contains("selected");


 if (isSelected) {
     shippingOfferId.classList.remove("selected"); // Remove the "selected" class if it's present
     var index = selectedOfferIds.indexOf(id);
     selectedOfferIds.splice(index, 1);

     console.log(selectedOfferIds);

                }else{
       selectedOfferIds.push(id)
      shippingOfferId.classList.add("selected"); // Remove the "selected" class if it's present
      console.log(selectedOfferIds)

                }
}

function addSelectedShippingOffer(){
console.log(selectedOfferIds)
if(selectedOfferIds.length === 0){
alert("You need to select an offer before you can proceed")
}else{

var travelbooking_id = Number(localStorage.getItem("travelbooking_id"))
var raw = JSON.stringify({
    "travelbooking_id":travelbooking_id

});

selectedOfferIds.map((item)=>{

let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${item}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(response.data);
  var lastElement = selectedOfferIds[selectedOfferIds.length - 1] === response.data[0]
  if(lastElement){
//    window.location.href = "";
travelDetails()

// Get a reference to the modal element
$('#shipping_offers_list_modal').modal('hide')
  }

})
.catch((error) => {
  console.log(error);
});


})

}


}

//Travel shipping
function my_Shipping(travelID,type,shipping_ids) {

   //COMMANDES SUR MES VOYAGES
   console.log("COMMANDES SUR MES VOYAGES")
 console.log(shipping_ids)
 localStorage.setItem("personal_shipping_ids",shipping_ids)

window.location.href="/travel/shipping"

 }

function setAccepted(id){
 console.log("Set to accepted")

    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/m1st_hk_roadshipping.travelbooking/set_to_accepted/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
}

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
   travelDetails()

//     window.location.href = "";
//     window.location.href = "";
 })
 .catch((error) => {
 alert(error.response.data.message)
   console.log(error.response.data.message);
 });

 }

function setNegotiation(id){
 var partner_attachment_ids = localStorage.getItem("partner_attachment_ids")
 if(Number(partner_attachment_ids) === 0 ){
 console.log("partner attachment id = 0")
// alert("please access to identification menu and upload your identity card")
   var result = confirm("Please access to identification menu and upload your identity card");
if (result) {
      window.location.href = "/profile"
} else {
    console.log("")
}

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
  alert ("your identity has not been confirmed")
  } else {
  console.log("Set Negotiation")
    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/m1st_hk_roadshipping.travelbooking/set_to_negotiating/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
}
 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
   travelDetails()
//     window.location.href = "";
//     window.location.href = "";
 })
 .catch((error) => {
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


function cancelTravel(id){
    console.log("travel_id= " + id)
    console.log("set to rejected")
    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/m1st_hk_roadshipping.travelbooking/set_to_rejected/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
}

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
   var alert_success_message = document.getElementById("alert_success_message")
   alert_success_message.innerHTML = `<p style="text-transform:capitalize">Canceled Successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();

//   window.location.href=""
travelDetails()
 })
 .catch((error) => {
 alert(error.response.data.message)
   console.log(error.response.data.message);
 });



 }

 function setComplete(id){

    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/m1st_hk_roadshipping.travelbooking/set_to_completed/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
//  window.location.href=""
travelDetails()
})
.catch((error) => {
                      var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
});


 }




//FOR SHIPPING START

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

  function markShippingReceived(){
   var transaction_code =document.getElementById('transaction_code').value;
   var markShippingId = localStorage.getItem("markShippingId ")

    if (transaction_code === confirmation_code){
    var raw = JSON.stringify({
    "state": "received"
           });
    let config = {
   method: 'put',
   maxBodyLength: Infinity,
   url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${markShippingId}`,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
//   window.location.href=""
travelDetails()
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

function DeleteMyReserve(id){

  var raw = JSON.stringify({
   "disagree": true
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
//  window.location.href=""
travelDetails()
})
.catch((error) => {
  console.log(error);
});

}


 function myQrCode(code,id){
//    console.log(code+"-"+id)
    var code_id = document.getElementById("code_id")
    confirmation_code = code+"-"+id
    localStorage.setItem("markShippingId ",id)
 }

function receivedParcel(id){

let data = JSON.stringify({
  "jsonrpc": 2
});

let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/shipping/luggage/confirm/${id}`,
  headers: {
    'Content-Type': 'application/json',
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
//  window.location.href=""
travelDetails()
})
.catch((error) => {
  console.log(error);
});


}

//FOR SHIPPING END


//GO TO SHIPPING TRAVEL PAGE
function my_bookingPage_shipping(id,type,my_shipping_id){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)
localStorage.setItem("travel_id_detail",id)
localStorage.setItem("shipping_id_detail",my_shipping_id)

window.location.href = "/my/traveler/shipping/details"

console.log(id,type)
}


var shipping = [];

function handleDateChange(){
// Get the input element
  const dateInput = document.getElementById("date_de_depart");

  // Get the value of the input
  const selectedDateTime = dateInput.value;

  // Separate the date and time strings
  const [date, time] = selectedDateTime.split("T");
  localStorage.setItem("my_trave_departure_date",date)

  console.log("hello",date)

  // Check if the date is in the past
  if (isPastDate(date)) {
  const departureDate_error = document.getElementById("departureDate_error")
  departureDate_error.style.display = "block"
    dateInput.value=""
    setTimeout(()=>{
    departureDate_error.style.display = "none"
    dateInput.value=""
  },1000)
  }


}


function handleDateChange1(){
// Get the input element
  const dateInput1 = document.getElementById("date_de_arrivee");

  // Get the value of the input
  const selectedDateTime1 = dateInput1.value;

  // Separate the date and time strings
  const [date, time] = selectedDateTime1.split("T");
var my_trave_departure_date = localStorage.getItem("my_trave_departure_date")
  console.log(date)

  const a = new Date(date);
   const d = new Date(my_trave_departure_date);


  if(a < d ){
//    alert("You can only select a date greater than the departure date")
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">You can only select a date greater than the departure date</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
    dateInput1.value = ""
  }


  var current_date_de_depart = document.getElementById('date_de_depart')
var current_ville_de_arriver = document.getElementById('date_de_arrivee')
if(current_date_de_depart.value === ""){
//alert("Remplissez d'abord le champ de la date de départ")
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">First fill in the departure date field</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
current_ville_de_arriver.value = ""
return;
}

}


function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}
