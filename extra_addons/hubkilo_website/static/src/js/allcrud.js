function rejectShipping(id){
var raw = JSON.stringify({
   "state": "rejected"
          });
   let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: `/api/v1/write/m1st_hk_roadshipping.shipping?values=${raw}&ids=${id}`,
  headers: {
    'Accept': 'application/json',
    'Authorization': localStorage.getItem("authorization"),
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
  window.location.href="/profile"
})
.catch((error) => {
alert(error.response.data.message)
  console.log(error.response.data.message);
});
}