//Conatastes que se guardan al cargar la pagina
const ACTUAL_LOCATION = location.href;
const BASE_MONEY = 300000;
const SALARY = 2000;
const INITIAL_BALANCE = 30000;

//Las siguientes son varibales con las vistas
var actualView, home, viewTitles;

//a partir de aquí se empiezan a definir las variables globales
var money,
  players = [],
  titles = [],
  customsPots = [],
  lines = [],
  houses = [],
  castles = [];
/*  customs: son pasos de aduana del juego en total son cuatro
    lines: sistema de trasporte del tablero
*/

/********************************************************************
 **    A PARTIR DE AQUI DECLARO LOS OBJETOS DE LA APLICACION       **
 *********************************************************************/
class Player {
  constructor(name) {
    this.id = players.length;
    this.name = name;
    this.acount = this.generateAcount();
    this.money = 0;
    this.mortgage = 0;
    this.titles = [];
    this.customsPost = [];
    this.lines = [];
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
      for (let i = 0; i < players.length; i++) {
        if (players[i].acount === acount) {
          unico = false;
          break;
        }
      }
    } while (!unico);

    return acount;
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

class Estate {
  constructor(name, price, image) {
    this.name = name;
    this.owner = undefined;
    this.price = price;
    this.image = image;
    this.isMortgage = false;
  }

  mortgage() {
    console.log("Se realizó la hipoteca");
  }

  withdrawMortgage() {
    //TODO
    console.log("Se levantó la hipoteca");
  }
}

class Title extends Estate {
  constructor(name, price, color, baseRent, rentWithAHouse, rentWithTwoHouses,
    rentWhitTreeHouses, rentWhitACastle, image) {
    super(name, price, image);
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

  mortgage() {
    console.log("Montando hipoteca desde titulo");
  }
}

class Line extends Estate{
  constructor(name, price, basePassage, image){
    super(name, price, image);
    this.basePassage = basePassage;
    this.passage = 0;
  }
}

class CustomsPost extends Estate{
  constructor(name, price, baseToll, image){
    super(name, price, image);
    this.baseToll = baseToll;
    this.toll = 0;
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

  if (bankerName.length !== 0) {
    createTitles();
    createLines();
    createCustomsPost();

    let player = new Player(bankerName);
    player.cashDeposit(INITIAL_BALANCE);
    players.push(player);
    money -= INITIAL_BALANCE;

    localStorage.bankerName = bankerName;
    localStorage.titles = JSON.stringify(titles);
    localStorage.lines = JSON.stringify(lines);
    localStorage.customsPost = JSON.stringify(customsPots);
    localStorage.money = money;
    localStorage.players = JSON.stringify(players);
    localStorage.gameSaved = true;

    location.href = "./principal.html";
  }
}

//Este metodo solo se ejecuta al cear al banquero
function createTitles() {
  titles = [];
  /* Titulos de la zona amarilla */
  titles.push(new Title("Tierra de la Fantasía", 400, "#FFF228", 100, 200, 300, 600, 900, "title_1.jpg"));
  titles.push(
    new Title(
      "Cielos de Dumbo",
      600,
      "#FFF228",
      100,
      200,
      300,
      600,
      900,
      "title_2.jpg"
    )
  );
  titles.push(
    new Title(
      "Villa de Pinocho",
      800,
      "#FFF228",
      100,
      300,
      600,
      1200,
      1800,
      "title_3.jpg"
    )
  );

  /*Titulos de la zona roja */
  titles.push(
    new Title(
      "Lagos de Peter Pan",
      1000,
      "#FF0901",
      100,
      500,
      900,
      1800,
      2700,
      "title_4.jpg"
    )
  );
  titles.push(
    new Title(
      "País de las Maravillas",
      1200,
      "#FF0901",
      100,
      500,
      900,
      1800,
      2700,
      "title_5.jpg"
    )
  );
  titles.push(
    new Title(
      "Mina de los siete enanitos",
      1200,
      "#FF0901",
      200,
      600,
      1200,
      2400,
      3600,
      "title_6.jpg"
    )
  );

  /*Titulos de la zona ocre */
  titles.push(
    new Title(
      "Desierto Apache",
      1400,
      "#FFBA20",
      300,
      800,
      1500,
      3000,
      4500,
      "title_7.jpg"
    )
  );
  titles.push(
    new Title(
      "Isla de Tom Sawyer",
      1600,
      "#FFBA20",
      300,
      800,
      1500,
      3000,
      4500,
      "title_8.jpg"
    )
  );
  titles.push(
    new Title(
      "Pobaldo indio",
      1800,
      "#FFBA20",
      300,
      900,
      1800,
      3600,
      5400,
      "title_9.jpg"
    )
  );

  /*Titulos de la zona verde*/
  titles.push(
    new Title(
      "Desiertos de la diligencia",
      1800,
      "#2C8000",
      400,
      1100,
      2100,
      4200,
      6300,
      "title_10.jpg"
    )
  );
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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
  titles.push(
    new Title(
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

function createLines() {
  lines = [];

  lines.push(new Line('Línea Tierra de la fantasía', 2000, 300, 'line_1.jpg'));
  lines.push(new Line('Línea Tierra de la frontera', 2000, 300, 'line_2.jpg'));
  lines.push(new Line('Línea Tierra del futuro', 2000, 300, 'line_3.jpg'));
  lines.push(new Line('Línea Tierra de la aventura', 2000, 300, 'line_4.jpg'));
}

function createCustomsPost(){
  customsPots = [];

  customsPots.push(new CustomsPost("Paso Dominios de Pedro el malo", 1000, 200, 'customs_1.jpg'));
  customsPots.push(new CustomsPost("Paso Caverna del Arco Iris", 2000, 400, 'customs_2.jpg'));
  customsPots.push(new CustomsPost("Paso el Matterhorn", 3000, 600, 'customs_3.jpg'));
  customsPots.push(new CustomsPost("Paso Aduanas del rio", 4000, 800, 'customs_4.jpg'));

}

function loadTitles() {
  titles = [];
  let temporal = JSON.parse(localStorage.titles);

  for (let i = 0; i < temporal.length; i++) {
    let item = temporal[i];
    titles.push(
      new Title(
        item.name,
        item.price,
        item.color,
        item.baseRent,
        item.rentWithAHouse,
        item.rentWithTwoHouses,
        item.rentWhitTreeHouses,
        item.rentWhitACastle,
        item.image
      )
    );
  }
}

function loadLines(){
  lines = [];
  let temporal = JSON.parse(localStorage.lines);

  for(let i = 0; i < temporal.length; i++){
    let item = temporal[i];
    lines.push(
      new Line(
        item.name,
        item.price,
        item.basePassage,
        item.image
      )
    );
  }
}

function loadCustomsPots(){
  customsPost = [];
  let temporal = JSON.parse(localStorage.customsPost);

  for(let i = 0; i < temporal.length; i++){
    let item = temporal[i];
    customsPost.push(
      new CustomsPost(
        item.name,
        item.price,
        item.baseToll,
        item.image
      )
    );
  }
}

function printTitles() {
  loadTitles();
  let result = ``;
  for (let i = 0; i < titles.length; i++) {
    let t = titles[i];
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
  loadLines();
  let result = ``;
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
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
  loadCustomsPots();
  let result = ``;
  for (let i = 0; i < customsPost.length; i++) {
    let l = customsPost[i];
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

  //Escribo el nombre del banquero
  document.getElementById("bankerName").innerText =
    "Banquero: " + localStorage.bankerName;

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
    console.log("mensaje");
  });
}

/******************************************************************
    A PARTIR DE AQUI SE EMPIEZAN A EJECUTAR LAS FUNCIONES
********************************************************************/

window.addEventListener("load", () => {
  if (ACTUAL_LOCATION.includes("index.html")) {
    if (typeof localStorage.gameSaved !== "undefined") {
      location.href = "./principal.html";
    }
    console.log("No existen datos de guardado");
    document
      .getElementById("index__button")
      .addEventListener("click", createBanker);
  } else {
    console.log("Estas en la siguiente direccion: " + ACTUAL_LOCATION);
    //En este punto lo que el programa debe hacer es cargar los datos guardados en localstorage
    loadState1();
  }
});
