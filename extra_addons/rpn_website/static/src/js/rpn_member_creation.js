

      console.log("MEMBER CREATION")

      // Global variable
      var currentSection = 1;
      var memberList = [], membershipFee = 20, paymentLink, section
      var authorization = localStorage.getItem("authorization")
      
      //localStorage.setItem("TotalToPay",Number(membershipFee))
      
      
      
      
      
      
      class rpnMemberCreation {
          onLoad(){
          localStorage.removeItem("managerId")
          localStorage.removeItem("TotalToPay")
          document.getElementById("membershipfees").innerHTML = membershipFee
          document.getElementById("total_amount").innerHTML = Number(membershipFee)

          }
      
          stepsVerificationOne(){
      
          //Step One
          if(!(document.getElementById("name").value.trim() === "" || document.getElementById("email").value.trim() === "" || document.getElementById("phone").value.trim() === "" || document.getElementById("gender").value.trim() === "")) {
           console.log("Going to step two")
          section = 1
      
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
              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
              currentStep.classList.add("completed");
              currentStep1.classList.add("completed");
      
              this.stepsVerificationTwo()
          }
      
      
          }
      
          stepsVerificationTwo(){
              //Step Two
          if(!(document.getElementById("status_name").value.trim() === "" || document.getElementById("status_document").value.trim() === "" || document.getElementById("status_number").value.trim() === "" )) {
           console.log("Going to step Three")
          section = 2
      
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
              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
              currentStep.classList.add("completed");
              currentStep1.classList.add("completed");

              this.stepsVerificationThree()
      
          }
      
      
          }

          stepsVerificationThree(){
          this.stepsVerificationFour()
//              //Step Two
//          if(!(document.getElementById("status_name").value.trim() === "" || document.getElementById("status_document").value.trim() === "" || document.getElementById("status_number").value.trim() === "" )) {
//           console.log("Going to step Three")
//          section = 2
//
//              document.getElementById("sectionn" + section).style.display = "none";
//              document.getElementById("sectionn" + (section + 1)).style.display = "flex";
//
//              document.querySelector(".side_bar_item_icon.active").classList.remove("active");
//              document.querySelector(`[data-step="${section + 1}"]`).classList.add("active");
//
//              document.querySelector(".side_bar_item_icon_text.activeText").classList.remove("activeText");
//              document.querySelector(`[data-step1="${section + 1}"]`).classList.add("activeText");
//
//              currentSection = section + 1;
//
//              // Update the current step to have the check icon and change the background color
//              const currentStep = document.querySelector(`[data-step="${section}"]`);
//              const currentStep1 = document.querySelector(`[data-step1="${section}"]`);
//              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
//              currentStep.classList.add("completed");
//              currentStep1.classList.add("completed");
//
//          }
//
//
          }

          stepsVerificationFour(){
              //Step Two
          if(!(document.getElementById("topUp_amount").value.trim() === "")) {
           console.log("Going to step Four")
          section = 3

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
              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
              currentStep.classList.add("completed");
              currentStep1.classList.add("completed");
              this.stepsVerificationFive()
          }


          }

          stepsVerificationFive(){
                        //Step Two
          if(!(document.getElementById("topUp_amount").value.trim() === "")) {
           console.log("Going to step Five")
          section = 4
           this.goToConfirmSection(section)


          }

          }


          nextSection(section) {
      
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
              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
              currentStep.classList.add("completed");
              currentStep1.classList.add("completed");
          
          }
          
          prevSection(section) {
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
              currentStep.innerHTML = `<span class="side_bar_item_icon_number">${section}</span>`;
              currentStep.classList.remove("completed");
              currentStep1.classList.remove("completed");
          
          }
      
          nextSectionOne(section){
      
              if (section === 1 && document.getElementById("name").value.trim() === "" || document.getElementById("email").value.trim() === "" || document.getElementById("phone").value.trim() === "") {
          
                      var alert_error_message = document.getElementById("alert_error_message")
                      alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Fill all your personal information</p>`
                      var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
                      myModal.show();
          }
      //        }else if(document.getElementById("image-input-id-card").value.trim()===""){
      //
      //            var alert_error_message = document.getElementById("alert_error_message")
      //            alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Select a profile picture</p>`
      //            var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
      //            myModal.show();
      //
      //        }
              else{
      
      var name = document.getElementById("name").value
      var phone = document.getElementById("phone").value
      var gender = document.getElementById("gender").value
      //var birth_city_id = localStorage.getItem("birth_city")
      //var residency_city_id = localStorage.getItem("residence_city")
      //var date = document.getElementById("date").value
      
      var stepOne = document.getElementById("stepOne")
      stepOne.innerHTML = `  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Loading...`
      var userId = Number(localStorage.getItem("userId"))
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `/api/v1/write/res.partner?ids=${userId}&values={\n  "name": "${name}",\n  "phone": "${phone}",\n  "gender": "${gender}"\n}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      //  alert("Successfully")
      
      this.uploadProfile()
      
      setTimeout(()=>{
      
         stepOne.innerHTML = "NEXT STEP"
      
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
                  currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
                  currentStep.classList.add("completed");
                  currentStep1.classList.add("completed");
                  },2000)
      })
      .catch((error) => {
        console.log(error);
      });
      
      
      
      
              }
              }
      
          uploadProfile(event){
           let fileinput = document.getElementById('image-input-id-card').files[0];
           let formData = new FormData();
           formData.append('image_1920_doc', fileinput);
           let config = {
             method: 'post',
             maxBodyLength: Infinity,
             url: '/image_1920/update',
             headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          },
             data : formData
           };
           axios.request(config)
           .then((response) => {
             console.log(JSON.stringify(response.data));
      
           })
           .catch((error) => {
             console.log(error);
           });
          }
      
          nextSectionTwo(section){
      
                  if (section === 2 && document.getElementById("status_name").value.trim() === "" || document.getElementById("status_document").value.trim() === "" || document.getElementById("status_number").value.trim() === "" ) {
              
                          var alert_error_message = document.getElementById("alert_error_message")
                          alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Fill all your personal information</p>`
                          var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
                          myModal.show();
              
                  }else if(localStorage.getItem("attachment_image") === ""){
                      
                      var alert_error_message = document.getElementById("alert_error_message")
                      alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">Select and upload the photo of the type of document you selected above </p>`
                      var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
                      myModal.show();
              
                  }
                  else{

      
                  //Change attachment start
      //            let data = '';

      var status_document = document.getElementById("status_document").value
      var status_number = document.getElementById("status_number").value
      var userId = Number(localStorage.getItem("userId"))
      var status_name = document.getElementById("status_name").value


      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/api/v1/create/ir.attachment?values={\n "name": "${status_number}",\n "attach_custom_type": "${status_document}",\n "partner_id": ${userId}\n}`,
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
                      currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
                      currentStep.classList.add("completed");
                      currentStep1.classList.add("completed");
        this.processStatus(section)
      })
      .catch((error) => {
        console.log(error);
      });

      })
      .catch((error) => {
        console.log(error);
      });

      //for status
      
      
       }
         }
      
          nextSectionThree(section){
          if (localStorage.getItem("managerId") === undefined || localStorage.getItem("managerId") === null ) {
          console.log("Going next step without selecting a new managers")
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
              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
              currentStep.classList.add("completed");
              currentStep1.classList.add("completed");
      
          }else{
                  this.processStatus(section)
      
          }
      
            }
      
          goToConfirmSection(section){
              
                      
              //Confirm personal information start
              document.getElementById("confirmName").innerHTML = document.getElementById("name").value
              document.getElementById("confirmEmail").innerHTML = document.getElementById("email").value
              document.getElementById("confirmPhone").innerHTML = document.getElementById("phone").value
              //Confirm personal information end
      
              //confrim status and documents start
              document.getElementById("confirmStatus").innerHTML = document.getElementById("status_name").value
              document.getElementById("confirmDocument").innerHTML = document.getElementById("status_document").value
              document.getElementById("confirmNumber").innerHTML = document.getElementById("status_number").value
              //confrim status and documents end
      
              //confrim manager start
              if(localStorage.getItem("managerId") === undefined || localStorage.getItem("managerId") === null){
                document.getElementById("managerConfirmSection").style.display = "none"
              }else{
                  document.getElementById("managerConfirmSection").style.display = "block"
      
              }
              document.getElementById("statusManagerName").innerHTML = localStorage.getItem("managerName")
              document.getElementById("statusManagerEmail").innerHTML = localStorage.getItem("managerEmail")
              var managerPartnerId = localStorage.getItem("managerPartnerId")
              var manageImage_1920 = localStorage.getItem("manageImage_1920")
      
              var image = manageImage_1920 === "false" ? "/rpn_website/static/src/media/008-boy-3.svg" : `/web/image/res.partner/${managerPartnerId}/image_1920`
               document.getElementById("statusManagerImage").src = image
              //confrim manager end
      
              //confrim balance start
              document.getElementById("confirmTopUp").innerHTML = document.getElementById("topUp_amount").value
              document.getElementById("confirmMemFees").innerHTML = membershipFee
              if(document.getElementById("topUp_amount").value.trim() === ""){
                  document.getElementById("confirmTotalToPay").innerHTML = membershipFee
      
      
              }else{
                  document.getElementById("confirmTotalToPay").innerHTML = Number(document.getElementById("topUp_amount").value) + membershipFee
      
              }
              //confrim balance end
      
      
      
      if(document.getElementById("topUp_amount").value.trim() === ""){
      alert("You need to have a first recharge of $25")
                  document.getElementById("confirmTotalToPay").innerHTML = membershipFee
      
      }else{

      this.RechargeAccount(section)
      

      }
      
          }
      
          loadProfilePicture(event,inputId) {
              var image = document.getElementById("image-profile");
              var imageConfirm = document.getElementById("image-profileConfirm")  
                var file = event.target.files[0];
            
              // Check if the selected file is an image (jpeg, jpg, png, gif)
              var allowedExtensions = ["jpg", "jpeg", "png"];
              var fileExtension = file.name.split(".").pop().toLowerCase();
            
              if (allowedExtensions.indexOf(fileExtension) === -1) {
                        document.getElementById(inputId).value = "";
                        image.src = ""; 
                        imageConfirm.src = "" // Optionally clear the image source
      
                var alert_error_message = document.getElementById("alert_error_message")
      
                 alert_error_message.innerHTML = `<p style="font-weight:300">Please select a valid image file with image (jpeg, jpg, png)</p>`
      
              var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
              myModal.show();
            
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
                 imageConfirm.src = URL.createObjectURL(event.target.files[0]);
      
              }
            
            
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
                 confirmImage.src = URL.createObjectURL(event.target.files[0])
                 localStorage.setItem("attachment_image","1")
              }
            
            
            }
      
          getPhoneCountryCode(){
              const phoneInputField = document.getElementById("phone");
              const phoneInput = window.intlTelInput(phoneInputField, {
                    utilsScript:
                    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                    });
          //  const phoneNumber = phoneInput.getNumber();       
          }  
      
          getManagers(){
      
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '/api/v1/search_read?model=res.partner&fields=%5B%22name%22%2C%22email%22%2C%22member_id%22%2C%22is_member%22%2C%22image_1920%22%2C%22member_diseased%22%5D',
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        }
      };
      
      axios.request(config)
      .then((response) => {
      //  console.log("my current members", response.data)
         var manager_list = document.getElementById("manager_list")
      
       manager_list.innerHTML = response.data.map((member) => {
        if(member.is_member === true && member.member_diseased === false){
      //  console.log("my_manager",members);
              memberList.push(member)
              var image = member.image_1920 === false ? "/rpn_website/static/src/media/008-boy-3.svg" : `/web/image/res.partner/${member.id}/image_1920`
      
      //        return `<div class="col-md-6">
      //        <div id="manager_id${member.id}" onclick="RpnMemberCreation.selectManager(${member.id},'${member.email}','${member.name}',${member.member_id[0]},'${member.image_1920}')" style="background:white;display:flex;align-items:center;gap:20px;margin-top:5px;box-shadow:1px 10px 30px rgba(126, 124, 124, 0.24);padding:10px;margin:5px;border-radius:5px">
      //            <div>
      //                <img src=${image} alt="Your Image"
      //                    style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover;" />
      //            </div>
      //            <div>
      //                <p style="font-size:12;font-weight:800"
      //                    class="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:150px;">
      //                    ${member.name}</p>
      //                <p style="font-size:12;font-weight:300"
      //                    class="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:170px;">
      //                    ${member.email}</p>
      //            </div>
      //        </div>
      //
      //    </div>`
      //
      
        }
        }).join('')
      
      })
      .catch((error) => {
        console.log(error);
      });
      
      
      
      
          }
      
          selectManager(id,email,name,member_id,image){
              var managerId = document.getElementById(`manager_id${id}`)
              const isSelected = managerId.classList.contains("selected");
              console.log("Let's go,,,,,,,,,,,...................")

              if(isSelected){
                  managerId.classList.remove("selected");
                  localStorage.removeItem("managerId")
                  localStorage.removeItem("managerName")
                  localStorage.removeItem("managerEmail")
                  localStorage.removeItem("managerPartnerId")
                  localStorage.removeItem("manageImage_1920")
      
      
                  
              }else{
                  if(localStorage.getItem("managerId") === null || localStorage.getItem("managerId") === undefined){
                      localStorage.setItem("managerId",member_id)
                      localStorage.setItem("managerPartnerId",id)
                      localStorage.setItem("managerEmail",email)
                      localStorage.setItem("manageImage_1920",image)
                      localStorage.setItem("managerName",name)
                      managerId.classList.add("selected");
                  }else{
                      var alert_error_message = document.getElementById("alert_error_message")
                      alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">You can only select one manager</p>`
                      var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
                      myModal.show();
                  }
      
              }
      
      
          }

          selectMyManager(id,email,name,member_id,image){
              var managerId = document.getElementById(`manager_my_id${id}`)
              const isSelected = managerId.classList.contains("selected");
              console.log("Let's go,,,,,,,,,,,...................")

              if(isSelected){
                  managerId.classList.remove("selected");
                  localStorage.removeItem("managerId")
                  localStorage.removeItem("managerName")
                  localStorage.removeItem("managerEmail")
                  localStorage.removeItem("managerPartnerId")
                  localStorage.removeItem("manageImage_1920")



              }else{
                  if(localStorage.getItem("managerId") === null || localStorage.getItem("managerId") === undefined){
                      localStorage.setItem("managerId",member_id)
                      localStorage.setItem("managerPartnerId",id)
                      localStorage.setItem("managerEmail",email)
                      localStorage.setItem("manageImage_1920",image)
                      localStorage.setItem("managerName",name)
                      managerId.classList.add("selected");

                                    //confrim manager start
              if(localStorage.getItem("managerId") === undefined || localStorage.getItem("managerId") === null){
                document.getElementById("managerConfirmSection").style.display = "none"
              }else{
                  document.getElementById("managerConfirmSection").style.display = "block"

              }
              document.getElementById("statusManagerName").innerHTML = localStorage.getItem("managerName")
              document.getElementById("statusManagerEmail").innerHTML = localStorage.getItem("managerEmail")
              var managerPartnerId = localStorage.getItem("managerPartnerId")
              var manageImage_1920 = localStorage.getItem("manageImage_1920")

              var image = manageImage_1920 === "false" ? "/rpn_website/static/src/media/008-boy-3.svg" : `/web/image/res.partner/${managerPartnerId}/image_1920`
               document.getElementById("statusManagerImage").src = image
              //confrim manager end
                  }
//                  else{
//                      var alert_error_message = document.getElementById("alert_error_message")
//                      alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">You can only select one manager</p>`
//                      var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
//                      myModal.show();
//                  }

              }


          }

      
          selectSearchManager(id,email,name,member_id,image){
              var managerId = document.getElementById(`manager_search_id${id}`)
              const isSelected = managerId.classList.contains("selected");
      
              if(isSelected){
                  managerId.classList.remove("selected");
                  localStorage.removeItem("managerId")
                  localStorage.removeItem("managerPartnerId")
                  localStorage.removeItem("manageImage_1920")
      
                  
              }else{
                  if(localStorage.getItem("managerId") === null || localStorage.getItem("managerId") === undefined){
                      localStorage.setItem("managerId",member_id)
                      localStorage.setItem("managerPartnerId",id)
                      localStorage.setItem("managerEmail",email)
                      localStorage.setItem("manageImage_1920",image)
                      localStorage.setItem("managerName",name)
                      managerId.classList.add("selected");
                  }else{
                      var alert_error_message = document.getElementById("alert_error_message")
                      alert_error_message.innerHTML = `<p style="text-transform:capitalize;font-weight:300">You can only select one manager</p>`
                      var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
                      myModal.show();
                  }
      
              }
      
      
          }
      
          //LiVE SEARCH MEMBERS
          liveSearchMember(value) {
      
          var search_manager = document.getElementById('search_manager').value;
      
          var manager_list = document.getElementById('manager_list');
          var search_info = document.getElementById('search_members');
      
          manager_list.style.display = "none";
          search_info.style.display = "flex";
      
        
          // Perform search
          var filteredMembers = memberList.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
        
          // Log search results to the console
          console.log(filteredMembers);
          // localStorage.setItem("filteredMembers", JSON.stringify(filteredMembers))
        
        
        
      
          if (search_manager !== "") {
              manager_list.style.display = "none";
              search_info.style.display = "flex";    
        
            const search_members = document.getElementById('search_members');
            if (filteredMembers.length === 0) {
              search_members.innerHTML = `<h1 style="text-align:center;margin-top:100px;margin-bottom:100px">No Result!!</h1>`
            }
            else {
        
             search_info.innerHTML = filteredMembers.map((member)=>{
              var image = member.image_1920 === false ? "/rpn_website/static/src/media/008-boy-3.svg" : `/web/image/res.partner/${member.id}/image_1920`
      
              return ` <div class="col-md-6">
              <div id="manager_search_id${member.id}" onclick="RpnMemberCreation.selectSearchManager(${member.id},'${member.email}','${member.name}',${member.member_id[0]},'${member.image_1920}')" style="background:white;display:flex;align-items:center;gap:20px;margin-top:5px;box-shadow:1px 10px 30px rgba(126, 124, 124, 0.24);padding:10px;margin:5px;border-radius:5px">
                  <div>
                      <img src=${image} alt="Your Image"
                          style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover;" />
                  </div>
                  <div>
                      <p style="font-size:12;font-weight:800"
                          class="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:150px;">
                          ${member.name}</p>
                      <p style="font-size:12;font-weight:300"
                          class="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:170px;">
                          ${member.email}</p>
                  </div>
              </div>
      
          </div>`
        
             }).join("")
        
        
            }
        
          }else{
              manager_list.style.display = "flex";
              search_info.style.display = "none";
      
          }
        }
      
         caculateSimulatorTotal(currentValue) {
      
          console.log(currentValue.toString().length)
          if(Number(currentValue.toString().length)  > 5){
              document.getElementById("long_text").style.fontSize = "100%"
              document.getElementById("long_text2").style.fontSize = "100%"
          }else{
              document.getElementById("long_text").style.fontSize = "60px"
              document.getElementById("long_text2").style.fontSize = "54px" 
          }
      
          if(Number(currentValue) > 0){
          document.getElementById("currentValue").innerHTML = Number(currentValue)
      //    document.getElementById("total_amount").innerHTML = Number(membershipFee) + Number(currentValue)
          document.getElementById("total_amount").innerHTML =  Number(currentValue) + Number(membershipFee)
      
      //    localStorage.setItem("TotalToPay",Number(membershipFee) + Number(currentValue))
          localStorage.setItem("TotalToPay",Number(currentValue))
      
          }else{
           localStorage.setItem("TotalToPay",Number(currentValue))
          document.getElementById("currentValue").innerHTML = 0
          document.getElementById("total_amount").innerHTML = Number(membershipFee)
          }
      
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
      
       document.getElementById("name").value = response.data[0].display_name
       document.getElementById("email").value = response.data[0].email
      //phone
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
          document.getElementById("image-profile").src = "/web/static/img/placeholder.png"
       }else{
          document.getElementById("image-profile").src = `/web/image/res.partner/${response.data[0].id}/image_1920`
          document.getElementById("image-profileConfirm").src = `/web/image/res.partner/${response.data[0].id}/image_1920`
       }

      //recharge
      if(response.data[0].accounts === false){
          document.getElementById("topUp_amount").value = ""
       }else{
      this.getLastRecharge(response.data[0].accounts[response.data[0].accounts.length - 1])
       }

      
      
      //STEP TWO START
      localStorage.setItem("memberId",response.data[0].member_id[0])
      localStorage.setItem("memberActive",response.data[0].member_active)
      
       this.getAttachement(response.data[0].partner_attachment_ids[0])
         if(!(response.data[0].is_member === false)){
         localStorage.setItem("getMemberStatus",response.data[0].member_id[0])
       this.getMemberStatus()
      
         }
      
      //STEP THREE START
      
      setTimeout(()=>{
      RpnMemberCreation.stepsVerificationOne()
      },3000)



      })
      .catch((error) => {
        console.log(error);
      });
      
      
         })
         .catch(function (error) {
           console.log(error);
         });
      
          }

          getLastRecharge(id){
             let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `/api/v1/read?model=account.recharge&ids=[${id}]`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        }
      };

      axios.request(config)
      .then((response) => {
        console.log("LAST RECHARGE", response.data)

       document.getElementById("topUp_amount").value = response.data[0].total
       this.caculateSimulatorTotal(response.data[0].total)

      })
      .catch((error) => {
        console.log(error);
      });

          }
      
          getAttachement(id){
          console.log("uuuuuuuuuuuuuuu",id)
      
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `/api/v1/read?model=ir.attachment&ids=${id}&fields=%5B%22name%22%2C%22datas%22%2C%22attach_custom_type%22%5D`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log("My Attachment")
        console.log(response.data);
        document.getElementById("status_document").value = response.data[0].attach_custom_type
        document.getElementById("status_number").value = response.data[0].name
        document.getElementById("image-document").src = `/web/image/ir.attachment/${response.data[0].id}/datas`
        document.getElementById("confirmImage").src = `/web/image/ir.attachment/${response.data[0].id}/datas`

        localStorage.setItem("attachment_image",response.data[0].datas)
      
      
      
      })
      .catch((error) => {
        console.log(error);
      });
      
          }
      
          getMemberStatus(){
            console.log("My Member info")
      
            var memberId = localStorage.getItem("getMemberStatus")
      
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
        document.getElementById("status_name").value = response.data[0].status
        localStorage.setItem("my_manager",response.data[0].manager_id)
        if(response.data[0].manager_id === false){
        localStorage.setItem("my_manager_id","")
        }else{
        localStorage.setItem("my_manager_id",response.data[0].manager_id[0])
           //CURRENT SPECIFIC
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `/api/v1/read/res.partner?ids=${response.data[0].manager_id[0]}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization
        }
      };
      
      axios.request(config)
      .then((response) => {
       console.log("Current Manager")
        console.log(response.data);
      
         var manager_list = document.getElementById("manager_list")
      
       manager_list.innerHTML = response.data.map((member) => {
        if(member.is_member === true && member.member_diseased === false){
      //  console.log("my_manager",members);
              memberList.push(member)
              var image = member.image_1920 === false ? "/rpn_website/static/src/media/008-boy-3.svg" : `/web/image/res.partner/${member.id}/image_1920`

                setTimeout(()=>{
                console.log("Goooooooooooooooo")
           RpnMemberCreation.selectMyManager(member.id,member.email,member.name,member.member_id[0],member.image_1920)
          },2000)

              return `<div class="col-md-6">
              <div id="manager_my_id${member.id}"  style="background:white;display:flex;align-items:center;gap:20px;margin-top:5px;box-shadow:1px 10px 30px rgba(126, 124, 124, 0.24);padding:10px;margin:5px;border-radius:5px">
                  <div>
                      <img src=${image} alt="Your Image"
                          style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover;" />
                  </div>
                  <div>
                      <p style="font-size:12;font-weight:800"
                          class="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:150px;">
                          ${member.name}</p>
                      <p style="font-size:12;font-weight:300"
                          class="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width:170px;">
                          ${member.email}</p>
                  </div>
              </div>
      
          </div>`

      
        }
        }).join('')
      
      
      
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
      
          processStatus(section){
      var userId = Number(localStorage.getItem("userId"))
      var status_name = document.getElementById("status_name").value
      
      if(localStorage.getItem("isMember") === "false" ){
      
      console.log("Created your status in canada successfully")
      
      if(localStorage.getItem("managerId") === undefined || localStorage.getItem("managerId") === null){
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/api/v1/create/rpn.association.member?values={\n "status": "${status_name}", "partner_id": ${userId}\n}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
          alert("Successfully updated your status in canada")
          this.getMemberStatus()
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
              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
              currentStep.classList.add("completed");
              currentStep1.classList.add("completed");
      })
      .catch((error) => {
        console.log(error);
      });
      
      }
      else{
      var managerId = Number(localStorage.getItem("managerPartnerId"))
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/api/v1/create/rpn.association.member?values={\n "manager_id": ${managerId}, "status": "${status_name}", "partner_id": ${userId}\n}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      //    alert("Successfully updated your status in canada")
          this.getMemberStatus()
      
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
              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
              currentStep.classList.add("completed");
              currentStep1.classList.add("completed");
      })
      .catch((error) => {
        console.log(error);
      });
      
      
      }
      
      
      
      }
      else{
      console.log("Modify your status in canada successfully")
      
      if(localStorage.getItem("managerId") === undefined || localStorage.getItem("managerId") === null){
      var memberId = Number(localStorage.getItem("memberId"))
      
      let configStatus = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `/api/v1/write/rpn.association.member?ids=${memberId}&values={\n  "status": "${status_name}", "partner_id": ${userId}\n}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        }
      };
      
      axios.request(configStatus)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      //  alert("Successfully updated your status in canada")
          this.getMemberStatus()
      
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
                      currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
                      currentStep.classList.add("completed");
                      currentStep1.classList.add("completed");
      })
      .catch((error) => {
        console.log(error);
      });
      }else{
      var memberId = Number(localStorage.getItem("memberId"))
      var managerId = Number(localStorage.getItem("managerPartnerId"))
      
      let configStatus = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `/api/v1/write/rpn.association.member?ids=${memberId}&values={\n "manager_id": ${managerId}, "status": "${status_name}", "partner_id": ${userId}\n}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        }
      };
      
      axios.request(configStatus)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      //  alert("Successfully updated your status in canada")
          this.getMemberStatus()
      
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
                      currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
                      currentStep.classList.add("completed");
                      currentStep1.classList.add("completed");
      })
      .catch((error) => {
        console.log(error);
      });
      }
      
      
      }
      }
      
          RechargeAccount(section){
      
              var stepFour = document.getElementById("stepFour")
      stepFour.innerHTML = `  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Loading...`
      
      var userId = Number(localStorage.getItem("userId"))
      var TotalToPay = Number(localStorage.getItem("TotalToPay")) - 20

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `/api/v1/create/account.recharge?values={\n  "partner_id": ${userId},\n  "amount": ${TotalToPay}\n}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization,
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      stepFour.innerHTML = "NEXT STEP"
      localStorage.setItem("member_first_recharge_id",response.data[0])

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
              currentStep.innerHTML = '<i class="bi bi-check-lg"></i>';
              currentStep.classList.add("completed");
              currentStep1.classList.add("completed");
      
      })
      .catch((error) => {
        console.log(error);
      });
      
      
          }
      
          createMemberAndRechargeAccount(section) {
      
        var stepFive = document.getElementById("stepFive")
        stepFive.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...'
      
        var member_first_recharge_id = localStorage.getItem("member_first_recharge_id")
      
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `/api/v1/call/account.recharge/member_first_recharge/?ids=${member_first_recharge_id}`,
          headers: {
            'Accept': 'application/json',
            'Authorization': authorization,
          }
        };
      
        axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
            this.proceedToPayment(response.data[0][0])
           this.processStatus(section)
      
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
        paymentLink = response.data[0].payment_link
      })
      .catch((error) => {
        console.log(error);
      });
      
          }
      
          goToProceedPayment(){
          window.location.href = paymentLink
          }

          getLiveCurrentUser(){
                   //CURRENT SPECIFIC
                   var userId = localStorage.getItem("userId")
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `/api/v1/read/res.partner?ids=${userId}`,
        headers: {
          'Accept': 'application/json',
          'Authorization': authorization
        }
      };

      axios.request(config)
      .then((response) => {
       console.log("Current Live User Info")
        console.log(response.data);


      //STEP TWO START
      localStorage.setItem("memberId",response.data[0].member_id[0])
      localStorage.setItem("memberActive",response.data[0].member_active)
      localStorage.setItem("isMember",response.data[0].is_member)


//       this.getAttachement(response.data[0].partner_attachment_ids[0])

         if(!(response.data[0].is_member === false)){
         localStorage.setItem("getMemberStatus",response.data[0].member_id[0])
       this.getMemberStatus()
         }

      })
      .catch((error) => {
        console.log(error);
      });
          }

          cancelCreation(){
          window.location.href = "/my/home"
          }
      
      }
      
      var RpnMemberCreation = new rpnMemberCreation()
      
      
      setTimeout(()=>{
          RpnMemberCreation.getPhoneCountryCode()
          RpnMemberCreation.onLoad()
          RpnMemberCreation.getManagers()
          RpnMemberCreation.getCurrentUser()
      },2000)

      setInterval(() => {
          RpnMemberCreation.getLiveCurrentUser()
      }, 2000);



      
        
      