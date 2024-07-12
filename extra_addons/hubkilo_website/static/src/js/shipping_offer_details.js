var authorization = localStorage.getItem("authorization")


var travel_id_detail = localStorage.getItem("travel_id_detail")
var shipping_id_detail = localStorage.getItem("shipping_id_detail")

function shippingInfo(){
 axios.get(`/api/v1/read/m1st_hk_roadshipping.shipping?ids=${shipping_id_detail}`, {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       })
       .then(response => {
 console.log("my reservations............")
  console.log(response.data)

setTimeout(()=>{
Loader()
},2000)

     const all_results = document.getElementById('all_results')
     var luggage_ids =response.data.map((table)=>table.luggage_ids[0])

// Check if emptyArray is empty
if (response.data.length === 0) {

all_results.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:48px;color:#79a1de">No Shipping</h1>`

all_results.innerHTML} else {
     //SHOW SHIPPING
 response.data.map((table)=>{

localStorage.setItem("myTravelBookingId",table.travelbooking_id[0])
let datetime = table.create_date;
let time = datetime.split(" ")[1];

     localStorage.setItem("qrcode",table.name)
     var displayTravelListButton = table.travelbooking_id === false ? 'inline' :'none';
     var displayRated = table.state === "received" && table.is_rated === false   ? 'inline' :'none';
     var displayTrans = table.state === "rejected" || table.state === "pending"  ? 'inline' :'none'
     var others =table.state === "pending" ? 'inline' :'none'

var color = table.state === "rejected" && 'RGB(255,0,0)' || table.state === "received" && '#4472C4' || table.state === "accepted" && 'RGB(255,192,0)' || table.state === "paid" && 'RGB(0,176,80)'|| table.state === "pending" && 'RGB(165,165,165)'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'RGB(112,48,160)'
var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'Received'

     var border = table.state === "rejected" ? 'solid red 1px' :'solid blue 1px'


     setTimeout(()=>{
          if(table.disagree === true){
     document.getElementById("disagree_badge").innerHTML = `<div class="badge1 state" style="display:flex;background:red;color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">Cancelled</div>`
     }
     },1000)

//SHIPPING DETAILS
document.getElementById("shipping_details_display_name_offer").innerHTML = `${table.display_name}`
document.getElementById("shipping_details_display_name2_offer").innerHTML = `${table.display_name}`
document.getElementById("shipping_details_shipping_date_offer").innerHTML = `${table.shipping_date}`
document.getElementById("shipping_details_shipping_date_offer").innerHTML = `${table.shipping_date}`
document.getElementById("shipping_details_receiver_partner_id_offer").innerHTML = `${table.receiver_partner_id[1]}`
document.getElementById("shipping_details_receiver_email_offer").innerHTML = `${table.receiver_email}`
document.getElementById("shipping_details_receiver_address_offer").innerHTML = `${table.receiver_address}`
document.getElementById("shipping_details_receiver_phone_offer").innerHTML = `${table.receiver_phone}`

//SHIPPING BUTTONS
//
//document.getElementById("shipping_details_action_buttons_offer").innerHTML = ` <a href="/add/new/travel" class="btn btn-info"  style="text-transform: capitalize;display:${displayTravelListButton};font-weight:600;font-size:12px" >
//                                     Create A Travel
//                                   </a>
//
//                                   <button class="btn btn-primary"  style="text-transform: capitalize;display:${displayTravelListButton};font-weight:600;font-size:12px" href="#" data-bs-toggle="modal" data-bs-target="#travelList">
//                                     Add A Travel
//                                   </button>`



document.getElementById("disagree_badge_offer").innerHTML = `<div class="badge1 state" style="background:${color};border:1px solid ${color};color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>`




     localStorage.setItem("average_rating",table.average_rating)

//console.log("rating",table.is_rated)


        //GET LUGGAGE FOR SHIPPING


// return `
//      `

     }).join("")

   //SHOW SHPPING OFFER TRAVEL DETAILS
   response.data.map((myItem)=>{
      if(myItem.travelbooking_id === false){
      ///D DATE
let datetime = myItem.shipping_departure_date;
let date = datetime.split(" ")[0];
let dtime = datetime.split(" ")[1];
let date1 = new Date(date);

let options = { day: 'numeric', month: 'long', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options);

//aDATE
let adatetime = myItem.shipping_arrival_date;
let adate = adatetime.split(" ")[0];
let atime = adatetime.split(" ")[1];

//DEPARTURE CITY
let str = myItem.shipping_departure_city_id[1];
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = myItem.shipping_arrival_city_id[1];
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);


//TRAVEL INFORMATION
document.getElementById("shipping_details_offer_d_date").innerHTML = `${date}`
document.getElementById("shipping_details_offer_d_time").innerHTML = `${dtime}`
document.getElementById("shipping_details_offer_a_date").innerHTML = `${adate}`
document.getElementById("shipping_details_offer_a_time").innerHTML = `${atime}`


document.getElementById("shipping_details_offer_d_city").innerHTML = `${departure_city}`
document.getElementById("shipping_details_offer_d_country").innerHTML = `${departure_country}`
document.getElementById("shipping_details_offer_a_city").innerHTML = `${arrival_city}`
document.getElementById("shipping_details_offer_a_country").innerHTML = `${arrival_country}`



//SHIPPING DETAILS
//document.getElementById("shipping_details_display_offer_name").innerHTML = `${table.display_name}`
//document.getElementById("shipping_details_display_offer_name2").innerHTML = `${table.display_name}`
//document.getElementById("shipping_details_shipping_offer_date").innerHTML = `${table.shipping_date}`
//document.getElementById("shipping_details_shipping_offer_date").innerHTML = `${table.shipping_date}`
//document.getElementById("shipping_details_receiver_offer_partner_id").innerHTML = `${table.receiver_partner_id[1]}`
//document.getElementById("shipping_details_receiver_offer_email").innerHTML = `${table.receiver_email}`
//document.getElementById("shipping_details_receiver_offer_address").innerHTML = `${table.receiver_address}`
//document.getElementById("shipping_details_receiver_offer_phone").innerHTML = `${table.receiver_phone}`


      }



   }).join("")

   setTimeout(()=>{
   availableTravel()
},2000)
}







            })
          .catch(function(error) {
              console.log(error);
          })
}

setTimeout(()=>{
shippingInfo()
},1500)



function TravelInfo(){

axios.get(`/api/v1/read/m1st_hk_roadshipping.travelbooking?ids=${travel_id_detail}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        },
      })
    .then((response) => {

    localStorage.setItem("Bookings",JSON.stringify(response.data) )

    response.data.map((myItem)=>{
    console.log(myItem)
    localStorage.setItem("travelbooking_id",myItem.id)
      localStorage.setItem("traveler_info_id",myItem.partner_id[0])
      localStorage.setItem("traveler_info_name",myItem.partner_id[1])

///D DATE
let datetime = myItem.departure_date;
let date = datetime.split(" ")[0];
let dtime = datetime.split(" ")[1];
let date1 = new Date(date);

let options = { day: 'numeric', month: 'long', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options);

//aDATE
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



    })

    })
    .catch(function (error) {
      console.log(error);
    });
}
setInterval(TravelInfo,1500)


function availableTravel(){
console.log("MY TRAVEL")
let data2 = '{\r\n    "jsonrpc":"2.0"\r\n}';

    axios.get('/front_end/road/travels', {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       data : data2
       })
       .then(response => {
       console.log("search......")
       console.log(response.data)
           const travel_view_list_offer = document.getElementById('travel_view_list_offer');
           response.data.travels.map((item)=> voyages1.push(item))


           async function checkProfilePicStatus(partnerId) {
     try {
      const response = await axios.get(`/check_profile_pic/${partnerId}`);
      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }

 async function generateVoyageHTML(item) {
    // Your existing code here...
var my_user_id = localStorage.getItem("user_id")

    var display = item.booking_type === "road" ? "none" : "flex"
    var displayAir = item.booking_type === "air" ? "none" : "flex"
    var displayExpedition = item.partner_id[0] === Number(my_user_id) ? "none" : "flex"
    var displayExpeditionImage

//DEPARTURE CITY
let str = item.departure_city_id[1];
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = item.arrival_city_id[1];
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);

//DATE
let datetime = item.departure_date;
let date = datetime.split(" ")[0];
let date1 = new Date(date);

let options = { day: 'numeric', month: 'short', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();

console.log(formattedDate)
    // Check profile picture status
    const profilePicStatus = await checkProfilePicStatus(item.partner_id[0]);
    console.log("my",profilePicStatus); // Will be `true` or `false`

    const displayProfile =  profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    // Your existing code here...
    if (item.state === 'negotiating' && Number(my_user_id) === item.partner_id[0]) {
      return `<div class="my-2 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div id="travelForOffer${item.id}" onclick="selectTravelForOffer(${item.id})" class="room-item shadow overflow-hidden" style="border-radius:30px">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:14px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:700"> ${formattedDate}</h5>

                                </div>

                            </div>

                        </div>
                    </div>`;
    } else {
      return ``;
    }
  }

  async function displayVoyages() {
    try {
    if(response.data.travels.length === 0){
    travel_view_list_offer.innerHTML = `<h2 style='text-align:center;margin-top:100px;margin-bottom:200px'>No Travels ...</h2>`
    }else{
          const voyageHTMLPromises = response.data.travels.map((item) => generateVoyageHTML(item));
      const voyageHTMLs = await Promise.all(voyageHTMLPromises);
      travel_view_list_offer.innerHTML = voyageHTMLs.join('');
    }

    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

 displayVoyages();

            })
          .catch(function(error) {
              console.log(error);
          })
}

setTimeout(()=>{
availableTravel()
},2000)

var selectedTravelIds = []
function selectTravelForOffer(id){
var travelForOffer = document.getElementById(`travelForOffer${id}`)
var isSelected = travelForOffer.classList.contains("selected");


 if (isSelected) {
     travelForOffer.classList.remove("selected"); // Remove the "selected" class if it's present
     var index = selectedTravelIds.indexOf(id);
     selectedTravelIds.splice(index, 1);

     console.log(selectedTravelIds);

                }else{

                if(selectedTravelIds.length > 0){
                alert("You can not select more than one travel to add on a shipping offer")
                 }else{
                   selectedTravelIds.push(id)
                  travelForOffer.classList.add("selected"); // Remove the "selected" class if it's present
                  console.log(selectedTravelIds)
                    }

                }
}

function addTravelToShippingOffer(){

if(selectedTravelIds.length === 0){
alert("No travel has been selected, Please select a travel")
}else{
var shipping_id_detail = localStorage.getItem("shipping_id_detail")
  var raw = JSON.stringify({
   "travelbooking_id": Number(selectedTravelIds[0]),
           });

 let config = {
   method: 'put',
   maxBodyLength: Infinity,
   url:`/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${shipping_id_detail}`,
   headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
   }
 };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
   window.location.href="/my/travels"
//   window.location.href="/my/shipping"
 })
 .catch((error) => {
   console.log(error);
 });

}


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


 //PARTIR A MODIFIER BOKING
 function updateShipping(id){
 window.location.href = "/modifier_ma_reservation/" + id.toString()
 }

 var voyages1 = []

  //Transférer LA RESERVATION ROAD
    function Transferer(id,type,travelbooking_id){
    localStorage.setItem("shippingId",id)
    localStorage.setItem("shippingtype",type)

let data2 = '{\r\n    "jsonrpc":"2.0"\r\n}';

    axios.get('/front_end/road/travels', {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       data : data2
       })
       .then(response => {
       console.log("search......")
       console.log(response.data)
           var search_info1 = document.getElementById('search_row1');
           response.data.travels.map((item)=> voyages1.push(item))


           async function checkProfilePicStatus(partnerId) {
     try {
      const response = await axios.get(`/check_profile_pic/${partnerId}`);
      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }

 async function generateVoyageHTML(item) {
    // Your existing code here...
var my_user_id = localStorage.getItem("user_id")

    var display = item.booking_type === "road" ? "none" : "flex"
    var displayAir = item.booking_type === "air" ? "none" : "flex"
    var displayExpedition = item.partner_id[0] === Number(my_user_id) ? "none" : "flex"
    var displayExpeditionImage
     var background = travelbooking_id === item.id ? "solid 3px #217aff" : ""
     var hideButtonTrans = travelbooking_id === item.id ? "none" : "inline"


//DEPARTURE CITY
let str = item.departure_city_id[1];
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = item.arrival_city_id[1];
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);

//DATE
let datetime = item.departure_date;
let date = datetime.split(" ")[0];
let date1 = new Date(date);

let options = { day: 'numeric', month: 'short', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();

console.log(formattedDate)
    // Check profile picture status
    const profilePicStatus = await checkProfilePicStatus(item.partner_id[0]);
    console.log("my",profilePicStatus); // Will be `true` or `false`

    const displayProfile =  profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    // Your existing code here...
    if (item.state === 'negotiating') {
      return `<div class="my-2 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;border:${background}">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:14px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:700"> ${formattedDate}</h5>

                                </div>
                                <div class="d-flex justify-content-center">
                               <button onclick="completeTransfer(${item.id},'${item.booking_type}',${item.partner_id[0]})" style="display:${hideButtonTrans}" class="btn btn-primary">Transfer</button>
                                </div>
                            </div>

                        </div>
                    </div>`;
    } else {
      return ``;
    }
  }

  async function displayVoyages() {
    try {
    if(response.data.travels.length === 0){
    search_info1.innerHTML = `<h2 style='text-align:center;margin-top:100px;margin-bottom:200px'>No Travels ...</h2>`
    }else{
          const voyageHTMLPromises = response.data.travels.map((item) => generateVoyageHTML(item));
      const voyageHTMLs = await Promise.all(voyageHTMLPromises);
      search_info1.innerHTML = voyageHTMLs.join('');
    }

    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

 displayVoyages();


//  search_info1.innerHTML = response.data.map((item)=>{
// var my_user_id = localStorage.getItem("user_id")
//
//     var display = item.booking_type === "road" ? "none" : "flex"
//     var displayAir = item.booking_type === "air" ? "none" : "flex"
//     var displayExpedition = item.partner_id[0] === Number(my_user_id) || travelbooking_id === item.id ? "none" : "flex"
//     var background = travelbooking_id === item.id ? "solid 3px #217aff" : ""
//     var hideButtonTrans = travelbooking_id === item.id ? "none" : "inline"
//
////DEPARTURE CITY
//let str = item.departure_city_id[1];
//let parts = str.split(" (");
//let departure_city = parts[0];
//let departure_country = parts[1].slice(0, -1);
//
////ARRIVAL CITY
//let str1 = item.arrival_city_id[1];
//let parts1 = str1.split(" (");
//let arrival_city = parts1[0];
//let arrival_country = parts1[1].slice(0, -1);
//
////DATE
//let datetime = item.departure_date;
//let date = datetime.split(" ")[0];
//let date1 = new Date(date);
//
//let options = { day: 'numeric', month: 'long', year: 'numeric' };
//let formattedDate = date1.toLocaleDateString('en-GB', options);
//
// if(item.state==="negotiating"){
//  return `<div class="col-12 col-md-6 col-lg-4 mt-3" >
//                             <div class="my_card" style="border:${background}">
//                                 <div class="d-flex justify-content-between">
//                                    <div style="display: flex;gap:2px;align-items: center;">
//                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
//                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
//                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
//                                    <p style="white-space: nowrap;overflow: hidden;;font-size:12px;text-overflow: ellipsis;width:90px" class="heading text-center">${departure_country}</p>
//                                    </div>
//                                    <div style="display: flex;align-items: center;">
//                                <i class='fas fa-arrow-right' style='font-size:24px;'></i>
//                                    </div>
//                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
//                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${arrival_city}</h6>
//                                    <p style="white-space: nowrap;overflow: hidden;font-size:12px;text-overflow: ellipsis;width:90px" class="heading text-center">${arrival_country}</p>
//                                   </div>
//                                    </div>
//                                </div>
//
//
//                                 <div class="type">
//                                 <span  style='font-size:20px'>${formattedDate}</span>
//                                 </div>
//                                 <div class="card_country1">
//                                        <button onclick="completeTransfer(${item.id},'${item.booking_type}',${item.partner_id[0]})" style="display:${hideButtonTrans}" class="btn btn-primary">Transfer</button>
//                                 </div>
//                             </div>
//
//                            </div>`
// }else{
// return ``
// }
//
//    } ).join("")
            })
          .catch(function(error) {
              console.log(error);
          })




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

//  window.location.href="/my/shipping"
shippingInfo()
})
.catch((error) => {
  console.log(error);
});

}


   function completeTransfer(currentTravelId){
 console.log(currentTravelId)
 var shippingId = localStorage.getItem("shippingId")
 // Confirm
var result = confirm("Do you really want to transfer your shipping?");
if (result) {
  var raw = JSON.stringify({
   "travelbooking_id": Number(currentTravelId),
   "state": "pending",
   "disagree": false
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
   window.location.href="/my/shipping"
 })
 .catch((error) => {
   console.log(error);
 });
} else {
}

unmark_traveler_disagree(shippingId)




   }

function DeleteMyReserve(id){

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/m1st_hk_roadshipping.shipping/set_to_rejected/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  shippingInfo()
})
.catch((error) => {
  console.log(error);
});

}

 function ProceedPayment(id){
 var save_btn = document.querySelector(".save-btn")
   save_btn.innerHTML = " <div class='loader'></div>"
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
      setTimeout(()=>{
      save_btn.innerHTML = "Done !"
      save_btn.style = "background:#f1f5f4; color:#333; pointer-events:none"
  window.location.href=`/my/invoices/${invoice.move_id[0]}`
    },2000)
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

 function ViewCode(travel_code,id){
 var code = travel_code+"-"+id
 var code_id = document.getElementById("code_id")
 code_id.innerHTML = `${code}`

  var qrCodeDiv = document.getElementById('qrcode');
    qrCodeDiv.innerHTML = " "
     var qrCode = new QRCode(qrCodeDiv, {
       text: code, // Specify the content for the QR code
       width: 200, // Set the width and height of the QR code
       height: 200
     });
 }


function rateNow(id){

 var user_id = localStorage.getItem("user_id")
 var traveler_info_id = localStorage.getItem("traveler_info_id")
  var ratingValue = localStorage.getItem("ratingValue")
var rating_text = document.getElementById("rating_text")

if(ratingValue === null || ratingValue === undefined || rating_text.value.trim() === ""){
alert("Select a rate star and comment before rating")
}else{

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/res.partner.rating?values={\n  "rater_id": ${Number(user_id)},\n  "rated_id": ${Number(traveler_info_id)},\n  "rating": "${ratingValue}", \n    "comment":"${rating_text.value}"\n}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  if(response.data){

    var raw = JSON.stringify({
   "is_rated": true
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
   console.log(JSON.stringify(response.data));
//   window.location.href="/my/shipping"
shippingInfo()
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
}
function handleClick(value) {
  localStorage.setItem("ratingValue",value)
}

function seePartnerRatings(){
var traveler_info_id = localStorage.getItem("traveler_info_id")
var rating_view = document.getElementById("rating_view")

let data = '{\r\n    "jsonrpc": 2.0\r\n}';

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/partner/get_ratings?rated_partner_id=${traveler_info_id}`,
  data : data
};

axios.request(config)
.then((response) => {

  if(response.data.ratings.length === 0){
  rating_view.innerHTML = "<h5 style='text-align:center'> No Rating Yet, be the first to rate!</h5>"

  }else{
    rating_view.innerHTML = response.data.ratings.map((rating)=>{

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
    <div class="row" style="border-radius:0px 30px 30px 30px;background-color: rgb(70, 144, 190);padding:1rem;display: flex;justify-content: space-between;">
      <div class="col-lg-9 col-sm-12" style="display: flex;align-items: center;gap:30px">
        <img src=${rater_image} alt="Your Image" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" />
        <div >
    <h5 style="font-weight:700;font-size:16px">${rating.rater_name}</h5>
    <p class="col-12" style="margin-top:10px ;color:white;">${rating.comment}</p>
        </div>
      </div>

        <div id="ratingStar5" class="col-md-3 col-sm-12" style="display:${ratingStar5};gap: 5px;align-items: center;justify-content:end">
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
        </div>

        <div id="ratingStar1" class="col-md-3 col-sm-12" style="display:${ratingStar1};gap: 5px;align-items: center;justify-content:end">
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
        </div>

        <div id="ratingStar2" class="col-md-3 col-sm-12" style="display:${ratingStar2};gap: 5px;align-items: center;justify-content:end">
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
        </div>

        <div id="ratingStar3" class="col-md-3 col-sm-12" style="display:${ratingStar3};gap: 5px;align-items: center;justify-content:end">
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
        </div>

        <div id="ratingStar4" class="col-md-3 col-sm-12" style="display:${ratingStar4};gap: 5px;align-items: center;justify-content:end">
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
          <i class="fas fa-star" style="color: gold;;font-size:18x"></i>
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


//LiVE SEARCH departure
function liveSearch(value){
  var searchInput1 = document.getElementById('search_depart').value;
  var searchInput2 = document.getElementById('search_arrive').value;
var all_results= document.getElementById('search_row1');
var travel_view_list_offer= document.getElementById('travel_view_list_offer');
 all_results.style.display = "none";
 travel_view_list_offer.style.display = "none";
var search_info = document.getElementById('search_row');



 // Perform search
  var filteredCities = voyages1.filter((item)=> item.departure_city_id[1].toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredCities);
  localStorage.setItem("filteredCities",JSON.stringify(filteredCities))




if(searchInput1 !== ""){

const my_search_info = document.getElementById('search_row');
if(filteredCities.length === 0){
my_search_info.innerHTML= `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
}
else{

//verify image
async function checkProfilePicStatus(partnerId) {
     try {
      const response = await axios.get(`/check_profile_pic/${partnerId}`);
      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }

 async function generateVoyageHTML(item) {

 var travelbooking_id = Number(localStorage.getItem("myTravelBookingId"))
    // Your existing code here...
var my_user_id = localStorage.getItem("user_id")

    var display = item.booking_type === "road" ? "none" : "flex"
    var displayAir = item.booking_type === "air" ? "none" : "flex"
    var displayExpedition = item.partner_id[0] === Number(my_user_id) ? "none" : "flex"
    var displayExpeditionImage
     var background = travelbooking_id === item.id ? "solid 3px #217aff" : ""
     var hideButtonTrans = travelbooking_id === item.id ? "none" : "inline"


//DEPARTURE CITY
let str = item.departure_city_id[1];
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = item.arrival_city_id[1];
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);

//DATE
let datetime = item.departure_date;
let date = datetime.split(" ")[0];
let date1 = new Date(date);

let options = { day: 'numeric', month: 'short', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();

console.log(formattedDate)
    // Check profile picture status
    const profilePicStatus = await checkProfilePicStatus(item.partner_id[0]);
    console.log("my",profilePicStatus); // Will be `true` or `false`

    const displayProfile =  profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    // Your existing code here...
    if (item.state === 'negotiating') {
      return `<div class="my-2 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;border:${background}">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:14px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:700"> ${formattedDate}</h5>

                                </div>
                                <div class="d-flex justify-content-center">
                               <button onclick="completeTransfer(${item.id},'${item.booking_type}',${item.partner_id[0]})" style="display:${hideButtonTrans}" class="btn btn-primary">Transfer</button>
                                </div>
                            </div>

                        </div>
                    </div>`;
    } else {
      return ``;
    }


  }

  async function displayVoyages() {
    try {
      const voyageHTMLPromises = filteredCities.map((item) => generateVoyageHTML(item));
      const voyageHTMLs = await Promise.all(voyageHTMLPromises);
      search_info.innerHTML = voyageHTMLs.join('');
    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

displayVoyages()

}

}
}

//LiVE SEARCH arrival
function liveSearch2(value){
  var searchInput1 = document.getElementById('search_depart').value;
  var searchInput2 = document.getElementById('search_arrive').value;
var all_results= document.getElementById('search_row1');
var travel_view_list_offer= document.getElementById('travel_view_list_offer');
 all_results.style.display = "none";
 travel_view_list_offer.style.display = "none";
var search_info = document.getElementById('search_row');

// // Perform search
  // Log search results to the console

 var filteredCities1 = JSON.parse(localStorage.getItem("filteredCities"))




if(filteredCities1 === null){
var filteredCities = voyages1.filter((item)=> item.arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));

const my_search_info = document.getElementById('search_row');
if(filteredCities.length === 0){
my_search_info.innerHTML= `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
}
else{

//verify image
async function checkProfilePicStatus(partnerId) {
     try {
      const response = await axios.get(`/check_profile_pic/${partnerId}`);
      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }

}

}else if(searchInput2 !== ""){
console.log("something in input arrival")
var filteredCities = filteredCities1.filter((item)=> item.arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));

const my_search_info = document.getElementById('search_row');

if(filteredCities.length === 0){
my_search_info.innerHTML= `<h1 style="text-align:center">No Result!!</h1>`
}else{

  var filteredCities = filteredCities1.filter((item)=> item.arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));


//verify image
async function checkProfilePicStatus(partnerId) {
     try {
      const response = await axios.get(`/check_profile_pic/${partnerId}`);
      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }

 async function generateVoyageHTML(item) {

 var travelbooking_id = Number(localStorage.getItem("myTravelBookingId"))
    // Your existing code here...
var my_user_id = localStorage.getItem("user_id")

    var display = item.booking_type === "road" ? "none" : "flex"
    var displayAir = item.booking_type === "air" ? "none" : "flex"
    var displayExpedition = item.partner_id[0] === Number(my_user_id) ? "none" : "flex"
    var displayExpeditionImage
     var background = travelbooking_id === item.id ? "solid 3px #217aff" : ""
     var hideButtonTrans = travelbooking_id === item.id ? "none" : "inline"


//DEPARTURE CITY
let str = item.departure_city_id[1];
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = item.arrival_city_id[1];
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);

//DATE
let datetime = item.departure_date;
let date = datetime.split(" ")[0];
let date1 = new Date(date);

let options = { day: 'numeric', month: 'short', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();

console.log(formattedDate)
    // Check profile picture status
    const profilePicStatus = await checkProfilePicStatus(item.partner_id[0]);
    console.log("my",profilePicStatus); // Will be `true` or `false`

    const displayProfile =  profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    // Your existing code here...
    if (item.state === 'negotiating') {
      return `<div class="my-2 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;border:${background}">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:14px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:700"> ${formattedDate}</h5>

                                </div>
                                <div class="d-flex justify-content-center">
                               <button onclick="completeTransfer(${item.id},'${item.booking_type}',${item.partner_id[0]})" style="display:${hideButtonTrans}" class="btn btn-primary">Transfer</button>
                                </div>
                            </div>

                        </div>
                    </div>`;
    } else {
      return ``;
    }

  }

  async function displayVoyages() {
    try {
      const voyageHTMLPromises = filteredCities.map((item) => generateVoyageHTML(item));
      const voyageHTMLs = await Promise.all(voyageHTMLPromises);
      search_info.innerHTML = voyageHTMLs.join('');
    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

displayVoyages()

}

}
}

//LiVE SEARCH type
function liveSearch3(value){
  var searchInput3 = document.getElementById('searchInput3').value;
  var searchInput2 = document.getElementById('search_arrive').value;
var all_results= document.getElementById('search_row1');
var travel_view_list_offer= document.getElementById('travel_view_list_offer');
 all_results.style.display = "none";
 travel_view_list_offer.style.display = "none";
var search_info = document.getElementById('search_row');



 // Perform search
  var filteredCities = voyages1.filter((item)=> item.booking_type.toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredCities);
  localStorage.setItem("filteredCities",JSON.stringify(filteredCities))




if(searchInput3 !== ""){

const my_search_info = document.getElementById('search_row');
if(filteredCities.length === 0){
my_search_info.innerHTML= `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
}
else{

//verify image
async function checkProfilePicStatus(partnerId) {
     try {
      const response = await axios.get(`/check_profile_pic/${partnerId}`);
      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }

 async function generateVoyageHTML(item) {
 var travelbooking_id = Number(localStorage.getItem("myTravelBookingId"))
    // Your existing code here...
var my_user_id = localStorage.getItem("user_id")

    var display = item.booking_type === "road" ? "none" : "flex"
    var displayAir = item.booking_type === "air" ? "none" : "flex"
    var displayExpedition = item.partner_id[0] === Number(my_user_id) ? "none" : "flex"
    var displayExpeditionImage
     var background = travelbooking_id === item.id ? "solid 3px #217aff" : ""
     var hideButtonTrans = travelbooking_id === item.id ? "none" : "inline"


//DEPARTURE CITY
let str = item.departure_city_id[1];
let parts = str.split(" (");
let departure_city = parts[0];
let departure_country = parts[1].slice(0, -1);

//ARRIVAL CITY
let str1 = item.arrival_city_id[1];
let parts1 = str1.split(" (");
let arrival_city = parts1[0];
let arrival_country = parts1[1].slice(0, -1);

//DATE
let datetime = item.departure_date;
let date = datetime.split(" ")[0];
let date1 = new Date(date);

let options = { day: 'numeric', month: 'short', year: 'numeric' };
let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();

console.log(formattedDate)
    // Check profile picture status
    const profilePicStatus = await checkProfilePicStatus(item.partner_id[0]);
    console.log("my",profilePicStatus); // Will be `true` or `false`

    const displayProfile =  profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    // Your existing code here...
    if (item.state === 'negotiating') {
      return `<div class="my-2 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;border:${background}">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:14px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:700"> ${formattedDate}</h5>

                                </div>
                                <div class="d-flex justify-content-center">
                               <button onclick="completeTransfer(${item.id},'${item.booking_type}',${item.partner_id[0]})" style="display:${hideButtonTrans}" class="btn btn-primary">Transfer</button>
                                </div>
                            </div>

                        </div>
                    </div>`;
    } else {
      return ``;
    }

  }

  async function displayVoyages() {
    try {
      const voyageHTMLPromises = filteredCities.map((item) => generateVoyageHTML(item));
      const voyageHTMLs = await Promise.all(voyageHTMLPromises);
      search_info.innerHTML = voyageHTMLs.join('');
    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

displayVoyages()

}

}
}


function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}
