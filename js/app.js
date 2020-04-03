//Se declaran las variables globales del juego
var actualView, miBank;

/********************************************************************
 **    A PARTIR DE AQUI SE DEFINEN LAS FUNCIONES GLOBALES          **
 *********************************************************************/

//La siguiente funcion solo guarda el nombre del banquero de manera local
//para que posteriormente pueda ser procesado cuando se recarge en la pagina principal
function createBanker(e) {
  let bankerName = document.getElementById("bankerName").value;
  bankerName = bankerName.trim();
  console.log(bankerName)
  if (bankerName.length !== 0) {

    console.log(bankerName);
    miBank = new Bank(bankerName);

    localStorage.miBank = JSON.stringify(miBank);
    localStorage.gameSaved = true;

    location.href = "./principal.html";
  }
}

  /*Esta función se debe ejecutar cuando el usuario desde la vista de home 
  le da clic al botón agregar y entonces se procede a hacer todas las validaciones 
  necesarias para agregar al nuevo jugador y hacer las actualizaciones pertinentes */
function createNewPlayer() {
    let playerName = document.getElementById('homeNewPlayerName').value.trim();
    let message = ``; //Mensaje que aparecerá en la página
  
    if (typeof playerName === 'undefined' || playerName.length === 0) {
      message = createAlertMessage("Se debe ingresar un nombre valido", "alert-danger");
    } else {
      //Al intentar crear el nuevo jugador si el nombre está repetido retorna false
      if (miBank.newPlayer(playerName)) {
        //Se limpia el campo de ingreso de nuevo jugador
        document.getElementById('homeNewPlayerName').value = '';
        //Actualizo el localstorage concerniente al banco
        localStorage.miBank = JSON.stringify(miBank);
        //Actualizo la tarje principal
        updateMainCard();
        updateHomePlayersCard();
        //Creo el mensaje de que todo va correcto
        let textTemporal = `El jugador <strong>${playerName}</strong> fue gregado`;
        message = createAlertMessage(textTemporal, "alert-success");
  
      } else {
        let textTemporal = `El nombre <strong>${playerName}</strong> ya está en uso`;
        message = createAlertMessage(textTemporal, "alert-warning");
      }
    }
    //A partir de aqí se encuntan lo metodos que actualizan la vista
    document.getElementById('homeMessage').innerHTML = message;
}
  
function createAlertMessage(message, type){
    let result =  `<div class="alert ${type} alert-dismissible fade show" role="alert">
                    ${message} 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>`;
  
    return result;
}
  
  //Esta funcion se ejecuta cuando el usuario da click en el boton pagar salario
function paySalary(e){
    /*Se recupera el nombre del jugador al que se le va a pagar el salrio
      Que se encuentra en el padre del elemento que lanza el evento*/
    let playerName = e.target.parentNode.getAttribute('name');
    
    if(miBank.paySalary(playerName)){
      document.getElementById('salaryModalBody').innerHTML = `Se pagó el sueldo a ${playerName}`;
      updateHomePlayersCard();
      updateMainCard();
      localStorage.miBank = JSON.stringify(miBank);
    }else{
      document.getElementById('salaryModalBody').innerHTML = `No se pudo pagar el salario al jugador ${playerName}`;
    }
}
  
function makeCashDeposit(e){
    let message = '';
    document.getElementById('cashDepositModalAlert').innerHTML = '';
    //Primero recupero el valor a consignar y el nombre del cliente
    let amount = document.getElementById('cashDepositModalAmount').value;
    let playerName = document.querySelector('#cashDepositModal .modal-body p span').textContent;
    console.log(playerName)
    //ahora verifico que sea un numero
    amount = amount.trim();
    if(amount.length>0){
      //Ahora trato de convertir amount en un numero
      if(/^([0-9])*$/.test(amount)){
        amount = parseInt(amount);
        //Ahora se intenta hacer el deposito
        if(amount > 0 && miBank.cashDeposit(playerName, amount)){
          localStorage.miBank = JSON.stringify(miBank);
          message = createAlertMessage("Deposito reaizado correctamente", "alert-success")
          updateHomePlayersCard();
        }else{
          if(amount === 0){
            message = createAlertMessage("No puede ser cero", "alert-danger");
          }else{
            message = createAlertMessage("Ojo: Dinero Falso. Transaccion cancelada", "alert-warning");
          } 
          
        }
  
      }
      else{
        message = createAlertMessage("No es un numero valido", "alert-danger");
      }
    }else{
      message = createAlertMessage("Este campo es obligatorio", "alert-danger");
    }
  
    document.getElementById('cashDepositModalAlert').innerHTML = message;
    document.getElementById('cashDepositModalAmount').value = '';
}
  
function makeCashWithdrawal(){
    console.log("Se accedio a la interfaz para retirar dinero");
    document.getElementById('cashWithdrawalModalAlert').innerHTML = '';
    let message = '';
    //Primero recupero el monto a retirar y el jugador que solicita el retiro
    let playerName = document.querySelector('#cashWithdrawalModal .modal-body p span').textContent;
    let amount = document.getElementById('cashWithdrawalModalAmount').value;
    console.log(`Los datos recolectados son: ${playerName} y ${amount}`);
  
    amount = amount.trim();
    console.log(/^([0-9])*$/.test(amount));
  
    if(amount.length>0){
      //Ahora trato de convertir amount en un numero
      if(/^([0-9])*$/.test(amount)){
        amount = parseInt(amount,10);
        //Ahora se intenta hacer el retiro
        if(amount>0 && miBank.cashWithdrawal(playerName, amount)){
          localStorage.miBank = JSON.stringify(miBank);
          message = createAlertMessage("Transaccion exitosa", "alert-success");
          updateHomePlayersCard();
        }else{
          if(amount === 0){
            message = createAlertMessage("No puede ser cero", "alert-danger");
          }else{
            message = createAlertMessage("Saldo insuficientes", "alert-danger");
          }        
        }
  
      }
      else{
        message = createAlertMessage("No es un numero valido", "alert-danger");
      }
    }else{
      message = createAlertMessage("Este campo es obligatorio", "alert-danger");
    }
  
    document.getElementById('cashWithdrawalModalAlert').innerHTML = message;
    document.getElementById('cashWithdrawalModalAmount').value = '';
}

/***********************************************************************/
/*****    LAS SIGUIENTES SON FUNCIONES PARA PINTAR EN PANTALLA     *****/
/***********************************************************************/

function printTitles() {
  // loadTitles();
  let result = ``;
  for (let i = 0; i < miBank.titles.length; i++) {
    let t = miBank.titles[i];
    let owner = typeof t.owner === "undefined" ? "Banco" : t.owner.name;
    let disableSale = owner !== "Banco" ? 'disabled="true"' : "";
    let castle = typeof t.castle === "undefined" ? 0 : 1;
    let foreground = "black";

    if (t.color === "#FF0901" || t.color === "#2C8000" || t.color === "#5113AD")
      foreground = "white";

    let division = `<div name = "${t.name}" class="property_card" style="background-color: ${t.color}; color: ${foreground};">
                      <h2 class="property_card__title">${t.name}</h2>
                      <img src="img/titles/${t.image}" alt="${t.name}" class="property_card__img">
                      <div class="property_card__body">
                        <p>Propietario: <span>${owner}</span></p>
                        <p>Precio: <span>$ ${t.price}</span></p>
                        <p>Casas: <span>${t.houses.length}</span></p>
                        <p>Castillo: <span>${castle}</span></p>
                        <p>Alquiler: <span>$ ${t.rental}</span></p>
                        <p>Hipoteca: <span>$ ${t.rent}</span></p>
                      </div>

                      <button type="button" class="btn btn-primary property_card__btn-sell" data-toggle="modal" data-target="#bankPropertySale" ${disableSale}>Vender</button>
                      <button type="button" class="btn btn-success property_card__btn-auction" disabled="true">Subastar</button>
                      <button type="button" class="btn btn-dark property_card__btn-mortgage" disabled="true">Hipotecar</button>
                      <button type="button" class="btn btn-success property_card__btn-build" disabled="true">Edificar</button>
                      <button type="button" class="btn btn-danger property_card__btn-demolish" disabled="true">Demoler</button>
                      <button type="button" class="btn btn-dark property_card__btn-rental" disabled="true">Cobrar alquiler</button>
                    </div>`;
    result += division;
  }

  document.getElementById("titlesView").innerHTML = result;

  //Agrego las funciones que dehe hacerse al dar click en el boton vender
  let buttons = document.querySelectorAll("#titlesView .property_card__btn-sell")
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', (e)=>{
      //Se recupera el nombre del titulo que se quiere vender
      let titleName = e.target.parentNode.getAttribute('name')
      //Se recupera la informacion del titulo
      let titlePrice, actualOwner;
      for(let index2 = 0; index2 < miBank.titles.length; index2++){
        let title = miBank.titles[index2];
        if(title.name === titleName){
          titlePrice = title.price;
          actualOwner = typeof title.owner === 'undefined' ? 'Banco' : title.owner;
          break;
        }
      }

      //Ahora lo escribo en el modal
      document.getElementById('bankPropertySaleTitle').innerText = titleName;
      document.getElementById('bankPropertySaleActualOwner').innerText = actualOwner;
      document.getElementById('bankPropertySalePrice').innerText = formatCurrencyLite(titlePrice);

      //Ahora escribo los nombre de los jugadores
      let players = ``;
      for(let index3 = 0; index3 < miBank.players.length; index3++){
        players += `<option value="${miBank.players[index3].name}">${miBank.players[index3].name}</option>`
      }

      document.getElementById('bankPropertySaleBuyer').innerHTML = players;

      console.log(titleName + actualOwner + titlePrice);
    })
  }
}

function printLines() {
  // loadLines();
  let result = ``;
  for (let i = 0; i < miBank.lines.length; i++) {
    let l = miBank.lines[i];
    let owner = typeof l.owner === "undefined" ? "Banco" : l.owner.name;
    let foreground = "black";

    let division = `<div class="property_card" style="background-color: white; color: ${foreground};">
                      <h2 class="property_card__title">${l.name}</h2>
                      <img src="img/titles/${l.image}" alt="${l.name}" class="property_card__img">
                      <div class="property_card__body">
                        <p>Propietario: <span>${owner}</span></p>
                        <p>Precio: <span>$ ${l.price}</span></p>
                        <p>Pasaje: <span>$ ${l.passage}</span></p>
                      </div>
                      <button type="button" class="btn btn-primary property_card__btn-sell" disabled="true">Vender</button>
                      <button type="button" class="btn btn-success property_card__btn-auction" disabled="true">Subastar</button>
                      <button type="button" class="btn btn-dark property_card__btn-mortgage" disabled="true">Hipotecar</button>
                      <button type="button" class="btn btn-dark property_card__btn-payPassage" disabled="true">Cobrar pasaje</button>
                    </div>`;
    result += division;
  }

  document.getElementById("linesView").innerHTML = result;
}

function printCustomsPots() {
  // loadCustomsPots();
  let result = ``;
  for (let i = 0; i < miBank.customsPosts.length; i++) {
    let l = miBank.customsPosts[i];
    let owner = typeof l.owner === "undefined" ? "Banco" : l.owner.name;
    let foreground = "black";

    let division = `<div class="property_card" style="background-color: white; color: ${foreground};">
                      <h2 class="property_card__title">${l.name}</h2>
                      <img src="img/titles/${l.image}" alt="${l.name}" class="property_card__img">
                      <div class="property_card__body">
                        <p>Propietario: <span>${owner}</span></p>
                        <p>Precio: <span>$ ${l.price}</span></p>
                        <p>Peaje: <span>$ ${l.toll}</span></p>
                      </div>
                      <button type="button" class="btn btn-primary property_card__btn-sell" disabled="true">Vender</button>
                      <button type="button" class="btn btn-success property_card__btn-auction" disabled="true">Subastar</button>
                      <button type="button" class="btn btn-dark property_card__btn-mortgage" disabled="true">Hipotecar</button>
                      <button type="button" class="btn btn-dark property_card__btn-payToll" disabled="true">Cobrar peaje</button>
                    </div>`;
    result += division;
  }

  document.getElementById("customsView").innerHTML = result;
}

function updateMainCard(){
  document.getElementById("bankerName").innerText = `Banquero: ${miBank.bankerName}`;
  document.getElementById("bankerMoney").innerHTML = `Dinero: ${formatCurrencyLite(miBank.money)}`;
  document.getElementById("bankerHouses").innerHTML = `Casas: ${miBank.houses.length}`;
  document.getElementById("bankerCastles").innerHTML = `Castillos: ${miBank.castles.length}`;
  document.getElementById("bankerTitles").innerHTML = `Titulos: ${miBank.titles.length}`;
  document.getElementById("bankerCustomsPost").innerHTML = `Pasos: ${miBank.customsPosts.length}`;
  document.getElementById("bankerLines").innerHTML = `Lineas: ${miBank.lines.length}`;
}

function updateHomePlayersCard(){
  let htmlCode = ``;
  for(let i = 0; i < miBank.players.length; i++){
    let player = miBank.players[i];

    htmlCode += `<div name = "${player.name}" class="player-card">
                  <div class="player-card__title">
                    <h3>${player.name}</h3>
                    <p>Numero de cuenta: ${player.acount}</p>
                  </div>

                  <div class="player-card__money">
                    <p class="player-card__money-label">Dinero</p>
                    <p class="player-card__money-money"> ${formatCurrencyLite(player.money)}</p>
                  </div>

                  <div class="player-card__objects">
                    <p>Titulos: ${player.titles.length}</p>
                    <p>Casas: ${player.houses.length}</p>
                    <p>Castillos: ${player.castles.length}</p>
                  </div>

                  <button class="paymentSalary btn btn-primary" data-toggle="modal" data-target="#salaryModal">Pagar salario</button>
                  <button class="cashDesposit btn btn-success" data-toggle="modal" data-target="#cashDepositModal">Hacer Deposito</button>
                  <button class="cashWithdrawal btn btn-danger" data-toggle="modal" data-target="#cashWithdrawalModal">Hacer Retiro</button>
                </div>`;
  }

  document.getElementById('players-cards').innerHTML = htmlCode;

  //Agrego los eventos de los botones para pagar los sueldos
  let buttons = document.querySelectorAll('.player-card .paymentSalary');
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', paySalary);
  }

  //Agrego los eventos de los botones para hacer depositos, como esto abre es una ventana modal
  //lo que hace es pasarle el nombre del cliente a la ventana modal
  buttons = document.querySelectorAll('.player-card .cashDesposit');
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', (e)=>{
      //Primero recupero el nombre del cliente
      let playerName = e.target.parentNode.getAttribute('name');
      //Ahora lo imrpimo en la etiqueta nombre cliente
      document.querySelector('#cashDepositModal .modal-body p span').innerText = playerName;
    });
  }

  //Igual que lo anterior solo que este para hacer retiros
  buttons = document.querySelectorAll('.player-card .cashWithdrawal');
  for(let i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', (e)=>{
      //Primero recupero el nombre del cliente
      let playerName = e.target.parentNode.getAttribute('name');
      //Ahora lo imrpimo en la etiqueta nombre cliente
      document.querySelector('#cashWithdrawalModal .modal-body p span').innerText = playerName;
    });
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function loadState1() {
  //Primero habilito el boton para reiniciar
  document.getElementById("restar").addEventListener("click", () => {
    localStorage.clear();
    location.href = "./index.html";
  });

  document.getElementById('homeAddPlayer').addEventListener('click', createNewPlayer);

  //Lo siguiente es codigo temporal
  //Primero rescato el objeto del local storage
  miBank = new Bank();

  //Actualizo o imprimo los datos en pantallas
  updateMainCard();
  updateHomePlayersCard();
  printTitles();
  printLines();
  printCustomsPots();

  actualView.classList.remove("ocultar");
  //Fin del codigo temporal
  buildNavigation();

  //Agrego la funcionalidad a los modales para agregar o retirar dinero
  document.getElementById('makeCashDeposit').addEventListener('click', makeCashDeposit);
  document.getElementById('makeCashWithdrawal').addEventListener('click', makeCashWithdrawal);
}

function buildNavigation() {
  buildNavigationHelper("showHome", "home");
  buildNavigationHelper("showTitles", "titlesView");
  buildNavigationHelper("showPlayers", "playersView");
  buildNavigationHelper("showLines", "linesView");
  buildNavigationHelper("showCustoms", "customsView");
}

function buildNavigationHelper(navigatorButton, viewShow) {
  document.getElementById(navigatorButton).addEventListener("click", () => {
    //Ocultar la vista actual
    actualView.classList.add("ocultar");
    //Actulizo la actual view
    actualView = document.getElementById(viewShow);
    localStorage.actualView = viewShow;
    //Finalmente le digo que se muestre
    actualView.classList.remove("ocultar");
  });
}

/******************************************************************
    A PARTIR DE AQUI SE EMPIEZAN A EJECUTAR LAS FUNCIONES
********************************************************************/

window.addEventListener("load", () => {
  if (ACTUAL_LOCATION.includes("index.html")) {
    if (typeof localStorage.miBank !== "undefined") {
      location.href = "./principal.html";
    }
    document.getElementById("index__button").addEventListener("click", createBanker);

  } else {
    if (typeof localStorage.miBank !== 'undefined') {
      
      if(typeof localStorage.actualView === 'undefined'){
        actualView = document.getElementById("home");
        localStorage.actualView = "home";
      }else{
        actualView = document.getElementById(localStorage.actualView);
      }
      
      loadState1();
    } else {
      localStorage.clear();
      location.href = "./index.html";
    }
  }
});

/* Esta es una funcion que entrega fromato a los numeros segunel pais y la moneda */
function formatCurrency(locales, currency, fractionDigits, number){
  var formatted = new Intl.NumberFormat(locales, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: fractionDigits
  }).format(number);
  return formatted;
}

function formatCurrencyLite(number){
  return formatCurrency('es-CO', 'COP', 2, number);
}
