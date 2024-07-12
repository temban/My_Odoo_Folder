

 function getAuthorizationKey(){

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '/last/get_authorization_key',
};

axios.request(config)
.then((response) => {
var authorizationKey = "Basic"+" "+response.data.authorization_key

localStorage.setItem("authorization",authorizationKey)
//console.log(response.data)
})
.catch((error) => {
  console.log(error);
});


}
setInterval(getAuthorizationKey,2000)
