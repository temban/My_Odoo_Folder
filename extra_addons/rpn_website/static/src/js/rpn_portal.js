console.log("PORTAL")

//GLOBAL VARIABLES
var authorization = localStorage.getItem("authorization")

class rnpPortal {

    onLoad(){
    document.getElementById("rpn_currency1").innerHTML = localStorage.getItem("currency")
        document.getElementById("rpn_currency2").innerHTML = localStorage.getItem("currency")
    document.getElementById("rpn_currency3").innerHTML = localStorage.getItem("currency")
    document.getElementById("rpn_currency4").innerHTML = localStorage.getItem("currency")
    document.getElementById("rpn_currency5").innerHTML = localStorage.getItem("currency")
    document.getElementById("rpn_currency6").innerHTML = localStorage.getItem("currency")

    console.log(localStorage.getItem("currency"))

    }
    // select different tabs
    selectTab(section) {
        console.log("selectTab")
        if(section === "tab-1"){

            document.getElementById("tab-11").classList.add("tabby-tab-active")
            document.getElementById("tab-22").classList.remove("tabby-tab-active")
            document.getElementById("tab-33").classList.remove("tabby-tab-active")

        }else if(section === "tab-2"){
            
            document.getElementById("tab-11").classList.remove("tabby-tab-active")
            document.getElementById("tab-22").classList.add("tabby-tab-active")
            document.getElementById("tab-33").classList.remove("tabby-tab-active")

        }else if(section === "tab-3"){

            document.getElementById("tab-11").classList.remove("tabby-tab-active")
            document.getElementById("tab-22").classList.remove("tabby-tab-active")
            document.getElementById("tab-33").classList.add("tabby-tab-active")
        }
    }

    // Zoom picture
    seeImage(){
        console.log("seeImage")
        const attachmentImg = document.querySelector(`.attachment-img`);
                        const modalElement = document.getElementById("image-modal");
                        const modalContent = modalElement.querySelector(".modal1-content");
                        // Check if the "selected" class is present
                        const isSelected = modalElement.classList.contains("active");
        
                        if(isSelected){
                        modalElement.classList.remove("active");
        
                        }else{
                        modalContent.innerHTML = `<img src="${attachmentImg.src}" alt="Zoomed Attachment" class="zoomed-img"/>`;
                          modalElement.classList.add("active");
                        }

                        modalElement.addEventListener("click", () => {
                          modalElement.classList.remove("active");
                        });
        }

    getCurrentUser(){

   axios.get("/api/current/user")
   .then((response) => {
   console.log("Current User Info")
   console.log(response.data)

   //CURRENT SPECIFIC
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/res.partner?ids=${response.data.partner.id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization
  }
};

axios.request(config)
.then((response) => {
 console.log("Current All User Info")
  console.log(response.data);

 document.getElementById("rpn_portal_user_name").innerHTML = response.data[0].display_name
 document.getElementById("email").value = response.data[0].email
  document.getElementById("name").value = response.data[0].display_name
 document.getElementById("rpn_portal_user_balance").innerHTML = response.data[0].account_balance
 if(response.data[0].phone === false){
  document.getElementById("phone").value = ""
 }else{
  document.getElementById("phone").value = response.data[0].phone
 }



//gender
 if( response.data[0].gender === false ){
   document.getElementById("gender").value = ""
 }else{
   document.getElementById("gender").value = response.data[0].gender
 }



 //profile pic
  if(response.data[0].image_1920 === false){
    document.getElementById("portal_profile_picture").src = "/rpn_website/static/src/media/008-boy-3.svg"
 }else{
    document.getElementById("portal_profile_picture").src = `/web/image/res.partner/${response.data[0].id}/image_1920`
 }

//USER STATE START
localStorage.setItem("isMember",response.data[0].is_member)
 if(response.data[0].is_member === false){
 document.getElementById("portal_state").innerHTML = `        <div  style="display: flex;justify-content: center;align-items: center;border: red 2px solid; padding: 0 20px;border-radius:20px">
        <h1 class="mt-2" style="font-weight: 800;color: red;text-align: center;">INACTIVE</h1>
      </div>  `
 }else{
  document.getElementById("portal_state").innerHTML = `<div  style="display: flex;justify-content: center;align-items: center;border: #4fbf65 2px solid; padding: 0 20px;border-radius:20px">
        <h1 class="mt-2" style="font-weight: 800;color: #4fbf65;text-align: center;">ACTIVE</h1>
      </div>`
 }
//USER STATE END

localStorage.setItem("memberId",response.data[0].member_id[0])
 this.getAttachement(response.data[0].partner_attachment_ids[0])
   if(!(response.data[0].is_member === false)){
 this.getMemberStatus(response.data[0].member_id[0])
   }
})
.catch((error) => {
  console.log(error);
});


   })
   .catch(function (error) {
     console.log(error);
   });

    }


    getMemberStatus(memberId){
      console.log("My Member info")

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read?model=rpn.association.member&ids=${memberId}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization
  }
};

axios.request(config)
.then((response) => {
  console.log(response.data);

  //status
  document.getElementById("status").value = response.data[0].status

})
.catch((error) => {
  console.log(error);
});

    }


    getAttachement(id){

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read?model=ir.attachment&ids=%5B%22${id}%22%5D&fields=%5B%22name%22%2C%22attach_custom_type%22%5D&with_context=%7B%7D&with_company=1\n`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization
  }
};

axios.request(config)
.then((response) => {
  console.log("My Attachment")
  console.log(response.data);
  document.getElementById("portal_status_type").value = response.data[0].attach_custom_type
  document.getElementById("portal_status_number").value = response.data[0].name
  document.getElementById("zoom-img").src = `/web/image/ir.attachment/${response.data[0].id}/datas`

})
.catch((error) => {
  console.log(error);
});

    }

    //all Contribution
    getAllMyContribution(){
    var userId = localStorage.getItem("userId")
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/rpn/get_contributor_records/${userId}`,
};

axios.request(config)
.then((response) => {

  console.log("Contribution", response.data);
  var total_contribution = response.data.length
  document.getElementById("total_contribution").innerHTML = `(${response.data.length})`

  var portal_contribution_table_items = document.getElementById("portal_contribution_table_items")

  portal_contribution_table_items.innerHTML = response.data.map((contributions) =>{

        //DATE
        let datetime = contributions.date_of_death;
        let date = datetime.split(" ")[0];
        let date1 = new Date(date);

        let options = { day: 'numeric', month: 'short', year: 'numeric' };
        let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();


  return `<tr style="background: white;">
            <td style="font-size: 12px;font-weight: 500;">${formattedDate}</td>
            <td style="font-size: 12px;font-weight: 500;">${contributions.code}</td>
            <td style="font-size: 12px;font-weight: 500;">${contributions.description}</td>
            <td style="font-size: 12px;font-weight: 500;">${contributions.total_contribution}</td>
            <td style="font-size: 12px;font-weight: 500;">${contributions.contribution_per_member}</td>
            </tr>`

  }).join("")
})
.catch((error) => {
  console.log(error);
});

}


    //child Contribution
    getChildContribution(id,name){
    document.getElementById("contributor_name").innerHTML = `${name}`

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/rpn/get_contributor_records/${id}`,
};

axios.request(config)
.then((response) => {

  console.log("Contribution child", response.data);
    var contribution_child_table_items = document.getElementById("contribution_child_table_items")

  contribution_child_table_items.innerHTML = response.data.map((contributions) =>{

        //DATE
        let datetime = contributions.date_of_death;
        let date = datetime.split(" ")[0];
        let date1 = new Date(date);

        let options = { day: 'numeric', month: 'short', year: 'numeric' };
        let formattedDate = date1.toLocaleDateString('en-GB', options).toUpperCase();


  return `<tr style="background: white;">
            <td style="font-size: 12px;font-weight: 500;">${formattedDate}</td>
            <td style="font-size: 12px;font-weight: 500;">${contributions.code}</td>
            <td style="font-size: 12px;font-weight: 500;">${contributions.description}</td>
            <td style="font-size: 12px;font-weight: 500;">${contributions.total_contribution}</td>
            <td style="font-size: 12px;font-weight: 500;">${contributions.contribution_per_member}</td>
            </tr>`

  }).join("")

})
.catch((error) => {
  console.log(error);
});

}

    //all member's children
    getAllMemberChildren(){
    var userId = localStorage.getItem("userId")
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/rpn/manager/get_association_members/${userId}`,
};

axios.request(config)
.then((response) => {

  console.log("Children", response.data.association_members);
  var total_children_member = document.getElementById("children_members_list")
  document.getElementById("total_children_member").innerHTML = `(${response.data.association_members.length})`

  var currency = localStorage.getItem("currency")

  total_children_member.innerHTML = response.data.association_members.map((children)=>{
   var image = children.association_member.association_member_image_1920 === false ? "/rpn_website/static/src/media/008-boy-3.svg" : `/web/image/res.partner/${children.association_member[0].association_member_id}/image_1920`

  return `<div class="col-md-4">
                    <div class="rnp_portal_member p-4">
                      <div class="d-flex justify-content-between">
                        <div class="d-flex" style="gap:20px">
                          <img src=${image} alt="Portal user image"
                            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
                          <span style="font-weight: 600;font-size: 12px;width: 100px;">${children.association_member[0].association_member_name}</span>
                        </div>
                        <span style="font-size:24;font-weight: 700;">${children.association_member[0].association_member_account_balance} ${currency}</span>
                      </div>

                      <div class="d-flex justify-content-end">
                        <button onclick="RnpPortal.getChildContribution(${children.association_member[0].association_member_id},'${children.association_member[0].association_member_name}')" style="font-size: 12px;cursor: pointer;color: #690bec;border:none;background:none" data-toggle="modal"
                          data-target="#Contribution">Contributions <i class="bi bi-arrow-right"></i></button>
                      </div>


                    </div>
                  </div>`
  }).join("")

})
.catch((error) => {
  console.log(error);
});

}

    editProfileButton(){
 var name_div = document.getElementById("name_div")
var phone = document.getElementById("phone")
var gender = document.getElementById("gender")

document.getElementById("updateButton").style.display = "inline"
name_div.style.display = "flex";
phone.disabled = false;
gender.disabled = false;

    }

    editAccountProfile(){
    var name = document.getElementById("name").value
var phone = document.getElementById("phone").value
var gender = document.getElementById("gender").value
//var birth_city_id = localStorage.getItem("birth_city")
//var residency_city_id = localStorage.getItem("residence_city")
//var date = document.getElementById("date").value

var portal_updateButton = document.getElementById("portal_updateButton")
portal_updateButton.innerHTML = `  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Updating...`
var userId = Number(localStorage.getItem("userId"))
let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/res.partner?ids=${userId}&values={\n  "name": "${name}",\n  "phone": "${phone}",\n  "gender": "${gender}"}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  alert("Updated your profile successfully")
portal_updateButton.innerHTML = "Save Now"
   var name_div = document.getElementById("name_div")
var phone = document.getElementById("phone")
var gender = document.getElementById("gender")

document.getElementById("updateButton").style.display = "none"
name_div.style.display = "none";
phone.disabled = true;
gender.disabled = true;
  window.location.href = ""

})
.catch((error) => {
  console.log(error);
});

    }

    editStatusButton(){
    var portal_status_type = document.getElementById("portal_status_type")
var portal_status_number = document.getElementById("portal_status_number")
var status = document.getElementById("status")

document.getElementById("updateStatusButton").style.display = "inline"

document.getElementById("image-document").style.display = "block"

document.getElementById("zoom-img").style.display = "none"
document.getElementById("upload_id_document").style.display = "block"
document.getElementById("upload_id_document_view").style.display = "block"

portal_status_type.disabled = false;
portal_status_number.disabled = false;
status.disabled = false;
    }

    loadProfileDocument(event,inputId) {
        var image = document.getElementById("image-document");
        var confirmImage = document.getElementById("confirmImage")
        var file = event.target.files[0];

        // Check if the selected file is an image (jpeg, jpg, png, gif)
        var allowedExtensions = ["jpg", "jpeg", "png"];
        var fileExtension = file.name.split(".").pop().toLowerCase();

        if (allowedExtensions.indexOf(fileExtension) === -1) {
                  document.getElementById(inputId).value = "";
                  image.src = ""; // Optionally clear the image source
                  confirmImage.src = ""

        //   var alert_error_message = document.getElementById("alert_error_message")
        //   if(langaugeCodeAll === "fr"){
        //      alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Veuillez sélectionner un fichier image valide</p>`
        //   }else{
        //  alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Please select a valid image file</p>`
        //   }

        //    var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
        // myModal.show();

        }else{
           image.src = URL.createObjectURL(event.target.files[0]);
        }


      }


    editStatusProfile(){

    var portal_status_type = document.getElementById("portal_status_type").value
var portal_status_number = document.getElementById("portal_status_number").value
var userId = Number(localStorage.getItem("userId"))
var status = document.getElementById("status").value

var portal_updateStatusButton = document.getElementById("portal_updateStatusButton")
portal_updateStatusButton.innerHTML = `  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Updating...`

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/ir.attachment?values={\n "name": "${portal_status_number}",\n "attach_custom_type": "${portal_status_type}",\n "partner_id": ${userId}\n}`,
  headers: {
    'Authorization': authorization,
  },
//  data : data
};
//for attachment
axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  alert("Your Status in Canada were updated successfully")

portal_updateStatusButton.innerHTML = "Save Now"
  //upload status document
let data = new FormData();
let fileinput_attachment = document.getElementById('image-input-document').files[0];
data.append('ufile',fileinput_attachment);

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/upload/ir.attachment/${response.data[0]}/datas?`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
    'Content-Type': 'multipart/form-data',
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
    var portal_status_type = document.getElementById("portal_status_type")
var portal_status_number = document.getElementById("portal_status_number")
var status = document.getElementById("status")

document.getElementById("updateStatusButton").style.display = "none"
document.getElementById("image-document").style.display = "none"

document.getElementById("zoom-img").style.display = "flex"
document.getElementById("upload_id_document").style.display = "none"
document.getElementById("upload_id_document_view").style.display = "none"

portal_status_type.disabled = true;
portal_status_number.disabled = true;
status.disabled = true;

  this.processStatus()
})
.catch((error) => {
  console.log(error);
});

})
.catch((error) => {
  console.log(error);
});
    }

    processStatus(){
var status = document.getElementById("status").value

var memberId = Number(localStorage.getItem("memberId"))
var userId = localStorage.getItem("userId")
let configStatus = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/rpn.association.member?ids=${memberId}&values={\n  "status": "${status}", "partner_id": ${userId}\n}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(configStatus)
.then((response) => {
  console.log(JSON.stringify(response.data));
  window.location.href = ""
})
.catch((error) => {
  console.log(error);
});

}

    rechargeAccount(){

    var rechargeBalance = document.getElementById("rechargeBalance")
rechargeBalance.innerHTML = `  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Processing...`

var userId = Number(localStorage.getItem("userId"))
var amount = Number(document.getElementById("amount").value)
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/create/account.recharge?values={\n  "partner_id": ${userId},\n  "amount": ${amount}\n}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));


let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `/api/v1/call/account.recharge/member_other_recharge/?ids=${response.data[0]}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log("Invoice id",response.data[0][0]);

  this.proceedToPayment(response.data[0][0])

})
.catch((error) => {
  console.log(error);
});


})
.catch((error) => {
  console.log(error);
});


    }

    proceedToPayment(id){

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read?model=account.move&ids=${id}&fields=%5B%22payment_link%22%5D`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  window.location.href = response.data[0].payment_link
})
.catch((error) => {
  console.log(error);
});

    }

    }


var RnpPortal = new rnpPortal()

RnpPortal.getCurrentUser()
RnpPortal.getAllMyContribution()
RnpPortal.getAllMemberChildren()

setTimeout(()=>{
RnpPortal.onLoad()
},3000)
