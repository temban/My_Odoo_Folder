var authorization = localStorage.getItem("authorization")
console.log("hello home pag")

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

//ALL MY TRAVELS ARRAY
var voyages = [];

//GET TRY ALL TRAVELS
    axios.get('/api/v1/search_read/m1st_hk_roadshipping.travelbooking', {
        headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
        },
      }).then(response => {
      console.log("bad......")
              response.data.map((item)=> voyages.push(item))
           })
         .catch(function(error) {
             console.log(error);
         })




//TOUS MES VOYAGES ROAD
setTimeout(() => {
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
      return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]})" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;">
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
    const firstThreeObjects = voyages.slice(0, 4);

      const voyageHTMLPromises = firstThreeObjects.map((item) => generateVoyageHTML(item));
      const voyageHTMLs = await Promise.all(voyageHTMLPromises);
      home_voyages.innerHTML = voyageHTMLs.join('');
    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

 displayVoyages();

console.log("........" , voyages)



},2000)






};


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
function my_bookingPage(id,type,partner){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)
var my_user_id = localStorage.getItem("user_id")
localStorage.setItem("currentTravellerPartnerId",partner)

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

