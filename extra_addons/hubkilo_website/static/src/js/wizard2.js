var authorization = localStorage.getItem("authorization")

function userVerification(){
 var user_id = localStorage.getItem("user_id")
                  let config = {
                  method: 'get',
                  maxBodyLength: Infinity,
                  url: `/api/v1/read/res.partner?ids=${user_id}`,
                  headers: {
                    'Accept': 'application/json',
                    'Authorization': authorization
                  }
                };

                axios.request(config)
                .then((response) => {
//                console.log("USER VERIFICATION " ,response.data)
                  document.getElementById("phone1").value = response.data[0].phone;
                  document.getElementById("birthdate1").value = response.data[0].birthdate;
                  document.getElementById("gender1").value = response.data[0].gender;
                  document.getElementById("residence_city1").value = response.data[0].birth_city_id[1];
                  document.getElementById("birth_city1").value = response.data[0].residence_city_id[1];

                  localStorage.setItem("my_email",response.data[0].email)
                  localStorage.setItem("my_username",response.data[0].name)



                  if(response.data[0].phone === false || response.data[0].birthdate === false || response.data[0].gender === false || response.data[0].birth_city_id === false || response.data[0].residence_city_id === false ){
                  var unverified = document.getElementById("unverified")
                  unverified.style.display = "block"
                  }else{
                   var unverified = document.getElementById("unverified")
                   var verified = document.getElementById("verified")
                  verified.style.display = "block"
                  unverified.style.display = "none"
//                  unverified.style.display = "none"
                  // VERIFY FORM
                                                      document.getElementById("phone2").value = response.data[0].phone;
//                  document.getElementById("phone2").value = response.data[0].phone;
//                  document.getElementById("email").value = response.data[0].email;
                  document.getElementById("birthdate2").value = response.data[0].birthdate;
                  document.getElementById("gender2").value = response.data[0].gender;
                  document.getElementById("residence_city2").value = response.data[0].birth_city_id[1];
                  document.getElementById("birth_city2").value = response.data[0].residence_city_id[1];
                  }
//
//                  localStorage.setItem("related_user_id", response.data[0].related_user_id[0])


            })
            .catch(function (error) {
              console.log(error);
            });
}

setInterval(userVerification, 2000)


let currentSection = 1;

 function nextSection(section) {
    if (section === 2 &&   localStorage.getItem("luggage_id") === null || localStorage.getItem("luggage_id") === undefined) {
        var error_section2 = document.getElementById("error_section2")
        error_section2.innerHTML = `<div class="alert alert-warning" role="alert">
                    <i class="fa fa-warning" style="font-size:24px"></i>
                    Select luggage Model
                  </div>`
        setTimeout(function () {
            error_section2.innerHTML = ""; // Set the display property to "none" to hide the div
        }, 1500); // 3000 milliseconds = 3 seconds

        return;
    }


    if (section === 1 &&   localStorage.getItem("My_luggage_type") === null || localStorage.getItem("My_luggage_type") === undefined) {
        var error_section1 = document.getElementById("error_section1")
        error_section1.innerHTML = `<div class="alert alert-warning" role="alert">
                    <i class="fa fa-warning" style="font-size:24px"></i>
                    Select luggage type
                  </div>`
        setTimeout(function () {
            error_section1.innerHTML = ""; // Set the display property to "none" to hide the div
        }, 1500); // 3000 milliseconds = 3 seconds

        return;
    }

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

function prevSection(section) {
    document.getElementById("sectionn" + section).style.display = "none";
    document.getElementById("sectionn" + (section - 1)).style.display = "flex";

    document.querySelector(".side_bar_item_icon.active").classList.remove("active");
    document.querySelector(`[data-step="${section - 1}"]`).classList.add("active");

    document.querySelector(".side_bar_item_icon_text.activeText").classList.remove("activeText");
    document.querySelector(`[data-step1="${section - 1}"]`).classList.add("activeText");

    currentSection = section - 1;


    // Update the current step to show its original number and remove the completed class
    const currentStep = document.querySelector(`[data-step="${section}"]`);
    const currentStep1 = document.querySelector(`[data-step1="${section}"]`);
    currentStep.innerHTML = section;
    currentStep.classList.remove("completed");
    currentStep1.classList.remove("completed");

}


function selectType(section) {

    //display type in confirm section
    displayTypeContent(section)

    if (section == 1) {
        const road = document.getElementById("road");

        const value = road.dataset.value;

        // Check if the "selected" class is present
        const isSelected = road.classList.contains("selected");

        // Toggle the "selected" class based on its presence
        if (isSelected) {
            road.classList.remove("selected"); // Remove the "selected" class if it's present
            localStorage.removeItem("TravelTypeValue");

        } else {
            road.classList.add("selected"); // Add the "selected" class if it's not present
            localStorage.setItem("TravelTypeValue", value)
            console.log(value);
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



    }
    else if (section == 2) {
        const air = document.getElementById("air");

        const value = air.dataset.value;

        console.log(value);
        localStorage.setItem("TravelTypeValue", value)
    } else if (section == 3) {
        const sea = document.getElementById("sea");

        const value = sea.dataset.value;

        console.log(value);
        localStorage.setItem("TravelTypeValue", value)
    }

}


function MyprevSection(section) {

    // Update the current step to show its original number and remove the completed class
    const currentStep = document.querySelector(`[data-step="${section}"]`);
    const currentStep1 = document.querySelector(`[data-step1="${section}"]`);
    currentStep.innerHTML = section;
    currentStep.classList.remove("completed");
    currentStep1.classList.remove("completed");
    localStorage.removeItem("luggage_id")
    const road = document.getElementById("road");
//            road.classList.remove("selected"); // Remove the "selected" class if it's present


}

function verifyForm(section) {
    let my_booking_picture = document.getElementById('image-input-id-card').value.trim() === "";
let my_booking_picture1 = document.getElementById('image-input-id-card1').value.trim() === "";
let my_booking_picture2 = document.getElementById('image-input-id-card2').value.trim() === "";

    if (my_booking_picture || my_booking_picture1 || my_booking_picture2) {

        var error_section3 = document.getElementById("error_section3")
        error_section3.innerHTML = `<div class="alert alert-warning" role="alert">
        <i class="fa fa-warning" style="font-size:24px"></i>
        Please upload luggage images
      </div>`
        setTimeout(function () {
            error_section3.innerHTML = ""; // Set the display property to "none" to hide the div
        }, 1500); // 3000 milliseconds = 3 seconds

    } else {

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

}



function showDetails(section){

var selectId = localStorage.getItem("selectId")

if(selectId === null || selectId === undefined){

        var error_section4 = document.getElementById("error_section4")
        error_section4.innerHTML = `<div class="alert alert-warning" role="alert">
        <i class="fa fa-warning" style="font-size:24px"></i>
        Select a receiver
      </div>`
        setTimeout(function () {
            error_section4.innerHTML = ""; // Set the display property to "none" to hide the div
        }, 1500); // 3000 milliseconds = 3 seconds


}else{

var selectName = localStorage.getItem("selectName")
var average_weight= localStorage.getItem("average_weight")
var my_receiver_name = document.getElementById("my_receiver_name")
var receiver_dimension = document.getElementById("receiver_dimension")

// document.getElementById("description").value = document.getElementById("description2").value


my_receiver_name.innerHTML = `<span>${selectName}</span>`
receiver_dimension.innerHTML = `<span>${average_weight} Kg</span>`

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



}


function showDetails2(section){
var receiver_city_id = localStorage.getItem("receiver_city_id")
var receiver_name = document.getElementById("receiver_name").value
var receiver_email = document.getElementById("receiver_email").value
var receiver_phone = document.getElementById("receiver_phone").value
var receiver_address = document.getElementById("receiver_address").value
 let my_image_Picture = document.getElementById('image-input-colisPicture').value.trim() === "";
localStorage.setItem("selectName",receiver_name)




console.log("second div")

var selectId = localStorage.getItem("selectId")

if(receiver_name.trim()=== "" || receiver_email.trim()=== "" || receiver_phone.trim()=== "" || receiver_address.trim()=== "" || receiver_city_id === null || receiver_city_id === undefined){
//alert("Fill all the receiver's info fields")
     var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Please Fill all the receiver's information</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

}else{

var selectName = localStorage.getItem("selectName")
var average_weight= localStorage.getItem("average_weight")
var my_receiver_name = document.getElementById("my_receiver_name")
var receiver_dimension = document.getElementById("receiver_dimension")

my_receiver_name.innerHTML = `<span>${selectName}</span>`
receiver_dimension.innerHTML = `<span>${average_weight} Kg</span>`

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



}



function userVerify(section){

        if(document.getElementById("phone1").value === false || document.getElementById("birthdate1").value === false || document.getElementById("gender1").value === false || document.getElementById("gender1").value === "false" || document.getElementById("residence_city1").value === false || document.getElementById("birth_city1").value === false ){
//        alert("All the fields are required for verification")
                   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">All the fields are required for verification</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
        }else{
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


        }


function show_verification(){
var simple_unverified_form = document.getElementById("simple_unverified_form")
var verification_btn = document.getElementById("verification_btn")
var unverified_form = document.getElementById("unverified_form")
simple_unverified_form.style.display = "none"
verification_btn.style.display = "none"
unverified_form.style.display = "block"
}
