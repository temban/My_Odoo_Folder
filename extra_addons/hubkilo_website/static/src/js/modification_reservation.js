var authorization = localStorage.getItem("authorization")

var loadFileColis1 = function (event) {
  var image = document.getElementById("image-colis11");
    image.src = URL.createObjectURL(event.target.files[0]);
}
var loadFileColis2 = function (event) {
  var image = document.getElementById("image-colis22");
    image.src = URL.createObjectURL(event.target.files[0]);
}
var loadFileColis3 = function (event) {
  var image = document.getElementById("image-colis33");
    image.src = URL.createObjectURL(event.target.files[0]);
}
//
//var loadFileColisPictureUpdate= function (event) {
//  var image_colisPictureUpdate = document.getElementById("image-colisPictureUpdate");
//    image_colisPictureUpdate.src = URL.createObjectURL(event.target.files[0]);
//}

function updateReserve(){
var selectId = localStorage.getItem("selectId")

var updatedReceiverInfo =JSON.parse(localStorage.getItem("updatedReceiverInfo"))

var luggage_id = localStorage.getItem("luggage_id")
 var save_btn = document.querySelector(".save-btn")
var user_id = localStorage.getItem("user_id")

console.log(updatedReceiverInfo)

var raw = JSON.stringify({
            "receiver_partner_id":Number(selectId),
            "shipping_price": 0.0,
            "partner_id":Number(user_id),
            "luggage_ids":[Number(luggage_id)],
          });
  var destinataire = document.getElementById('destinataire').value;

if(destinataire.trim()=== ""){
alert("Select a the receiver")
}else{
   save_btn.innerHTML = " <div class='loader'></div>"

let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${elementId}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(response.data);
save_btn.innerHTML = "Updated successfully !"
      save_btn.style = "background:#f1f5f4; color:#333; pointer-events:none"
    window.location.href = "/profile";

})
.catch((error) => {
  console.log(error);
});

}



}


function updatePictues(){
event.preventDefault();
  var url2 = window.location.href;
  var urlParts2 = url2.split("/");
  var elementId3 = urlParts2[urlParts2.length - 1];
  console.log("This booking id is a " + typeof Number(elementId3));

let image1 = document.getElementById('image-input-colis1').files[0];
let image2 = document.getElementById('image-input-colis2').files[0];
let image3 = document.getElementById('image-input-colis3').files[0];

 var pic  = document.querySelector(".pic ")


var luggage_id = localStorage.getItem("luggage_id")

     pic.innerHTML = " <div class='loader'></div>"


//image 1
let formData = new FormData();
formData.append('ufile', image1 );
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
//if(i=3){
//  window.location.href = "/profile";
//
//}

})
.catch((error) => {
  console.log(error);
  alert(error.response.data.message)

});

setTimeout(()=>{
//image 2
let formData1 = new FormData();
formData1.append('ufile', image2 );
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
formData2.append('ufile', image3 );
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
console.log('booking image added .....' )

//  window.location.href = "/profile";


})
.catch((error) => {
  console.log(error);
});

      pic.innerHTML = "Done !"

},3500)


}

//const travelBookingType = localStorage.getItem("travel_type_edit")
//console.log("type of this booking : " + travelBookingType)
//var check = "unchecked"
//// var traveler_id_id
//window.onload = function(){
//
////document.getElementById("second_des").style.display = "none";
//
//}
//
//
//setTimeout(()=>{
//
//var shipping_id_detail = localStorage.getItem("shipping_id_detail")
//let config = {
//  method: 'get',
//  maxBodyLength: Infinity,
//  url: `/api/v1/read/m1st_hk_roadshipping.shipping?ids=${shipping_id_detail}`,
//  headers: {
//    'Accept': 'application/json',
//    'Authorization': authorization,
//  }
//};
//
//axios.request(config)
//.then((response) => {
//  console.log(response.data);
//
//  response.data.map((item)=>{
//var my_luggage_id = item.luggage_ids[0]
//
//     if(my_luggage_id === ""){
//     console.log("empty")
//     }else{
//
//let config = {
//  method: 'get',
//  maxBodyLength: Infinity,
//  url: `/api/v1/read/m1st_hk_roadshipping.luggage?ids=${my_luggage_id}`,
//  headers: {
//    'Accept': 'application/json',
//    'Authorization': authorization,
//  }
//};
//
//axios.request(config)
//.then((response) => {
//  response.data.map((luggage)=>{
//console.log("my luggage id ",luggage.id )
//
//localStorage.setItem("luggage_id",luggage.id)
//
//document.getElementById("image-colis1").src = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image1";
//document.getElementById("image-colis2").src = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image2";
//document.getElementById("image-colis3").src = "/web/image/m1st_hk_roadshipping.luggage/"+luggage.id+"/luggage_image3";
//
//
//  })
//
//})
//.catch((error) => {
//  console.log(error);
//});
//
//     }
//
//
//  })
//
//})
//.catch((error) => {
//  console.log(error);
//});
//
//},2000)
//
//



