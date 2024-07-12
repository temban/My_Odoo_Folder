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
  response.data.map((travel)=>localStorage.setItem("myTravels",travel.travelbooking_ids) )
  response.data.map((travel)=>{
  localStorage.setItem("myShipping",travel.shipping_ids)

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

 //MY DESTINATIONS ROAD
 setTimeout(()=>{
 var user_id = localStorage.getItem("user_id")

 axios.get(`/api/v1/search_read/m1st_hk_roadshipping.shipping`, {
        headers: {
    'Accept': 'application/json',
    'Authorization': authorization
        },
      }).then(response => {
 console.log("my destinations")
 console.log(response.data)

 // Check if emptyArray is empty
if (response.data.length === 0) {
  console.log("emptyArray is empty");
} else {
  console.log("emptyArray is not empty");
}


     const my_parcels = document.getElementById('my_parcels')

    my_parcels.innerHTML=response.data.map((table)=>{
    localStorage.setItem("qrcode",table.name)
    var displayNegociation = table.state === "negotiating" ? 'inline' :'none';
    var displayTrans = table.state === "accepted" ? 'none' :'inline';

    let datetime = table.create_date;
let time = datetime.split(" ")[1];

     localStorage.setItem("qrcode",table.name)
     var displayNegociation = table.state === "negotiating" ? 'inline' :'none';
     var displayChatButton = table.state === "pending" ? 'inline' :'none';
     var displayCodeButton = table.state === "confirm" ? 'inline' :'none';
     var displayPayButton = table.state === "accepted" ? 'inline' :'none';
     var displayInvoiceButton = table.move_id === false ? 'none' :'inline';
     var displayTrans = table.state === "rejected" || table.state === "pending"  ? 'inline' :'none'
     var others = table.state === "rejected" || table.state === "pending" ? 'inline' :'none'
var color = table.state === "rejected" && 'RGB(255,0,0)' || table.state === "received" && '#4472C4' || table.state === "accepted" && 'RGB(255,192,0)' || table.state === "paid" && 'RGB(0,176,80)'|| table.state === "pending" && 'RGB(165,165,165)'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'RGB(112,48,160)'
var content = table.state === "rejected" && 'Rejected' || table.state === "received" && 'Delivered' || table.state === "accepted" && 'Dispatched' || table.state === "paid" && 'Paid'|| table.state === "pending" && 'Pending'|| table.state === "pending" && 'RGB(165,165,165)' || table.state === "confirm" && 'Received'
     var border = table.state === "rejected" ? 'solid red 1px' :'solid blue 1px'



var my_state_content = table.disagree === true ? `<div class="badge1 state" style="display:flex;background: red;color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">Rejected</div>` : `<div class="badge1 state" style="background:${color};border:1px solid ${color};color:white;position: relative;display: flex;justify-content: center;top: 50px;right: -50px;font-size:12px;font-weight: 700;width:300px;transform: rotate(45deg);text-transform: capitalize;">${content}</div>`


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


    if(Number(user_id) === Number(table.receiver_partner_id[0])){

     return `<div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">

                        <div class="room-item shadow overflow-hidden" style="border-radius:30px;position:relative">

                         <div class="container_badge" style="position: absolute;top: -30px;right: -20px;height: 50px; width: 250px">
                         ${my_state_content}
                         </div>


                            <div class="px-4 pb-4">

                            <div style="display: flex;justify-content:start;gap:10px;align-items: center;margin-top:20px">

                            <h6 class="" style="font-weight:700;color:black;font-size:16px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" >Reference :</h6>
                            <h6 class="" style="color:black;font-size:16px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" >${table.display_name}</h6>

                            </div>

                            <div class="d-flex justify-content-between">
                                    <div style="display: flex;gap: 10px;align-items: center;">
                                      <div class="mt-4 heading" style="display:flex;align-items: center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                      <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:16px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >DEPARTURE</h6>
                                       <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${departure_city}</h6>
                                    <p style=";font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px" class="heading text-center">${departure_country}</p>
                                    </div>
                                    <div style="display: flex;align-items: center;">
                                <i class='fas fa-arrow-right' style='font-size:24px;'></i>
                                    </div>
                                   <div class="mt-4 heading" style="display:flex;align-items:center;flex-direction: column;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                                    <h6 class="text-center" style="font-weight:700;color:#217aff;font-size:16px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >ARRIVAL</h6>
                                    <h6 class="text-center" style="color:#217aff;font-size:12px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:120px" >${arrival_city}</h6>
                                    <p style="white-space: nowrap;font-size:12px;overflow: hidden;text-overflow: ellipsis;width:90px" class="heading text-center">${arrival_country}</p>
                                   </div>
                                    </div>
                                </div>



                                <div style="display: flex;justify-content: center;gap: 10px;margin-top:5px;">

                                 <button class="btn py-2 px-4" onclick="seeLuggage(${table.luggage_ids[0]})"
                                  style="background: #000000;color:white;border-radius:5px;font-size:10px;text-transform: capitalize"
                                  data-bs-toggle="modal" data-bs-target="#exampleModalL">View luggage info</button>

                                   <button onclick="ViewCode('${table.travel_code}',${table.id})" style="display:${displayCodeButton};font-size:12px;text-transform: capitalize" href="#" class="btn btn-danger" style="" data-bs-toggle="modal" data-bs-target="#exampleModalR">
                                     View Code
                                   </button>
                                </div>
                            </div>
                        </div>
                               <!-- MODAL LUGGAGE START -->
        <div class="modal fade" id="exampleModalL" tabindex="-1" aria-labelledby="exampleModalLabelL"
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


        <!-- MODAL VIEW CODE START -->
    <div class="modal fade" id="exampleModalR" tabindex="-1" aria-labelledby="exampleModalLabelR" aria-hidden="true">
   <div class="modal-dialog">
     <div class="modal-content">
       <div class="modal-header">
         <h5 class="modal-title" id="exampleModalLabel">Shipping Validation</h5>
         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
       </div>
       <div class="modal-body" style="padding:20px">
         <div id="qrcode" style="display:flex;justify-content:center;align-items:center"></div>
       </div>
       <div class="">
         <h5 style="text-align:center;">Validation Code: <b id="code_id" style="color:red;text-align:center"> </b> </h5>
       </div>
       <div class="modal-footer">
         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
       </div>
     </div>
   </div>
 </div>
        <!-- MODAL VIEW CODE END -->

                    </div>`
    }




   }).join("")

Loader()



 })
 .catch(function(error) {
             console.log(error);
         })


 },1000)

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

function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}
