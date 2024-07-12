
//localStorage.setItem("authorization",'eGF2aWVybGFtYXIxN0BnbWFpbC5jb206MTIzNA==\'')

//all cities
function getAllTheCities(){
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: '/get_cities',
};

axios.request(config)
.then((response) => {
//  console.log(JSON.stringify(response.data));
  localStorage.setItem("allCities",JSON.stringify(response.data.cities))
})
.catch((error) => {
  console.log(error);
});

}
getAllTheCities()
