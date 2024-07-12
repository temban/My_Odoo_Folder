     var authorization = localStorage.getItem("authorization")
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})





//search
var voyages2 = [];

  //USER INFO
  function my_users_travel_info(){
    axios.get("/api/res_partner/")
  .then((response) => {
  console.log("user Info")
    var userId = response.data.partner.id
        console.log(response.data.partner);
     localStorage.setItem("user_id",userId);
     if(response.data){
//         document.getElementById("output").src = "/web/image/res.partner/"+ userId +"/image_1920";
//    document.getElementById('username').innerHTML = response.data.partner.name

 axios.get('/api/v1/read/res.partner?ids=' + userId.toString() , {
        headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
        },
      }).then(response => {
 console.log("my Specific partner")
 console.log(response.data)
 response.data.map((travel)=>localStorage.setItem("myShipping",travel.shipping_ids) )


 //MY TRAVELS

 response.data.map((travel)=>{

 setTimeout(()=>{
 axios.get(`/api/v1/read/m1st_hk_roadshipping.travelbooking?ids=${travel.travelbooking_ids}`, {
         headers: {
     'Accept': 'application/json',
     'Authorization': authorization,
         },
       }).then(response => {
  console.log("My travels")
  console.log(response.data)

  // MY ROAD TRAVELS
 const my_travels = document.getElementById('my_results')
response.data.map((item)=> voyages2.push(item))
  my_travels.innerHTML = response.data.map((item)=>{
var my_user_id = localStorage.getItem("user_id")

    var display = item.booking_type === "road" ? "none" : "flex"
    var displayAir = item.booking_type === "air" ? "none" : "flex"
    var displayExpedition = item.partner_id[0] === Number(my_user_id) ? "none" : "flex"

    var color = item.state === "rejected" && 'RGB(255,0,0)' || item.state === "completed" && '#4472C4' || item.state === "accepted" && '#FFC000' || item.state === "negotiating" && '#00B050'|| item.state === "pending" && 'RGB(165,165,165)'
    var content = item.state === "rejected" && 'Rejected' || item.state === "completed" && 'Complete' || item.state === "accepted" && 'Running' || item.state === "negotiating" && 'Published'|| item.state === "pending" && 'Pending'

 var display = item.state === "pending" ? 'inline' : 'none'
 var displayNegotiationButton = item.state === "pending" ? 'inline' : 'none'
 var viewShipping = item.state === "rejected" ? 'none' : 'inline'
 var border = item.state === "rejected" ? 'solid red 1px' :'solid blue 1px'


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

 return `     <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden"  style="border-radius:30px;">
                            <div class="px-4 pb-2">
                                   <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap:2px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;;font-size:12px;text-overflow: ellipsis;width:90px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:24px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;font-size:12px;text-overflow: ellipsis;width:90px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                               <div style="display: flex;justify-content:space-between;align-items: center;gap:20px">
                                   <h5 class="mb-0" style="font-weight:700;display:flex;align-items:center;gap:20px;font-size:12px;"> ${formattedDate}</h5>
                                    <button class=" py-2 px-4 state" style="font-family:'Obitron',sans-serif ;font-weight:700;color:${color};border:2px solid ${color};background:white;font-size:12px;border-radius:30px;text-transform: capitalize;">${content}</button>
                                </div>

                                 <div style="display: flex;justify-content: space-between;gap: 10px;margin-top:20px;">
                                   <button type="button" class="btn" onclick="setNegotiation(${item.id})" style="text-transform: capitalize;background: #217aff;color:white;border-radius:10px;display:${displayNegotiationButton}"><i class='fas fa-upload'></i> Publish</button>
                                    <span onclick="travelDetails(${item.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none;" class="mt-2  py-2">More info ></span>

                                </div>

                            </div>

                        </div>
                    </div>`


   } ).join("")

  Loader()


            })
          .catch(function(error) {
              console.log(error);
          })

 //})

 },2000)

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
  }

my_users_travel_info()



//BOOKING PAGE
function my_bookingPage(id,type,kilo){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)

  window.location.href = "/booking/page/"+type + "/" + id.toString();

console.log(id,type)
}




//LiVE SEARCH
function liveSearch3(value){
  var searchInput1 = document.getElementById('searchInput3').value;
var all_results= document.getElementById('my_results');
 all_results.style.display = "none";
var search_info = document.getElementById('search_row');



 // Perform search
  var filteredCities = voyages2.filter((item)=> item.state.toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredCities);




if(searchInput1 !== ""){

const my_search_info = document.getElementById('search_row');
if(filteredCities.length === 0){
my_search_info.innerHTML= `<h1 style="text-align:center;margin-top:100px;margin-bottom:200px">No Result!!</h1>`
}else{
  search_info.innerHTML = filteredCities.map((item)=>{
var my_user_id = localStorage.getItem("user_id")

    var display = item.booking_type === "road" ? "none" : "flex"
    var displayAir = item.booking_type === "air" ? "none" : "flex"
    var displayExpedition = item.partner_id[0] === Number(my_user_id) ? "none" : "flex"
    var color = item.state === "rejected" && 'RGB(255,0,0)' || item.state === "completed" && '#4472C4' || item.state === "accepted" && '#FFC000' || item.state === "negotiating" && '#00B050'|| item.state === "pending" && 'RGB(165,165,165)'
    var content = item.state === "rejected" && 'Rejected' || item.state === "completed" && 'Complete' || item.state === "accepted" && 'Running' || item.state === "negotiating" && 'Published'|| item.state === "pending" && 'Pending'

 var display = item.state === "pending" ? 'inline' : 'none'
 var displayNegotiationButton = item.state === "pending" ? 'inline' : 'none'
 var viewShipping = item.state === "rejected" ? 'none' : 'inline'
 var border = item.state === "rejected" ? 'solid red 1px' :'solid blue 1px'


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

 return `   <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden"  style="border-radius:30px;">
                            <div class="px-4 pb-2">
                                   <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap:2px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;;font-size:12px;text-overflow: ellipsis;width:90px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:24px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;font-size:12px;text-overflow: ellipsis;width:90px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                               <div style="display: flex;justify-content:space-between;align-items: center;gap:20px">
                                   <h5 class="mb-0" style="font-weight:700;display:flex;align-items:center;gap:20px;font-size:12px;"> ${formattedDate}</h5>
                                    <button class=" py-2 px-4 state" style="font-family:'Obitron',sans-serif ;font-weight:700;color:${color};border:2px solid ${color};background:white;font-size:12px;border-radius:30px;text-transform: capitalize;">${content}</button>
                                </div>

                                 <div style="display: flex;justify-content: space-between;gap: 10px;margin-top:20px;">
                                   <button type="button" class="btn" onclick="setNegotiation(${item.id})" style="text-transform: capitalize;background: #217aff;color:white;border-radius:10px;display:${displayNegotiationButton}"><i class='fas fa-upload'></i> Publish</button>
                                    <span onclick="travelDetails(${item.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none;" class="mt-2  py-2">More info ></span>

                                </div>

                            </div>

                        </div>
                    </div>`


   } ).join("")

}


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

    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/m1st_hk_roadshipping.travelbooking/set_to_negotiating/?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
}
//          var raw = JSON.stringify({
//            "state": "negotiating"
//          });
//          let config = {
//            method: 'put',
//            maxBodyLength: Infinity,
//            url: `/api/v1/write/m1st_hk_roadshipping.travelbooking?values=${raw}&ids=${id}`,
//            headers: {
//              'Accept': 'application/json',
//              'Authorization': authorization,
//            }
//          };

 axios.request(config)
 .then((response) => {
   console.log(JSON.stringify(response.data));
   my_users_travel_info()

//     window.location.href = "";
//     window.location.href = "";
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

 //PARTIR A MODIFIER VOYAGES
 function updateVoyage(id,type){
 localStorage.setItem("updateType",type)
 window.location.href = "/modifier/" + id.toString()
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
//
//    var alert_error_message = document.getElementById("alert_error_message")
//   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Successfully Canceled</p>`
//
//     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
//  myModal.show();

   window.location.href=""
 })
 .catch((error) => {
 alert(error.response.data.message)
   console.log(error.response.data.message);
 });



 }

function travelDetails(id){
window.location.href = `/my/travel/details/${id}`
localStorage.setItem("travelbooking_id",id)
}

function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}
