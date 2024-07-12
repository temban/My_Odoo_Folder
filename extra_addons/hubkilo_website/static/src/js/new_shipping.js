

var authorization = localStorage.getItem("authorization")

var url = window.location.href;
var urlParts = url.split("/");
var elementId = urlParts[urlParts.length - 1];
localStorage.removeItem("selectId");
localStorage.removeItem("selected_luggage");
localStorage.removeItem("My_luggage_type");
localStorage.removeItem("receiver_city_id")
localStorage.removeItem("selectName")
  console.log("booking page " + elementId);

//
//setTimeout(()=>{
//    const phoneInputField = document.getElementById("phone1");
//const phoneInput = window.intlTelInput(phoneInputField, {
//      utilsScript:
//      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
//      });
//},5000)

var loadFileColisPicture= function (event) {
  var image_colisPicture = document.getElementById("image-colisPicture");
    image_colisPicture.src = URL.createObjectURL(event.target.files[0]);
}

var loadFileColis11 = function (event,inputId) {
  var image = document.getElementById("image-colis1");
  var image11 = document.getElementById("image-colis11");

    var file = event.target.files[0];

  // Check if the selected file is an image (jpeg, jpg, png, gif)
  var allowedExtensions = ["jpg", "jpeg", "png"];
  var fileExtension = file.name.split(".").pop().toLowerCase();

  if (allowedExtensions.indexOf(fileExtension) === -1) {
            document.getElementById(inputId).value = "";
            image.src = ""; // Optionally clear the image source
            image11.src = ""; // Optionally clear the image source
//            alert("Please select a valid image file.");

    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Please select a valid image file</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

  }else{
     image.src = URL.createObjectURL(event.target.files[0]);
    image11.src = URL.createObjectURL(event.target.files[0]);
  }


}
var loadFileColis22 = function (event,inputId) {
  var image = document.getElementById("image-colis2");
  var image22 = document.getElementById("image-colis22");

    var file1 = event.target.files[0];

  // Check if the selected file is an image (jpeg, jpg, png, gif)
  var allowedExtensions = ["jpg", "jpeg", "png"];
  var fileExtension = file1.name.split(".").pop().toLowerCase();

  if (allowedExtensions.indexOf(fileExtension) === -1) {
                document.getElementById(inputId).value = "";
            image.src = ""; // Optionally clear the image source
            image22.src = ""; // Optionally clear the image source
//                alert("Please select a valid image file (jpg, jpeg, png).");
                    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Please select a valid image file (jpg, jpeg, png)</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

  }else{
      image.src = URL.createObjectURL(event.target.files[0]);
    image22.src = URL.createObjectURL(event.target.files[0]);
  }


}
var loadFileColis33 = function (event,inputId) {
  var image = document.getElementById("image-colis3");
  var image33 = document.getElementById("image-colis33");

    var file = event.target.files[0];

  // Check if the selected file is an image (jpeg, jpg, png, gif)
  var allowedExtensions = ["jpg", "jpeg", "png"];
  var fileExtension = file.name.split(".").pop().toLowerCase();

  if (allowedExtensions.indexOf(fileExtension) === -1) {
                document.getElementById(inputId).value = "";
            image.src = ""; // Optionally clear the image source
            image33.src = ""; // Optionally clear the image source
//            alert("Please select a valid image file (jpg, jpeg, png).");

                    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Please select a valid image file (jpg, jpeg, png)</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
  }else{
      image.src = URL.createObjectURL(event.target.files[0]);
    image33.src = URL.createObjectURL(event.target.files[0]);
  }


}

   //USER INFO
   axios
   .get("/api/res_partner/")
   .then((response) => {
   console.log("user Info")
     var userId = response.data.partner.id

//         console.log("USER INFO");
//         console.log(response.data.partner);
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
  response.data.map((travel)=>localStorage.setItem("myShipping",travel.shipping_ids) )
  response.data[0].partner_attachment_ids.length >= 1 ? localStorage.setItem("partner_attachment_ids", response.data[0].partner_attachment_ids) : localStorage.setItem("partner_attachment_ids", 0)

  response.data.map((receiver)=>{
//       console.log(receiver.receiver_partner_ids)
localStorage.setItem("receiver_partner_ids",receiver.receiver_partner_ids)
  //SPECIFIC PARTNER IDS
  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/res.partner?ids=[${receiver.receiver_partner_ids}]`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  response.data.map((options)=>{
//    console.log(options);

  var selectElement = document.getElementById("destinataireShippingOffer");

  var optionsHTML = response.data.map((options)=>{
//  return `<option></option><option value="${options.id}">${options.name}</option>`
var email = options.email === false ? "No Email" : options.email

  return `<div class="col-md-6"><div id="my_reserve_button${options.id}" onclick="myBooking2(${options.id},'${options.name}',6)" style="background:white;display:flex;align-items:center;gap:20px;margin-top:5px;box-shadow:1px 10px 30px rgba(126, 124, 124, 0.24);padding:10px;margin:5px">
               <div>
                 <img src="${options.image_1920 ? '/web/image/res.partner/' + options.id + '/image_1920' : '/hubkilo_website/static/src/img/avatar-profile.png'}" alt="Your Image" style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover;"/>
               </div>
               <div>
                 <p style="font-size:12;font-weight:800"  class="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:150px;">${options.name}</p>
                 <p style="font-size:12;font-weight:300" class="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:170px;">${email}</p>
               </div>
             </div>

           </div></div>`
  }).join("");
  selectElement.innerHTML = optionsHTML;

  })
})
.catch((error) => {
  console.log(error);
});

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



function donow(){
console.log("hello")
}

//VERIFIER LE DESTINATAIR
function handleCheckboxChange(checkbox) {
    var recipient_form = document.getElementById("recipient_form");

  if (!checkbox.checked) {
    console.log("Checkbox is checked..");
    var second_des = document.getElementById("second_des");
    var my_reserve_button = document.getElementById("my_reserve_button");
    var verifyNewReceiver = document.getElementById("verifyNewReceiver");
    var my_reserve_button2 = document.getElementById("my_reserve_button2");
    var verifyNewReceiver2 = document.getElementById("verifyNewReceiver2");
    second_des.style.display = "block";
    my_reserve_button2.style.display = "block";
    recipient_form.style.display = "none";
    my_reserve_button.style.display = "none";
    my_reserve_button.style.display = "block";
    verifyNewReceiver.style.display = "none";
    verifyNewReceiver.style.display = "block";
    my_reserve_button2.style.display = "none";
    verifyNewReceiver2.style.display = "none";
  } else {
    console.log("Checkbox is unchecked");
    var recipient_form = document.getElementById("recipient_form");
    var second_des = document.getElementById("second_des");
    var my_reserve_button = document.getElementById("my_reserve_button");
    var my_reserve_button2 = document.getElementById("my_reserve_button2");

    var verifyNewReceiver = document.getElementById("verifyNewReceiver");
    var verifyNewReceiver2 = document.getElementById("verifyNewReceiver2");

    second_des.style.display = "none";
    recipient_form.style.display = "inline";
    my_reserve_button2.style.display = "block";
    my_reserve_button.style.display = "none";
    verifyNewReceiver.style.display = "none";
    verifyNewReceiver2.style.display = "block";

//    recipient_form.innerHTML = ``;
  }


}

 async function handleSelectChange(selectElement) {
    var selectedValue = selectElement.value;
    console.log(selectedValue);
     var selectedText = selectElement.options[selectElement.selectedIndex].textContent;


    localStorage.setItem("selectId",Number(selectedValue))
    localStorage.setItem("selectName",selectedText)

    //image destinataire
      var destinataire_image = document.getElementById("destinataire_image");

       try {
      const response = await axios.get(`/check_profile_pic/${selectedValue}`);
//      if(response.data === "True"){
//       destinataire_image.innerHTML= `<img style="width:150px;height:150px;margin-bottom:10px" src="/web/image/res.partner/${selectedValue}/image_1920"/>`
//
//      }else{
//             destinataire_image.innerHTML= `<img style="width:150px;height:150px;margin-bottom:10px" src="/hubkilo_website/static/src/img/avatar-profile.png"/>`
//
//      }
      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }



//BOOKING
function myBookingOrder(event,section){
console.log("Going booking one")

const user_id = localStorage.getItem("user_id")

var selected_luggage = localStorage.getItem("selected_luggage")
var luggage_id = localStorage.getItem("luggage_id")

var destinataire = localStorage.getItem("selectId")
//var my_destinataire = document.getElementById('destinataireShippingOffer').value;

var myBookingId ;

var selectedArriveCityId = localStorage.getItem("selectedArriveCityId")
var selectedDepartCityId = localStorage.getItem("selectedDepartCityId")
var date_de_depart_offer = document.getElementById("date_de_depart_offer").value
var date_de_arrivee_offer = document.getElementById("date_de_arrivee_offer").value

var departure_d = date_de_depart_offer.replace('T', ' ').substr(0, 16)
var arrival_d = date_de_arrivee_offer.replace('T', ' ').substr(0, 16)


let my_booking_picture = document.getElementById('image-input-id-card').value.trim() === "";
let my_booking_picture1 = document.getElementById('image-input-id-card1').value.trim() === "";
let my_booking_picture2 = document.getElementById('image-input-id-card2').value.trim() === "";

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


var travelbooking_id = localStorage.getItem("travelbooking_id")
console.log("booking road")
console.log(travelbooking_id)
var luggage_id = localStorage.getItem("luggage_id")

console.log("my luggage id",luggage_id )


var raw = JSON.stringify({
//            "travelbooking_id": Number(travelbooking_id),
            "receiver_partner_id": Number(destinataire),
//            "receiver_source": "database",
            "luggage_ids": [Number(luggage_id)],
            "partner_id":Number(user_id),
            "shipping_departure_city_id": selectedDepartCityId,
            "shipping_arrival_city_id": selectedArriveCityId,
            "shipping_departure_date": departure_d,
            "shipping_arrival_date": arrival_d,
          });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/m1st_hk_roadshipping.shipping?values=${raw}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  if(response.data){

var booking_picture1 = document.getElementById('image-input-id-card').files[0];
var booking_picture2= document.getElementById('image-input-id-card1').files[0];
var booking_picture3 = document.getElementById('image-input-id-card2').files[0];


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

      button.innerHTML = "Done !"
      button.style = "background:#f1f5f4; color:#333; pointer-events:none"
  button.disabled = true;


            document.getElementById("sectionn" + section).style.display = "none";
            document.getElementById("sectionn" + (section + 1)).style.display = "flex";

            document.querySelector(".side_bar_item_icon.active").classList.remove("active");
            document.querySelector(`[data-step="${section + 1}"]`).classList.add("active");

            document.querySelector(".side_bar_item_icon_text.activeText").classList.remove("activeText");
            document.querySelector(`[data-step1="${section + 1}"]`).classList.add("activeText");

            currentSection = section + 1;

            // Update the current step to have the check icon and change the background color
            const currentStep = document.querySelector(`[data-step="${section}"]`);
            const currentStep1 = document.querySelector(`[data-step1="${section}"]`);
            currentStep.innerHTML = '<i class="fa fa-check"></i>';
            currentStep.classList.add("completed");
            currentStep1.classList.add("completed");

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

//BOOKING
function myBooking2(id,name,section){

document.getElementById("my_reserve_button2").style.display = "none"
document.getElementById("my_reserve_button").style.display = "block"

localStorage.setItem("selectId",id)
localStorage.setItem("selectName",name)

var selectName = localStorage.getItem("selectName")
var average_weight= localStorage.getItem("average_weight")
var average_height= localStorage.getItem("average_height")
var average_width= localStorage.getItem("average_width")

var my_receiver_name = document.getElementById("my_receiver_name")
var my_receiver_image = document.getElementById("my_receiver_image")
var receiver_dimension = document.getElementById("receiver_dimension")

async function checkProfilePicStatus() {
     try {
      const response = await axios.get(`/check_profile_pic/${id}`);
   const displayReceiverProfile = response.data === "True" ? `/web/image/res.partner/${id}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"
   my_receiver_image.innerHTML = `<img src=${displayReceiverProfile} alt="Your Image" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;"/>`

      return response.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
    } catch (error) {
      console.error('Error checking profile picture status:', error);
      return null;
    }
  }
checkProfilePicStatus()



document.getElementById('confirmDepartCity').value = document.getElementById('ville_de_depart').value;
document.getElementById('confirmDepartDate').value = document.getElementById('date_de_depart_offer').value.replace('T', ' ').substr(0, 16)
document.getElementById('confirmArrivalCity').value = document.getElementById('ville_de_arriver').value
document.getElementById('confirmArrivalDate').value = document.getElementById('date_de_arrivee_offer').value.replace('T', ' ').substr(0, 16)



my_receiver_name.innerHTML = `<span style="text-transform: uppercase">${name}</span>`
receiver_dimension.innerHTML = `<h6>Dimensions: <span style="color:#217aff">${average_width}</span> X <span style="color:#217aff">${average_height}</span></h6>
                                 <h6>Weight: <span style="color:#217aff">${average_weight}</span> kg </h6>`


                 document.getElementById("sectionn" + section).style.display = "none";
                document.getElementById("sectionn" + (section + 1)).style.display = "flex";

            document.querySelector(".side_bar_item_icon.active").classList.remove("active");
            document.querySelector(`[data-step="${section + 1}"]`).classList.add("active");

            document.querySelector(".side_bar_item_icon_text.activeText").classList.remove("activeText");
            document.querySelector(`[data-step1="${section + 1}"]`).classList.add("activeText");

            currentSection = section + 1;

            // Update the current step to have the check icon and change the background color
            const currentStep = document.querySelector(`[data-step="${section}"]`);
            const currentStep1 = document.querySelector(`[data-step1="${section}"]`);
            currentStep.innerHTML = '<i class="fa fa-check"></i>';
            currentStep.classList.add("completed");
            currentStep1.classList.add("completed");



}





//BOOKING PAGE
function bookingPage(id,type,kilo){
//href="/voyage/page/${item.id}"
localStorage.setItem("travelBookingType",type)

  window.location.href = "/voyage/page/"+type + "/" + id.toString();

console.log(id,type)
}


//a user's address book 2 by
function createUserAndManualOrder(section){
 console.log("New Manual Going Booking")
var user_id = localStorage.getItem("user_id")
var selected_luggage = localStorage.getItem("selected_luggage")
var receiver_city_id = localStorage.getItem("receiver_city_id")
var luggage_id = localStorage.getItem("luggage_id")
var receiver_name = document.getElementById("receiver_name").value
var receiver_email = document.getElementById("receiver_email").value
var receiver_phone = document.getElementById("receiver_phone").value
var receiver_address = document.getElementById("receiver_address").value
var selectedArriveCityId = localStorage.getItem("selectedArriveCityId")
var selectedDepartCityId = localStorage.getItem("selectedDepartCityId")
var date_de_depart_offer = document.getElementById("date_de_depart_offer").value
var date_de_arrivee_offer = document.getElementById("date_de_arrivee_offer").value

var departure_d = date_de_depart_offer.replace('T', ' ').substr(0, 16)
var arrival_d = date_de_arrivee_offer.replace('T', ' ').substr(0, 16)


let my_booking_picture = document.getElementById('image-input-id-card').value.trim() === "";
let my_booking_picture1 = document.getElementById('image-input-id-card1').value.trim() === "";
let my_booking_picture2 = document.getElementById('image-input-id-card2').value.trim() === "";
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
  button.disabled = true;
var travelbooking_id = localStorage.getItem("travelbooking_id")
console.log("booking road")
console.log(travelbooking_id)
var luggage_id = localStorage.getItem("luggage_id")

console.log("my luggage id",luggage_id )

var raw = JSON.stringify({
//            "travelbooking_id": Number(travelbooking_id),
            "partner_id":Number(user_id),
            "receiver_source":"manual",
            "luggage_ids": [Number(luggage_id)],
            "receiver_email_set": receiver_email,
            "receiver_phone_set": receiver_phone,
            "receiver_name_set": receiver_name,
            "receiver_street_set": receiver_address,
            "receiver_city_id": receiver_city_id,
            "register_receiver": "True",
            "shipping_departure_city_id": selectedDepartCityId,
            "shipping_arrival_city_id": selectedArriveCityId,
            "shipping_departure_date": departure_d,
            "shipping_arrival_date": arrival_d,
          });

          let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/m1st_hk_roadshipping.shipping?values=${raw}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));

  if(response.data){
  var shippingId = response.data[0]

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
var booking_picture1 = document.getElementById('image-input-id-card').files[0];
var booking_picture2= document.getElementById('image-input-id-card1').files[0];
var booking_picture3 = document.getElementById('image-input-id-card2').files[0];

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


        button.disabled = true;


            document.getElementById("sectionn" + (section)).style.display = "none";
            document.getElementById("sectionn" + (section + 1)).style.display = "flex";

            document.querySelector(".side_bar_item_icon.active").classList.remove("active");
            document.querySelector(`[data-step="${section + 1}"]`).classList.add("active");

            document.querySelector(".side_bar_item_icon_text.activeText").classList.remove("activeText");
            document.querySelector(`[data-step1="${section + 1}"]`).classList.add("activeText");

            currentSection = section + 1;

            // Update the current step to have the check icon and change the background color
            const currentStep = document.querySelector(`[data-step="${section}"]`);
            const currentStep1 = document.querySelector(`[data-step1="${section}"]`);
            currentStep.innerHTML = '<i class="fa fa-check"></i>';
            currentStep.classList.add("completed");
            currentStep1.classList.add("completed");

            const currentStepp = document.querySelector(`[data-step="${section - 1}"]`);
            const currentStep11 = document.querySelector(`[data-step1="${section - 1}"]`);

            currentStepp.innerHTML = '<i class="fa fa-check"></i>';
            currentStepp.classList.add("completed");
            currentStep11.classList.add("completed");

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

//a user's address book
function createUserAndBook(){
console.log("clicking")

var receiver_name = document.getElementById("receiver_name").value
var receiver_email = document.getElementById("receiver_email").value
var receiver_phone = document.getElementById("receiver_phone").value
var receiver_address = document.getElementById("receiver_address").value

var user_id = localStorage.getItem("user_id")
var selected_luggage = localStorage.getItem("selected_luggage")
var luggage_id = localStorage.getItem("luggage_id")

let my_booking_picture = document.getElementById('image-input-id-card').value.trim() === "";
let my_booking_picture1 = document.getElementById('image-input-id-card1').value.trim() === "";
let my_booking_picture2 = document.getElementById('image-input-id-card2').value.trim() === "";
 let my_image_Picture = document.getElementById('image-input-colisPicture').value.trim() === "";



if(receiver_name.trim()=== "" || receiver_email.trim()=== "" || receiver_phone.trim()=== "" || receiver_address.trim()=== ""){
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
 var save_btn = document.querySelector(".save-btn")

   save_btn.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
     var button = document.querySelector(".save-btn");
  button.disabled = true;

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/res.users?values={\n  "name": "${receiver_name}",\n "login": "${receiver_email}",\n  "phone": "${receiver_phone}",\n  "sel_groups_1_9_10": 9\n}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
var id = response.data
  if(response.data){


let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/res.users?ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
response.data.map((partner_info)=>{
console.log(partner_info.partner_id)
localStorage.setItem("user_id2",partner_info.partner_id[0])

if(partner_info.partner_id){


// var button = document.getElementById('my_reserve_button');
//  button.disabled = true;

var travelbooking_id = localStorage.getItem("travelbooking_id")
console.log("booking road")
console.log(travelbooking_id)
var luggage_id = localStorage.getItem("luggage_id")

console.log("my luggage id",luggage_id )


var raw = JSON.stringify({
            "travelbooking_id": Number(travelbooking_id),
            "receiver_partner_id": Number(partner_info.partner_id[0]),
            "shipping_price": 0.0,
            "partner_id":Number(user_id),
            "luggage_ids": [Number(luggage_id)]

          });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/m1st_hk_roadshipping.shipping?values=${raw}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
//  window.location.href="/profile"
})
.catch((error) => {
  console.log(error);
});


//setTimeout(() => {

var booking_picture1 = document.getElementById('image-input-id-card').files[0];
var booking_picture2= document.getElementById('image-input-id-card1').files[0];
var booking_picture3 = document.getElementById('image-input-id-card2').files[0];



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
//if(i=3){
//  window.location.href = "/profile";
//
//}

})
.catch((error) => {
  console.log(error);
  alert(error.response.data.message)
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

})
.catch((error) => {
  console.log(error);
});


//NEW USER IMAGE CREATE
var user_id2 = localStorage.getItem("user_id2")
 var image_input_colisPicture = document.getElementById('image-input-colisPicture').files[0];
var image_input_colisPictureData = new FormData();
image_input_colisPictureData.append('ufile', image_input_colisPicture);
     let ProfileConfig = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/res.partner/${user_id2}/image_1920`,
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
   var save_btn = document.querySelector(".save-btn")

save_btn.innerHTML = "Booking Done!"
      save_btn.style = "background:#f1f5f4; color:#333; pointer-events:none"
    window.location.href = "/my/shipping";
})
.catch((error) => {
  console.log(error);
   var save_btn = document.querySelector(".save-btn")

     save_btn.innerHTML = "Submit"
  var button = document.querySelector(".save-btn");
  button.disabled = false;
});




},3500)




}{
console.log("No partner Id")
}

})
})
.catch((error) => {
  console.log(error);
});


  }else{
  console.log("error on specific user")
  }




})
.catch((error) => {
  console.log(error);
//  alert(error.response.data.message)
           var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

});

}


}



//getAllPartners
var allPartners
function getAllPartners(){
let data = '{\r\n    "jsonrpc":"2.0"\r\n}';

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '/all/partners',
  data : data
};

axios.request(config)
.then((response) => {
console.log("allPartners",response.data)
allPartners = response.data
//  sessionStorage.setItem("allPartners",JSON.stringify(response.data) )
})
.catch((error) => {
  console.log(error);
});

}
getAllPartners()


//Search partners
function searchPartners(value){
console.log("New Editing Partners")
//var allPartners = JSON.parse(sessionStorage.getItem("allPartners"))
//console.log("my partners",allPartners)
let receiver_button = document.getElementById("receiver_button")
let receiver_email = document.getElementById("receiver_email")
var users_card = document.getElementById("users_card")


    var filteredPartners = allPartners.filter((item)=>{
     if (typeof item.email === 'string') {
    return item.email.toLowerCase().includes(value.toLowerCase());
  }else{
    return false; // Or any other appropriate behavior for non-string email values
  }

    });
  console.log(filteredPartners);

if(filteredPartners.length === 0 || receiver_email.value.trim() === ""){
receiver_button.style.display="none"
}else{
receiver_button.style.display="flex"
}

users_card.innerHTML = filteredPartners.map((item)=>{
var email = item.email === false ? "No Email" : item.email
return `  <div class="col-lg-6">

        <div id="my_reserve_button${item.id}" onclick="myBooking2(${item.id},'${item.name}',6)" data-bs-dismiss="modal" aria-label="Close" style="display:flex;align-items:center;gap:20px;margin-top:10px;box-shadow:1px 10px 30px rgba(126, 124, 124, 0.24);padding:10px;margin:20px">
               <div>
                 <img src="${item.image ? '/web/image/res.partner/' + item.id + '/image_1920' : '/hubkilo_website/static/src/img/avatar-profile.png'}" alt="Your Image" style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover;"/>
               </div>
               <div>
                 <h5>${item.name}</h5>
                 <p>${email}</p>
               </div>
             </div>

           </div>

    </div>
    `
}).join("")


}

        //update info
        function updateUserAdd() {
    console.log("updating..now");
    var phone = document.getElementById("phone").value;
    var birthdate = document.getElementById("birthdate").value;
    var gender = document.getElementById("gender").value;
    let currentPartner_ids = localStorage.getItem("user_id");

var residence_city = localStorage.getItem("residence_city")
var birth_city = localStorage.getItem("birth_city")

var name = localStorage.getItem("my_username")
var email = localStorage.getItem("my_email")


        var save_btn = document.getElementById("updateButton")
        save_btn.disabled = true
   save_btn.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
    var raw = JSON.stringify({
            "name": name,
            "email": email,
            "phone": phone,
            "gender": gender,
            "birthdate": birthdate,
             "residence_city_id": Number(residence_city),
             "birth_city_id": Number(birth_city)
          });
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `/api/v1/write/res.partner?ids=${currentPartner_ids}&values=${raw}`,
          headers: {
        'Accept': 'application/json',
    'Authorization': authorization,
      }
    };

     axios.request(config)
    .then((response) => {
       console.log(response)
       let related_user_id = localStorage.getItem("related_user_id")

       var raw = JSON.stringify({
            "email": email,
            "login": email,

          });
                   let config = {
                  method: 'put',
                  maxBodyLength: Infinity,
                      url: `/api/v1/write/res.users?ids=${related_user_id}&values=${raw}`,
                          headers: {
                        'Accept': 'application/json',
                        'Authorization': authorization,
                      }
                    };

                    axios.request(config)
                    .then((response) => {
                    //alert("created and updated")
                     console.log(response)
                  })
                  .catch(error => {
                  console.log(error);
//                      alert("Fill all the fields")

    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Fill all the fields</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
                   save_btn.innerHTML = "Update Now"
                   save_btn.disabled = false

                  })

       if ((typeof(response.data[0])) == typeof(1) ){
             save_btn.innerHTML = "Done !"
             save_btn.style = "background:#f1f5f4; color:#333; pointer-events:none"
                localStorage.removeItem("my_email")
                 localStorage.removeItem("my_username")

    var alert_success_message = document.getElementById("alert_success_message")
   alert_success_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Account updated successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();
  //            setTimeout(()=>{
//            userVerification()
//            },1000)
        }


    })
    .catch(error => {
    console.log(error);
    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Fill all the fields</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
    save_btn.innerHTML = "Update Now"
save_btn.disabled = false

    })

    }


async function checkTravelerPicStatus() {

  var currentTravellerPartnerId = localStorage.getItem("currentTravellerPartnerId")
  var currentTravellerPartnerRating = localStorage.getItem("currentTravellerPartnerRating")
  var currentTravellerPartnerName = localStorage.getItem("currentTravellerPartnerName")
  var profile_chat = document.getElementById("profile_chat2")
  var average_rating = localStorage.getItem("shipping_average_rating")


  try {
    const response1 = await axios.get(`/check_profile_pic/${currentTravellerPartnerId}`);
    console.log(response1.data)
    const displayTravelerProfile = response1.data === "True" ? `/web/image/res.partner/${currentTravellerPartnerId}/image_1920` : "/hubkilo_website/static/src/img/avatar-profile.png"

    profile_chat.innerHTML = `   <div>
                               <div class="d-flex align-items-center">
                                 <div class="mr-3">
                                <img src=${displayTravelerProfile} alt="Your Image" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover;"/>
                                          </div>
                                 <div class="chat-caption">
                                    <h5 class="mb-0" >${currentTravellerPartnerName.toUpperCase()}</h5>
                                     <div style="display: flex;gap: 5px;flex-direction:column">
                                        <p class="mb-0" style="font-size:16px;font-weight:700"><i class="fa fa-star" style="color: gold;font-size:16px"></i>${currentTravellerPartnerRating}</p>
                                          <button class="btn" onclick="seePartnerRatings()" style="text-decoration:none;color:#217aff;font-weight:700;border:none;text-transform:capitalize" data-toggle="modal" data-target="#exampleModalScrollable">
                                       View all reviews
                                      </button>

                                    </div>
                                 </div>
                              </div>

                               <!-- Modal -->
<div class="modal fade" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
  <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">Traveler Ratings</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="rating_view">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<!-- Modal -->

                               </div>`
    return response1.data; // `data` will be `true` if the profile picture exists, and `false` otherwise
  } catch (error) {
    console.error('Error checking profile picture status:', error);
    return null;
  }
}


// Define a regular expression pattern to match the URL path
const currentPath2 = window.location.pathname;

// Check if the current path matches the pattern
if ( currentPath2 === "/add/new/shipping") {

setTimeout(() => {
checkTravelerPicStatus()
}, 2000)

}


function seePartnerRatings() {
  var traveler_info_id = localStorage.getItem("currentTravellerPartnerId")
  var rating_view = document.getElementById("rating_view")

  let data = '{\r\n    "jsonrpc": 2.0\r\n}';

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `/partner/get_ratings?rated_partner_id=${traveler_info_id}`,
    data: data
  };

  axios.request(config)
    .then((response) => {

      if (response.data.ratings.length === 0) {
        rating_view.innerHTML = "<h5 style='text-align:center'> No Rating Yet, be the first to rate!</h5>"

      } else {
        rating_view.innerHTML = response.data.ratings.map((rating) => {

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
    <div class="row" style="border-radius:0px 30px 30px 30px;background-color: rgb(70, 144, 190);padding:5px 0px;display: flex;justify-content: space-between;">
      <div class="col-md-12 col-sm-12" style="display: flex;align-items: center;gap:30px;">
        <img src=${rater_image} alt="Your Image" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" />
        <div >
    <h5 style="font-weight:700;font-size:14px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:90px;">${rating.rater_name}</h5>
    <p class="col-12" style="margin-top:10px ;color:white;font-size:12px">${rating.comment}</p>
        </div>
      </div>

        <div id="ratingStar5" class="col-md-12 col-sm-12" style="display:${ratingStar5};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

        <div id="ratingStar1" class="col-md-12 col-sm-12" style="display:${ratingStar1};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

        <div id="ratingStar2" class="col-md-12 col-sm-12" style="display:${ratingStar2};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

        <div id="ratingStar3" class="col-md-12 col-sm-12" style="display:${ratingStar3};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
        </div>

        <div id="ratingStar4" class="col-md-12 col-sm-12" style="display:${ratingStar4};gap: 5px;align-items: center;justify-content:end;padding:10px;margin-left;10px;">
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
          <i class="fas fa-star" style="color: gold;font-size:10x"></i>
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

