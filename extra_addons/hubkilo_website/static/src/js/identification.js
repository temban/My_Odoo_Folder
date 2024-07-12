     var authorization = localStorage.getItem("authorization")
     function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#blah')
                        .attr('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

function addIdentificationInfo() {
console.log("attachment start...")
        var attach_custom_type = document.getElementById("attach_custom_type").value;
        var name = document.getElementById("name").value;
        var date_start = document.getElementById("date_start").value;
        var date_end = document.getElementById("date_end").value;



if(attach_custom_type.trim() === "" || name.trim()==="" || date_start.trim()=== "" || date_end.trim() === ""){
//alert("Fill in all the information for your identification")
    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Fill in all the information for your identification</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();

}else if(document.getElementById('file-input-attachment').value.trim() === ""){
//alert("Select your ID or Passport picture")
    var alert_error_message = document.getElementById("alert_error_message")
   alert_error_message.innerHTML = `<p style="text-transform:capitalize">Select your ID or Passport picture</p>`

     var myModal = new bootstrap.Modal(document.getElementById("errorModal"));
  myModal.show();
}else {
        var save_btn = document.getElementById("identificationInfo")
   save_btn.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`
    var raw = JSON.stringify({
            "name": name,
            "attach_custom_type": attach_custom_type,
            "date_start": date_start,
            "date_end": date_end,
            "partner_id": Number(localStorage.getItem("currentPartner_ids"))
          });
       let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `/api/v1/create/ir.attachment?values=${raw}`,
          headers: {
        'Accept': 'application/json',
        'Authorization': authorization,
      }
    };

    axios.request(config)
    .then((response) => {
       console.log(response.data)

           let attachment_id = response.data
           console.log("attachment_image start...")

          setTimeout(()=>{
              let fileinput_attachment = document.getElementById('file-input-attachment').files[0];
              let formData = new FormData();
              formData.append('ufile', fileinput_attachment);
              let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `/api/v1/upload/ir.attachment/${attachment_id}/datas`,
                headers: {
                  'Accept': 'application/json',
                  'Authorization':  authorization,
                  'Content-Type': 'multipart/form-data',
             },
                data : formData
              };
              axios.request(config)
              .then((response) => {
                console.log("response ---> " + response.data);
                save_btn.innerHTML = "Done !"
                save_btn.style = "background:#f1f5f4; color:#333; pointer-events:none"

//             alert("Your identification information has been saved successfully");

    var alert_success_message = document.getElementById("alert_success_message")
   alert_success_message.innerHTML = `<p style="text-transform:capitalize">Your identification information has been saved successfully</p>`

     var myModal = new bootstrap.Modal(document.getElementById("successModal"));
  myModal.show();
             window.location.href = "/profile";
              })
              .catch((error) => {
                console.log(error);
              });

          },3500)


      })
      .catch(error => {
        console.log(error);
      })

}

   }

  function uploadId(event){
  let fileinput = document.getElementById('file-input').files[0];
  let formData = new FormData();
  formData.append('datas', fileinput);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `/api/v1/upload/ir.attachment/${attachment_id}/datas`,
    headers: {
      'Accept': 'application/json',
      'Authorization':  authorization,
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