var authorization = localStorage.getItem("authorization")
var voyages = [];

//SOCKET START
// Event handler for when the connection is established
const socketHome = new WebSocket(`wss://preprod.hubkilo.com:9090/all_rooms`);

// Event handler for when the connection is established
socketHome.addEventListener("open", (event) => {
  console.log(`Connected to WebSocket server in room all_rooms`);
  console.log(event)
});

// Event handler for incoming messages from the server
socketHome.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  console.log(`Received message:`, message);
  voyages.push(message.data)
  displayAllTravels()
});

// Event handler for when the connection is closed
socketHome.addEventListener("close", (event) => {
  if (event.wasClean) {
    console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
  } else {
    console.error(`Connection abruptly closed`);
  }
});

// Event handler for connection errors
socketHome.addEventListener("error", (error) => {
  console.error(`WebSocket error:`, error);
});

//SOCKET END

//GET PUBLICITY IMAGES AND GET ALL AIR TRAVELS
window.onload = function() {

  //USER INFO
  axios
  .get("/api/res_partner/")
  .then((response) => {
  console.log("user Info")
    var userId = response.data.partner.id
        console.log(response.data.partner);
     localStorage.setItem("user_id",userId);
     if(response.data){

 axios.get('/api/v1/read/res.partner?ids=' + userId.toString() , {
        headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
        },
      }).then(response => {
 console.log("my Specific partner")
 console.log(response.data)
 response.data.map((travel)=>localStorage.setItem("myTravels",travel.travelbooking_ids) )
 response.data.map((travel)=>localStorage.setItem("myShipping",travel.shipping_ids) )

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

};



//ALL MY TRAVELS ARRAY

//GET TRY ALL TRAVELS
function allHomeTravels(){
let data = '{\r\n    "jsonrpc":"2.0"\r\n}';

    axios.get('/front_end/road/travels', {
        headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
        },
     data : data
      }).then(response => {
      console.log("bad......")
              response.data.travels.map((item)=> voyages.push(item))
           })
         .catch(function(error) {
             console.log(error);
         })
}
allHomeTravels()



//TOUS MES VOYAGES ROAD
function displayAllTravels(){
const home_voyages = document.getElementById('home_voyages_road')

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

 Loader()

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
    if (item.state === 'negotiating') {
      return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]},${item.average_rating},'${item.partner_id[1]}')" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px" class="heading text-center">${arrival_country}</p>
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
                                <div class="d-flex justify-content-end">
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
 // Perform search
  var filteredTravel = voyages.filter((item)=> item.state === "negotiating");

      var voyageHTMLPromises = filteredTravel.slice(0,3).map((item) => generateVoyageHTML(item));
      var voyageHTMLs = await Promise.all(voyageHTMLPromises);
      home_voyages.innerHTML = voyageHTMLs.join('');
    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

 displayVoyages();

console.log("........" , voyages)


}

setTimeout(() => {
displayAllTravels()
},2000)


//ALL SHIPPING OFFERS START

var shippingOffers = []
function allShippingOffers(){
 axios.get(`/api/v1/search_read/m1st_hk_roadshipping.shipping`, {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       })
       .then(response => {
 console.log("my shipping offers............")
  console.log(response.data)

     const offers_results = document.getElementById('offers_results')
     var luggage_ids =response.data.map((table)=>table.luggage_ids[0])

     //Filter all shipping offer that are pending
     response.data.map((table)=>{
       if(table.travelbooking_id === false && table.state == "pending"){
     shippingOffers.push(table)

     }
     })

            })
          .catch(function(error) {
              console.log(error);
          })
}
allShippingOffers()

function displayShippingHome(){
console.log("LIST OF SHIPPING")
     const offers_results = document.getElementById('home_shipping_offers')

     // Check if emptyArray is empty
if (shippingOffers.length === 0) {
Loader()
offers_results.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:48px;color:#79a1de">No Shipping</h1>`
}
else {
Loader()
var filteredShippingOffer = shippingOffers.slice(0,3)
     //SHOW SHIPPING
   offers_results.innerHTML = filteredShippingOffer.map((table)=>{


//let datetime = table.shipping_departure_date;
//let time = datetime.split(" ")[1];

     localStorage.setItem("qrcode",table.name)
     var displayNegociation = table.state === "negotiating" ? 'inline' :'none';
     var displayChatButton = table.state === "received" || table.msg_shipping_accepted === false ? 'none' :'inline';
     var displayCodeButton = table.state === "paid" ? 'inline' :'none';
     var displayPayButton = table.state === "accepted" ? 'inline' :'none';
//     var displayInvoiceButton = table.move_id === false ? 'none' :'inline';
     var displayTrans = table.state === "rejected" || table.state === "pending"  ? 'inline' :'none'
     var others = table.state === "rejected" || table.state === "pending" ? 'inline' :'none'

var color = table.state === "rejected" && 'RGB(255,0,0)' || table.state === "received" && '#4472C4' || table.state === "accepted" && 'RGB(255,192,0)' || table.state === "paid" && 'RGB(0,176,80)'|| table.state === "pending" && 'RGB(165,165,165)'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'RGB(112,48,160)'
var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'Received'



//if(table.travelbooking_id === false && table.state == "pending"){
if(table.state == "pending"){
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

         <div class="room-item shadow overflow-hidden" onclick="my_bookingPage_shipping('${table.booking_type}',${table.id})" style="border-radius:30px;position: relative;">

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
                                        <h6 class="mb-0" style="font-weight: 700;color: #021531;font-size:12px">${table.name}</h6>
                                        <h6 class="mb-0" style="color:#217aff;font-size:12px;">${formattedDate}</h6>
                                    </div>
                                </div>

                                <div style="display: flex;justify-content:space-between;gap: 40px;margin-top:20px;padding-bottom:20px">
                                <div class="" style="display:none;justify-content:start;gap: 10px;">
                                    <span onclick="my_bookingPage_shipping('${table.booking_type}',${table.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none" class="mt-2  py-2">More info ></span>
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
setTimeout(()=>{
displayShippingHome()
},2000)

//ALL SHIPPING OFFERS END


//all cities
function getAllCities(){
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '/get_cities',
};

axios.request(config)
.then((response) => {
//  console.log(JSON.stringify(response.data));
  localStorage.setItem("allCities",JSON.stringify(response.data.cities))
})
.catch((error) => {
  console.log(error);
});

}
getAllCities()








//BOOKING PAGE
function my_bookingPage(id,type,partner,rating,name){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)
var my_user_id = localStorage.getItem("user_id")
localStorage.setItem("currentTravellerPartnerId",partner)
localStorage.setItem("currentTravellerPartnerRating",rating)
localStorage.setItem("currentTravellerPartnerName",name)

if(Number(my_user_id) === Number(partner)){
 console.log("Can not")
}else{
 window.location.href = "/booking/page/road/" + id.toString();
}



console.log(id,type)
}




//SEARCH BY BUTTON
function searchHome(){
event.preventDefault(); // Prevent the form from submitting


var type_de_voyage = document.getElementById("type_de_voyage").value

var selectedArriveCityId = localStorage.getItem("selectedArriveCityId")
var selectedDepartCityId = localStorage.getItem("selectedDepartCityId")


window.location.href = "/travels/" + selectedDepartCityId + "/" + selectedArriveCityId + "/" + type_de_voyage;
console.log(type_de_voyage)
}

//GO TO SHIPPING TRAVEL PAGE
function my_bookingPage_shipping(type,my_shipping_id){
localStorage.setItem("travelBookingType",type)
localStorage.setItem("shipping_id_detail",my_shipping_id)

window.location.href = "/shipping/offers/details"

}

function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}