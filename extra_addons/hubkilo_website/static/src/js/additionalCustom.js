//DISPLAY LUGGAGE START
var authorization = localStorage.getItem("authorization")
  localStorage.removeItem("luggage_id");

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
      var my_modal_body = document.getElementById("my_modal_body");

  console.log(response.data);
  my_modal_body.innerHTML= response.data.map((luggage)=>{

var briefcase = luggage.type === "briefcase" ? "none" : "flex"
var envelope = luggage.type === "envelope" ? "none" : "flex"

  return ` <div  class="col-lg-4 col-md-4 col-sm-12" style="margin-top: 0.5rem">
      <div id="luggage_col" class="card" style="width: 80%;height:100%;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 0.5rem;">
        <i class="fa fa-envelope"  style="font-size:100px;color:#217aff;display:${briefcase}"></i>
        <i class="fa fa-briefcase"  style="font-size:100px;color:#217aff;display:${envelope}"></i>
          <h5 class="card-title" style="text-align: center;">${luggage.display_name}</h5>

          <p>${luggage.average_width} x ${luggage.average_height}</p>
          <h4>${luggage.average_weight} kg</h4>

          <button type="button" data-bs-dismiss="modal" onclick="saveLuggageInfo(${luggage.id},'${luggage.display_name}',${luggage.average_width},${luggage.average_height},${luggage.average_weight})" class="btn " style="background-color: #217aff;color: white;">Select Model</button>
      </div>
    </div>`
  }).join("")
})
.catch((error) => {
  console.log(error);
});
//DISPLAY LUGGAGE END

var luggage_ids = []

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
luggage_ids.push(response.data[0])

setTimeout(()=>{
saveLuggageIds()
},2000)
})
.catch((error) => {
  console.log(error);
});


}

function saveLuggageInfoDetails(section){

  //luggage details
var average_weight = document.getElementById("weight").value
 var average_width = document.getElementById("width").value
 var average_height = document.getElementById("height").value
 var description = document.getElementById("description").value

 var saveLuggage = document.getElementById("saveLuggage")

document.getElementById("description2").value = description

     saveLuggage.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`


  var luggageTypeId = localStorage.getItem("luggageTypeId")

if(description.trim() === "" || average_weight.trim() ==="" || average_width.trim() ==="" || average_height.trim() ===""){
                    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">All the fields need to be fill before it can be save</p>`
     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

     var saveLuggage = document.getElementById("saveLuggage")

    saveLuggage.innerHTML = "NEXT STEP"
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

  saveLuggage.innerHTML = "NEXT STEP"

luggage_ids.push(response.data[0])

    var alert_success_message = document.getElementById("alert_success_message")
   alert_success_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Luggage details save successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();

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



setTimeout(()=>{
saveLuggageIds()
},2000)
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

function saveLuggageIds(){
console.log("my ids", luggage_ids)
localStorage.setItem("selected_luggage",luggage_ids)
}

function displayTypeContent(check) {
            var confirmation = document.getElementById("confirmation")
            if (check == "section1") {
                confirmation.innerHTML = `<div class=" side_info_item">
                                <div class="image_tag1">

                                </div>
                                <p style="text-align: center;margin-top:20px;font-weight: 700;font-family: Poppins;">
                                    ENVELOP</p>
                            </div>`
            } else if (check == "section2") {
                confirmation.innerHTML = `<div class=" side_info_item">
                                <div class="image_tag2">

                                </div>
                                <p style="text-align: center;margin-top:20px;font-weight: 700;font-family: Poppins;">
                                    BRIEFCASE</p>
                            </div>`
            } else if ("section3") {
                confirmation.innerHTML = `<div class=" side_info_item">
                                <div class="image_tag3">

                                </div>
                                <p style="text-align: center;margin-top:20px;font-weight: 700;font-family: Poppins;">
                                    SUITCASE</p>
                            </div>`
            }
        }

function showSection(section,sectionn) {

localStorage.setItem("luggageSection",section)
displayTypeContent(section)

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

    localStorage.setItem("My_luggage_type",sectionn)

document.getElementById("sectionn" + sectionn).style.display = "none";
    document.getElementById("sectionn" + (sectionn + 1)).style.display = "flex";

    document.querySelector(".side_bar_item_icon.active").classList.remove("active");
    document.querySelector(`[data-step="${sectionn + 1}"]`).classList.add("active");

    document.querySelector(".side_bar_item_icon_text.activeText").classList.remove("activeText");
    document.querySelector(`[data-step1="${sectionn + 1}"]`).classList.add("activeText");

    currentSection = sectionn + 1;



    // Update the current step to have the check icon and change the background color
    const currentStep = document.querySelector(`[data-step="${sectionn}"]`);
    const currentStep1 = document.querySelector(`[data-step1="${sectionn}"]`);
    currentStep.innerHTML = '<i class="fa fa-check"></i>';
    currentStep.classList.add("completed");
    currentStep1.classList.add("completed");

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


    localStorage.setItem("My_luggage_type",sectionn)

    document.getElementById("sectionn" + sectionn).style.display = "none";
        document.getElementById("sectionn" + (sectionn + 1)).style.display = "flex";

        document.querySelector(".side_bar_item_icon.active").classList.remove("active");
        document.querySelector(`[data-step="${sectionn + 1}"]`).classList.add("active");

        document.querySelector(".side_bar_item_icon_text.activeText").classList.remove("activeText");
        document.querySelector(`[data-step1="${sectionn + 1}"]`).classList.add("activeText");

        currentSection = sectionn + 1;



        // Update the current step to have the check icon and change the background color
        const currentStep = document.querySelector(`[data-step="${sectionn}"]`);
        const currentStep1 = document.querySelector(`[data-step1="${sectionn}"]`);
        currentStep.innerHTML = '<i class="fa fa-check"></i>';
        currentStep.classList.add("completed");
        currentStep1.classList.add("completed");

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

        localStorage.setItem("My_luggage_type",sectionn)

    document.getElementById("sectionn" + sectionn).style.display = "none";
        document.getElementById("sectionn" + (sectionn + 1)).style.display = "flex";

        document.querySelector(".side_bar_item_icon.active").classList.remove("active");
        document.querySelector(`[data-step="${sectionn + 1}"]`).classList.add("active");

        document.querySelector(".side_bar_item_icon_text.activeText").classList.remove("activeText");
        document.querySelector(`[data-step1="${sectionn + 1}"]`).classList.add("activeText");

        currentSection = sectionn + 1;



        // Update the current step to have the check icon and change the background color
        const currentStep = document.querySelector(`[data-step="${sectionn}"]`);
        const currentStep1 = document.querySelector(`[data-step1="${sectionn}"]`);
        currentStep.innerHTML = '<i class="fa fa-check"></i>';
        currentStep.classList.add("completed");
        currentStep1.classList.add("completed");

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



function DeselectLuggageInfo(){
var luggage_id = localStorage.getItem("luggage_id")
  localStorage.removeItem("luggage_id");



}

