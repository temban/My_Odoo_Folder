var authorization = localStorage.getItem("authorization")


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

  response.data.map((travel)=>localStorage.setItem("myTravels",travel.travelbooking_ids) )
  response.data.map((travel)=>{
  localStorage.setItem("myShipping",travel.shipping_ids)

setTimeout(()=>{
 axios.get(`/api/v1/read/m1st_hk_roadshipping.shipping?ids=${travel.shipping_ids}`, {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       })
       .then(response => {
 console.log("my reservations............")
  console.log(response.data)

     const all_results = document.getElementById('all_results')
     const my_shipping_offers_results = document.getElementById('my_shipping_offers_results')
     var luggage_ids =response.data.map((table)=>table.luggage_ids[0])

// Check if emptyArray is empty
if (response.data.length === 0) {
Loader()
all_results.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:48px;color:#79a1de">No Shipping</h1>`


} else {
Loader()
     //SHOW SHIPPING
     response.data.map((item)=> shipping.push(item))

//     var shippingOrders = response.data.filter((item)=> item.travelbooking_id === false)

   all_results.innerHTML=response.data.map((table)=>{


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



if(table.travelbooking_id !== false){
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

var my_state_content = table.disagree === true ? `<div class="badge1 state" style="display:flex;background: red;color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">Rejected</div>` : `<div class="badge1 state" style="background:${color};border:1px solid ${color};color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>`


 return ` <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">

                                               <div class="room-item shadow overflow-hidden" style="border-radius:30px;position: relative;">

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
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
                                    <span onclick="my_bookingPage_shipping(${table.travelbooking_id[0]},'${table.booking_type}',${table.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none;" class="mt-2  py-2">More info ></span>
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

     }).join("")

   my_shipping_offers_results.innerHTML=response.data.map((table)=>{


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



if(table.travelbooking_id === false){
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


 return ` <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">

                                               <div class="room-item shadow overflow-hidden" style="border-radius:30px;position: relative;">

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
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
                                    <span onclick="my_bookingPage_shipping(${table.travelbooking_id[0]},'${table.booking_type}',${table.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none;" class="mt-2  py-2">More info ></span>
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

     }).join("")
}







            })
          .catch(function(error) {
              console.log(error);
          })

},2000)



  } )

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


//GO TO SHIPPING TRAVEL PAGE
function my_bookingPage_shipping(id,type,my_shipping_id){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)
localStorage.setItem("travel_id_detail",id)
localStorage.setItem("shipping_id_detail",my_shipping_id)

window.location.href = "/my/shipping/details"

console.log(id,type)
}


function seeLuggage(luggage_ids){
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


var shipping = [];

//LiVE SEARCH
function liveSearchOrders(value){
  var searchInputOrders = document.getElementById('searchInputOrders').value;
var all_results= document.getElementById('all_results');
 all_results.style.display = "none";
var search_row_orders = document.getElementById('search_row_orders');

if(searchInputOrders === "all"){
 all_results.style.display = "flex";
 search_row_orders.style.display = "none";

}else{
 search_row_orders.style.display = "flex";

// Perform search
  var filteredShipping = shipping.filter((item)=> item.state.toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredShipping);
  if(searchInputOrders !== ""){

//const my_search_info = document.getElementById('search_row');
if(filteredShipping.length === 0){
search_row_orders.innerHTML= `<h1 style="text-align:center;margin-top:100px;margin-bottom:200px">No Result!!</h1>`
}else{
  search_row_orders.innerHTML = filteredShipping.map((table)=>{


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


if(table.travelbooking_id !== false){

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

     setTimeout(()=>{
          if(table.disagree === true){
     document.getElementById("disagree_badge").innerHTML = `<div class="badge1 state" style="display:flex;border:1px solid red;color:red;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">Cancelled</div>`
     }
     },1000)

        //GET LUGGAGE FOR SHIPPING


 return `<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">

                                               <div class="room-item shadow overflow-hidden" style="border-radius:30px;position: relative;">

                                               <div id="disagree_badge" class="container_badge" style="position: absolute;top: -30px;right: -20px;height: 50px; width: 250px">
                                               <div class="badge1 state" style="background:${color};border:1px solid ${color};color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>
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
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
                                    <span onclick="my_bookingPage_shipping(${table.travelbooking_id[0]},'${table.booking_type}',${table.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none;" class="mt-2  py-2">More info ></span>
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


     }).join("")

}


}


}






}

function liveSearchOffers(value){
  var searchInputOffers = document.getElementById('searchInputOffers').value;
var my_shipping_offers_results= document.getElementById('my_shipping_offers_results');
 my_shipping_offers_results.style.display = "none";
var search_info = document.getElementById('search_row_offers');

if(searchInputOffers === "all"){
 all_results.style.display = "flex";
 search_row_offers.style.display = "none";

}else{
 search_row_offers.style.display = "flex";

// Perform search
  var filteredShipping = shipping.filter((item)=> item.state.toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredShipping);
  if(searchInputOffers !== ""){

//const my_search_info = document.getElementById('search_row');
if(filteredShipping.length === 0){
search_row_offers.innerHTML= `<h1 style="text-align:center;margin-top:100px;margin-bottom:200px">No Result!!</h1>`
}else{
  search_row_offers.innerHTML = filteredShipping.map((table)=>{


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


if(table.travelbooking_id === false){

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

     setTimeout(()=>{
          if(table.disagree === true){
     document.getElementById("disagree_badge").innerHTML = `<div class="badge1 state" style="display:flex;border:1px solid red;color:red;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">Cancelled</div>`
     }
     },1000)

        //GET LUGGAGE FOR SHIPPING


 return `<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">

                                               <div class="room-item shadow overflow-hidden" style="border-radius:30px;position: relative;">

                                               <div id="disagree_badge" class="container_badge" style="position: absolute;top: -30px;right: -20px;height: 50px; width: 250px">
                                               <div class="badge1 state" style="background:${color};border:1px solid ${color};color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>
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
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
                                    <span onclick="my_bookingPage_shipping(${table.travelbooking_id[0]},'${table.booking_type}',${table.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none;" class="mt-2  py-2">More info ></span>
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


     }).join("")

}


}


}






}



function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}
