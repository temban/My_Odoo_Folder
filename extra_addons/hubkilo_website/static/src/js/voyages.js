

var authorization = localStorage.getItem("authorization")


//console.log("ALL TRAVELS PAGE", owl)

//GLOBAL VARIABLES
var totalPages, page

//SEARCH BY PARAMS
var travelUrl = window.location.href;
var travelUrlParts = travelUrl.split('/');
var travel_type = travelUrlParts[travelUrlParts.length - 1];
var arrival_town = travelUrlParts[travelUrlParts.length - 2];
var departure_town = travelUrlParts[travelUrlParts.length - 3];

var travelSearch = []
var travels1 = [];
var travels2 = [];

//SOCKET START
//// Event handler for when the connection is established
//const socket = new WebSocket(`wss://preprod.hubkilo.com:9090/all_rooms`);
//
//// Event handler for when the connection is established
//socket.addEventListener("open", (event) => {
//  console.log(`Connected to WebSocket server in room allrooms`);
//  console.log(event)
//});
//
//// Event handler for incoming messages from the server
//socket.addEventListener("message", (event) => {
//  const message = JSON.parse(event.data);
//  console.log(`Received message:`, message);
//  travels1.push(message.data)
////  travels2.push(message.data)
//  hub_travels.paginated_hub_travel()
//});
//
//// Event handler for when the connection is closed
//socket.addEventListener("close", (event) => {
//  if (event.wasClean) {
//    console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
//  } else {
//    console.error(`Connection abruptly closed`);
//  }
//});
//
//// Event handler for connection errors
//socket.addEventListener("error", (error) => {
//  console.error(`WebSocket error:`, error);
//});

//SOCKET END

class HubTravels  {


//USER INFO
 user_info_voyage() {
  axios.get("/api/res_partner/")
    .then((response) => {
      console.log("user Info")
      var userId = response.data.partner.id
      console.log(response.data.partner);
      localStorage.setItem("user_id", userId);
      if (response.data) {

        axios.get('/api/v1/read/res.partner?ids=' + userId.toString(), {
          headers: {
            'Accept': 'application/json',
            'Authorization': authorization,
          },
        }).then(response => {
          console.log("my Specific partner")
          console.log(response.data)
          response.data.map((travel) => localStorage.setItem("myTravels", travel.travelbooking_ids))
          response.data.map((travel) => localStorage.setItem("myShipping", travel.shipping_ids))

        })
          .catch(function (error) {
            console.log(error);
          })

      } else {
        console.log("Was not successful")
      }

    })
    .catch(function (error) {
      console.log(error);
    });

}


//GET TRY ALL TRAVELS FOR SEARCH START
 paginated_hub_travel() {
  let data1 = '{\r\n    "jsonrpc":"2.0"\r\n}';

  axios.get('/front_end/road/travels', {
    headers: {
      'Accept': 'application/json',
      'Authorization': authorization,
    },
    data: data1
  })
    .then(response => {
      response.data.travels.map((item) => travels2.push(item))
    })
    .catch(function (error) {
      console.log(error);
    })
}

//GET TRY ALL TRAVELS FOR SEARCH END

//GET TRY ALL TRAVELS START
 all_hub_travels() {
  let data = JSON.stringify({
    "jsonrpc": "2.0"
  });
  axios.post('/all/hub_raod/travels', {
    headers: {
      'Accept': 'application/json',
      'Authorization': authorization,
    },
    data: data
  })
    .then(response => {
      console.log("Paginated Travel")
      response.data.result.travels.map((item) => travels1.push(item))
      page = 1
      totalPages = response.data.result.total_pages
    })
    .catch(function (error) {
      console.log(error);
    })
}

 my_hub_my_travels(){
 var myTravels = localStorage.getItem("myTravels")
  console.log("my Travels")
  console.log(myTravels)

  //myTravels.map((travel)=>{

  axios.get(`/api/v1/read/m1st_hk_roadshipping.travelbooking?ids=${myTravels}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': authorization,
    },
  }).then(response => {
    console.log("My travels")
    console.log(response.data)

    // MY ROAD TRAVELS
    const my_travels = document.getElementById('my_results')

    if (response.data.length === 0) {
      my_travels.innerHTML = `<h2 style='text-align:center;margin-top:100px;margin-bottom:200px'>No Travels ...</h2>`
    } else {

      my_travels.innerHTML = response.data.map((item) => {
        var my_user_id = localStorage.getItem("user_id")

        var display = item.booking_type === "road" ? "none" : "flex"
        var displayAir = item.booking_type === "air" ? "none" : "flex"
        var displayExpedition = item.partner_id[0] === Number(my_user_id) ? "none" : "flex"
        var color = item.state === "rejected" && 'RGB(255,0,0)' || item.state === "completed" && '#4472C4' || item.state === "accepted" && '#FFC000' || item.state === "negotiating" && '#00B050' || item.state === "pending" && 'RGB(165,165,165)'
        var content = item.state === "rejected" && 'Rejected' || item.state === "completed" && 'Complete' || item.state === "accepted" && 'Running' || item.state === "negotiating" && 'Published' || item.state === "pending" && 'Pending'

        var display = item.state === "pending" ? 'inline' : 'none'
        var displayNegotiationButton = item.state === "pending" ? 'flex' : 'none'
        var viewShipping = item.state === "rejected" ? 'none' : 'inline'
        var border = item.state === "rejected" ? 'solid red 1px' : 'solid blue 1px'


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
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;">
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
                                    <button class="py-2 px-4 state" style="font-weight:700;color:${color};border:2px solid ${color};background:white ;font-size:12px;border-radius:30px;text-transform: capitalize;">${content}</button>
                                </div>

                                 <div style="display: flex;justify-content: space-between;gap: 10px;margin-top:20px;">
                                   <button id="publishTravels" type="button" class="btn" onclick="hub_travels.setNegotiation(${item.id})" style="text-transform: capitalize;background: #217aff;color:white;border-radius:10px;display:${displayNegotiationButton};justify-content:center"><i class='fas fa-upload'></i> Publish</button>
                                    <span onclick="hub_travels.travelDetails(${item.id})" style="font-family: 'Poppins',sans-serif;cursor: pointer;text-decoration: underline;font-weight:700;color:#217aff;font-size:12px;text-decoration: none;" class="mt-2  py-2">More info ></span>

                                </div>

                            </div>

                        </div>
                    </div>`


      }).join("")
    }




  })
    .catch(function (error) {
      console.log(error);
    })

}
//GET TRY ALL TRAVELS END

 seePagination(totalPages, page) {
  let data = JSON.stringify({
    "jsonrpc": "2.0",
    "params": {
      "page": page
    }
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/all/hub_raod/travels',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      //VOYAGES PAGINATION START
      const element = document.querySelector(".pagination ul");
      element.innerHTML = createPagination(totalPages, page);
      //calling function with passing parameters and adding inside element which is ul tag
      function createPagination(totalPages, page) {
        let liTag = '';
        let active;
        let beforePage = page - 1;
        let afterPage = page + 1;
        console.log(page)
        if (page > 1) { //show the next button if the page value is greater than 1
          liTag += `<li class="btn prev" onclick="hub_travels.seePagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
        }

        if (page > 2) { //if page value is less than 2 then add 1 after the previous button
          liTag += `<li class="first numb" onclick="hub_travels.seePagination(totalPages, 1)"><span>1</span></li>`;
          if (page > 3) { //if page value is greater than 3 then add this (...) after the first li or page
            liTag += `<li class="dots"><span>...</span></li>`;
          }
        }

        // how many pages or li show before the current li
        if (page == totalPages) {
          beforePage = beforePage;
        } else if (page == totalPages - 1) {
          beforePage = beforePage;
        }
        // how many pages or li show after the current li
        if (page == 1) {
          afterPage = afterPage + 2;
        } else if (page == 2) {
          afterPage = afterPage + 1;
        }

        for (var plength = beforePage; plength <= afterPage; plength++) {
          if (plength > totalPages) { //if plength is greater than totalPage length then continue
            continue;
          }
          if (plength == 0) { //if plength is 0 than add +1 in plength value
            plength = plength + 1;
          }
          if (page == plength) { //if page is equal to plength than assign active string in the active variable
            active = "active";
          } else { //else leave empty to the active variable
            active = "";
          }
          liTag += `<li class="numb ${active}" onclick="hub_travels.seePagination(totalPages, ${plength})"><span>${plength}</span></li>`;
        }

        if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
          if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
            liTag += `<li class="dots"><span>...</span></li>`;
          }
          liTag += `<li class="last numb" onclick="hub_travels.seePagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
        }

        if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
          liTag += `<li class="btn next" onclick="hub_travels.seePagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
        }
        element.innerHTML = liTag; //add li tag inside ul tag
        return liTag; //reurn the li tag
      }

      //VOYAGES PAGINATION END
      const home_voyages = document.getElementById('all_results')
      home_voyages.innerHTML = ""
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
        console.log("my", profilePicStatus); // Will be `true` or `false`

        const displayProfile = profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

        // Your existing code here...
        if (item.state === 'negotiating') {
          return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="hub_travels.my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]},${item.average_rating},'${item.partner_id[1]}')" data-wow-delay="0.1s">
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
          if (response.data.result.travels.length === 0) {
            home_voyages.innerHTML = `<h2 style='text-align:center;margin-top:100px;margin-bottom:200px'>No Travels ...</h2>`
          } else {
            const voyageHTMLPromises = response.data.result.travels.map((item) => generateVoyageHTML(item));
            const voyageHTMLs = await Promise.all(voyageHTMLPromises);
            home_voyages.innerHTML = voyageHTMLs.join('');
          }

        } catch (error) {
          console.error('Error generating voyage HTML:', error);
        }
      }

      displayVoyages();
    })
    .catch((error) => {
      console.log(error);
    });




  const element = document.querySelector(".pagination ul");
  element.innerHTML = createPagination(totalPages, page);
  //calling function with passing parameters and adding inside element which is ul tag
  function createPagination(totalPages, page) {
    let liTag = '';
    let active;
    let beforePage = page - 1;
    let afterPage = page + 1;
    console.log(page)
    if (page > 1) { //show the next button if the page value is greater than 1
      liTag += `<li class="btn prev" onclick="hub_travels.seePagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (page > 2) { //if page value is less than 2 then add 1 after the previous button
      liTag += `<li class="first numb" onclick="hub_travels.seePagination(totalPages, 1)"><span>1</span></li>`;
      if (page > 3) { //if page value is greater than 3 then add this (...) after the first li or page
        liTag += `<li class="dots"><span>...</span></li>`;
      }
    }

    // how many pages or li show before the current li
    if (page == totalPages) {
      beforePage = beforePage;
    } else if (page == totalPages - 1) {
      beforePage = beforePage;
    }
    // how many pages or li show after the current li
    if (page == 1) {
      afterPage = afterPage + 2;
    } else if (page == 2) {
      afterPage = afterPage + 1;
    }

    for (var plength = beforePage; plength <= afterPage; plength++) {
      if (plength > totalPages) { //if plength is greater than totalPage length then continue
        continue;
      }
      if (plength == 0) { //if plength is 0 than add +1 in plength value
        plength = plength + 1;
      }
      if (page == plength) { //if page is equal to plength than assign active string in the active variable
        active = "active";
      } else { //else leave empty to the active variable
        active = "";
      }
      liTag += `<li class="numb ${active}" onclick="hub_travels.seePagination(totalPages, ${plength})"><span>${plength}</span></li>`;
    }

    if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
      if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        liTag += `<li class="dots"><span>...</span></li>`;
      }
      liTag += `<li class="last numb" onclick="hub_travels.seePagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
    }

    if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
      liTag += `<li class="btn next" onclick="hub_travels.seePagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }
    element.innerHTML = liTag; //add li tag inside ul tag
    return liTag; //reurn the li tag
  }
}


//BOOKING PAGE
 my_bookingPage(id, type, partner, rating, name) {
  //href="/voyage/page/${item.id}"
  localStorage.setItem("travelBookingType", type)
  var my_user_id = localStorage.getItem("user_id")
  localStorage.setItem("currentTravellerPartnerId", partner)
  localStorage.setItem("currentTravellerPartnerRating", rating)
  localStorage.setItem("currentTravellerPartnerName", name)


  if (Number(my_user_id) === Number(partner)) {
    console.log("Can not")
  } else {
    window.location.href = "/booking/page/road/" + id.toString();
  }



  console.log(id, type)
}

//LiVE SEARCH departure
 liveSearch(value) {
  var searchInput1 = document.getElementById('search_depart').value;
  var searchInput2 = document.getElementById('search_arrive').value;
  var all_results = document.getElementById('all_results');
  var all_results_div = document.getElementById('all_results_div');
  all_results.style.display = "none";
  all_results_div.style.display = "none";
  var search_info = document.getElementById('search_row');



  // Perform search
  var filteredCities = travels2.filter((item) => item.departure_city_id[1].toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredCities);
  localStorage.setItem("filteredCities", JSON.stringify(filteredCities))




  if (searchInput1 !== "") {

    const my_search_info = document.getElementById('search_row');
    if (filteredCities.length === 0) {
      my_search_info.innerHTML = `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
    }
    else {

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
        console.log("my", profilePicStatus); // Will be `true` or `false`

        const displayProfile = profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

        // Your existing code here...
        if (item.state === 'negotiating') {
          return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="hub_travels.my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]},${item.average_rating},'${item.partner_id[1]}')" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:12px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:12px;font-weight:700"> ${formattedDate}</h5>

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
 liveSearch2(value) {
  var searchInput1 = document.getElementById('search_depart').value;
  var searchInput2 = document.getElementById('search_arrive').value;
  var all_results = document.getElementById('all_results');
  var all_results_div = document.getElementById('all_results_div');

  all_results.style.display = "none";
  all_results_div.style.display = "none";
  var search_info = document.getElementById('search_row');

  // // Perform search
  // Log search results to the console

  var filteredCities1 = JSON.parse(localStorage.getItem("filteredCities"))




  if (filteredCities1 === null) {
    var filteredCities = travels2.filter((item) => item.arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));

    const my_search_info = document.getElementById('search_row');
    if (filteredCities.length === 0) {
      my_search_info.innerHTML = `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
    }
    else {

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
        console.log("my", profilePicStatus); // Will be `true` or `false`

        const displayProfile = profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

        // Your existing code here...
        if (item.state === 'negotiating') {
          return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="hub_travels.my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]},${item.average_rating},'${item.partner_id[1]}')" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:12px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:12px;font-weight:700"> ${formattedDate}</h5>

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
          const voyageHTMLPromises = filteredCities.map((item) => generateVoyageHTML(item));
          const voyageHTMLs = await Promise.all(voyageHTMLPromises);
          search_info.innerHTML = voyageHTMLs.join('');
        } catch (error) {
          console.error('Error generating voyage HTML:', error);
        }
      }

      displayVoyages()

    }

  } else if (searchInput2 !== "") {
    console.log("something in input arrival")
    var filteredCities = filteredCities1.filter((item) => item.arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));

    const my_search_info = document.getElementById('search_row');

    if (filteredCities.length === 0) {
      my_search_info.innerHTML = `<h1 style="text-align:center">No Result!!</h1>`
    } else {

      var filteredCities = filteredCities1.filter((item) => item.arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));


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
        console.log("my", profilePicStatus); // Will be `true` or `false`

        const displayProfile = profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

        // Your existing code here...
        if (item.state === 'negotiating') {
          return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="hub_travels.my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]},${item.average_rating},'${item.partner_id[1]}')" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:12px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:12px;font-weight:700"> ${formattedDate}</h5>

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
 liveSearch3(value) {
  var searchInput3 = document.getElementById('searchInput3').value;
  var searchInput2 = document.getElementById('search_arrive').value;
  var all_results = document.getElementById('all_results');
  var all_results_div = document.getElementById('all_results_div');

  all_results.style.display = "none";
  all_results_div.style.display = "none";

  var search_info = document.getElementById('search_row');



  // Perform search
  var filteredCities = travels2.filter((item) => item.booking_type.toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredCities);
  localStorage.setItem("filteredCities", JSON.stringify(filteredCities))




  if (searchInput3 !== "") {

    const my_search_info = document.getElementById('search_row');
    if (filteredCities.length === 0) {
      my_search_info.innerHTML = `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
    }
    else {

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
        console.log("my", profilePicStatus); // Will be `true` or `false`

        const displayProfile = profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

        // Your existing code here...
        if (item.state === 'negotiating') {
          return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="hub_travels.my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]},${item.average_rating},'${item.partner_id[1]}')" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:12px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:12px;font-weight:700"> ${formattedDate}</h5>

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

//Travel shipping
 my_Shipping(travelID, type, shipping_ids) {

  //COMMANDES SUR MES VOYAGES
  console.log("COMMANDES SUR MES VOYAGES")
  console.log(shipping_ids)
  localStorage.setItem("personal_shipping_ids", shipping_ids)

  window.location.href = "/travel/shipping"

}

 setNegotiation(id) {
  var partner_attachment_ids = localStorage.getItem("partner_attachment_ids")
  var publish = document.getElementById("publishTravels")

     publish.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
  if (Number(partner_attachment_ids) === 0) {
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
        response.data.map((partner_attachment_verification) => {
          if (partner_attachment_verification.conformity === true) {
            conformity = true
          }
        })
        if (conformity === false) {
          alert("your identity has not been confirmed")
        } else {
          var raw = JSON.stringify({
            "state": "negotiating"
          });
//          let config = {
//            method: 'put',
//            maxBodyLength: Infinity,
//            url: `/api/v1/write/m1st_hk_roadshipping.travelbooking?values=${raw}&ids=${id}`,
//            headers: {
//              'Accept': 'application/json',
//              'Authorization': authorization,
//            }
//          };
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
   hub_travels.my_hub_my_travels()
//     window.location.href = "";
//     window.location.href = "";

 })
 .catch((error) => {
 console.log(error)

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


 cancelTravel(id) {
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
      alert("canceled !!")
      window.location.href = ""
    })
    .catch((error) => {
      alert(error.response.data.message)
      console.log(error.response.data.message);
    });



}

 travelDetails(id){
window.location.href = `/my/travel/details/${id}`
localStorage.setItem("travelbooking_id",id)
}

setConsole(){
console.log("HELO OWL")
}


}

HubTravels.template = 'hubkilo_website.voyages'


// Creating an instance of the class
const hub_travels = new HubTravels();


const currentPath = window.location.pathname;

// Check if the current URL contains a specific path or pattern
if (currentPath === '/travels' || currentPath === '/fr/travels') {

hub_travels.user_info_voyage()
hub_travels.paginated_hub_travel()
hub_travels.all_hub_travels()


  if (Boolean(travel_type) && Boolean(arrival_town) && Boolean(departure_town)) {

  let data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "departure_city_id": Number(departure_town),
      "arrival_city_id": Number(arrival_town),
      "booking_type": travel_type
    }
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/all/road/search/travel',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      console.log("DDDDDDDDDDDDDD",response.data.result.response);
      var all_results = document.getElementById('all_results');
      var all_results_div = document.getElementById('all_results_div');

      all_results.style.display = "none";
      all_results_div.style.display = "none";
      //response.data.result.response.map((item)=> travelSearch.push(item))
//      localStorage.setItem("searchTravels", JSON.stringify(response.data.result.response))

   if(response.data.result.response){
  const search_row = document.getElementById('search_row')

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
    var displayExpedition = item.partner_id === Number(my_user_id) ? "none" : "flex"
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
    console.log("my", profilePicStatus); // Will be `true` or `false`

    const displayProfile = profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    // Your existing code here...
    if (item.state === 'negotiating') {
      return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="hub_travels.my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]},${item.average_rating},'${item.partner_id[1]}')" data-wow-delay="0.1s">
                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;">
                            <div class=" px-4 pb-2 ">
                                <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                    <i class='fas fa-bus-alt' style='font-size:38px;color:#dde3ea'></i>
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                       <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:20px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:100px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;font-size:12px;text-transform: uppercase;" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>
                                <div style="display:flex;gap: 20px;justify-content:space-between">
                                <div style="display:flex;gap: 20px;">
                                <img src=${displayProfile} alt="Your Image" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"/>
                                    <div>
                                    <h5 style="font-weight:700;font-size:12px">${item.partner_id[1]}</h5>
                                    <div style="display: flex;gap: 5px;">
                                        <i class="fa fa-star" style="color: gold;;font-size:12px"></i>
                                        <p style="font-size:12px;font-weight:700">${item.average_rating}</p>
                                    </div>
                                    </div>
                                </div>

                                <h5 class="mb-0 mb-3" style="display:flex;align-items:center;gap:20px;font-size:12px;font-weight:700"> ${formattedDate}</h5>

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
      if (response.data.result.response.length === 0) {
        search_row.innerHTML = `<h2 style='text-align:center;margin-top:100px;margin-bottom:200px'>No Travels ...</h2>`
      }
      const voyageHTMLPromises = response.data.result.response.map((item) => generateVoyageHTML(item));
      const voyageHTMLs = await Promise.all(voyageHTMLPromises);
      search_row.innerHTML = voyageHTMLs.join('');
    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

  displayVoyages();

      }



    })
    .catch((error) => {
      console.log(error);
    });



}


//TOUS MES VOYAGES
setTimeout(() => {

  //VOYAGES PAGINATION START
  const element = document.querySelector(".pagination ul");
  element.innerHTML = createPagination(totalPages, page);
  //calling function with passing parameters and adding inside element which is ul tag
  function createPagination(totalPages, page) {
    let liTag = '';
    let active;
    let beforePage = page - 1;
    let afterPage = page + 1;
    console.log(page)
    if (page > 1) { //show the next button if the page value is greater than 1
      liTag += `<li class="btn prev" onclick="hub_travels.seePagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (page > 2) { //if page value is less than 2 then add 1 after the previous button
      liTag += `<li class="first numb" onclick="hub_travels.seePagination(totalPages, 1)"><span>1</span></li>`;
      if (page > 3) { //if page value is greater than 3 then add this (...) after the first li or page
        liTag += `<li class="dots"><span>...</span></li>`;
      }
    }

    // how many pages or li show before the current li
    if (page == totalPages) {
      beforePage = beforePage;
    } else if (page == totalPages - 1) {
      beforePage = beforePage;
    }
    // how many pages or li show after the current li
    if (page == 1) {
      afterPage = afterPage + 2;
    } else if (page == 2) {
      afterPage = afterPage + 1;
    }

    for (var plength = beforePage; plength <= afterPage; plength++) {
      if (plength > totalPages) { //if plength is greater than totalPage length then continue
        continue;
      }
      if (plength == 0) { //if plength is 0 than add +1 in plength value
        plength = plength + 1;
      }
      if (page == plength) { //if page is equal to plength than assign active string in the active variable
        active = "active";
      } else { //else leave empty to the active variable
        active = "";
      }
      liTag += `<li class="numb ${active}" onclick="hub_travels.seePagination(totalPages, ${plength})"><span>${plength}</span></li>`;
    }

    if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
      if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        liTag += `<li class="dots"><span>...</span></li>`;
      }
      liTag += `<li class="last numb" onclick="hub_travels.seePagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
    }

    if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
      liTag += `<li class="btn next" onclick="hub_travels.seePagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }
    element.innerHTML = liTag; //add li tag inside ul tag
    return liTag; //reurn the li tag
  }

  //VOYAGES PAGINATION END
  const home_voyages = document.getElementById('all_results')

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
    console.log("my", profilePicStatus); // Will be `true` or `false`

    const displayProfile = profilePicStatus === "True" ? `/web/image/res.partner/${item.partner_id[0]}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    // Your existing code here...
    if (item.state === 'negotiating') {
      return `<div class="col-lg-4 col-md-6 wow fadeInUp" onclick="hub_travels.my_bookingPage(${item.id},'${item.booking_type}',${item.partner_id[0]},${item.average_rating},'${item.partner_id[1]}')" data-wow-delay="0.1s">
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
   Loader()

    try {
      if (travels1.length === 0) {
        home_voyages.innerHTML = `<h2 style='text-align:center;margin-top:100px;margin-bottom:200px'>No Travels ...</h2>`
      } else {
        const voyageHTMLPromises = travels1.map((item) => generateVoyageHTML(item));
        const voyageHTMLs = await Promise.all(voyageHTMLPromises);
        home_voyages.innerHTML = voyageHTMLs.join('');
      }

    } catch (error) {
      console.error('Error generating voyage HTML:', error);
    }
  }

  displayVoyages();
  console.log(travels1)


}, 2000)

//MY TRAVELS
setTimeout(() => {
  hub_travels.my_hub_my_travels()
}, 2000)

function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}

}








