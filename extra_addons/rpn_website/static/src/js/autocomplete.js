// residence_city
 setTimeout(()=>{
    function autocomplete(inp, arr) {
      var currentFocus;

      inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

for (i = 0; i < arr.length; i++) {
  if (arr[i].name.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
    b = document.createElement("DIV");
    b.innerHTML = "<strong >" + arr[i].name.substr(0, val.length) + "</strong>";
    b.innerHTML += arr[i].name.substr(val.length) + " (" + arr[i].country + ")";
    b.addEventListener("click", function(e) {
      inp.value = this.innerText; // Set the city and country name in the input field
      var selectedCountry = arr.find(country => (inp.value.includes(country.name) && inp.value.includes(country.country)));
      if (selectedCountry) {
        localStorage.setItem("residence_city", selectedCountry.id); // Store the selected country ID in localStorage
      }
      closeAllLists();
    });
    a.appendChild(b);
  }
}
      });

      inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode === 38) {
          currentFocus--;
          addActive(x);
        } else if (e.keyCode === 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
      });

      function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
      }

      function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }

      function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      document.addEventListener("click", function (e) {
        closeAllLists(e.target);
      });
    }

var countries = JSON.parse(localStorage.getItem("allCities"))


    autocomplete(document.getElementById("residency_city_id"), countries);
 },5000)


//birth_city
 setTimeout(()=>{
    function autocomplete(inp, arr) {
      var currentFocus;

      inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {
  if (arr[i].name.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
    b = document.createElement("DIV");
    b.innerHTML = "<strong >" + arr[i].name.substr(0, val.length) + "</strong>";
    b.innerHTML += arr[i].name.substr(val.length) + " (" + arr[i].country + ")";
    b.addEventListener("click", function(e) {
      inp.value = this.innerText; // Set the city and country name in the input field
      var selectedCountry = arr.find(country => (inp.value.includes(country.name) && inp.value.includes(country.country)));
      if (selectedCountry) {
        localStorage.setItem("birth_city", selectedCountry.id); // Store the selected country ID in localStorage
      }
      closeAllLists();
    });
    a.appendChild(b);
  }
}
      });

      inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode === 40) {
          currentFocus++;
          addActive(x);
        } else if (e.keyCode === 38) {
          currentFocus--;
          addActive(x);
        } else if (e.keyCode === 13) {
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
      });

      function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
      }

      function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }

      function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      document.addEventListener("click", function (e) {
        closeAllLists(e.target);
      });
    }

var countries = JSON.parse(localStorage.getItem("allCities"))


    autocomplete(document.getElementById("birth_city_id"), countries);
 },5000)

