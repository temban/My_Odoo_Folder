     var authorization = localStorage.getItem("authorization")

 var confirmation_code



//My shippings
var shipping_ids = localStorage.getItem("personal_shipping_ids")

 axios.get(`/api/v1/read/m1st_hk_roadshipping.shipping?ids=${shipping_ids}`, {
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
my_all_results.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:40px;color:#79a1de">No Expeditions On My Travel</h1>`
} else {
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
var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'Received'


     var border = table.state === "rejected" ? 'solid red 1px' :'solid blue 1px'

     localStorage.setItem("qrcode",table.name)
     var displayReject = table.state === "pending" ? 'inline' :'none';
     var displayChatButton2 = table.state === "received" || table.msg_shipping_accepted === false ? 'none' :'inline';
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


 if(table.state ==="rejected"){
  return ``

 }else{
 return `    <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">

        <div class="room-item shadow overflow-hidden" style="border-radius:30px;position: relative">

        <div class="container_badge" style="position: absolute;top: -30px;right: -20px;height: 50px; width: 250px">
         <div class="badge1" style="border:1px solid ${color};color:${color};position: relative;display: flex;justify-content: center;top: 50px;right: -50px;box-shadow: 1px 1px 15px ${color};font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>
         </div>

              <div class="mt-4" style="padding-left:10px;padding-right:20px">
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

                <div style="display: flex;justify-content:space-between;margin-top:20px">

                    <button onclick="storeBookingInfos(${table.id})" class="btn px-4" style="background:#217aff;color:white;border-radius:5px;font-size:12px;display:${displayChatButton2}">Negotiate <i class='fas fa-comment-alt' style='color:white'></i></button>
                    <button class="btn px-4" onclick="seeLuggage1(${table.luggage_ids[0]})" style="background: #000000;color:white;border-radius:5px;font-size:12px;" data-bs-toggle="modal" data-bs-target="#exampleModal">Luggage Info</button>

                </div>

                <div style="display: flex;justify-content:end;">
                 <div style="display: flex;justify-content:start;gap: 10px">
                    <span onclick="my_bookingPage_shipping(${table.travelbooking_id[0]},'${table.booking_type}',${table.id})" style="cursor: pointer;text-decoration: none;font-weight:700;color:#217aff;margin-top:30px;font-size:12px" class="mt-2 py-2">More info ></span>
                </div>
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

</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary"
        data-bs-dismiss="modal">Close</button>
</div>
</div>
</div>
</div>
<!-- MODAL LUGGAGE END -->`
 }


     }).join("")
}


            })
          .catch(function(error) {
              console.log(error);
          })



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

//GO TO SHIPPING TRAVEL PAGE
function my_bookingPage_shipping(id,type,my_shipping_id){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)
localStorage.setItem("travel_id_detail",id)
localStorage.setItem("shipping_id_detail",my_shipping_id)

window.location.href = "/my/traveler/shipping/details"

console.log(id,type)
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
function liveSearch3(value){
  var searchInput1 = document.getElementById('searchInput3').value;
var all_results= document.getElementById('my_all_results');
 all_results.style.display = "none";
var search_info = document.getElementById('search_row');

if(searchInput1 === "all"){
 all_results.style.display = "flex";
 search_info.style.display = "none";

}else{
 search_info.style.display = "flex";

// Perform search
  var filteredShipping = shipping.filter((item)=> item.state.toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredShipping);
  if(searchInput1 !== ""){

const my_search_info = document.getElementById('search_row');
if(filteredShipping.length === 0){
my_search_info.innerHTML= `<h1 style="text-align:center;margin-top:100px;margin-bottom:200px">No Result!!</h1>`
}else{
  search_info.innerHTML = filteredShipping.map((table)=>{

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
var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'Received'


     var border = table.state === "rejected" ? 'solid red 1px' :'solid blue 1px'

     localStorage.setItem("qrcode",table.name)
     var displayReject = table.state === "pending" ? 'inline' :'none';
     var displayChatButton2 = table.state === "received" || table.msg_shipping_accepted === false ? 'none' :'inline';
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


 if(table.state ==="rejected"){
  return ``

 }else{
 return `    <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">

        <div class="room-item shadow overflow-hidden" style="border-radius:30px;position: relative">

        <div class="container_badge" style="position: absolute;top: -30px;right: -20px;height: 50px; width: 250px">
         <div class="badge1" style="border:1px solid ${color};color:${color};position: relative;display: flex;justify-content: center;top: 50px;right: -50px;box-shadow: 1px 1px 15px ${color};font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>
         </div>

              <div class="mt-4" style="padding-left:10px;padding-right:20px">
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

                <div style="display: flex;justify-content:space-between;margin-top:20px">

                    <button onclick="storeBookingInfos(${table.id})" class="btn px-4" style="background:#217aff;color:white;border-radius:5px;font-size:12px;display:${displayChatButton2}">Negotiate <i class='fas fa-comment-alt' style='color:white'></i></button>
                    <button class="btn px-4" onclick="seeLuggage1(${table.luggage_ids[0]})" style="background: #000000;color:white;border-radius:5px;font-size:12px;" data-bs-toggle="modal" data-bs-target="#exampleModal">Luggage Info</button>

                </div>

                <div style="display: flex;justify-content:end;">
                 <div style="display: flex;justify-content:start;gap: 10px">
                    <span onclick="my_bookingPage_shipping(${table.travelbooking_id[0]},'${table.booking_type}',${table.id})" style="cursor: pointer;text-decoration: none;font-weight:700;color:#217aff;margin-top:30px;font-size:12px" class="mt-2 py-2">More info ></span>
                </div>
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

</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary"
        data-bs-dismiss="modal">Close</button>
</div>
</div>
</div>
</div>
<!-- MODAL LUGGAGE END -->`
 }


     }).join("")

}


}


}






}
