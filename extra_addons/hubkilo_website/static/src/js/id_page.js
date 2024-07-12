function seeTable(){
  var authorization = localStorage.getItem("authorization")

 //VERIFY CONFORMITY START
  var partner_attachment_ids = (localStorage.getItem("partner_attachment_ids"))

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `/api/v1/read/ir.attachment?ids=[${partner_attachment_ids}]&fields=%5B%22conformity%22%2C%22name%22%2C%22date_start%22%2C%22date_end%22%2C%22duration%22%2C%22duration_rest%22%2C%22validity%22%2C%22conformity%22%2C%22attach_custom_type%22%5D&with_context=%7B%7D`,
  headers: {
    'Accept': 'application/json',
    'Authorization': authorization,
  }
};

axios.request(config)
.then((response) => {
console.log("Identity")
console.log(response.data)
  var my_attachments = document.getElementById("attachments")

  my_attachments.innerHTML = response.data.map((attachment)=>{

var conformity = attachment.conformity === true && attachment.duration > 0  ?  "inline-block" : "none"
var unconformity = attachment.conformity === true && attachment.duration <= 0 ?  "inline-block" : "none"
var processing = attachment.conformity === false && attachment.duration > 0 ?  "inline-block" : "none"
var notValid = attachment.conformity === false && attachment.duration <= 0 ?  "inline-block" : "none"

let date1 = new Date(attachment.date_start);
let date2 = new Date(attachment.date_end);

let options = { day: 'numeric', month: 'short', year: 'numeric' };
let options2 = { day: 'numeric', month: 'short', year: 'numeric' };
let formattedDateStart = date1.toLocaleDateString('en-GB', options);
let formattedDateEnd = date2.toLocaleDateString('en-GB', options2);



return `<tr><td>
					  <div class="user-info">
						<div class="user-info__img" onclick="seeImage(${attachment.id})">
						  <img src="/web/image/ir.attachment/${attachment.id}/datas" alt="User Img" class="attachment-img${attachment.id}" id="zoom-img"/>
						</div>
						<div class="user-info__basic">
						  <p class="text-muted mb-0">${formattedDateStart}</p>
						  <p class="text-muted mb-0">${formattedDateEnd}</p>
						</div>
					  </div>
					</td>
					<td>
						<div style="display:flex">
					<p class="text-muted mb-0"><h5><i class='fa fa-address-card-o' style='font-size:35px; margin-right:5px'></i></h5> <span style="margin-top:5px">${attachment.attach_custom_type}</span></p>

						</div>
					</td>

					<td>
					  <p class="text-muted mb-0">${attachment.duration} Days</p>
					</td>
					  			<td>
<span style="display:${conformity}; color: #81F79F; border: 3px solid #81F79F; width: 110px; border-radius: 10px; padding: 8px;">
    Conformed
</span>
<span style="display:${unconformity}; color: #FA5858; border: 2px solid #FA5858; width:110px; border-radius: 10px; padding: 8px;">
    Expired
</span>
<span style="display:${processing}; color: orange; border: 2px solid orange; width:110px; border-radius: 10px; padding: 8px;">
    Processing
</span>
	</td>
				</tr> `
}).join("")

})
.catch((error) => {
  console.log(error);
});

 //VERIFY CONFORMITY END

}

seeTable()

function seeImage(id){
console.log("ok")
const attachmentImg = document.querySelector(`.attachment-img${id}`);
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
//				attachmentImg.addEventListener("click", () => {
//				  modalContent.innerHTML = `<img src="${attachmentImg.src}" alt="Zoomed Attachment" class="zoomed-img"/>`;
//				  modalElement.classList.add("active");
//				});
//
				modalElement.addEventListener("click", () => {
				  modalElement.classList.remove("active");
				});
}