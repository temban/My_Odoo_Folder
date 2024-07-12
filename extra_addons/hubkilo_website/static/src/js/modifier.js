     var authorization = localStorage.getItem("authorization")

var loadFile = function (event) {
  var image = document.getElementById("image-preview-id-card");
    image.src = URL.createObjectURL(event.target.files[0]);
}
window.onload = function(){
       var url = window.location.href;
  var urlParts = url.split('/');
  var elementId = urlParts[urlParts.length - 1];


let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/m1st_hk_roadshipping.travelbooking?ids=${elementId}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(response.data);
  response.data.map((item)=>{
  document.getElementById("type_de_voyage").value = item.booking_type
  document.getElementById("start").innerHTML = item.departure_city_id[1]
  document.getElementById("end").innerHTML = item.arrival_city_id[1]
  document.getElementById("date_de_depart").value = item.departure_date
  document.getElementById("date_de_arrivee").value = item.arrival_date

//  document.getElementById("ville_depart").innerHTML = `<option data-tokens="ketchup mustard" >${item.departure_city_id[1]}</option>`


console.log("my typppp",document.getElementById("type_de_voyage").value, document.getElementById("ville_depart").value)
  })
})
.catch((error) => {
  console.log(error);
});

}

function update() {
                console.log("updated updated")
  var button = document.getElementById('myModifyButton');
  button.disabled = true;
 var save_btn = document.getElementById('myModifyButton')
    save_btn.innerHTML = '<div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div>'

    var url1 = window.location.href;
  var urlParts1 = url1.split('/');
  var elementId1 = urlParts1[urlParts1.length - 1];

//       var travel_type = document.getElementById('type_de_voyage').value;
       var departure_town = localStorage.getItem("selectedDepartCityId")
       var arrival_town = localStorage.getItem("selectedArriveCityId")
       var departure_date = document.getElementById('date_de_depart').value;
       var arrival_date = document.getElementById('date_de_arrivee').value;

var departure_d = departure_date.replace('T', ' ').substr(0, 16)
var arrival_d = arrival_date.replace('T', ' ').substr(0, 16)

console.log(arrival_d,departure_d)
console.log(typeof(arrival_d),typeof(departure_d))

var raw = JSON.stringify({
  "name": "Travels",
  "booking_type": "road",
  "departure_city_id": departure_town,
  "arrival_city_id": arrival_town,
  "arrival_date": arrival_d,
  "departure_date": departure_d

          });


let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/m1st_hk_roadshipping.travelbooking?values=${raw}&ids=${elementId1}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
      save_btn.innerHTML = "Updated Successfully "

        setTimeout(()=>{
          window.location.href = ""
        },1000)
})
.catch((error) => {
  console.log(error);
});




   }