//window.onload = function () {
//  if(localStorage.getItem("userId") !== null){
//  window.location.href = "/profile";
//  }
//
//}


   function signup() {
   //alert("sign...1234...abcd")
    let termsCheckbox = document.getElementById("termsCheckbox");
     if(termsCheckbox.checked){
        localStorage.clear();
        var name = document.getElementById("name").value.toString();
        var phone = document.getElementById("phone").value.toString();
        var email = document.getElementById("email").value.toString();
//        var birthplace = document.getElementById("birthplace").value.toString();
        var street = document.getElementById("street").value.toString();
        //var birthday = (document.getElementById("birthday").value).toString().substring(2).replaceAll('-', "/");
        var birthdate = (document.getElementById("birthday").value.toString())
        var sex = document.getElementById("sex").value.toString();
//        var typeofpiece = document.getElementById("typeofpiece").value;
        var password = document.getElementById("password").value.toString();
        var raw = JSON.stringify({
            "name": name,
            "login": email,
            "password": password,
            "phone":phone,
            "sex": sex,
//            "residence_city_id": "100",
//            "birth_city_id": "23",
//            "birthdate": birthdate,
            "sel_groups_1_9_10": 10
          });
       let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `/api/v1/create/res.users?values=${raw}`,
          headers: {
        'Accept': 'application/json',
        'Authorization': localStorage.getItem("authorization")
      }
    };

    axios.request(config)
    .then((response) => {
       console.log(response)
       console.log(response.data[0])
       console.log("type -> ", typeof(response.data[0]))
        let created_userId = response.data[0].toString()
       var raw = JSON.stringify({
            "email": email,
            "sex": sex,
//            "birthdate": birthdate,
            "street": street,
          });
                   let config = {
                  method: 'put',
                  maxBodyLength: Infinity,
                      url: `/api/v1/write/res.users?ids=${created_userId}&values=${raw}`,
                          headers: {
                        'Accept': 'application/json',
                        'Authorization': localStorage.getItem("authorization"),
                      }
                    };

                    axios.request(config)
                    .then((response) => {
                    //alert("created and updated")
                     console.log(response)
                  })
                  .catch(error => {
                  alert("error! please verify fields");
                  console.log(error);
                  })

        if ((typeof(response.data[0])) == typeof(1) ){
            alert("Account created successfully");
            localStorage.setItem("currentUser_ids", response.data[0]);
              window.location.href = "/web/login";
        }

      })
      .catch(error => {
      alert("error! please verify fields _-_-_");
        console.log(error);
      })
     }else{
     console.log("terms unchecked")
     alert("Please accept the terms and conditions.")
     }
   }


//  function signup() {
//        localStorage.clear();
//        var name = document.getElementById("name").value;
//        var phone = document.getElementById("phone").value;
//        var email = document.getElementById("email").value;
//        var birthplace = document.getElementById("birthplace").value;
//        var street = document.getElementById("street").value;
//        var birthday = document.getElementById("birthday").value
////        var birthday = (document.getElementById("birthday").value).toString().substring(2).replaceAll('-', "/");
//        var sex = document.getElementById("sex").value;
////        var typeofpiece = document.getElementById("typeofpiece").value;
//        var password = document.getElementById("password").value;
//
//
//      const url = 'create/new/partner';
//      const jsonData = JSON.stringify({
//      "jsonrpc": "2.0",
//      "method": "call",
//      "params": {
//       "name": name,
//      "email": email,
//      "phone": phone,
//      "birthday": birthday,
////      "birthplace": birthplace,
//      "sex": sex,
//      "is_traveler": false,
//      "street": street,
//      "password": password
//      }
//      })
//      axios.post(url, jsonData, {
//        headers: {
//          'Content-Type': 'application/json',
//        }
//      })
//      .then(response => {
//       responsee = JSON.stringify(response.data.result)
//        if ((responsee.message) = "Account created successfully" ){
//            alert("Account created successfully ><>");
//              window.location.href = "/web/login";
//              localStorage.setItem("name", name);
//        }
//
//      })
//      .catch(error => {
//      alert("error! please verify fields");
//        console.log(error);
//      })
//
//   }

// function signup() {
//    let config = {
//      method: 'post',
//      maxBodyLength: Infinity,
//      url: 'https://preprod.hubkilo.com/api/v1/create/res.users?values={\n  "name": "Benzema",\n "login": "benzema11@gmail.com",\n  "password": "armel",\n  "phone": "+237678521453",\n  "sex": "male",\n  "birth_city_id": "23",\n  "residence_city_id": "100",\n  "birthday": "2012-02-21",\n  "sel_groups_1_9_10": 10\n}',
//      headers: {
//        'Accept': 'application/json',
//        'Authorization': 'Basic bmF0aGFsaWU6QXplcnR5MTIzNDUl'
//      }
//    };
//
//    axios.request(config)
//    .then((response) => {
//      console.log(JSON.stringify(response.data));
//    })
//    .catch((error) => {
//      console.log(error);
//    });
//   }


//odoo website editor

//<?xml version="1.0"?>
//<t name="Auth Signup/ResetPassword form fields" t-name="auth_signup.fields">
//
//             <div class="form-group field-login">
//                <label for="sex">Gender</label>
//                <input type="text" name="login" t-att-value="login" id="login" class="form-control form-control-sm" autofocus="autofocus" autocapitalize="off" required="required" t-att-readonly="'readonly' if only_passwords else None"/>
//                   <select type="text" name="login" t-att-value="login" id="login" class="form-control form-control-sm" autofocus="autofocus" autocapitalize="off" required="required" t-att-readonly="'readonly' if only_passwords else None">
//
//                    <option value="male">male</option>
//                    <option value="female">female</option>
//                  </select>
//            </div>
//
//            <div class="form-group field-login">
//                <label for="login">Email</label>
//                <input type="text" name="login" t-att-value="login" id="login" class="form-control form-control-sm" autofocus="autofocus" autocapitalize="off" required="required" t-att-readonly="'readonly' if only_passwords else None"/>
//            </div>
//
//            <div class="form-group field-name">
//                <label for="name">Full Name</label>
//                <input type="text" name="name" t-att-value="name" id="name" class="form-control form-control-sm" placeholder="e.g. John Doe" required="required" t-att-readonly="'readonly' if only_passwords else None" t-att-autofocus="'autofocus' if login and not only_passwords else None"/>
//            </div>
//
//             <div class="form-group field-login">
//                <label for="Phone">Phone</label>
//                <input type="text" name="login" t-att-value="login" id="login" class="form-control form-control-sm" autofocus="autofocus" autocapitalize="off" required="required" t-att-readonly="'readonly' if only_passwords else None"/>
//            </div>
//
//            <div class="form-group field-password pt-2">
//                <label for="password">Password</label>
//                <input type="password" name="password" id="password" class="form-control form-control-sm" required="required" t-att-autofocus="'autofocus' if only_passwords else None"/>
//            </div>
//
//            <div class="form-group field-confirm_password">
//                <label for="confirm_password">Confirm Password</label>
//                <input type="password" name="confirm_password" id="confirm_password" class="form-control form-control-sm" required="required"/>
//            </div>
//        </t>
//
//