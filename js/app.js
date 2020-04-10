//Se declaran las variables globales del juego
var actualView, myBank;

/********************************************************************
 **    A PARTIR DE AQUI SE DEFINEN LAS FUNCIONES GLOBALES          **
 *********************************************************************/

//La siguiente funcion solo guarda el nombre del banquero de manera local
//para que posteriormente pueda ser procesado cuando se recarge en la pagina principal
function createBanker(e) {
  let bankerName = document.getElementById("bankerName").value;
  bankerName = bankerName.trim();
  if (bankerName.length !== 0) {
    myBank = new Bank(bankerName);
    SaveBank(myBank);

    location.href = "./principal.html";
  }
}

/*Esta función se debe ejecutar cuando el usuario desde la vista de home 
le da clic al botón agregar y entonces se procede a hacer todas las validaciones 
necesarias para agregar al nuevo jugador y hacer las actualizaciones pertinentes */
function createNewPlayer() {
  let playerName = document.getElementById('nameOfNewPlayer').value.trim();
  let message = ``; //Mensaje que aparecerá en la página

  if (typeof playerName === 'undefined' || playerName.length === 0) {
    message = createAlertMessage("Se debe ingresar un nombre valido", "alert-danger");
  } else {
    /*El metodo del banco retorna false si el nombre está repetido o no hay dinero */
    if (myBank.newPlayer(playerName)) {
      //Se limpia el campo de ingreso de nuevo jugador
      document.getElementById('nameOfNewPlayer').value = '';
      SaveBank(myBank);
      updateMainCard();
      updateHomePlayersCard();

      //Se crea el mensaje para el usuario
      let textTemporal = `El jugador <strong>${playerName}</strong> fue gregado`;
      message = createAlertMessage(textTemporal, "alert-success");

    } else {
      let textTemporal = `El nombre <strong>${playerName}</strong> ya está en uso`;
      message = createAlertMessage(textTemporal, "alert-warning");
    }
  }
  //Se muestra al usuario el mensaje
  document.getElementById('newPlayerAlert').innerHTML = message;
}

function createAlertMessage(message, type) {
  let result = `<div class="alert ${type} alert-dismissible fade show" role="alert">
                    ${message} 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>`;

  return result;
}

//Esta funcion se ejecuta cuando el usuario da click en el boton pagar salario
function paySalary(e) {
  /*Se recupera el nombre del jugador al que se le va a pagar el salrio
    Que se encuentra en el padre del elemento que lanza el evento*/
  let playerName = e.target.parentNode.parentNode.getAttribute('name');

  if (myBank.paySalary(playerName)) {
    document.getElementById('salaryModalBody').innerHTML = `Se pagó el sueldo a ${playerName}`;
    updateHomePlayersCard();
    updateMainCard();
    SaveBank(myBank);
  } else {
    document.getElementById('salaryModalBody').innerHTML = `No se pudo pagar el salario al jugador ${playerName}`;
  }
}

function makeCashDeposit(e) {
  let message = '';
  document.getElementById('cashDepositModalAlert').innerHTML = '';
  //Primero recupero el valor a consignar y el nombre del cliente
  let amount = document.getElementById('cashDepositModalAmount').value;
  let playerName = document.querySelector('#cashDepositModal .modal-body p span').textContent;
  console.log(playerName)
  //ahora verifico que sea un numero
  amount = amount.trim();
  if (amount.length > 0) {
    //Ahora trato de convertir amount en un numero
    if (/^([0-9])*$/.test(amount)) {
      amount = parseInt(amount);
      //Ahora se intenta hacer el deposito
      if (amount > 0 && myBank.cashDeposit(playerName, amount)) {
        SaveBank(myBank);
        message = createAlertMessage("Deposito realizado correctamente", "alert-success")
        updateHomePlayersCard();
      } else {
        if (amount === 0) {
          message = createAlertMessage("No puede ser cero", "alert-danger");
        } else {
          message = createAlertMessage("Ojo: Dinero Falso. Transaccion cancelada", "alert-warning");
        }

      }

    }
    else {
      message = createAlertMessage("No es un numero valido", "alert-danger");
    }
  } else {
    message = createAlertMessage("Este campo es obligatorio", "alert-danger");
  }

  document.getElementById('cashDepositModalAlert').innerHTML = message;
  document.getElementById('cashDepositModalAmount').value = '';
}

function makeCashWithdrawal() {
  console.log("Se accedio a la interfaz para retirar dinero");
  document.getElementById('cashWithdrawalModalAlert').innerHTML = '';
  let message = '';
  //Primero recupero el monto a retirar y el jugador que solicita el retiro
  let playerName = document.querySelector('#cashWithdrawalModal .modal-body p span').textContent;
  let amount = document.getElementById('cashWithdrawalModalAmount').value;
  console.log(`Los datos recolectados son: ${playerName} y ${amount}`);

  amount = amount.trim();
  console.log(/^([0-9])*$/.test(amount));

  if (amount.length > 0) {
    //Ahora trato de convertir amount en un numero
    if (/^([0-9])*$/.test(amount)) {
      amount = parseInt(amount, 10);
      //Ahora se intenta hacer el retiro
      if (amount > 0 && myBank.cashWithdrawal(playerName, amount)) {
        SaveBank(myBank)
        message = createAlertMessage("Transaccion exitosa", "alert-success");
        updateHomePlayersCard();
      } else {
        if (amount === 0) {
          message = createAlertMessage("No puede ser cero", "alert-danger");
        } else {
          message = createAlertMessage("Saldo insuficientes", "alert-danger");
        }
      }

    }
    else {
      message = createAlertMessage("No es un numero valido", "alert-danger");
    }
  } else {
    message = createAlertMessage("Este campo es obligatorio", "alert-danger");
  }

  document.getElementById('cashWithdrawalModalAlert').innerHTML = message;
  document.getElementById('cashWithdrawalModalAmount').value = '';
}

function sellProperty() {
  let propertyName = document.getElementById('bankPropertySaleTitle').textContent;
  let buyerName = document.getElementById('bankPropertySaleBuyer').value;
  let result = myBank.sellProperty(propertyName, buyerName);

  if (result.result) {
    SaveBank(myBank);
    updateMainCard();
    updateHomePlayersCard();
    switch (result.propertyType) {
      case "Title":
        printTitles();
        break;
      case "Line":
        printLines();
        break;
      case "CustomsPost":
        printCustomsPots();
        break;
    }
    document.querySelector('#bankPropertySale .sellAlert').innerHTML = createAlertMessage(result.message, "alert-success");
  } else {
    document.querySelector('#bankPropertySale .sellAlert').innerHTML = createAlertMessage(result.message, "alert-danger");
  }


}

function auctionProperty() {
  let propertyName = document.getElementById('bankPropertyAuctionTitle').textContent;
  let buyerName = document.getElementById('bankPropertyAuctionBuyer').value;
  let auctionPrice = document.getElementById('bankPropertyAuctionPrice').value;
  auctionPrice = parseInt(auctionPrice);
  auctionPrice = isNaN(auctionPrice) ? 0: auctionPrice;
  console.log(auctionPrice);
  let result = myBank.auctionProperty(propertyName, buyerName, auctionPrice);

  if (result.result) {
    SaveBank(myBank);
    updateMainCard();
    updateHomePlayersCard();
    switch (result.propertyType) {
      case "Title":
        printTitles();
        break;
      case "Line":
        printLines();
        break;
      case "CustomsPost":
        printCustomsPots();
        break;
    }
    document.querySelector('#bankPropertyAuction .auctionAlert').innerHTML = createAlertMessage(result.message, "alert-success");
  } else {
    document.querySelector('#bankPropertyAuction .auctionAlert').innerHTML = createAlertMessage(result.message, "alert-danger");
  }
}

/***********************************************************************/
/*****    LAS SIGUIENTES SON FUNCIONES PARA PINTAR EN PANTALLA     *****/
/***********************************************************************/

function printTitles() {
  // loadTitles();
  let result = ``;
  for (let i = 0; i < myBank.titles.length; i++) {
    let t = myBank.titles[i];
    let owner = typeof t.owner === "undefined" ? "Banco" : t.owner.name;

    let castle = typeof t.castle === "undefined" ? 0 : 1;
    let foreground = "black";

    if (t.color === "#FF0901" || t.color === "#2C8000" || t.color === "#5113AD")
      foreground = "white";

    /*
    | A continuacion se definen los parametros que habilitan o deshabiltan los botones
     */
    let disableSale = owner !== "Banco" ? 'disabled="true"' : "";
    let disableAuction = owner !== "Banco" ? 'disabled = "true"' : "";
    let disableMortgage = (owner === "Banco" || t.mortgage > 0)
      ? 'disabled = "true"'
      : "";

    let disableBuilding = "";
    if (owner === "Banco" || t.hasACastle) {
      disableBuilding = 'disabled = "true"';
    }
    let disableDemolish = "";
    if (owner === "Banco" || !t.hasACastle || t.houses.length === 0) {
      disableDemolish = 'disabled = "true"';
    }
    let disableCollectRent = t.rental === 0 ? 'disabled = "true"' : "";


    let division = `<div name = "${t.name}" class="property_card" style="background-color: ${t.color}; color: ${foreground};">
                      <h2 class="property_card__title">${t.name}</h2>
                      <img src="img/titles/${t.image}" alt="${t.name}" class="property_card__img">
                      <div class="property_card__body">
                        <p>Propietario: <span>${owner}</span></p>
                        <p name = "price">Precio: <span>$ ${t.price}</span></p>
                        <p>Casas: <span>${t.houses.length}</span></p>
                        <p>Castillo: <span>${castle}</span></p>
                        <p name = "rental">Alquiler: <span>$ ${t.rental}</span></p>
                        <p>Hipoteca: <span>$ ${t.mortgage}</span></p>
                      </div>

                      <button type="button" class="btn btn-primary property_card__btn-sell" data-toggle="modal" data-target="#bankPropertySale" ${disableSale}>Vender</button>
                      <button type="button" class="btn btn-success property_card__btn-auction" data-toggle="modal" data-target="#bankPropertyAuction"  ${disableAuction}>Subastar</button>
                      <button type="button" class="btn btn-dark property_card__btn-mortgage" ${disableMortgage}>Hipotecar</button>
                      <button type="button" class="btn btn-success property_card__btn-build" ${disableBuilding}>Edificar</button>
                      <button type="button" class="btn btn-danger property_card__btn-demolish" ${disableDemolish}>Demoler</button>
                      <button type="button" class="btn btn-dark property_card__btn-rental" ${disableCollectRent}>Cobrar alquiler</button>
                    </div>`;
    result += division;
  }

  document.getElementById("titlesView").innerHTML = result;

  //Agrego las funciones que dehe hacerse al dar click en el boton vender
  let buttons = document.querySelectorAll("#titlesView .property_card__btn-sell")
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', _propertyBtnSell);
  }

  buttons = document.querySelectorAll("#titlesView .property_card__btn-auction");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', _propertyBtnAuction);
  }
}

function printLines() {
  // loadLines();
  let result = ``;
  for (let i = 0; i < myBank.lines.length; i++) {
    let l = myBank.lines[i];
    let owner = typeof l.owner === "undefined" ? "Banco" : l.owner.name;
    let foreground = "black";

    let disableSale = owner !== "Banco" ? 'disabled="true"' : "";
    let disableAuction = owner !== "Banco" ? 'disabled = "true"' : "";
    let disableMortgage = (owner === "Banco" || l.mortgage > 0)
      ? 'disabled = "true"'
      : "";
    let disableCollectPassage = owner === 'Banco'
      ? 'disabled = "true"'
      : "";

    let division = `<div name = "${l.name}" class="property_card" style="background-color: white; color: ${foreground};">
                      <h2 class="property_card__title">${l.name}</h2>
                      <img src="img/titles/${l.image}" alt="${l.name}" class="property_card__img">
                      <div class="property_card__body">
                        <p>Propietario: <span>${owner}</span></p>
                        <p>Precio: <span>$ ${l.price}</span></p>
                        <p>Pasaje: <span>$ ${l.passage}</span></p>
                      </div>
                      <button type="button" class="btn btn-primary property_card__btn-sell" data-toggle="modal" data-target="#bankPropertySale" ${disableSale}>Vender</button>
                      <button type="button" class="btn btn-success property_card__btn-auction" data-toggle="modal" data-target="#bankPropertyAuction" ${disableAuction}>Subastar</button>
                      <button type="button" class="btn btn-dark property_card__btn-mortgage" ${disableMortgage}>Hipotecar</button>
                      <button type="button" class="btn btn-dark property_card__btn-payPassage" ${disableCollectPassage}>Cobrar pasaje</button>
                    </div>`;
    result += division;
  }

  document.getElementById("linesView").innerHTML = result;

  //Agrego las funciones que dehe hacerse al dar click en el boton vender
  let buttons = document.querySelectorAll("#linesView .property_card__btn-sell")
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', _propertyBtnSell);
  }

  buttons = document.querySelectorAll("#linesView .property_card__btn-auction");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', _propertyBtnAuction);
  }
}

function printCustomsPots() {
  // loadCustomsPots();
  let result = ``;
  for (let i = 0; i < myBank.customsPosts.length; i++) {
    let l = myBank.customsPosts[i];
    let owner = typeof l.owner === "undefined" ? "Banco" : l.owner.name;
    let foreground = "black";

    let disableSale = owner !== "Banco" ? 'disabled="true"' : "";
    let disableAuction = owner !== "Banco" ? 'disabled = "true"' : "";
    let disableMortgage = (owner === "Banco" || l.mortgage > 0)
      ? 'disabled = "true"'
      : "";
    let disableChargeToll = owner === 'Banco'
      ? 'disabled = "true"'
      : "";

    let division = `<div name = "${l.name}" class="property_card" style="background-color: white; color: ${foreground};">
                      <h2 class="property_card__title">${l.name}</h2>
                      <img src="img/titles/${l.image}" alt="${l.name}" class="property_card__img">
                      <div class="property_card__body">
                        <p>Propietario: <span>${owner}</span></p>
                        <p>Precio: <span>$ ${l.price}</span></p>
                        <p>Peaje: <span>$ ${l.toll}</span></p>
                      </div>
                      <button type="button" class="btn btn-primary property_card__btn-sell" data-toggle="modal" data-target="#bankPropertySale" ${disableSale}>Vender</button>
                      <button type="button" class="btn btn-success property_card__btn-auction" data-toggle="modal" data-target="#bankPropertyAuction" ${disableAuction}>Subastar</button>
                      <button type="button" class="btn btn-dark property_card__btn-mortgage" ${disableMortgage}>Hipotecar</button>
                      <button type="button" class="btn btn-dark property_card__btn-payToll" ${disableChargeToll}>Cobrar peaje</button>
                    </div>`;
    result += division;
  }

  document.getElementById("customsView").innerHTML = result;

  //Agrego las funciones que dehe hacerse al dar click en el boton vender
  let buttons = document.querySelectorAll("#customsView .property_card__btn-sell")
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', _propertyBtnSell);
  }

  buttons = document.querySelectorAll("#customsView .property_card__btn-auction");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', _propertyBtnAuction);
  }
}

function _propertyBtnSell(e) {
  //Se recupera el nombre del titulo que se quiere vender
  let propertyName = e.target.parentNode.getAttribute('name')
  let property = myBank.recoveryProperty(propertyName);
  let actualOwner = typeof property.owner === 'undefined'
    ? 'Banco'
    : property.owner.name;


  //Ahora lo escribo en el modal
  document.getElementById('bankPropertySaleTitle').innerText = propertyName;
  document.getElementById('bankPropertySaleActualOwner').innerText = actualOwner;
  document.getElementById('bankPropertySalePrice').innerText = formatCurrencyLite(property.price);

  //Ahora escribo los nombre de los jugadores
  let players = ``;
  for (let index3 = 0; index3 < myBank.players.length; index3++) {
    players += `<option value="${myBank.players[index3].name}">${myBank.players[index3].name}</option>`
  }
  document.getElementById('bankPropertySaleBuyer').innerHTML = players;

  //Se borra cualquier tipo de alerta anterior
  document.querySelector('#bankPropertySale .sellAlert').innerHTML = '';
}

function _propertyBtnAuction(e) {
  //Se recupera el nombre del titulo que se quiere vender
  let propertyName = e.target.parentNode.getAttribute('name')
  let property = myBank.recoveryProperty(propertyName);
  let actualOwner = typeof property.owner === 'undefined'
    ? 'Banco'
    : property.owner.name;
  let basePrice = property.price - 200;

  //Ahora escribo los nombre de los jugadores
  let players = ``;
  for (let index3 = 0; index3 < myBank.players.length; index3++) {
    players += `<option value="${myBank.players[index3].name}">${myBank.players[index3].name}</option>`
  }

  document.getElementById('bankPropertyAuctionTitle').innerText = property.name;
  document.getElementById('bankPropertyAuctionActualOwner').innerText = actualOwner;
  document.getElementById('bankPropertyAuctionPrice').value = basePrice;
  document.getElementById('bankPropertyAuctionBuyer').innerHTML = players;

  document.querySelector('#bankPropertyAuction .auctionAlert').innerHTML = '';
}

function updateMainCard() {
  let bankerName = myBank.bankerName;
  let money = myBank.money;
  let mortgage = 0;
  let netFortune = money;
  let players = myBank.players.length;
  let houses = 0;
  let castles = 0;
  let titles = 0;
  let lines = 0;
  let customsPosts = 0;

  for (let index = 0; index < myBank.titles.length; index++) {

    let title = myBank.titles[index];
    if (typeof title.owner === 'undefined') {
      titles++;
      netFortune += title.price;
    }

    if (index < 4) {
      let line = myBank.lines[index];
      let customsPost = myBank.customsPosts[index];

      if (typeof line.owner === 'undefined') {
        lines++;
        netFortune += line.price;
      }

      if (typeof customsPost.owner === 'undefined') {
        customsPosts++;
        netFortune += customsPost.price;
      }
    }
  }

  for (let index = 0; index < myBank.players.length; index++) {
    mortgage += myBank.players[index].mortgage;
  }

  for (let index = 0; index < myBank.houses.length; index++) {
    if (typeof myBank.houses[index].owner === 'undefined') {
      houses++;
      netFortune += HOUSE_PRICE;
    }

    if (index < MAX_CASTLES && typeof myBank.castles[index].owner === 'undefined') {
      castles++;
      netFortune += CASTLE_PRICE;
    }
  }

  netFortune += mortgage;

  document.getElementById("bankerName").innerText = `${bankerName}`;
  document.getElementById("bankMoney").innerHTML = `${formatCurrencyLite(money)}`;
  document.getElementById("bankMortgage").innerHTML = `${formatCurrencyLite(mortgage)}`;
  document.getElementById("bankNetFortune").innerHTML = `${formatCurrencyLite(netFortune)}`;
  document.getElementById("bankPlayers").innerHTML = `${players}`;
  document.getElementById("bankHouses").innerHTML = `${houses}`;
  document.getElementById("bankCastles").innerHTML = `${castles}`;
  document.getElementById("bankTitles").innerHTML = `${titles}`;
  document.getElementById("bankLines").innerHTML = `${lines}`;
  document.getElementById("bankCustomsPosts").innerHTML = `${customsPosts}`;

}

function updateHomePlayersCard() {
  let htmlCode = ``;
  for (let i = 0; i < myBank.players.length; i++) {
    let player = myBank.players[i];
    let propertys = player.titles.length + player.lines.length + player.customsPosts.length;

    htmlCode += `<div name = "${player.name}" class="player-card">
                  <div class="player-card__header">
                    <h3 class="player-card__header__title">${player.name}</h3>

                    <div class="player-card__header__item">
                      <p class="player-card__header__label">Propiedades:</p>
                      <p class="player-card__header__number">${propertys}</p>
                    </div>

                    <div class="player-card__header__item">
                      <p class="player-card__header__label">Casas:</p>
                      <p class="player-card__header__number">${player.houses}</p>
                    </div>
                    <div class="player-card__header__item">
                      <p class="player-card__header__label">Castillos:</p>
                      <p class="player-card__header__number">${player.castles}</p>
                    </div>
                  </div>

                  <div class="player-card__body">
                    <div class="player-card__body__money">
                    <p>Dinero</p>
                    <p class="money">${formatCurrencyLite(player.money)}</p>
                  </div>

                  <div class="player-card__body__morgage">
                    <p>Hipotecas</p>
                    <p class="money">${formatCurrencyLite(player.mortgage)}</p>
                  </div>

                  <div class="player-card__body__netFortune">
                    <p>Fortuna Neta</p>
                      <p class="money">${formatCurrencyLite(player.netFortune)}</p>
                  </div>

                  <button class="paymentSalary btn btn-primary" data-toggle="modal" data-target="#salaryModal">Pagar salario</button>
      
                  <button class="cashDesposit btn btn-success" data-toggle="modal" data-target="#cashDepositModal">Hacer Deposito</button>
      
                  <button class="cashWithdrawal btn btn-danger" data-toggle="modal" data-target="#cashWithdrawalModal">Hacer Retiro</button>

                </div>
              </div>`;
  }

  document.getElementById('players-cards').innerHTML = htmlCode;

  //Agrego los eventos de los botones para pagar los sueldos
  let buttons = document.querySelectorAll('.player-card .paymentSalary');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', paySalary);
  }

  //Agrego los eventos de los botones para hacer depositos, como esto abre es una ventana modal
  //lo que hace es pasarle el nombre del cliente a la ventana modal
  buttons = document.querySelectorAll('.player-card .cashDesposit');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
      //Primero recupero el nombre del cliente
      let playerName = e.target.parentNode.parentNode.getAttribute('name');
      //Ahora lo imrpimo en la etiqueta nombre cliente
      document.querySelector('#cashDepositModal .modal-body p span').innerText = playerName;
    });
  }

  //Igual que lo anterior solo que este para hacer retiros
  buttons = document.querySelectorAll('.player-card .cashWithdrawal');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', (e) => {
      //Primero recupero el nombre del cliente
      let playerName = e.target.parentNode.parentNode.getAttribute('name');
      //Ahora lo imrpimo en la etiqueta nombre cliente
      document.querySelector('#cashWithdrawalModal .modal-body p span').innerText = playerName;
    });
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function loadStatus() {
  //Se recupera el banco desde localstorage
  myBank = LoadBank();
  updateMainCard();
  updateHomePlayersCard();
  printTitles();
  printLines();
  printCustomsPots();

  //Se habilita el boton para reiniciar el juego
  document.getElementById("restar").addEventListener("click", () => {
    localStorage.clear();
    location.href = "./index.html";
  });

  document.getElementById('addNewPlaer').addEventListener('click', createNewPlayer);

  actualView.classList.remove("ocultar");
  buildNavigation();

  // //Agrego la funcionalidad a los modales para agregar o retirar dinero
  document.getElementById('makeCashDeposit').addEventListener('click', makeCashDeposit);
  document.getElementById('makeCashWithdrawal').addEventListener('click', makeCashWithdrawal);
  document.getElementById('bankPropertySaleBtn').addEventListener('click', sellProperty);
  document.getElementById('bankPropertyAuctionBtn').addEventListener('click', auctionProperty);
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
    /*Localstorage.book es donde se guardan los datos de la aplicacion de manera local*/
    if (typeof localStorage.books !== "undefined") {
      location.href = "./principal.html";
    } else {
      document.getElementById("index__button").addEventListener("click", createBanker);
    }

  } else if (ACTUAL_LOCATION.includes("principal.html")) {
    /*Si localstorage.books está indefinido se limpia el storage y se lanza al index parasolicitar banquero y crear los objetos */
    if (typeof localStorage.books !== 'undefined') {

      if (typeof localStorage.actualView === 'undefined') {
        actualView = document.getElementById("home");
        localStorage.actualView = "home";
      } else {
        actualView = document.getElementById(localStorage.actualView);
      }

      loadStatus();
    } else {
      localStorage.clear();
      location.href = "./index.html";
    }
  } else {
    location.href = "./index.html";
  }
});//Fin de addevenlistener

/* Esta es una funcion que entrega fromato a los numeros segunel pais y la moneda */
function formatCurrency(locales, currency, fractionDigits, number) {
  var formatted = new Intl.NumberFormat(locales, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: fractionDigits
  }).format(number);
  return formatted;
}

function formatCurrencyLite(number) {
  return formatCurrency('es-CO', 'COP', 2, number);
}
