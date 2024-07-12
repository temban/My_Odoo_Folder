
var authorization = localStorage.getItem("authorization")

//GLOBAL VARIABLES
var totalPages, page


//GET TRY ALL TRAVELS FOR SEARCH START
var paginatedShippingOffers = []

 function  all_hub_shipping() {
  let data = JSON.stringify({
    "jsonrpc": "2.0"
  });
  axios.post('/all/hub_road/shipping', {
    headers: {
      'Accept': 'application/json',
      'Authorization': authorization,
    },
    data: data
  })
    .then(response => {
      console.log("PAGINATED SHIPPING",response.data.result)
      response.data.result.shipping_data.map((item) => paginatedShippingOffers.push(item))
      page = 1
      totalPages = response.data.result.total_pages
    })
    .catch(function (error) {
      console.log(error);
    })
}
all_hub_shipping()

function displayShipping(){
console.log("LIST OF PAGINATED SHIPPING",paginatedShippingOffers)
     const offers_results = document.getElementById('offers_results')

     // Check if emptyArray is empty
if (paginatedShippingOffers.length === 0) {
Loader()
offers_results.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:48px;color:#79a1de">No Shipping</h1>`
}
else {
Loader()
     //SHOW SHIPPING
   offers_results.innerHTML = paginatedShippingOffers.map((table)=>{


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
                                        <h6 class="mb-0" style="font-weight: 700;color: #021531;font-size:12px">${table.name}</h6>
                                        <h6 class="mb-0" style="color:#217aff;font-size:12px;">${formattedDate}</h6>
                                    </div>
                                </div>

                                <div style="display: flex;justify-content:space-between;gap: 40px;margin-top:20px">
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
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
  //Shipping PAGINATION START
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
      liTag += `<li class="btn prev" onclick="seePagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (page > 2) { //if page value is less than 2 then add 1 after the previous button
      liTag += `<li class="first numb" onclick="seePagination(totalPages, 1)"><span>1</span></li>`;
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
      liTag += `<li class="numb ${active}" onclick="seePagination(totalPages, ${plength})"><span>${plength}</span></li>`;
    }

    if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
      if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        liTag += `<li class="dots"><span>...</span></li>`;
      }
      liTag += `<li class="last numb" onclick="seePagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
    }

    if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
      liTag += `<li class="btn next" onclick="seePagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }
    element.innerHTML = liTag; //add li tag inside ul tag
    return liTag; //reurn the li tag
  }



displayShipping()
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
 console.log("my shipping offers............")
  console.log(response.data)
//   response.data.map((item)=>shippingOffers.push(item))

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


function seePagination(totalPages, page) {
  let data = JSON.stringify({
    "jsonrpc": "2.0",
    "params": {
      "page": page
    }
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/all/hub_road/shipping',
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
          liTag += `<li class="btn prev" onclick="seePagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
        }

        if (page > 2) { //if page value is less than 2 then add 1 after the previous button
          liTag += `<li class="first numb" onclick="seePagination(totalPages, 1)"><span>1</span></li>`;
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
          liTag += `<li class="numb ${active}" onclick="seePagination(totalPages, ${plength})"><span>${plength}</span></li>`;
        }

        if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
          if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
            liTag += `<li class="dots"><span>...</span></li>`;
          }
          liTag += `<li class="last numb" onclick="seePagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
        }

        if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
          liTag += `<li class="btn next" onclick="seePagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
        }
        element.innerHTML = liTag; //add li tag inside ul tag
        return liTag; //reurn the li tag
      }

           const offers_results = document.getElementById('offers_results')
          offers_results.innerHTML = ""
     // Check if emptyArray is empty
if (response.data.result.shipping_data.length === 0) {
Loader()
offers_results.innerHTML = `<h1 style="text-align:center;margin-top:200px;margin-bottom:200px;font-size:48px;color:#79a1de">No Shipping</h1>`


}
else {
Loader()
     //SHOW SHIPPING
   offers_results.innerHTML = response.data.result.shipping_data.map((table)=>{


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
                                        <h6 class="mb-0" style="font-weight: 700;color: #021531;font-size:12px">${table.name}</h6>
                                        <h6 class="mb-0" style="color:#217aff;font-size:12px;">${formattedDate}</h6>
                                    </div>
                                </div>

                                <div style="display: flex;justify-content:space-between;gap: 40px;margin-top:20px">
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
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
      liTag += `<li class="btn prev" onclick="seePagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (page > 2) { //if page value is less than 2 then add 1 after the previous button
      liTag += `<li class="first numb" onclick="seePagination(totalPages, 1)"><span>1</span></li>`;
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
      liTag += `<li class="numb ${active}" onclick="seePagination(totalPages, ${plength})"><span>${plength}</span></li>`;
    }

    if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
      if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        liTag += `<li class="dots"><span>...</span></li>`;
      }
      liTag += `<li class="last numb" onclick="seePagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
    }

    if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
      liTag += `<li class="btn next" onclick="seePagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }
    element.innerHTML = liTag; //add li tag inside ul tag
    return liTag; //reurn the li tag
  }
}




//GO TO SHIPPING TRAVEL PAGE
function my_bookingPage_shipping(type,my_shipping_id){
localStorage.setItem("travelBookingType",type)
localStorage.setItem("shipping_id_detail",my_shipping_id)

window.location.href = "/shipping/offers/details"

}


//LiVE SEARCH departure
 function liveSearchOffers(value) {
  var searchInput1 = document.getElementById('search_depart').value;
  var searchInput2 = document.getElementById('search_arrive').value;
//  var all_results = document.getElementById('all_results');
  var all_shipping_div = document.getElementById('all_shipping_div');
//  all_results.style.display = "none";
  all_shipping_div.style.display = "none";
  var search_info = document.getElementById('search_row_shipping_offers');



  // Perform search
  var filteredCities = shippingOffers.filter((item) => item.shipping_departure_city_id[1].toLowerCase().includes(value.toLowerCase()));

  // Log search results to the console
  console.log(filteredCities);
  localStorage.setItem("filteredCities", JSON.stringify(filteredCities))




  if (searchInput1 !== "") {

    const search_row_shipping_offers = document.getElementById('search_row_shipping_offers');
    if (filteredCities.length === 0) {
      search_row_shipping_offers.innerHTML = `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
    }
    else {

     search_info.innerHTML = filteredCities.map((table)=>{


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
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
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
}

//LiVE SEARCH arrival
 function liveSearchOffers2(value) {
  var searchInput1 = document.getElementById('search_depart').value;
  var searchInput2 = document.getElementById('search_arrive').value;
//  var all_results = document.getElementById('all_results');
  var all_shipping_div = document.getElementById('all_shipping_div');

//  all_results.style.display = "none";
  all_shipping_div.style.display = "none";
  var search_info = document.getElementById('search_row_shipping_offers');

  // // Perform search
  // Log search results to the console

  var filteredCities1 = JSON.parse(localStorage.getItem("filteredCities"))




  if (filteredCities1 === null) {
    var filteredCities = shippingOffers.filter((item) => item.shipping_arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));

    const my_search_info = document.getElementById('search_row_shipping_offers');
    if (filteredCities.length === 0) {
      my_search_info.innerHTML = `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
    }
    else {

     search_info.innerHTML = filteredCities.map((table)=>{


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
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
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

  } else if (searchInput2 !== "") {
    console.log("something in input arrival")
    var filteredCities = filteredCities1.filter((item) => item.shipping_arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));

    const my_search_info = document.getElementById('search_row_shipping_offers');

    if (filteredCities.length === 0) {
      my_search_info.innerHTML = `<h1 style="text-align:center">No Result!!</h1>`
    } else {

      var filteredCities = filteredCities1.filter((item) => item.shipping_arrival_city_id[1].toLowerCase().includes(value.toLowerCase()));

     search_info.innerHTML = filteredCities.map((table)=>{


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
                                <div class="" style="display: flex;justify-content:start;gap: 10px;">
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
}


function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}

//setTimeout(()=>{
//Loader()
//},2000)
