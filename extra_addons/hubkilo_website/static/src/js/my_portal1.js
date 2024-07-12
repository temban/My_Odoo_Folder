//reservation
function selectTravel(){
const Type_de_voyage = document.getElementById('type_de_voyage_reservation').value
const Table_One = document.getElementById("Table_One")
const Table_Two = document.getElementById("Table_Two")
const Table_Three = document.getElementById("Table_Three")


console.log(Type_de_voyage)

if(Type_de_voyage === "air"){
Table_Two.style.display = "none"
Table_Three.style.display = "none"
Table_One.style.display = ""

  //MES AIR RESERVATIONS
  axios.get('air/current/user/my_booking/made/?debug=assets', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }).then(response => {
    const table3 = document.getElementById('table3')
     var departure_town = response.data.map((table) => table.travel.departure_town)
     var arrival_town = response.data.map((table) => table.travel.arrival_town)
     var travel_type = response.data.map((table) => table.travel.travel_type)



    table3.innerHTML=response.data.map((table)=>{
    localStorage.setItem("qrcode",table.code)
    var displayNegociation = table.travel.negotiation === false || table.status === "accepted" ? 'none' :'inline';
    var displayTrans = table.status === "accepted" ? 'none' :'inline';

    return `<tr >
                                                <td>
                    <div class="d-flex align-items-center">
                      <div class="d-flex justify-content-start flex-column">
                        <p class="text-dark fw-bold text-hover-primary">${table.travel.traveler.user_name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.receiver.receiver_name}</p>
                  </td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.kilo_booked}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block ">${table.kilo_booked_price}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.type_of_luggage}</p>
                  </td>
                  <td>
                    <span class="badge badge-light-primary fs-7 fw-bold" style="border: solid red 1px;color:red; padding:7px;border-radius:5px">${table.status}</span>
                  </td>
                  <td class="text-start">
                    <button onclick="storeAirBookingInfos(${table.id})" style="display:${displayTrans  !== 'none' ? 'inline' : 'none'}"  class="btn btn-warning btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                    <!--begin::Svg Icon | path: icons/duotune/art/art005.svg-->
                      <span class="svg-icon svg-icon-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor" />
                          <path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor" />
                        </svg>
                      </span>
                      <!--end::Svg Icon-->
                    </button>

                    <button style="display:${displayTrans  !== 'none' ? 'inline' : 'none'}" onclick="DeleteMyReserve(${table.id})" id="delete" class="btn btn-danger btn-icon btn-bg-light btn-active-color-primary btn-sm">
                                                            <!--begin::Svg Icon | path: icons/duotune/general/gen027.svg-->
                                                            <span class="svg-icon svg-icon-3">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor" />
                                                                    <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor" />
                                                                    <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor" />
                                                                </svg>
                                                            </span>
                                                            <!--end::Svg Icon-->
                                                        </button>
                   <button type="button" onclick="Transferer(${table.id},'${table.travel.departure_town}','${table.travel.arrival_town}','${table.travel.travel_type}',${table.travel.id})" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" style="margin-top:5px;display:${displayTrans  !== 'none' ? 'inline' : 'none'}">
                     Transférer
                    </button>
                    <button href="#" class="btn btn-danger" style="margin-top:5px" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                     View Code
                    </button>

                    <button id="negoce"  onclick="storeBookingInfos(${table.id})" style="display:${displayNegociation !== 'none' ? 'inline' : 'none'}" type="button" class="btn btn-success">Négocier Prix</button>

                    <!-- Modal -->
<div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Votre Code QR et Code de transaction</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      </div>
      <div class="">
        <h2 style="text-align:center">Code de transaction: <b id="code_id1" style="color:red;text-align:center">${table.code}</b> </h2>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Liste des voyages similaires à votre réservation</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div id="search_row" class="modal-body row" style="display: flex,align-items: center,justify-content:center">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</div>

                  </td>
                </tr>`}).join("")

  console.log(response.data);
  })
  .catch(function(error) {
  console.log(error);
  })

Table_One.innerHTML = `<div id="kt_app_content_container" class="" >
                                    <!--begin::Tables Widget 11-->
									<div class="card mb-5 mb-xl-8">
										<!--begin::Header-->
										<div class="card-header border-0 pt-5" style="display:flex;justify-content: space-between;">
											<h3 class="card-title align-items-start flex-column">
												<span class="card-label fw-bold fs-3 mb-1">Mes réservations aériennes</span>
											</h3>
											<div class="card-toolbar">
											</div>
										</div>
										<!--end::Header-->

										<!--begin::Body-->
										<div class="card-body py-3">
											<!--begin::Table container-->
											<div class="table-responsive">
												<!--begin::Table-->
												<table class="table align-middle gs-0 gy-4">
													<!--begin::Table head-->
													<thead>
														<tr class="fw-bold text-muted bg-light">
															<th class="min-w-240px rounded-start">Nom du voyageur</th>
															<th class="min-w-125px">Nom du destinataire</th>
															<th class="min-w-125px">Kilo réservé</th>
															<th class="min-w-200px">Kilo par prix </th>
															<th class="min-w-200px">Type de bagage</th>
															<th class="min-w-150px">Status</th>
															<th class="min-w-200px"></th>
														</tr>
													</thead>
													<!--end::Table head-->
													<!--begin::Table body-->
													<tbody id="table3">

													</tbody>
													<!--end::Table body-->
												</table>
												<!--end::Table-->
											</div>
											<!--end::Table container-->
										</div>
										<!--begin::Body-->
									</div>
									<!--end::Tables Widget 11-->
								</div>`

}else if(Type_de_voyage === "road"){
Table_One.style.display = "none"
Table_Two.style.display = ""

    //MES ROAD RESERVATIONS
  axios.get('road/current/user/my_booking/made/?debug=assets', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }).then(response => {
    const table31 = document.getElementById('table31')
     var departure_town = response.data.map((table) => table.travel.departure_town)
     var arrival_town = response.data.map((table) => table.travel.arrival_town)
     var travel_type = response.data.map((table) => table.travel.travel_type)

       const Largeur = document.getElementById('Largeur2')
  const Poids = document.getElementById('Poids1')
  const Taille = document.getElementById('Taille')
  const Kilo_reserve = document.getElementById('Kilo_reserve')
  const Kilo_prix = document.getElementById('Kilo_prix')

      Largeur.style.display = ""
  Poids.style.display = ""
  Taille.style.display = ""
  Kilo_reserve.style.display = "none"
  Kilo_prix.style.display = "none"




    table31.innerHTML=response.data.map((table)=>{
    localStorage.setItem("qrcode",table.code)
    var display = table.travel.negotiation === false || table.status === "accepted" ? 'none' :'inline';
        var displayTrans = table.status === "accepted" ? 'none' :'inline';

    return `<tr >
                                                <td>
                    <div class="d-flex align-items-center">
                      <div class="d-flex justify-content-start flex-column">
                        <p class="text-dark fw-bold text-hover-primary">${table.travel.traveler.user_name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.receiver.receiver_name}</p>
                  </td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.luggage_weight}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block ">${table.luggage_width}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block ">${table.luggage_height}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.type_of_luggage}</p>
                  </td>
                  <td>
                    <span class="badge badge-light-primary fs-7 fw-bold" style="border: solid red 1px;color:red; padding:7px;border-radius:5px">${table.status}</span>
                  </td>
                  <td class="text-start">

                    <button onclick="storeRoadBookingInfos(${table.id})" style="display:${displayTrans  !== 'none' ? 'inline' : 'none'}"  class="btn btn-warning btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                    <!--begin::Svg Icon | path: icons/duotune/art/art005.svg-->
                      <span class="svg-icon svg-icon-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path opacity="0.3" d="M21.4 8.35303L19.241 10.511L13.485 4.755L15.643 2.59595C16.0248 2.21423 16.5426 1.99988 17.0825 1.99988C17.6224 1.99988 18.1402 2.21423 18.522 2.59595L21.4 5.474C21.7817 5.85581 21.9962 6.37355 21.9962 6.91345C21.9962 7.45335 21.7817 7.97122 21.4 8.35303ZM3.68699 21.932L9.88699 19.865L4.13099 14.109L2.06399 20.309C1.98815 20.5354 1.97703 20.7787 2.03189 21.0111C2.08674 21.2436 2.2054 21.4561 2.37449 21.6248C2.54359 21.7934 2.75641 21.9115 2.989 21.9658C3.22158 22.0201 3.4647 22.0084 3.69099 21.932H3.68699Z" fill="currentColor" />
                          <path d="M5.574 21.3L3.692 21.928C3.46591 22.0032 3.22334 22.0141 2.99144 21.9594C2.75954 21.9046 2.54744 21.7864 2.3789 21.6179C2.21036 21.4495 2.09202 21.2375 2.03711 21.0056C1.9822 20.7737 1.99289 20.5312 2.06799 20.3051L2.696 18.422L5.574 21.3ZM4.13499 14.105L9.891 19.861L19.245 10.507L13.489 4.75098L4.13499 14.105Z" fill="currentColor" />
                        </svg>
                      </span>
                      <!--end::Svg Icon-->
                    </button>
                    <button style="display:${displayTrans !== 'none' ? 'inline' : 'none'}" onclick="DeleteMyReserve(${table.id})" id="delete" class="btn btn-danger btn-icon btn-bg-light btn-active-color-primary btn-sm">
                                                            <!--begin::Svg Icon | path: icons/duotune/general/gen027.svg-->
                                                            <span class="svg-icon svg-icon-3">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="currentColor" />
                                                                    <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="currentColor" />
                                                                    <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="currentColor" />
                                                                </svg>
                                                            </span>
                                                            <!--end::Svg Icon-->
                                                        </button>
                   <button type="button" onclick="Transferer1(${table.id},'${table.travel.departure_town}','${table.travel.arrival_town}','${table.travel.travel_type}',${table.travel.id})" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2" style="margin-top:5px;display:${displayTrans !== 'none' ? 'inline' : 'none'}">
                     Transférer
                    </button>
                    <button onclick="qrCode1('${table.code}')" href="#" class="btn btn-danger" style="margin-top:5px" data-bs-toggle="modal" data-bs-target="#exampleModal11">
                     View Code
                    </button>

                   <button id="negoce"  onclick="storeBookingInfoos(${table.id})" style="display:${display !== 'none' ? 'inline' : 'none'}" type="button" class="btn btn-success">Négocier Prix</button>

                    <!-- Modal -->
<div class="modal fade" id="exampleModal11" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Votre Code QR et Code de transaction</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      </div>
      <div class="">
        <h2 style="text-align:center">Code de transaction: <b id="code_id" style="color:red;text-align:center"></b> </h2>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

    <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Liste des voyages similaires à votre réservation</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div id="search_row1" class="modal-body row" style="display: flex,align-items: center,justify-content:center">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</div>

                  </td>
                </tr>`}).join("")

  console.log(response.data);
  })
  .catch(function(error) {
  console.log(error);
  })

  Table_Two.innerHTML = `<div id="kt_app_content_container" class="">
                                    <!--begin::Tables Widget 11-->
									<div class="card mb-5 mb-xl-8">
										<!--begin::Header-->
										<div class="card-header border-0 pt-5" style="display:flex;justify-content: space-between;">
											<h3 class="card-title align-items-start flex-column">
												<span class="card-label fw-bold fs-3 mb-1">Mes réservations terrestres</span>
											</h3>
											<div class="card-toolbar">
											</div>
										</div>
										<!--end::Header-->

										<!--begin::Body-->
										<div class="card-body py-3">
											<!--begin::Table container-->
											<div class="table-responsive">
												<!--begin::Table-->
												<table class="table align-middle gs-0 gy-4">
													<!--begin::Table head-->
													<thead>
														<tr class="fw-bold text-muted bg-light">
															<th class="min-w-240px rounded-start">Nom du voyageur</th>
															<th class="min-w-125px">Nom du destinataire</th>
															<th class="min-w-125px">Poids</th>
															<th class="min-w-200px">Largeur</th>
															<th class="min-w-200px">Taille</th>
															<th class="min-w-200px">Type de bagage</th>
															<th class="min-w-150px">Status</th>
															<th class="min-w-200px"></th>
														</tr>
													</thead>
													<!--end::Table head-->
													<!--begin::Table body-->
													<tbody id="table31">

													</tbody>
													<!--end::Table body-->
												</table>
												<!--end::Table-->
											</div>
											<!--end::Table container-->
										</div>
										<!--begin::Body-->
									</div>
									<!--end::Tables Widget 11-->
								</div>`

}

}


//destination
function selectTravel1(){
const Type_de_voyage = document.getElementById('type_de_voyage_reservation1').value
const Table_One = document.getElementById("Table_One_d")
const Table_Two = document.getElementById("Table_Two_d")
const Table_Three = document.getElementById("Table_Three_d")


console.log(Type_de_voyage)

if(Type_de_voyage === "air"){
Table_Two.style.display = "none"
Table_Three.style.display = "none"
Table_One.style.display = ""

  //MES AIR destination
  axios.get('/air/receiver/bookings/?debug=assets', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }).then(response => {
    const table4 = document.getElementById('table4')
     var departure_town = response.data.map((table) => table.travel.departure_town)
     var arrival_town = response.data.map((table) => table.travel.arrival_town)
     var travel_type = response.data.map((table) => table.travel.travel_type)



    table4.innerHTML=response.data.map((table)=>{
    localStorage.setItem("qrcode",table.code)
    return `<tr >
                                                <td>
                    <div class="d-flex align-items-center">
                      <div class="d-flex justify-content-start flex-column">
                        <p class="text-dark fw-bold text-hover-primary">${table.travel.traveler.user_name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.sender.sender_name}</p>
                  </td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.kilo_booked}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block ">${table.kilo_booked_price}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.type_of_luggage}</p>
                  </td>
                  <td>
                    <span class="badge badge-light-primary fs-7 fw-bold" style="border: solid red 1px;color:red; padding:7px;border-radius:5px">${table.status}</span>
                  </td>
                  <td class="text-start">

                     <button onclick="qrCode('${table.code}')" href="#" class="btn btn-danger" style="margin-top:5px" data-bs-toggle="modal" data-bs-target="#exampleModal222">
                     View Code
                    </button>
                    <!-- Modal -->
<div class="modal fade" id="exampleModal222" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Votre Code QR et Code de transaction</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="qrcode" style="display:flex;justify-content:center;align-items:center"></div>
      </div>
      <div class="">
        <h2 style="text-align:center">Code de transaction: <b id="code_id" style="color:red;text-align:center">${table.code}</b> </h2>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

                  </td>
                </tr>`}).join("")

  console.log(response.data);
  })
  .catch(function(error) {
  console.log(error);
  })

Table_One.innerHTML = `<div id="kt_app_content_container" class="">
                                    <!--begin::Tables Widget 11-->
									<div class="card mb-5 mb-xl-8">
										<!--begin::Header-->
										<div class="card-header border-0 pt-5" style="display:flex;justify-content: space-between;">
											<h3 class="card-title align-items-start flex-column">
												<span class="card-label fw-bold fs-3 mb-1">Colis aérien reçus</span>
											</h3>
											<div class="card-toolbar">
											</div>
										</div>
										<!--end::Header-->

										<!--begin::Body-->
										<div class="card-body py-3">
											<!--begin::Table container-->
											<div class="table-responsive">
												<!--begin::Table-->
												<table class="table align-middle gs-0 gy-4">
													<!--begin::Table head-->
													<thead>
														<tr class="fw-bold text-muted bg-light">
															<th class="min-w-240px rounded-start">Nom du voyageur</th>
															<th class="min-w-125px">nom de l'expéditeur</th>
															<th class="min-w-125px">Kilo réservé</th>
															<th class="min-w-200px">Kilo par prix </th>
															<th class="min-w-200px">Type de bagage</th>
															<th class="min-w-150px">Status</th>
															<th class="min-w-200px"></th>
														</tr>
													</thead>
													<!--end::Table head-->
													<!--begin::Table body-->
													<tbody id="table4">

													</tbody>
													<!--end::Table body-->
												</table>
												<!--end::Table-->
											</div>
											<!--end::Table container-->
										</div>
										<!--begin::Body-->
									</div>
									<!--end::Tables Widget 11-->
								</div>`

}else if(Type_de_voyage === "road"){
Table_One.style.display = "none"
Table_Two.style.display = ""

    //MES ROAD Destination
  axios.get('/road/receiver/bookings/?debug=assets', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }).then(response => {
    const table41 = document.getElementById('table41')
     var departure_town = response.data.map((table) => table.travel.departure_town)
     var arrival_town = response.data.map((table) => table.travel.arrival_town)
     var travel_type = response.data.map((table) => table.travel.travel_type)

       const Largeur = document.getElementById('Largeur2')
  const Poids = document.getElementById('Poids1')
  const Taille = document.getElementById('Taille')
  const Kilo_reserve = document.getElementById('Kilo_reserve')
  const Kilo_prix = document.getElementById('Kilo_prix')

      Largeur.style.display = ""
  Poids.style.display = ""
  Taille.style.display = ""
  Kilo_reserve.style.display = "none"
  Kilo_prix.style.display = "none"




    table41.innerHTML=response.data.map((table)=>{
    localStorage.setItem("qrcode",table.code)
    return `<tr >
                                                <td>
                    <div class="d-flex align-items-center">
                      <div class="d-flex justify-content-start flex-column">
                        <p class="text-dark fw-bold text-hover-primary">${table.travel.traveler.user_name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.receiver.receiver_name}</p>
                  </td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.luggage_weight}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block ">${table.luggage_width}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block ">${table.luggage_height}</p></td>
                  <td>
                    <p class="text-dark fw-bold text-hover-primary d-block">${table.type_of_luggage}</p>
                  </td>
                  <td>
                    <span class="badge badge-light-primary fs-7 fw-bold" style="border: solid red 1px;color:red; padding:7px;border-radius:5px">${table.status}</span>
                  </td>
                  <td class="text-start">

                    <button onclick="qrCode2('${table.code}')" href="#" class="btn btn-danger" style="margin-top:5px" data-bs-toggle="modal" data-bs-target="#exampleModal111">
                     View Code
                    </button>
                    <!-- Modal -->
<div class="modal fade" id="exampleModal111" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Votre Code QR et Code de transaction</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="qrcode2" style="display:flex;justify-content:center;align-items:center"></div>
      </div>
      <div class="">
        <h2 style="text-align:center">Code de transaction: <b id="code_id2" style="color:red;text-align:center"></b> </h2>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>


                  </td>
                </tr>`}).join("")

  console.log(response.data);
  })
  .catch(function(error) {
  console.log(error);
  })

  Table_Two.innerHTML = `<div id="kt_app_content_container" class="">
                                    <!--begin::Tables Widget 11-->
									<div class="card mb-5 mb-xl-8">
										<!--begin::Header-->
										<div class="card-header border-0 pt-5" style="display:flex;justify-content: space-between;">
											<h3 class="card-title align-items-start flex-column">
												<span class="card-label fw-bold fs-3 mb-1">Colis terrestre reçus</span>
											</h3>
											<div class="card-toolbar">
											</div>
										</div>
										<!--end::Header-->

										<!--begin::Body-->
										<div class="card-body py-3">
											<!--begin::Table container-->
											<div class="table-responsive">
												<!--begin::Table-->
												<table class="table align-middle gs-0 gy-4">
													<!--begin::Table head-->
													<thead>
														<tr class="fw-bold text-muted bg-light">
															<th class="min-w-240px rounded-start">Nom du voyageur</th>
															<th class="min-w-125px">Nom du destinataire</th>
															<th class="min-w-125px">Poids</th>
															<th class="min-w-200px">Largeur</th>
															<th class="min-w-200px">Taille</th>
															<th class="min-w-200px">Type de bagage</th>
															<th class="min-w-150px">Status</th>
															<th class="min-w-200px"></th>
														</tr>
													</thead>
													<!--end::Table head-->
													<!--begin::Table body-->
													<tbody id="table41">

													</tbody>
													<!--end::Table body-->
												</table>
												<!--end::Table-->
											</div>
											<!--end::Table container-->
										</div>
										<!--begin::Body-->
									</div>
									<!--end::Tables Widget 11-->
								</div>`

}

}


function storeAirBookingInfos(id){
//alert("id -> road -> "+ id)
 axios
  .get("/air/view/booking/"+ id +"/?debug=assets")
  .then((response) => {
    localStorage.setItem("travel_type_edit",response.data.travel.travel_type)
  //  alert("store" + localStorage.getItem("travel_type_edit"))
  window.location.href ="/modifier_ma_reservation/" + id.toString()
  })
  .catch(function (error) {
    console.log(error);
  });
}

function storeRoadBookingInfos(id){
//alert("id -> road -> "+ id)
 axios
  .get("/road/view/booking/"+ id +"/?debug=assets")
  .then((response) => {
    console.log("STORE BOOKING INFOS")
    console.log( " booking_id " + response.data.id)
    localStorage.setItem("travel_type_edit",response.data.travel.travel_type)
  //  alert("store" + localStorage.getItem("travel_type_edit"))
    window.location.href ="/modifier_ma_reservation/" + id.toString()


  })
  .catch(function (error) {
    console.log(error);
  });
}