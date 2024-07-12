var authorization = localStorage.getItem("authorization")
    window.onload = function () {
      //USER INFO

console.log("get user infos edit profile")
             axios
            .get("/api/res_partner/?debug=assets")
            .then((response) => {
            console.log("user Info")
              document.getElementById('username').innerHTML = response.data.partner.name
                let partner_ids = response.data.partner.id
                  let config = {
                  method: 'get',
                  maxBodyLength: Infinity,
                  url: `/api/v1/read/res.partner?ids=${partner_ids}`,
                  headers: {
                    'Accept': 'application/json',
                    'Authorization': authorization
                  }
                };

                axios.request(config)
                .then((response) => {
                console.log(" get specific user...TO UPDATE.. " ,response.data)
                localStorage.setItem("related_user_id", response.data[0].related_user_id[0])
                //      document.getElementById("output").src = "/web/image/res.partner/"+ userId +"/image_1920";
                  document.getElementById("username_edit").value = response.data[0].name;
                  document.getElementById("phone").value = response.data[0].phone;
                  document.getElementById("phone2").value = response.data[0].phone;
                  document.getElementById("email").value = response.data[0].email;
                  document.getElementById("birthdate").value = response.data[0].birthdate;
                  document.getElementById("gender").value = response.data[0].gender;
                  document.getElementById("residence_city").value = response.data[0].birth_city_id[1];
                  document.getElementById("birth_city").value = response.data[0].residence_city_id[1];

                  localStorage.setItem("residence_city",response.data[0].birth_city_id[0])
                  localStorage.setItem("birth_city",response.data[0].residence_city_id[0])

                  localStorage.setItem("related_user_id", response.data[0].related_user_id[0])

setTimeout(()=>{
  Loader()
},1000)
            })
            .catch(function (error) {
              console.log(error);
            });

        })
        .catch(function (error) {
          console.log(error);
        });
    }



function updateUser() {
    console.log("updating...6");
    var name = document.getElementById("username_edit").value;
    var phone = document.getElementById("phone").value;
    var email = document.getElementById("email").value;
    var birthdate = document.getElementById("birthdate").value;
    var gender = document.getElementById("gender").value;
    let currentPartner_ids = localStorage.getItem("user_id");

var residence_city = localStorage.getItem("residence_city")
var birth_city = localStorage.getItem("birth_city")

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
                   save_btn.innerHTML = "Update Now"
                   save_btn.disabled = false

                  console.log(error);
                  })

       if ((typeof(response.data[0])) == typeof(1) ){
             save_btn.innerHTML = "Done !"
//             save_btn.style = "background:#f1f5f4; color:#333; pointer-events:none"

//            alert("Account updated successfully");
    var alert_success_message = document.getElementById("alert_success_message")
   alert_success_message.innerHTML = `<p style="text-transform:capitalize">Account updated successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();
                   save_btn.disabled = false

//              window.location.href = "";
        }


    })
    .catch(error => {
  save_btn.innerHTML = "Update Now"
  save_btn.disabled = false

    console.log(error);
    })

    }



function Loader(){
 var loaderContainer = document.querySelector(".loader_container");
    loaderContainer.style.display = "none";

}
