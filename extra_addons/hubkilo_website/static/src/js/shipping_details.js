var authorization = localStorage.getItem("authorization")

var travel_id_detail = localStorage.getItem("travel_id_detail")
var shipping_id_detail = localStorage.getItem("shipping_id_detail")

//Shipping Info
var shipping_detail_id,shipping_detail_travel_code,shipping_detail_booking_type,shipping_detail_travel_booking_id,shipping_detail_payment_link,shipping_detail_luggage_ids


var loadFileColisOffer1 = function (event) {
  var image = document.getElementById("image-colis11");
    image.src = URL.createObjectURL(event.target.files[0]);
}
var loadFileColisOffer2 = function (event) {
  var image = document.getElementById("image-colis22");
    image.src = URL.createObjectURL(event.target.files[0]);
}
var loadFileColisOffer3 = function (event) {
  var image = document.getElementById("image-colis33");
    image.src = URL.createObjectURL(event.target.files[0]);
}

setTimeout(()=>{
    const phoneInputField = document.getElementById("receiver_phone");
const phoneInput = window.intlTelInput(phoneInputField, {
      utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
},5000)


function shippingInfo(){
 axios.get(`/api/v1/read/m1st_hk_roadshipping.shipping?ids=${shipping_id_detail}`, {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization
         },
       })
       .then(response => {
 console.log("my shipping details............")
  console.log(response.data)
  setTimeout(()=>{
Loader()
},1500)

     const all_results = document.getElementById('all_results')
     var luggage_ids =response.data.map((table)=>table.luggage_ids[0])

     //display shipping luggage info to be edited
     response.data.map((table)=>{

          if(table.luggage_ids[0] === ""){
     console.log("empty")
     }else{

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/m1st_hk_roadshipping.luggage?ids=${table.luggage_ids[0]}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {


console.log("LUGGAGE INFO",response.data)
  response.data.map((luggage)=>{
console.log("my luggage id ",luggage.id )

if(luggage.luggage_model_id[0] <= 7){
 const envelope = document.getElementById("envelope");
  envelope.classList.add("selected");

}else if (luggage.luggage_model_id[0] === 8 ||luggage.luggage_model_id[0] === 9 ){
const briefcase = document.getElementById("briefcase");
  briefcase.classList.add("selected");

}else{
const suitcase = document.getElementById("suitcase");
  suitcase.classList.add("selected");

}

localStorage.setItem("luggage_id",luggage.id)

document.getElementById("image-colis11").src = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image1";
document.getElementById("image-colis22").src = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image2";
document.getElementById("image-colis33").src = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image3";

document.getElementById('image-input-colis1').files[0] = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image1" ;
 document.getElementById('image-input-colis2').files[0] = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image2";
 document.getElementById('image-input-colis3').files[0] = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image3";


  })

})
.catch((error) => {
  console.log(error);
});

     }
     })






// Check if emptyArray is empty
if (response.data.length === 0) {

all_results.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:48px;color:#79a1de">No Shipping</h1>`

all_results.innerHTML} else {
     //SHOW SHIPPING
   response.data.map((table)=>{
//   all_results.innerHTML=response.data.map((table)=>{

localStorage.setItem("myTravelBookingId",table.travelbooking_id[0])
let datetime = table.create_date;
let time = datetime.split(" ")[1];


     localStorage.setItem("qrcode",table.name)
     var displayNegociation = table.state === "negotiating" ? 'inline' :'none';
     var displayChatButton = table.state === "received" || table.msg_shipping_accepted === false ? 'none' :'inline';
     var displayCodeButton = table.state === "paid" || table.state === "confirm" ? 'inline' :'none';
     var displayTravelListButton = table.travelbooking_id === false ? 'inline' :'none';
     var displayPayButton = table.state === "accepted" ? 'inline' :'none';
     var displayRated = table.state === "received" && table.is_rated === false   ? 'inline' :'none';
     var displayInvoiceButton = table.move_id === false || table.state === "received" || table.state === "paid" || table.state === "confirm"   ? 'none' :'inline';
     var displayTrans = table.state === "rejected" || table.state === "pending"  ? 'inline' :'none'
//     var others =table.state === "pending" ? 'inline' :'none'

     //OTHERS BUTTONS
     if(table.state === "pending"){
     document.getElementById("edit1").style.display = 'inline'
     document.getElementById("deleteMyReserve").style.display = 'inline'
     }else{
     document.getElementById("edit1").style.display = 'none'
     document.getElementById("deleteMyReserve").style.display = 'none'
     }

     //TRANSFER BUTTONS
     if(table.state === "rejected" || table.state === "pending"){
          document.getElementById("transferShippingOrders").style.display = 'inline'
     }else{
          document.getElementById("transferShippingOrders").style.display = 'none'
     }

     //PROCEED PAYMENT
     if(table.move_id === false || table.state === "received" || table.state === "paid" || table.state === "confirm"){
      document.getElementById("proceedToPay").style.display = 'none'
     }else{
      document.getElementById("proceedToPay").style.display = 'inline'
     }
     //RATE DIV
     if(table.is_rated === true){
     document.getElementById("my_rate_div").style.display = 'none'
     }else{
     document.getElementById("my_rate_div").style.display = 'inline'
     }
     //IF RATED
     if(table.state === "received" && table.is_rated === false ){
     document.getElementById("rate_traveler").style.display = 'inline'
     }else{
     document.getElementById("rate_traveler").style.display = 'none'
     }
     //VIEW CODE
     if(table.state === "paid" || table.state === "confirm"){
     document.getElementById("view_my_code").style.display = 'inline'
     }else{
     document.getElementById("view_my_code").style.display = 'none'
     }
     //TRAVELS VIEW
     if(table.travelbooking_id === false){
      document.getElementById("view_travel_list").style.display = 'inline'
     }else{
      document.getElementById("view_travel_list").style.display = 'none'
     }

     //CHAT BUTTON
     if(table.state === "received" || table.msg_shipping_accepted === false){
     document.getElementById("shipping_chat_button").style.display = 'none'
     }else{
     document.getElementById("shipping_chat_button").style.display = 'inline'
     }

     var color = table.state === "rejected" && 'RGB(255,0,0)' || table.state === "received" && '#4472C4' || table.state === "accepted" && 'RGB(255,192,0)' || table.state === "paid" && 'RGB(0,176,80)'|| table.state === "pending" && 'RGB(165,165,165)'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'RGB(112,48,160)'
     var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'Received'

     var border = table.state === "rejected" ? 'solid red 1px' :'solid blue 1px'

     var is_rated = table.is_rated === true ? 'none' : 'inline'

     shipping_detail_id = table.id
     shipping_detail_booking_type = table.booking_type
     shipping_detail_travel_booking_id = table.travelbooking_id[0]
     shipping_detail_payment_link = response.data[0].payment_link
     shipping_detail_travel_code = table.travel_code
     shipping_detail_luggage_ids = table.luggage_ids[0]


     setTimeout(()=>{
          if(table.disagree === true){
     document.getElementById("disagree_badge").innerHTML = `<div class="badge1 state" style="display:flex;background:red;color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">Cancelled</div>`
     }

     },1000)

      setTimeout(()=>{
 document.getElementById("ville_de_depart").value = table.shipping_departure_city_id[1]
document.getElementById("date_de_depart").value = table.shipping_departure_date
document.getElementById("ville_de_arriver").value = table.shipping_arrival_city_id[1]
document.getElementById("date_de_arrivee").value = table.shipping_arrival_date

localStorage.setItem("selectedArriveCityId",table.shipping_arrival_city_id[0])
localStorage.setItem("selectedDepartCityId",table.shipping_departure_city_id[0])


     },3000)

//SHIPPING DETAILS
document.getElementById("shipping_details_display_name").innerHTML = `${table.display_name}`
document.getElementById("shipping_details_display_name2").innerHTML = `${table.display_name}`
document.getElementById("shipping_details_shipping_date").innerHTML = `${table.shipping_date}`
document.getElementById("shipping_details_shipping_date").innerHTML = `${table.shipping_date}`
document.getElementById("shipping_details_receiver_partner_id").innerHTML = `${table.receiver_partner_id[1]}`
document.getElementById("shipping_details_receiver_email").innerHTML = `${table.receiver_email}`
document.getElementById("shipping_details_receiver_address").innerHTML = `${table.receiver_address}`
document.getElementById("shipping_details_receiver_phone").innerHTML = `${table.receiver_phone}`

//SHIPPING BUTTONS

//
//document.getElementById("shipping_details_action_buttons").innerHTML = `  <button id="edit1" onclick="showEdit()" class="btn" style="border-radius:10px;display:${others};border:solid 2px black;color:black;text-transform: capitalize;" > Edit <i class='fas fa-pen'></i></button>
//                                    <div id="edit2" style="display:none">
//                                      <button onclick="showEdit2()" class="btn" style="border-radius:10px;display:${others};border:solid 2px black;color:black;text-transform: capitalize;" > Edit <i class='fas fa-pen'></i></button>
//                                    </div>
//
//                                    <button id="transferShippingOrders" class="btn"  onclick="Transferer()" style="text-transform: capitalize;border-radius:10px;display:${displayTrans  !== 'none' ? 'inline' : 'none'};border:solid 2px black;color:black" data-bs-toggle="modal" data-bs-target="#exampleModalTransfer">Transfer <i class='fas fa-caret-right'></i><i class='fas fa-caret-right'></i></button>
//
//                                    <button class="btn" onclick="DeleteMyReserve()"
//                                        style="text-transform: capitalize;border-radius:10px;display:${others};border:solid 2px black;color:black">Cancel <i class='fas fa-ban'></i></button>
//
//                                     <button type="button" class="btn" onclick="goToInvoice()" style="text-transform: capitalize;display:${displayInvoiceButton};background:#217aff;color:white;font-weight:700">
//                                    Proceed To Pay
//                                     </button>
//
//                                     <div style="display:${is_rated}">
//                                     <button type="button" class="btn" data-toggle="modal" data-target="#rating" style="text-transform: capitalize;display:${displayRated};background:#217aff;color:white;font-weight:700">
//                                    Rate Traveler <i class="fa fa-thumbs-up" style="color:white"></i>
//                                     </button>
//                                     </div>
//
//                                   <button onclick="ViewCode()" style="text-transform: capitalize;display:${displayCodeButton};border:solid 2px black;color:black" href="#" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal1">
//                                     View Code
//                                   </button>
//
//                                   <button class="btn btn-primary"  style="text-transform: capitalize;display:${displayTravelListButton};" href="#" data-bs-toggle="modal" data-bs-target="#travelList">
//                                     View Travel List
//                                   </button>`

//document.getElementById("shipping_details_buttons").innerHTML = `<button class="btn py-2 px-4" onclick="seeLuggage()" style="background: #000000;color:white;border-radius:5px;font-size:12px;text-transform: capitalize;" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class='fas fa-suitcase-rolling' style="color:white"></i> Luggage Info</button>
//                                        <button onclick="storeBookingInfos()" class="btn py-2 px-4" style="background: white;color:black;border: 1px solid black;text-transform: capitalize;border-radius:5px;font-size:12px;display:${displayChatButton}">Negotiate
//                                        <i class='fas fa-comment-alt' style='color:black'></i>
//                                    </button>`

document.getElementById("disagree_badge").innerHTML = `<div class="badge1 state" style="background:${color};border:1px solid ${color};color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>`


localStorage.setItem("average_rating",table.average_rating)

//console.log("rating",table.is_rated)


        //GET LUGGAGE FOR SHIPPING


// return `
//      `

     }).join("")

   //SHOW SHPPING OFFER TRAVEL DETAILS
   response.data.map((myItem)=>{
      const travel_info = document.getElementById("travel_info");

      if(myItem.travelbooking_id === false){
      document.getElementById("transferShippingOrders").style.display = "none"
      document.getElementById("aboutTravelSection").style.display = "none"

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
document.getElementById("shipping_details_d_date").innerHTML = `${date}`
document.getElementById("shipping_details_d_time").innerHTML = `${dtime}`
document.getElementById("shipping_details_a_date").innerHTML = `${adate}`
document.getElementById("shipping_details_a_time").innerHTML = `${atime}`


document.getElementById("shipping_details_d_city").innerHTML = `${departure_city}`
document.getElementById("shipping_details_d_country").innerHTML = `${departure_country}`
document.getElementById("shipping_details_a_city").innerHTML = `${arrival_city}`
document.getElementById("shipping_details_a_country").innerHTML = `${arrival_country}`



      }
      else{
            document.getElementById("destination_section").style.display = "none"

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
      const travel_info = document.getElementById("travel_info");
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


//TRAVEL INFORMATION
document.getElementById("shipping_details_d_date").innerHTML = `${date}`
document.getElementById("shipping_details_d_time").innerHTML = `${dtime}`
document.getElementById("shipping_details_a_date").innerHTML = `${adate}`
document.getElementById("shipping_details_a_time").innerHTML = `${atime}`


document.getElementById("shipping_details_d_city").innerHTML = `${departure_city}`
document.getElementById("shipping_details_d_country").innerHTML = `${departure_country}`
document.getElementById("shipping_details_a_city").innerHTML = `${arrival_city}`
document.getElementById("shipping_details_a_country").innerHTML = `${arrival_country}`




    })

    })
    .catch(function (error) {
      console.log(error);
    });
}
//setInterval(TravelInfo,1500)

setTimeout(()=>{
shippingInfo()
TravelInfo()
},1500)

//setInterval(shippingInfo,4000)




//VERIFIER LE DESTINATAIR
function handleCheckboxOfferChange(checkbox) {
    var recipient_form = document.getElementById("recipient_form");

  if (!checkbox.checked) {
    console.log("Checkbox is checked..");
    var second_des = document.getElementById("second_des");
    var my_reserve_button = document.getElementById("my_reserve_button");
    var my_reserve_button2 = document.getElementById("my_reserve_button2");
    second_des.style.display = "block";
    recipient_form.style.display = "none";

        my_reserve_button2.style.display = "none";
    my_reserve_button.style.display = "block";

//    my_reserve_button.style.display = "block";
//    my_reserve_button2.style.display = "none";
  } else {
    console.log("Checkbox is unchecked");
    var recipient_form = document.getElementById("recipient_form");
    var second_des = document.getElementById("second_des");
    var my_reserve_button = document.getElementById("my_reserve_button");
    var my_reserve_button2 = document.getElementById("my_reserve_button2");

    second_des.style.display = "none";
    recipient_form.style.display = "inline";
    my_reserve_button2.style.display = "block";
    my_reserve_button.style.display = "none";
  }


}


function availableTravel(){
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
           const travel_view_list = document.getElementById('travel_view_list');
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
    if (item.state === 'negotiating' && item.partner_id[0] !== Number(my_user_id)) {
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
    travel_view_list.innerHTML = `<h2 style='text-align:center;margin-top:100px;margin-bottom:200px'>No Travels ...</h2>`
    }else{
          const voyageHTMLPromises = response.data.travels.map((item) => generateVoyageHTML(item));
      const voyageHTMLs = await Promise.all(voyageHTMLPromises);
      travel_view_list.innerHTML = voyageHTMLs.join('');
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

//verify image
async function checkProfilePicStatusShipping() {

var traveler_profile = document.getElementById("traveler_profile")
var traveler_info_id = localStorage.getItem("traveler_info_id")
var traveler_info_name = localStorage.getItem("traveler_info_name")
var average_rating= localStorage.getItem("average_rating")

     try {
      const response = await axios.get(`/check_profile_pic/${traveler_info_id}`);
      console.log("hello",response.data)

      if(response.data === "False"){
      traveler_profile.innerHTML = `<div style="display:flex;gap: 20px;">
                                <img src="/hubkilo_website/static/src/img/avatar-profile.png" alt="Your Image" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:18px">${traveler_info_name}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fas fa-star" style="color: gold;;font-size:14px"></i>
                                        <h6 style="font-size:14px;font-weight:700">${average_rating}</h6>
                                    </div>
                                    </div>
                                </div>`
      }else{
      traveler_profile.innerHTML = `<div style="display:flex;gap: 20px;">
                                <img src="/web/image/res.partner/${traveler_info_id}/image_1920" alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:18px">${traveler_info_name}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fas fa-star" style="color: gold;;font-size:14px"></i>
                                        <h6 style="font-size:14px;font-weight:700">${average_rating}</h6>
                                    </div>
                                    </div>
                                </div>`
      }
      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }
  setTimeout(()=>{
  checkProfilePicStatusShipping()
  },3000)
  setInterval(checkProfilePicStatusShipping,2000)


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
       selectedTravelIds.push(id)
      travelForOffer.classList.add("selected"); // Remove the "selected" class if it's present
      console.log(selectedTravelIds)

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
   window.location.href=""
//   window.location.href="/my/shipping"
 })
 .catch((error) => {
   console.log(error);
 });

}


}

function seeLuggage(){
console.log(shipping_detail_luggage_ids)
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/m1st_hk_roadshipping.luggage?ids=${shipping_detail_luggage_ids}`,
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
 function storeBookingInfos(){
 console.log("STORE BOOKING INFOS TRAVEL PARTNER_ID -> " + shipping_detail_id)
 let config = {
   method: 'get',
   maxBodyLength: Infinity,
   url: '/api/v1/read/m1st_hk_roadshipping.shipping?ids=' + shipping_detail_id ,
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
    function Transferer(){
    localStorage.setItem("shippingId",shipping_detail_id)
    localStorage.setItem("shippingtype",shipping_detail_booking_type)

//         shipping_detail_id = table.id
//     shipping_detail_booking_type = table.booking_type
//     shipping_detail_travel_booking_id = table.travelbooking_id[0]

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
     var background = shipping_detail_travel_booking_id === item.id ? "solid 3px #217aff" : ""
     var hideButtonTrans = shipping_detail_travel_booking_id === item.id ? "none" : "inline"


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
checkProfilePicStatusShipping()
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

function DeleteMyReserve(){

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/m1st_hk_roadshipping.shipping/set_to_rejected/?ids=${shipping_detail_id}`,
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

function goToInvoice(){
window.location.href=`${shipping_detail_payment_link}`
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

 function ViewCode(){
 var code = shipping_detail_travel_code+"-"+shipping_detail_id
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
   window.location.href=""
//shippingInfo()
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
var travel_view_list= document.getElementById('travel_view_list');
 all_results.style.display = "none";
 travel_view_list.style.display = "none";
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
var travel_view_list= document.getElementById('travel_view_list');
 all_results.style.display = "none";
 travel_view_list.style.display = "none";
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
var travel_view_list= document.getElementById('travel_view_list');
 all_results.style.display = "none";
 travel_view_list.style.display = "none";
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

function saveLuggageInfo(id,display_name,average_width,average_height,average_weight,element,ids){

  localStorage.setItem("average_height",average_height)
  localStorage.setItem("average_width",average_width)
  localStorage.setItem("average_weight",average_weight)
    //luggage details
 document.getElementById("weight").value = average_weight
   document.getElementById("width").value = average_width
   document.getElementById("height").value = average_height

  var luggage_col = document.getElementById("luggage_col");

var raw = JSON.stringify({
            "average_height": Number(average_height),
            "average_weight": Number(average_weight),
            "average_width": Number(average_width),
            "luggage_model_id": Number(id),
          });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/m1st_hk_roadshipping.luggage?values=${raw}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};


axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  localStorage.setItem("luggage_id",response.data)
//luggage_ids.push(response.data[0])

//setTimeout(()=>{
//saveLuggageIds()
//},2000)
})
.catch((error) => {
  console.log(error);
});


}

function saveEditLuggageInfoDetails(){

  //luggage details
var average_weight = document.getElementById("weight").value
 var average_width = document.getElementById("width").value
 var average_height = document.getElementById("height").value
 var description = document.getElementById("description").value

 var saveLuggage = document.getElementById("saveLuggage")

//document.getElementById("description2").value = description

//     saveLuggage.innerHTML = `<div class="spinner-border text-light" role="status">
//  <span class="sr-only">Loading...</span>
//</div>`


  var luggageTypeId = localStorage.getItem("luggageTypeId")

if(description.trim() === "" || average_weight.trim() ==="" || average_width.trim() ==="" || average_height.trim() ===""){
                    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">All the fields need to be fill before it can be save</p>`
     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

     var saveLuggage = document.getElementById("saveLuggage")

//    saveLuggage.innerHTML = "NEXT STEP"
}else{

var raw = JSON.stringify({
            "average_height": Number(average_height),
            "average_weight": Number(average_weight),
            "average_width": Number(average_width),
            "luggage_model_id": Number(luggageTypeId),
            "name": description
          });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/m1st_hk_roadshipping.luggage?values=${raw}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};


axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  localStorage.setItem("luggage_id",response.data)

    var alert_success_message = document.getElementById("alert_success_message")
   alert_success_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Luggage details save successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();


})
.catch((error) => {
  console.log(error);


    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">${error.response.data.message}</p>`
     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
});


}


}

function showSectionDetails(section) {

localStorage.setItem("luggageSection",section)

  const sections = document.getElementsByClassName("section");
  for (let i = 0; i < sections.length; i++) {
    sections[i].style.display = "none";
  }

  const sectionToShow = document.getElementById(section);
  sectionToShow.style.display = "block";


  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '/api/v1/search_read/m0sthk.luggage_model',
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
console.log("my luggage model")
//      var my_modal_body = document.getElementById("my_modal_body");

if(section === "section1"){
    localStorage.removeItem("luggage_id")

                const envelope = document.getElementById("envelope");

                // Check if the "selected" class is present
                const isSelected = envelope.classList.contains("selected");
                    const briefcase = document.getElementById("briefcase");
                    const suitcase = document.getElementById("suitcase");
                    briefcase.classList.remove("selected"); // Remove the "selected" class if it's present
                    suitcase.classList.remove("selected"); // Remove the "selected" class if it's present


                // Toggle the "selected" class based on its presence
                if (isSelected) {
                    envelope.classList.remove("selected"); // Remove the "selected" class if it's present
                    localStorage.removeItem("My_luggage_type");

                    briefcase.classList.remove("selected"); // Remove the "selected" class if it's present
                    suitcase.classList.remove("selected"); // Remove the "selected" class if it's present

                }else{
    envelope.classList.add("selected");

    briefcase.classList.remove("selected"); // Remove the "selected" class if it's present
    suitcase.classList.remove("selected"); // Remove the "selected" class if it's present

      var section11 = document.getElementById("section11");
section11.innerHTML= response.data.map((luggage)=>{

var briefcase = luggage.type === "briefcase" ? "none" : "flex"
var envelope = luggage.type === "envelope" ? "none" : "flex"

if(luggage.type === "envelope" ){
//col-md-3 col-sm-6
  return ` <div  class="" style="margin-top: 0.5rem; margin-right: 1rem; margin-left: 1rem">
      <div id="luggage_col${luggage.id}"  class="card" onclick="toggleSelect(${luggage.id},'${luggage.display_name}',${luggage.average_width},${luggage.average_height},${luggage.average_weight})" style="display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 0.5rem;border: 2px solid #e0dcdc;" data-selected="false">
        <i class="fa fa-envelope"  style="font-size:25px;color:#217aff;display:${briefcase}"></i>
        <i class="fa fa-briefcase"  style="font-size:25px;color:#217aff;display:${envelope}"></i>
          <h6 class="card-title" style="text-align: center;font-size:12px;font-weight:800">${luggage.display_name}</h6>

          <p style="font-weight:300">${luggage.average_width} x ${luggage.average_height}</p>
          <h6 style="font-size:12px;font-weight:700">${luggage.average_weight} kg</h6>

   </div>
    </div>`
}

  }).join("")

                }


}
else if(section === "section2"){
    localStorage.removeItem("luggage_id")

                const briefcase = document.getElementById("briefcase");

                // Check if the "selected" class is present
                const isSelected = briefcase.classList.contains("selected");
                    const envelope = document.getElementById("envelope");
                    const suitcase = document.getElementById("suitcase");
                    suitcase.classList.remove("selected"); // Remove the "selected" class if it's present
                    envelope.classList.remove("selected"); // Remove the "selected" class if it's present

                // Toggle the "selected" class based on its presence
                if (isSelected) {
                    briefcase.classList.remove("selected"); // Remove the "selected" class if it's present
                    localStorage.removeItem("My_luggage_type");
                    const envelope = document.getElementById("envelope");
                    const suitcase = document.getElementById("suitcase");
                    suitcase.classList.remove("selected"); // Remove the "selected" class if it's present
                    envelope.classList.remove("selected"); // Remove the "selected" class if it's present

                }else{

    briefcase.classList.add("selected");
   suitcase.classList.remove("selected"); // Remove the "selected" class if it's present
    envelope.classList.remove("selected"); // Remove the "selected" class if it's present

 var section122 = document.getElementById("section22");
section22.innerHTML= response.data.map((luggage)=>{

var briefcase = luggage.type === "briefcase" ? "none" : "flex"
var envelope = luggage.type === "envelope" ? "none" : "flex"

if(luggage.type === "briefcase" ){
  return ` <div  class="" style="margin-top: 0.5rem;margin-right:1rem;margin-left:1rem">
      <div id="luggage_col${luggage.id}" class="card" onclick="toggleSelect(${luggage.id},'${luggage.display_name}',${luggage.average_width},${luggage.average_height},${luggage.average_weight})" style="display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 0.5rem;border: 2px solid #e0dcdc;" data-selected="false">
        <i class="fa fa-envelope"  style="font-size:25px;color:#217aff;display:${briefcase}"></i>
        <i class="fa fa-briefcase"  style="font-size:25px;color:#217aff;display:${envelope}"></i>
          <h6  class="card-title" style="text-align: center;font-size:12px;font-weight:800">${luggage.display_name}</h6>

          <p style="font-size:12px;font-weight:300">${luggage.average_width} x ${luggage.average_height}</p>
          <h6 style="font-size:12px;font-weight:700">${luggage.average_weight} kg</h6>

   </div>
    </div>`
}

  }).join("")

                }


}
else if(section === "section3"){
    localStorage.removeItem("luggage_id")

                const suitcase = document.getElementById("suitcase");

                // Check if the "selected" class is present
                const isSelected = suitcase.classList.contains("selected");
                    const envelope = document.getElementById("envelope");
                    const briefcase = document.getElementById("briefcase");
                    briefcase.classList.remove("selected"); // Remove the "selected" class if it's present
                    envelope.classList.remove("selected"); // Remove the "selected" class if it's present


                // Toggle the "selected" class based on its presence
                if (isSelected) {
                    suitcase.classList.remove("selected"); // Remove the "selected" class if it's present
                    localStorage.removeItem("My_luggage_type");
                    const envelope = document.getElementById("envelope");
                    const briefcase = document.getElementById("briefcase");
                    briefcase.classList.remove("selected"); // Remove the "selected" class if it's present
                    envelope.classList.remove("selected"); // Remove the "selected" class if it's present



                }else{

    suitcase.classList.add("selected");
    briefcase.classList.remove("selected"); // Remove the "selected" class if it's present
    envelope.classList.remove("selected"); // Remove the "selected" class if it's present


      var section33 = document.getElementById("section33");
section33.innerHTML= response.data.map((luggage)=>{

if(luggage.type === "suitcase" ){
  return `<div class="" style="margin-top: 0.5rem; margin-right: 1rem; margin-left: 1rem">
  <div
    id="luggage_col${luggage.id}"
    class="card"
    style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0.5rem; border: 2px solid #e0dcdc;"
    onclick="toggleSelect(${luggage.id},'${luggage.display_name}',${luggage.average_width},${luggage.average_height},${luggage.average_weight})"
    data-selected="false"
  >
    <i class="fas fa-suitcase" style="font-size: 25px; color: #217aff"></i>
    <h6 class="card-title" style="text-align: center;font-size:12px;font-weight:800">${luggage.display_name}</h6>
    <p style="font-size:12px;font-weight:300">${luggage.average_width} x ${luggage.average_height}</p>
    <h6 style="font-size:12px;font-weight:700">${luggage.average_weight} kg</h6>



  </div>
</div>
`
}


  }).join("")
    }


}


  console.log(response.data);

})
.catch((error) => {
  console.log(error);
});

}

function toggleSelect(id,display_name,average_width,average_height,average_weight,element,ids) {

var element = document.getElementById(`luggage_col${id}`)

localStorage.setItem("luggageTypeId",id)
   //  const selected = element.getAttribute('data-selected');
  const selected = element.getAttribute('data-selected');
                  // Check if the "selected" class is present

   if (selected === 'false') {
      if(localStorage.getItem("luggage_id") === null || localStorage.getItem("luggage_id") === undefined ){
    element.style.border = '2px solid #4fbf65';
    element.setAttribute('data-selected', 'true');
saveLuggageInfo(id,display_name,average_width,average_height,average_weight,element,ids)
document.getElementById("luggageDetails").style.display = "flex"
   }else{
       var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">You can not select more than one luggage model</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
       myModal.show();

   }

  }
  else {
    element.style.border = '2px solid #e0dcdc';
    element.setAttribute('data-selected', 'false');
    localStorage.removeItem("luggage_id")
document.getElementById("luggageDetails").style.display = "none"

     }






}

//BOOKING
function myBooking2(id,name,section){

var my_reserve_button = document.getElementById(`my_reserve_button${id}`)
    var my_reserve_button1 = document.getElementById("my_reserve_button");
    var my_reserve_button2 = document.getElementById("my_reserve_button2");

           // Check if the "selected" class is present
                const isSelected = my_reserve_button.classList.contains("selected");

                // Toggle the "selected" class based on its presence
                if (isSelected) {
                    my_reserve_button.classList.remove("selected"); // Remove the "selected" class if it's present
                    localStorage.removeItem("My_luggage_type");
                    localStorage.removeItem("selectId",id)
                     localStorage.removeItem("selectName",name)
                     my_reserve_button2.style.display = "block"
                     my_reserve_button1.style.display = "none"
                }else{
    my_reserve_button.classList.add("selected");
    localStorage.setItem("selectId",id)
    console.log(id)
localStorage.setItem("selectName",name)
my_reserve_button2.style.display = "none"
my_reserve_button1.style.display = "block"
}


}

function myBooking1(travelBookingId){
console.log("Going booking one")

const travelBookingType = localStorage.getItem("travelBookingType")
const user_id = localStorage.getItem("user_id")

//var selected_luggage = localStorage.getItem("selected_luggage")
var luggage_id = localStorage.getItem("luggage_id")

var destinataire = localStorage.getItem("selectId")
var my_destinataire = document.getElementById('destinataire').value;

var myBookingId ;

var selectedArriveCityId = localStorage.getItem("selectedArriveCityId")
var selectedDepartCityId = localStorage.getItem("selectedDepartCityId")
var date_de_depart_offer = document.getElementById("date_de_depart").value
var date_de_arrivee_offer = document.getElementById("date_de_arrivee").value

var departure_d = date_de_depart_offer.replace('T', ' ').substr(0, 16)
var arrival_d = date_de_arrivee_offer.replace('T', ' ').substr(0, 16)

//if(travelBookingType === "road" || travelBookingType === "By Road"){

let my_booking_picture = document.getElementById('image-input-colis1').value.trim() === "";
let my_booking_picture1 = document.getElementById('image-input-colis2').value.trim() === "";
let my_booking_picture2 = document.getElementById('image-input-colis3').value.trim() === "";

if( my_booking_picture || my_booking_picture1 || my_booking_picture2){
//alert("Select your luggage's images");
                    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Select your luggage's images</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
return;

}
else if(luggage_id === null || luggage_id === undefined){
//alert('Choose a luggage type');
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Choose a luggage type</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
}
else if(localStorage.getItem("selectId") === null || localStorage.getItem("selectId") === undefined){
//alert('Select the receiver');
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Select the receiver</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
}
else{


 var button = document.getElementById('my_reserve_button');
  button.disabled = true;


     button.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`


var travel_id_detail = localStorage.getItem("travel_id_detail")
console.log("booking road")
console.log(travel_id_detail)
var luggage_id = localStorage.getItem("luggage_id")

console.log("my luggage id",luggage_id )

 var shipping_id_detail = localStorage.getItem("shipping_id_detail")

if(travelBookingId === 'false'){

var raw = JSON.stringify({
            "receiver_partner_id":Number(destinataire),
            "shipping_price": 0.0,
            "partner_id":Number(user_id),
            "luggage_ids":[Number(luggage_id)],
            "shipping_departure_city_id": selectedDepartCityId,
            "shipping_arrival_city_id": selectedArriveCityId,
            "shipping_departure_date": departure_d,
            "shipping_arrival_date": arrival_d,
          });

let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${shipping_id_detail}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  if(response.data){

var booking_picture1 = document.getElementById('image-input-colis1').files[0];
var booking_picture2= document.getElementById('image-input-colis2').files[0];
var booking_picture3 = document.getElementById('image-input-colis3').files[0];


//image 1
let formData = new FormData();
formData.append('ufile', booking_picture1 );
let image_config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image1`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData
};

axios.request(image_config)
.then((response) => {
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )

})
.catch((error) => {
  console.log(error);
//  alert(error.response.data.message)
     var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

});

setTimeout(()=>{
//image 2
let formData1 = new FormData();
formData1.append('ufile', booking_picture2 );
let image_config1 = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image2`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData1
};

axios.request(image_config1)
.then((response) => {
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )


})
.catch((error) => {
  console.log(error);
});

},2000)

setTimeout(()=>{
//image 2
let formData2 = new FormData();
formData2.append('ufile', booking_picture3 );
let image_config2 = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image3`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData2
};

axios.request(image_config2)
.then((response) => {
  console.log(JSON.stringify(response.data));
  localStorage.removeItem("luggage_id");
console.log('booking image added .....' )
window.location.href = ""
      button.innerHTML = "Done !"
      button.style = "background:#f1f5f4; color:#333; pointer-events:none"
  button.disabled = true;


})
.catch((error) => {
  console.log(error);

});

},3500)


  }
})
.catch((error) => {
  console.log(error);
});


}else{

var raw = JSON.stringify({
            "receiver_partner_id":Number(destinataire),
            "shipping_price": 0.0,
            "partner_id":Number(user_id),
            "luggage_ids":[Number(luggage_id)],
          });

let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${shipping_id_detail}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  if(response.data){

var booking_picture1 = document.getElementById('image-input-colis1').files[0];
var booking_picture2= document.getElementById('image-input-colis2').files[0];
var booking_picture3 = document.getElementById('image-input-colis3').files[0];


//image 1
let formData = new FormData();
formData.append('ufile', booking_picture1 );
let image_config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image1`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData
};

axios.request(image_config)
.then((response) => {
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )

})
.catch((error) => {
  console.log(error);
//  alert(error.response.data.message)
     var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

});

setTimeout(()=>{
//image 2
let formData1 = new FormData();
formData1.append('ufile', booking_picture2 );
let image_config1 = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image2`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData1
};

axios.request(image_config1)
.then((response) => {
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )


})
.catch((error) => {
  console.log(error);
});

},2000)

setTimeout(()=>{
//image 2
let formData2 = new FormData();
formData2.append('ufile', booking_picture3 );
let image_config2 = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image3`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData2
};

axios.request(image_config2)
.then((response) => {
  console.log(JSON.stringify(response.data));
  localStorage.removeItem("luggage_id");
console.log('booking image added .....' )
window.location.href = ""
      button.innerHTML = "Done !"
      button.style = "background:#f1f5f4; color:#333; pointer-events:none"
  button.disabled = true;


})
.catch((error) => {
  console.log(error);

});

},3500)


  }
})
.catch((error) => {
  console.log(error);
});



}



}



}


//a user's address book 2 by
function editUserAndManualShipping(travelBookingId){

    const phoneInputField = document.getElementById("receiver_phone");
const phoneInput = window.intlTelInput(phoneInputField, {
      utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
 console.log("Edit Manual Going Booking")
var user_id = localStorage.getItem("user_id")
//var selected_luggage = localStorage.getItem("selected_luggage")
var receiver_city_id = localStorage.getItem("receiver_city_id")
var luggage_id = localStorage.getItem("luggage_id")
var receiver_name = document.getElementById("receiver_name").value
var receiver_email = document.getElementById("receiver_email").value
var receiver_phone = phoneInput.getNumber()
//var receiver_phone = document.getElementById("receiver_phone").value
var receiver_address = document.getElementById("receiver_address").value


var selectedArriveCityId = localStorage.getItem("selectedArriveCityId")
var selectedDepartCityId = localStorage.getItem("selectedDepartCityId")
var date_de_depart_offer = document.getElementById("date_de_depart").value
var date_de_arrivee_offer = document.getElementById("date_de_arrivee").value

var departure_d = date_de_depart_offer.replace('T', ' ').substr(0, 16)
var arrival_d = date_de_arrivee_offer.replace('T', ' ').substr(0, 16)


let my_booking_picture = document.getElementById('image-input-colis1').value.trim() === "";
let my_booking_picture1 = document.getElementById('image-input-colis2').value.trim() === "";
let my_booking_picture2 = document.getElementById('image-input-colis3').value.trim() === "";
 let my_image_Picture = document.getElementById('image-input-colisPicture').value.trim() === "";

if(receiver_name.trim()=== "" || receiver_email.trim()=== "" || receiver_phone.trim()=== "" || receiver_address.trim()=== "" || receiver_city_id === null || receiver_city_id === undefined){
//alert("Fill all the receiver's info fields")
     var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Fill all the receiver's info fields</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

}else if(my_booking_picture || my_booking_picture1 || my_booking_picture2 ){
//alert("Select your luggage's images")
     var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Select your luggage's images</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

}else if(luggage_id === null || luggage_id === undefined){
//alert('Choose a luggage type');
     var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Choose a luggage type</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();


}else if(my_image_Picture){
//alert("Select a photo of the receiver")
     var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Select a photo of the receiver</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();


}else{
console.log(receiver_name,receiver_email,receiver_phone,receiver_address)
 var save_btn = document.getElementById("my_reserve_button2")

   save_btn.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
     var button = document.getElementById("my_reserve_button2");
//  button.disabled = true;
//var travelbooking_id = localStorage.getItem("travelbooking_id")
var luggage_id = localStorage.getItem("luggage_id")
 var shipping_id_detail = localStorage.getItem("shipping_id_detail")

console.log("my luggage id",luggage_id )

if(travelBookingId === 'false'){
var raw = JSON.stringify({
            "partner_id":Number(user_id),
            "receiver_source":"manual",
            "luggage_ids": [Number(luggage_id)],
            "receiver_email_set": receiver_email,
            "receiver_phone_set": receiver_phone,
            "receiver_name_set": receiver_name,
            "receiver_street_set": receiver_address,
            "receiver_city_id": receiver_city_id,
            "shipping_departure_city_id": selectedDepartCityId,
            "shipping_arrival_city_id": selectedArriveCityId,
            "shipping_departure_date": departure_d,
            "shipping_arrival_date": arrival_d,
            "register_receiver": "True",
          });

 let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${shipping_id_detail}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
//alert("SUCCESSFULL")
  console.log(JSON.stringify(response.data));

  if(response.data){
  var shippingId = Number(localStorage.getItem("shipping_id_detail"))

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/m1st_hk_roadshipping.shipping?ids=${shippingId}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));

  response.data.map((partner)=>{
  var receiver_partner_id = partner.receiver_partner_id[0]

    //NEW USER IMAGE CREATE
 var image_input_colisPicture = document.getElementById('image-input-colisPicture').files[0];
var image_input_colisPictureData = new FormData();
image_input_colisPictureData.append('ufile', image_input_colisPicture);
     let ProfileConfig = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/res.partner/${receiver_partner_id}/image_1920`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : image_input_colisPictureData
};
axios.request(ProfileConfig)
.then((response) => {
console.log("NEW USER IMAGE CREATE SUCCESS")
  console.log(JSON.stringify(response.data));

  if(response.data){
  //uploading luggages
var booking_picture1 = document.getElementById('image-input-colis1').files[0];
var booking_picture2= document.getElementById('image-input-colis2').files[0];
var booking_picture3 = document.getElementById('image-input-colis3').files[0];

//image 1
let formData = new FormData();
formData.append('ufile', booking_picture1 );
let image_config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image1`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData
};

axios.request(image_config)
.then((response) => {
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )


})
.catch((error) => {
  console.log(error);
//  alert(error.response.data.message)
       var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();


});

setTimeout(()=>{
//image 2
let formData1 = new FormData();
formData1.append('ufile', booking_picture2 );
let image_config1 = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image2`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData1
};

axios.request(image_config1)
.then((response) => {
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )
//if(i=3){
//  window.location.href = "/profile";
//
//}

})
.catch((error) => {
  console.log(error);
});

},2000)

setTimeout(()=>{
//image 2
let formData2 = new FormData();
formData2.append('ufile', booking_picture3 );
let image_config2 = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image3`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData2
};

axios.request(image_config2)
.then((response) => {
  localStorage.removeItem("luggage_id");
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )
window.location.href=""
})
.catch((error) => {
  console.log(error);
});






},3500)


  }

})
.catch((error) => {
  console.log(error);
   var save_btn = document.querySelector(".save-btn")

     save_btn.innerHTML = "Submit"
  var button = document.querySelector(".save-btn");
  button.disabled = false;
});


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

}else{
var raw = JSON.stringify({
            "partner_id":Number(user_id),
            "receiver_source":"manual",
            "luggage_ids": [Number(luggage_id)],
            "receiver_email_set": receiver_email,
            "receiver_phone_set": receiver_phone,
            "receiver_name_set": receiver_name,
            "receiver_street_set": receiver_address,
            "receiver_city_id": receiver_city_id,
            "register_receiver": "True",
          });

 let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${shipping_id_detail}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
//alert("SUCCESSFULL")
  console.log(JSON.stringify(response.data));

  if(response.data){
  var shippingId = Number(localStorage.getItem("shipping_id_detail"))

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/m1st_hk_roadshipping.shipping?ids=${shippingId}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));

  response.data.map((partner)=>{
  var receiver_partner_id = partner.receiver_partner_id[0]

    //NEW USER IMAGE CREATE
 var image_input_colisPicture = document.getElementById('image-input-colisPicture').files[0];
var image_input_colisPictureData = new FormData();
image_input_colisPictureData.append('ufile', image_input_colisPicture);
     let ProfileConfig = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/res.partner/${receiver_partner_id}/image_1920`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : image_input_colisPictureData
};
axios.request(ProfileConfig)
.then((response) => {
console.log("NEW USER IMAGE CREATE SUCCESS")
  console.log(JSON.stringify(response.data));

  if(response.data){
  //uploading luggages
var booking_picture1 = document.getElementById('image-input-colis1').files[0];
var booking_picture2= document.getElementById('image-input-colis2').files[0];
var booking_picture3 = document.getElementById('image-input-colis3').files[0];

//image 1
let formData = new FormData();
formData.append('ufile', booking_picture1 );
let image_config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image1`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData
};

axios.request(image_config)
.then((response) => {
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )


})
.catch((error) => {
  console.log(error);
//  alert(error.response.data.message)
       var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();


});

setTimeout(()=>{
//image 2
let formData1 = new FormData();
formData1.append('ufile', booking_picture2 );
let image_config1 = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image2`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData1
};

axios.request(image_config1)
.then((response) => {
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )
//if(i=3){
//  window.location.href = "/profile";
//
//}

})
.catch((error) => {
  console.log(error);
});

},2000)

setTimeout(()=>{
//image 2
let formData2 = new FormData();
formData2.append('ufile', booking_picture3 );
let image_config2 = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/m1st_hk_roadshipping.luggage/${Number(luggage_id)}/luggage_image3`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : formData2
};

axios.request(image_config2)
.then((response) => {
  localStorage.removeItem("luggage_id");
  console.log(JSON.stringify(response.data));
console.log('booking image added .....' )
window.location.href=""
})
.catch((error) => {
  console.log(error);
});






},3500)


  }

})
.catch((error) => {
  console.log(error);
   var save_btn = document.querySelector(".save-btn")

     save_btn.innerHTML = "Submit"
  var button = document.querySelector(".save-btn");
  button.disabled = false;
});


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



}

}


function showEdit(){
document.getElementById("editSection").style.display = "flex"
document.getElementById("edit1").style.display = "none"
document.getElementById("edit2").style.display = "flex"
}

function showEdit2(){
document.getElementById("editSection").style.display = "none"
document.getElementById("edit1").style.display = "flex"
document.getElementById("edit2").style.display = "none"
}


function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}
