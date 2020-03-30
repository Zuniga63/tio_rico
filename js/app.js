//Constantes que se guardan al cargar la pagina
const ACTUAL_LOCATION = location.href;    //La utilizo para saber en que pagina estoy en cada momento
const BASE_MONEY = 300000;                //Es todo el dinero que puede estar en circulacion
const SALARY = 2000;                      //Es el dinero que se le paga a un jugador cuando llega a la estacion
const INITIAL_BALANCE = 26400;            //Es el dinero que se le entrega al jugador cuando es creado

//Se declaran las variables que estan relacionadas con las vista en la seccion principal
var actualView;

//Se declaran las variables que se van a estar utilizando en el juego
var miBank;

/********************************************************************
 **    A PARTIR DE AQUI DECLARO LOS OBJETOS DE LA APLICACION       **
 *********************************************************************/
class Player {
  constructor(id, name, acount) {
    this.id = id;
    this.name = name;
    this.acount = acount;
    this.money = 0;
    this.mortgage = 0;
    this.titles = [];
    this.customsPosts = [];
    this.lines = [];
  }

  cashDeposit(money) {
    this.money += money;
    return true;
  }

  cashWithdrawal(money) {
    if (this.money >= money) {
      this.money -= money;
      return true;
    }

    return false;
  }
}

class EstateProperty {
  constructor(id, name, price, image) {
    this.id = id;
    this.name = name;
    this.owner = undefined;
    this.price = price;
    this.image = image;
    this.isMortgage = false;
  }

  mortgage() {
    this.isMortgage = true;
    console.log(`Se hipotecó la propiedad: ${this.name}`);
    return Math.floor(this.price / 2);
  }

  withdrawMortgage() {
    this.isMortgage = false;
    console.log(`Se levantó la hipoteca de: ${this.name}`);
  }
}

class Title extends EstateProperty {
  constructor(id, name, price, color, baseRent, rentWithAHouse, rentWithTwoHouses,
    rentWhitTreeHouses, rentWhitACastle, image) {
    super(id, name, price, image);
    this.color = color;
    this.rent = 0;
    this.baseRent = baseRent;
    this.rentWithAHouse = rentWithAHouse;
    this.rentWithTwoHouses = rentWithTwoHouses;
    this.rentWhitTreeHouses = rentWhitTreeHouses;
    this.rentWhitACastle = rentWhitACastle;
    this.houses = [];
    this.castle = undefined;
  }

  //Este elemento es diferente a la base porque aplica hipoteca a las casas o castillos
  mortgage() {
    console.log("Montando hipoteca desde titulo");
  }
}

class Line extends EstateProperty {
  constructor(id, name, price, basePassage, image) {
    super(id, name, price, image);
    this.basePassage = basePassage;
    this.passage = 0;
  }
}

class CustomsPost extends EstateProperty {
  constructor(id, name, price, baseToll, image) {
    super(id, name, price, image);
    this.baseToll = baseToll;
    this.toll = 0;
  }
}

class Building {
  constructor(id, price) {
    this.id = id;
    this.owner = undefined;
    this.title = undefined;
    this.price = price;
  }

  buildingOn(title) {
    this.title = title;
  }

  buildingOf(title) {
    this.title = undefined;
  }
}

class House extends Building {
  constructor(id, price) {
    super(id, price);
  }
}

class Castle extends Building {
  constructor(id, price) {
    super(id, price);
  }
}

class Bank {
  constructor(bankerName) {
    this.players = [];
    this.titles = [];
    this.customsPosts = [];
    this.lines = [];
    this.houses = [];
    this.castles = [];
    this.createObjets();
    
    if(typeof bankerName !== 'undefined'){
      this.money = BASE_MONEY;
      this.bankerName = bankerName;
      console.log(this.players);
      this.newPlayer(bankerName);

    }else if(typeof localStorage.miBank !== 'undefined'){
      let temporal = JSON.parse(localStorage.miBank);
      this.money = temporal.money;
      this.bankerName = temporal.bankerName;

      //Se cargan en memoria los jugadores
      for(let i = 0; i < temporal.players.length; i++){
        let newPlayer = new Player(i, temporal.players[i].name, temporal.players[i].acount);
        newPlayer.money = temporal.players[i].money;
        newPlayer.mortgage = temporal.players[i].mortgage;
        this.players.push(newPlayer);
      }

      //TODO: Asignar las propiedades a los jugadores
      //TODO: asignar las casas a los jugadores y las propiedades
      //TODO: asignar los castillos a los jugadores y las propiedades
      //TODO: hacer efectivas las hipotecas

    }
    
  }

  createObjets() {
    this.createTitles();
    this.createCustomsPost();
    this.createLines();
    this.createBuildings();
  }

  createTitles() {
    this.titles = [];
    /* Titulos de la zona amarilla */
    this.titles.push(new Title(0, "Tierra de la Fantasía", 400, "#FFF228", 100, 200, 300, 600, 900, "title_1.jpg"));
    this.titles.push(new Title(1, "Cielos de Dumbo", 600, "#FFF228", 100, 200, 300, 600, 900, "title_2.jpg"));
    this.titles.push(new Title(2, "Villa de Pinocho", 800, "#FFF228", 100, 300, 600, 1200, 1800, "title_3.jpg"));

    /*Titulos de la zona roja */
    this.titles.push(new Title(3, "Lagos de Peter Pan", 1000, "#FF0901", 100, 500, 900, 1800, 2700, "title_4.jpg"));
    this.titles.push(new Title(4, "País de las Maravillas", 1200, "#FF0901", 100, 500, 900, 1800, 2700, "title_5.jpg"));
    this.titles.push(new Title(5, "Mina de los siete enanitos", 1200, "#FF0901", 200, 600, 1200, 2400, 3600, "title_6.jpg"));

    /*Titulos de la zona ocre */
    this.titles.push(new Title(6, "Desierto Apache", 1400, "#FFBA20", 300, 800, 1500, 3000, 4500, "title_7.jpg"));
    this.titles.push(new Title(7, "Isla de Tom Sawyer", 1600, "#FFBA20", 300, 800, 1500, 3000, 4500, "title_8.jpg"));
    this.titles.push(new Title(8, "Pobaldo indio", 1800, "#FFBA20", 300, 900, 1800, 3600, 5400, "title_9.jpg"));

    /*Titulos de la zona verde*/
    this.titles.push(new Title(9, "Desiertos de la diligencia", 1800, "#2C8000", 400, 1100, 2100, 4200, 6300, "title_10.jpg"));
    this.titles.push(
      new Title(
        10,
        "Rutas del tren Santa Fe",
        2000,
        "#2C8000",
        400,
        1100,
        2100,
        4200,
        6300,
        "title_11.jpg"
      )
    );
    this.titles.push(
      new Title(
        11,
        "Región Cabañas",
        2200,
        "#2C8000",
        400,
        1200,
        2400,
        4800,
        7200,
        "title_12.jpg"
      )
    );

    /* Titulos de la zona morada*/
    this.titles.push(
      new Title(
        12,
        "Altos del monorriel",
        2200,
        "#5113AD",
        500,
        1400,
        2700,
        5400,
        8100,
        "title_13.jpg"
      )
    );
    this.titles.push(
      new Title(
        13,
        "Glaciares del teleferico",
        2400,
        "#5113AD",
        500,
        1400,
        2700,
        5400,
        8100,
        "title_14.jpg"
      )
    );
    this.titles.push(
      new Title(
        14,
        "Parques de los Astrojet",
        2600,
        "#5113AD",
        500,
        1500,
        3000,
        6000,
        9000,
        "title_15.jpg"
      )
    );

    /* Titulos de la zona naranja*/
    this.titles.push(
      new Title(
        15,
        "Playa de los botes del futuro",
        2800,
        "#FFB012",
        600,
        1700,
        3300,
        6600,
        9900,
        "title_16.jpg"
      )
    );
    this.titles.push(
      new Title(
        16,
        "Puentes de la autopista",
        3000,
        "#FFB012",
        600,
        1700,
        3300,
        6600,
        9900,
        "title_17.jpg"
      )
    );
    this.titles.push(
      new Title(
        17,
        "Imperio del Nautilus",
        3000,
        "#FFB012",
        600,
        1800,
        3600,
        7200,
        10800,
        "title_18.jpg"
      )
    );

    /* Titulos de la zona azul marino*/
    this.titles.push(
      new Title(
        18,
        "Muelle jungla",
        3200,
        "#36DEF0",
        700,
        2000,
        3900,
        7800,
        11700,
        "title_19.jpg"
      )
    );
    this.titles.push(
      new Title(
        19,
        "Valle de los leones",
        3400,
        "#36DEF0",
        700,
        2000,
        3900,
        7800,
        11700,
        "title_20.jpg"
      )
    );
    this.titles.push(
      new Title(
        20,
        "Ciénaga de los hipopotamos",
        3600,
        "#36DEF0",
        700,
        2100,
        4200,
        8400,
        12600,
        "title_21.jpg"
      )
    );

    /* Titulos de la zona rosada */
    this.titles.push(
      new Title(
        21,
        "Valle de las jirafas",
        3600,
        "pink",
        800,
        2300,
        4500,
        9000,
        13500,
        "title_22.jpg"
      )
    );
    this.titles.push(
      new Title(
        22,
        "Valle de los elefantes",
        3800,
        "pink",
        800,
        2300,
        4500,
        9000,
        13500,
        "title_23.jpg"
      )
    );
    this.titles.push(
      new Title(
        23,
        "Aldea Caníbal",
        3600,
        "pink",
        800,
        2400,
        4800,
        9600,
        14400,
        "title_24.jpg"
      )
    );
  }

  createLines() {
    this.lines = [];

    this.lines.push(new Line(0, 'Línea Tierra de la fantasía', 2000, 300, 'line_1.jpg'));
    this.lines.push(new Line(1, 'Línea Tierra de la frontera', 2000, 300, 'line_2.jpg'));
    this.lines.push(new Line(2, 'Línea Tierra del futuro', 2000, 300, 'line_3.jpg'));
    this.lines.push(new Line(3, 'Línea Tierra de la aventura', 2000, 300, 'line_4.jpg'));
  }

  createCustomsPost() {
    this.customsPosts = [];

    this.customsPosts.push(new CustomsPost(0, "Paso Dominios de Pedro el malo", 1000, 200, 'customs_1.jpg'));
    this.customsPosts.push(new CustomsPost(1, "Paso Caverna del Arco Iris", 2000, 400, 'customs_2.jpg'));
    this.customsPosts.push(new CustomsPost(2, "Paso el Matterhorn", 3000, 600, 'customs_3.jpg'));
    this.customsPosts.push(new CustomsPost(3,"Paso Aduanas del rio", 4000, 800, 'customs_4.jpg'));

  }

  createBuildings(){
    this.houses = [];
    this.castles = [];
    for(let i = 0; i<30; i++){
      if(i<10){
        this.castles.push(new Castle(i, 3500));
      }
      this.houses.push(new House(i, 1000));
    }

  }

  newPlayer(playerName){
    //Lo primero es definir que el nombre del jugador sea unico
    let uniqueName = true;
    for(let i = 0; i < this.players.length; i++){
      if(this.players[i].name.toUpperCase()===playerName.toUpperCase()){
        uniqueName = false;
        return false;
      }
    }

    let player = new Player(this.players.length, playerName, this.generateAcount());
    player.cashDeposit(INITIAL_BALANCE);
    this.money -= INITIAL_BALANCE;
    this.players.push(player);

    return true;
  }

  //Este codigo genera un numero de cuenta con 4 numeros
  generateAcount() {
    //Lo primero que se hace es crear una secuencia de 4 numeors
    let unico = true;
    let acount = "";

    do {
      unico = true;
      for (let i = 0; i < 4; i++) {
        acount += Math.floor(Math.random() * 10);
      }

      //Ahora compruebo que el numero de cuenta es unico, al recorrer players
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].acount === acount) {
          unico = false;
          break;
        }
      }
    } while (!unico);

    return acount;
  }
}

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


function printTitles() {
  // loadTitles();
  let result = ``;
  for (let i = 0; i < miBank.titles.length; i++) {
    let t = miBank.titles[i];
    let owner = typeof t.owner === "undefined" ? "Banco" : t.owner.name;
    let castle = typeof t.castle === "undefined" ? 0 : 1;
    let foreground = "black";

    if (t.color === "#FF0901" || t.color === "#2C8000" || t.color === "#5113AD")
      foreground = "white";

    let division = `<div class="property_card" style="background-color: ${t.color}; color: ${foreground};">
                      <img src="img/titles/${t.image}" alt="${t.name}" class="property_card__img">
                      <div class="property_card__body">
                        <h2 class="property_card__title">${t.name}</h2>
                        <p>Propietario: <span>${owner}</span></p>
                        <p>Precio: <span>$ ${t.price}</span></p>
                        <p>Casas: <span>${t.houses.length}</span></p>
                        <p>Castillo: <span>${castle}</span></p>
                        <p>Alquiler: <span>$ ${t.rent}</span></p>
                        <div class="button">
                          <button type="button" class="btn btn-success">Vender</button>
                          <button type="button" class="btn btn-primary">Subastar</button>
                          <button type="button" class="btn btn-warning">Hipotecar</button>
                        </div>
                      </div>
                    </div>`;
    result += division;
  }

  document.getElementById("titlesView").innerHTML = result;
}

function printLines() {
  // loadLines();
  let result = ``;
  for (let i = 0; i < miBank.lines.length; i++) {
    let l = miBank.lines[i];
    let owner = typeof l.owner === "undefined" ? "Banco" : l.owner.name;
    let foreground = "black";

    let division = `<div class="property_card" style="background-color: white; color: ${foreground};">
                      <img src="img/titles/${l.image}" alt="${l.name}" class="property_card__img">
                      <div class="property_card__body">
                        <h2 class="property_card__title">${l.name}</h2>
                        <p>Propietario: <span>${owner}</span></p>
                        <p>Precio: <span>$ ${l.price}</span></p>
                        <p>Peaje: <span>$ ${l.passage}</span></p>
                        <div class="button">
                          <button type="button" class="btn btn-success">Vender</button>
                          <button type="button" class="btn btn-primary">Subastar</button>
                          <button type="button" class="btn btn-warning">Hipotecar</button>
                        </div>
                      </div>
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
                      <img src="img/titles/${l.image}" alt="${l.name}" class="property_card__img">
                      <div class="property_card__body">
                        <h2 class="property_card__title">${l.name}</h2>
                        <p>Propietario: <span>${owner}</span></p>
                        <p>Precio: <span>$ ${l.price}</span></p>
                        <p>Peaje: <span>$ ${l.passage}</span></p>
                        <div class="button">
                          <button type="button" class="btn btn-success">Vender</button>
                          <button type="button" class="btn btn-primary">Subastar</button>
                          <button type="button" class="btn btn-warning">Hipotecar</button>
                        </div>
                      </div>
                    </div>`;
    result += division;
  }

  document.getElementById("customsView").innerHTML = result;
}

function loadState1() {
  //Primero habilito el boton para reiniciar
  document.getElementById("restar").addEventListener("click", () => {
    localStorage.clear();
    location.href = "./index.html";
  });

  //Lo siguiente es codigo temporal
  //Primero rescato el objeto del local storage
  miBank = new Bank();

  document.getElementById("bankerName").innerText =
    "Banquero: " + miBank.bankerName;
  document.getElementById("bankerMoney").innerHTML = `Dinero: $ ${miBank.money}`;
  document.getElementById("bankerHouses").innerHTML = `Casas: ${miBank.houses.length}`;
  document.getElementById("bankerCastles").innerHTML = `Castillos: ${miBank.castles.length}`;
  document.getElementById("bankerTitles").innerHTML = `Titulos: ${miBank.titles.length}`;
  document.getElementById("bankerCustomsPost").innerHTML = `Pasos: ${miBank.customsPosts.length}`;
  document.getElementById("bankerLines").innerHTML = `Lineas: ${miBank.lines.length}`;
  
  printTitles();
  printLines();
  printCustomsPots();

  actualView = document.getElementById("home");
  buildNavigation();
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
    if(typeof localStorage.miBank !== 'undefined'){
      loadState1();
    } else{
      localStorage.clear();
      location.href = "./index.html";
    }
  }
});
