$(document).ready(function() {
       axios.get('/my_route')
    .then(function(response) {
        data = response.data;
        $("#name").html(data.name);
//        $("#age").html(data.age);
//        document.getElementById('user1').innerHTML =  response.data.name
        console.log(this.user);
    })
    .catch(function(error) {
        console.log(error);
    });
});