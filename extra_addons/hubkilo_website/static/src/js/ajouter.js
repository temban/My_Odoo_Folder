

var authorization = localStorage.getItem("authorization")
var loadFile = function (event) {
  var image = document.getElementById("image-preview-id-card");
    image.src = URL.createObjectURL(event.target.files[0]);
}

var loadFile2 = function (event) {
  var image = document.getElementById("image-preview-billet");
    image.src = URL.createObjectURL(event.target.files[0]);
}



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
                console.log("USER VERIFICATION " ,response.data)
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
                  // VERIFY FORM
                                                      document.getElementById("phone2").value = response.data[0].phone;

                  document.getElementById("birthdate2").value = response.data[0].birthdate;
                  document.getElementById("gender2").value = response.data[0].gender;
                  document.getElementById("residence_city2").value = response.data[0].birth_city_id[1];
                  document.getElementById("birth_city2").value = response.data[0].residence_city_id[1];
                  }



            })
            .catch(function (error) {
              console.log(error);
            });
}

setInterval(userVerification, 2000)





function controlTravelType(){
console.log("begin");
var travel_type = document.getElementById('type_de_voyage').value;

if(travel_type !== "air"){

console.log("end")
} else{

}
}


//remove from local storage when reload
localStorage.removeItem("TravelTypeValue")


//Start error date

window.onload = function(){
function passedDate(){
var current_departure_date = document.getElementById('date_de_depart')

var currentDate = new Date();  // Get the current date
currentDate.setDate(currentDate.getDate() + 1);

var my_currentDate = currentDate.toISOString().split('T')[0];

current_departure_date.min = my_currentDate
}
passedDate()
}

function isPastDate(selectedDate) {
  const currentDate = new Date();
  return new Date(selectedDate) < currentDate;
}


function handleDateChange(){
// Get the input element
  const dateInput = document.getElementById("date_de_depart");

  // Get the value of the input
  const selectedDateTime = dateInput.value;

  // Separate the date and time strings
  const [date, time] = selectedDateTime.split("T");
  localStorage.setItem("my_trave_departure_date",date)

  console.log("hello",date)

  // Check if the date is in the past
  if (isPastDate(date)) {
  const departureDate_error = document.getElementById("departureDate_error")
  departureDate_error.style.display = "block"
    dateInput.value=""
    setTimeout(()=>{
    departureDate_error.style.display = "none"
    dateInput.value=""
  },1000)
  }


}

function handleDateChangeAir(){
// Get the input element
  const dateInput = document.getElementById("date_de_depart_air");

  // Get the value of the input
  const selectedDateTime = dateInput.value;

  // Separate the date and time strings
  const [date, time] = selectedDateTime.split("T");
  localStorage.setItem("my_trave_departure_date_air",date)

  console.log("hello",date)

  // Check if the date is in the past
  if (isPastDate(date)) {
  const departureDate_error = document.getElementById("departureDate_error_air")
  departureDate_error.style.display = "block"
    dateInput.value=""
    setTimeout(()=>{
    departureDate_error.style.display = "none"
    dateInput.value=""
  },1000)
  }


}


function handleDateChange1(){
// Get the input element
  const dateInput1 = document.getElementById("date_de_arrivee");

  // Get the value of the input
  const selectedDateTime1 = dateInput1.value;

  // Separate the date and time strings
  const [date, time] = selectedDateTime1.split("T");
var my_trave_departure_date = localStorage.getItem("my_trave_departure_date")
  console.log(date)

  const a = new Date(date);
   const d = new Date(my_trave_departure_date);


  if(a < d ){
//    alert("You can only select a date greater than the departure date")
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">You can only select a date greater than the departure date</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
    dateInput1.value = ""
  }


  var current_date_de_depart = document.getElementById('date_de_depart')
var current_ville_de_arriver = document.getElementById('date_de_arrivee')
if(current_date_de_depart.value === ""){
//alert("Remplissez d'abord le champ de la date de départ")
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">First fill in the departure date field</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
current_ville_de_arriver.value = ""
return;
}

}

function handleDateChangeAir1(){
// Get the input element
  const dateInput1 = document.getElementById("date_de_arrivee_air");

  // Get the value of the input
  const selectedDateTime1 = dateInput1.value;

  // Separate the date and time strings
  const [date, time] = selectedDateTime1.split("T");
var my_trave_departure_date = localStorage.getItem("my_trave_departure_date_air")
  console.log(date)

  const a = new Date(date);
   const d = new Date(my_trave_departure_date);


  if(a < d ){
//    alert("You can only select a date greater than the departure date")
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">You can only select a date greater than the departure date</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
    dateInput1.value = ""
  }


  var current_date_de_depart = document.getElementById('date_de_depart_air')
var current_ville_de_arriver = document.getElementById('date_de_arrivee_air')
if(current_date_de_depart.value === ""){
//alert("Remplissez d'abord le champ de la date de départ")
   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">First fill in the departure date field</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
current_ville_de_arriver.value = ""
return;
}

}

function add(section){

var selectedArriveCityId = localStorage.getItem("selectedArriveCityId")
var selectedDepartCityId = localStorage.getItem("selectedDepartCityId")
var TravelTypeValue = localStorage.getItem("TravelTypeValue")

var departure_date = document.getElementById('date_de_depart').value;
var arrival_date = document.getElementById('date_de_arrivee').value;
var user_id = localStorage.getItem("user_id")

var departure_d = departure_date.replace('T', ' ').substr(0, 16)
var arrival_d = arrival_date.replace('T', ' ').substr(0, 16)

var save_btn = document.getElementById("add_btn_road")

 console.log(departure_date)
   save_btn.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
  var button = document.querySelector(".save-btn");
  save_btn.disabled = true;
var raw = JSON.stringify({
  "name": "Travels",
  "booking_type": TravelTypeValue,
  "departure_city_id": selectedDepartCityId,
  "arrival_city_id": selectedArriveCityId,
  "arrival_date": arrival_d,
  "departure_date": departure_d,
  "partner_id":Number(user_id)

          });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/m1st_hk_roadshipping.travelbooking?values=${raw}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
    localStorage.removeItem("TravelTypeValue");
    setTimeout(()=>{
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

    },1000)
})
.catch((error) => {
//  alert(error.response.data.message)

   var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">${error.response.data.message}</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
   save_btn.innerHTML = `Confirm and create`
  var button = document.querySelector(".save-btn");
  button.disabled = false;

});

 }



//WIZARD START

        let currentSection = 1;

        function nextSection(section) {
            if (section === 1 && localStorage.getItem("TravelTypeValue") === null || localStorage.getItem("TravelTypeValue") === undefined) {
                var error_section1 = document.getElementById("error_section1")
                error_section1.innerHTML = `<div class="alert alert-warning" role="alert">
                            <i class="fa fa-warning" style="font-size:24px"></i>
                            Select a type
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

        function userVerify(section){

        if(document.getElementById("phone1").value === false || document.getElementById("birthdate1").value === false || document.getElementById("gender1").value === false || document.getElementById("gender1").value === "false" || document.getElementById("residence_city1").value === false || document.getElementById("birth_city1").value === false ){
//        alert("All the fields are required for verification")
           var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">All the fields are required for verification</p>`

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

        function MyprevSection(section) {

            // Update the current step to show its original number and remove the completed class
            const currentStep = document.querySelector(`[data-step="${section}"]`);
            const currentStep1 = document.querySelector(`[data-step1="${section}"]`);
            currentStep.innerHTML = section;
            currentStep.classList.remove("completed");
            currentStep1.classList.remove("completed");
            localStorage.removeItem("TravelTypeValue")
            const road = document.getElementById("road");
            road.classList.remove("selected"); // Remove the "selected" class if it's present


        }

        function displayTypeContent(check) {
            var confirmation = document.getElementById("confirmation")
            if (check ==="road") {
                confirmation.innerHTML = ` <div id="road" class="side_info_item">
                                 <div class="image_tag1">

                                </div>
                                <p style="text-align: center;margin-top:20px;font-weight: 700;font-family: Poppins;">
                                    ROAD</p>
                            </div>`
            } else if (check ==="air") {
                confirmation.innerHTML = ` <div id="air" class="side_info_item">
                                <div class="image_tag2">
                                </div>
                                <p style="text-align: center;margin-top:20px;font-weight: 700;font-family: Poppins;">AIR
                                </p>
                            </div>`
            } else if (check == 3) {
                confirmation.innerHTML = `<div id="sea" class="side_info_item">
                                <div class="image_tag3">
                                </div>
                                <p style="text-align: center;margin-top:20px;font-weight: 700;font-family: Poppins;">SEA
                                </p>
                            </div>`
            }
        }

        function selectType(section,type) {

            //display type in confirm section
            displayTypeContent(type)

            if (type === "road") {

                const road = document.getElementById("road");
                const air = document.getElementById("air");

                const value = road.dataset.value;

                // Check if the "selected" class is present
                const isSelected = road.classList.contains("selected");

                // Toggle the "selected" class based on its presence
                if (isSelected) {
                    road.classList.remove("selected"); // Remove the "selected" class if it's present
                    air.classList.remove("selected"); // Remove the "selected" class if it's present
                    localStorage.removeItem("TravelTypeValue");

                }
                 else {
                 const road_details = document.getElementById("road_details")
                const air_details = document.getElementById("air_details")
                const stepTwoAir = document.getElementById("stepTwoAir")
                const stepTwoRoad = document.getElementById("stepTwoRoad")
                const add_btn_road = document.getElementById("add_btn_road")
                const add_btn_air = document.getElementById("add_btn_air")
                road_details.style.display = "flex"
                stepTwoRoad.style.display = "flex"
                add_btn_road.style.display = "flex"
                add_btn_air.style.display = "none"
                air_details.style.display = "none"
                stepTwoAir.style.display = "none"

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
            else if (type === "air") {


                const air = document.getElementById("air");
                const road = document.getElementById("road");


                const value = air.dataset.value;

//                console.log(value);
//                localStorage.setItem("TravelTypeValue", value)
                             // Check if the "selected" class is present
                const isSelected = air.classList.contains("selected");

                // Toggle the "selected" class based on its presence
                if (isSelected) {
                    air.classList.remove("selected"); // Remove the "selected" class if it's present
                    road.classList.remove("selected"); // Remove the "selected" class if it's present
                    localStorage.removeItem("TravelTypeValue");

                }
                 else {
                 const road_details = document.getElementById("road_details")
                const air_details = document.getElementById("air_details")
                const stepTwoAir = document.getElementById("stepTwoAir")
                const stepTwoRoad = document.getElementById("stepTwoRoad")
                const add_btn_road = document.getElementById("add_btn_road")
                const add_btn_air = document.getElementById("add_btn_air")
                road_details.style.display = "none"
                stepTwoRoad.style.display = "none"
                add_btn_road.style.display = "none"
                add_btn_air.style.display = "flex"
                air_details.style.display = "flex"
                stepTwoAir.style.display = "flex"

                    air.classList.add("selected"); // Add the "selected" class if it's not present
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
            else if (type === "sea") {
                const sea = document.getElementById("sea");

                const value = sea.dataset.value;

                console.log(value);
                localStorage.setItem("TravelTypeValue", value)
            }

        }

        function verifyFormRoad(section) {
            if (document.getElementById("ville_de_depart").value.trim() === "" || document.getElementById("ville_de_arriver").value.trim() === "" || document.getElementById("date_de_depart").value.trim() === "" || document.getElementById("date_de_arrivee").value.trim() === "") {

                var error_section2 = document.getElementById("error_section2")
                error_section2.innerHTML = `<div class="alert alert-warning" role="alert">
                <i class="fa fa-warning" style="font-size:24px"></i>
                Please fill all the fields
              </div>`
                setTimeout(function () {
                    error_section2.innerHTML = ""; // Set the display property to "none" to hide the div
                }, 1500); // 3000 milliseconds = 3 seconds

            } else {
                //display confirm form
                var ville_depart = document.getElementById('ville_de_depart').value;
                var ville_arrivee = document.getElementById('ville_de_arriver').value;
                document.getElementById('confirmDetailsRoad').style.display = "flex";
                document.getElementById('confirmDetailsAir').style.display = "none";

                document.getElementById('confirmDepartCity').value = document.getElementById('ville_de_depart').value;
                document.getElementById('confirmDepartDate').value = document.getElementById('date_de_depart').value.replace('T', ' ').substr(0, 16)
                document.getElementById('confirmArrivalCity').value = document.getElementById('ville_de_arriver').value
                document.getElementById('confirmArrivalDate').value = document.getElementById('date_de_arrivee').value.replace('T', ' ').substr(0, 16)


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

        function verifyFormAir(section) {
            if (document.getElementById("ville_de_depart_air").value.trim() === "" || document.getElementById("ville_de_arriver_air").value.trim() === "" || document.getElementById("date_de_depart_air").value.trim() === "" || document.getElementById("price_per_kilo").value.trim() === "" || document.getElementById("quantity_available").value.trim() === ""|| document.getElementById("Restriction_of_what_you").value.trim() === "") {

                var error_section2 = document.getElementById("error_section2")
                error_section2.innerHTML = `<div class="alert alert-warning" role="alert">
                <i class="fa fa-warning" style="font-size:24px"></i>
                Please fill all the fields
              </div>`
                setTimeout(function () {
                    error_section2.innerHTML = ""; // Set the display property to "none" to hide the div
                }, 1500); // 3000 milliseconds = 3 seconds

            } else {
                //display confirm form
                var ville_depart = document.getElementById('ville_de_depart').value;
                var ville_arrivee = document.getElementById('ville_de_arriver').value;
                document.getElementById('confirmDetailsRoad').style.display = "none";
                document.getElementById('confirmDetailsAir').style.display = "flex";

                document.getElementById('confirmDepartCityAir').value = document.getElementById('ville_de_depart_air').value;
                document.getElementById('confirmDepartDateAir').value = document.getElementById('date_de_depart_air').value.replace('T', ' ').substr(0, 16)
                document.getElementById('confirmArrivalCityAir').value = document.getElementById('ville_de_arriver_air').value
                document.getElementById('confirmArrivalDateAir').value = document.getElementById('date_de_arrivee_air').value.replace('T', ' ').substr(0, 16)

                document.getElementById('price_per_kilo_confirm').value = document.getElementById('price_per_kilo').value;
                document.getElementById('quantity_available_confirm').value = document.getElementById('quantity_available').value;
                document.getElementById('Restriction_of_what_you_confirm').value = document.getElementById('Restriction_of_what_you').value;



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

//if(residence_city === null || birth_city === null || residence_city === undefined || birth_city === undefined){
//alert("Select Birth and Residence City")
//}else{
//
//}
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

//    var alert_error_message = document.getElementById("alert_error_message")
//   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Fill all the fields</p>`
//
//     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
//  myModal.show();
                   save_btn.innerHTML = "Update Now"
                   save_btn.disabled = false

                  })

       if ((typeof(response.data[0])) == typeof(1) ){
             save_btn.innerHTML = "Done !"
             save_btn.style = "background:#f1f5f4; color:#333; pointer-events:none"
                localStorage.removeItem("my_email")
                 localStorage.removeItem("my_username")

    var alert_success_message = document.getElementById("alert_success_message")
   alert_success_message.innerHTML = `<p style="text-transform:capitalize">Account updated successfully</p>`

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
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Fill all the fields</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
    save_btn.innerHTML = "Update Now"
save_btn.disabled = false

    })

    }


function show_verification(){
var simple_unverified_form = document.getElementById("simple_unverified_form")
var verification_btn = document.getElementById("verification_btn")
var unverified_form = document.getElementById("unverified_form")
simple_unverified_form.style.display = "none"
verification_btn.style.display = "none"
unverified_form.style.display = "block"
}

//WIZARD END

function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";
}

setTimeout(()=>{
Loader()
},2000)
