//Constantes que se guardan al cargar la pagina
const ACTUAL_LOCATION = location.href;    //La utilizo para saber en que pagina estoy en cada momento
const BASE_MONEY = 300000;                //Es todo el dinero que puede estar en circulacion
const SALARY = 2000;                      //Es el dinero que se le paga a un jugador cuando llega a la estacion
const INITIAL_BALANCE = 26400;            //Es el dinero que se le entrega al jugador cuando es creado
const HOUSE_PRICE = 1000;
const CASTLE_PRICE = 5000;
const MAX_HOUSES = 30;
const MAX_CASTLES = 10;
const TAX_OF_LAND_OF_DE_FUTURE_BASE = 1500;
const TAX_OF_LAND_OF_DE_FUTURE_PER_CASTLE = 200;
const TAX_OF_ADVENTURE_LAND = 1800;
const TAX_OF_LAND_OF_THE_BORDER = 2000;
const BAMBI_AWARD = 3000;
const PINOCCHIO_AWARD = 6000;
const DAISY_AWARD = 4000;
const CINDERELLA_AWARD = 5000;
const MORTGAGE_INTEREST = 200;
//Se declaran las variables globales del juego
var actualView, miBank;

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
    this.houses = 0;
    this.castles = 0;
    this.netFortune = 0;
  }

  cashDeposit(money) {
    this.money += money;
    this.calculateNetFortune();
    return true;
  }

  cashWithdrawal(money) {
    if (this.money >= money) {
      this.money -= money;
      this.calculateNetFortune();
      return true;
    }

    return false;
  }

  payMortgages(amount){
    e = new Object();
    if(this.mortgage > 0 && this.mortgage >= amount){
      this.mortgage += amount;
      return true;
    }

    return false;
  }

  addEstateProperty(property, propertyType){
    switch(propertyType){
      case "Title":{
        let repetido = false;
        for(let index = 0; index < this.titles.length; index++){
          if(property.id === this.titles[index].id){
            repetido = true;
            break;
          }
        }

        if(!repetido){
          this.titles.push(property);
          this.titles.sort((a,b)=>a.id-b.id);
          this.countBuilding();
          this.calculateNetFortune();
          return true;
        }

        return false;
      }
      case "Line":{
        let repetido = false;
        for(let index = 0; index < this.lines.length; index++){
          if(property.id === this.lines[index].id){
            repetido = true;
            break;
          }
        }

        if(!repetido){
          this.lines.push(property);
          this.lines.sort((a,b)=>a.id-b.id);
          this.calculateNetFortune();
          return true;
        }

        return false;
      }
      case "CustomsPost":{
        let repetido = false;
        for(let index = 0; index < this.customsPosts.length; index++){
          if(property.id === this.customsPosts[index].id){
            repetido = true;
            break;
          }
        }

        if(!repetido){
          this.customsPosts.push(property);
          this.customsPosts.sort((a,b)=>a.id-b.id);
          this.calculateNetFortune();
          return true;
        }

        return false;
      }

    }
  }

  removeEstaeProperty(property, propertyType){
    let position;
    let encontrado = false;
    
    switch(propertyType){
      case "Title":{
        for(let index = 0; index < this.titles.length; index++){
          if(this.titles[index].id === property.id){
            position = index;
            encontrado = true;
            break;
          }
        }

        if(encontrado){
          this.titles.slice(position, position);
          this.countBuilding();
          this.calculateNetFortune();
          return true;
        }

        return false;
      }
      case "Line":{
        for(let index = 0; index < this.lines.length; index++){
          if(this.lines[index].id === property.id){
            position = index;
            encontrado = true;
            break;
          }
        }

        if(encontrado){
          this.lines.slice(position, position);
          return true;
        }

        return false;
      }
      case "CustomsPost":{
        for(let index = 0; index < this.customsPosts.length; index++){
          if(this.customsPosts[index].id === property.id){
            position = index;
            encontrado = true;
            this.calculateNetFortune();
            break;
          }
        }

        if(encontrado){
          this.lines.slice(position, position);
          this.calculateNetFortune();
          return true;
        }

        return false;
      }
    }
  }

  countBuilding(){
    let temporalHouses = 0;
    let temporalCastles = 0;
    for(let index = 0; index < this.titles.length; index++){
      if(this.titles[index].hasACastle){
        temporalCastles++;
      }else {
        temporalHouses += this.titles[index].houses.length;
      }
    }

    this.castles = temporalCastles;
    this.houses = temporalHouses;
  }

  calculateNetFortune(){
    let fortune = 0;
    fortune += this.money;
    fortune += this.houses * HOUSE_PRICE;
    fortune += this.castles * CASTLE_PRICE;
    fortune -= this.mortgage;
    for(let index = 0; index < this.titles.length; index++){
      fortune += this.titles[index].price;
    }

    for(let index = 0; index < this.lines; index++){
      fortune += this.lines[index].price;
    }

    for(let index = 0; index < this.customsPosts.length; index++){
      fortune += this.customsPosts[index].price;
    }

    this.netFortune = fortune;
  }
}
/***************************************/
/*****     CLASES DE PROPIEDADES   *****/
/***************************************/
class EstateProperty {
  constructor(id, name, price, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.owner = undefined;
    this.hasOwner = false;
    this.isMortgage = false;
    this.mortgage = 0;
  }

  makeMortgage() {
    this.isMortgage = true;
    console.log(`Se hipotecó la propiedad: ${this.name}`);
    this.mortgage = Math.floor(this.price / 2) + MORTGAGE_INTEREST;
    return Math.floor(this.price / 2);
  }

  withdrawalMortgage() {
    this.isMortgage = false;
    this.mortgage = 0;
    console.log(`Se levantó la hipoteca de: ${this.name}`);
  }

  makeDeed(newOwner){
    this.owner = newOwner;
  }
}

class Title extends EstateProperty {
  constructor(id, name, price, color, baseRent, rentWithAHouse, rentWithTwoHouses,
    rentWhitTreeHouses, rentWhitACastle, image) {
    super(id, name, price, image);
    this.color = color;
    this.rental = 0;
    this.baseRental = baseRent;
    this.rentalWithAHouse = rentWithAHouse;
    this.rentalWithTwoHouses = rentWithTwoHouses;
    this.rentalWhitTreeHouses = rentWhitTreeHouses;
    this.rentalWhitACastle = rentWhitACastle;
    this.houses = [];
    this.castle = undefined;
    this.hasACastle = false;
    this.zoneBenefits = false;
  }

  //Este elemento es diferente a la base porque aplica hipoteca a las casas o castillos
  makeMortgage() {
    this.isMortgage = true;
    this.mortgage = Math.floor((this.price / 2) + this.houses.length * HOUSE_PRICE);
    this.mortgage += this.hasACastle ? (CASTLE_PRICE / 2) : 0;
    this.defineRental();
    return true; 
  }

  withdrawalMortgage() {
    this.isMortgage = false;
    this.mortgage = 0;
    this.defineRental();
    console.log(`Se levantó la hipoteca de: ${this.name}`);
  }

  makeDeed(newOwner){
    this.owner = newOwner;
    this.defineRental();
  }

  buildHouse(house){
    let e = new Object();

    if(typeof this.owner !== 'undefined'){
      if(!this.isMortgage){
        if(this.zoneBenefits){
          if(this.houses.length < 3){
            house.makeDeed(this.owner);
            house.buildingOn(this);
            this.houses.push(house);
            this.defineRental();
            e.result = true;
          }
          else{
            e.result = false;
            e.message = "No se pueden construir mas de tres casas";
          }
        }else{
          e.result = false;
          e.message = "No se puede construir si no tienes las tres propiedades del mismo color"
        }
      }else{
        e.result = false;
        e.message = "No se puede construir en propiedades hipotecadas"
      }
    }else {
      e.result = false;
      e.message = "No se puede construir casas en propiedades del banco";
    }

    return e;
  }

  buildCastle(castle){
    let e = new Object();

    if(typeof this.owner !== 'undefined'){
      if(!this.hasACastle){
        if(!this.isMortgage){
          if(this.houses.length === 3){
            this.demolishHouse();
            this.demolishHouse();
            this.demolishHouse();
            
            castle.makeDeed(this.owner);
            castle.buildingOn(this);
            this.castle = castle;
            this.hasACastle = true;
            this.defineRental();
            e.result = true;
          }else{
            e.result = false;
            e.message = "Deben haber tres casas en esta propiedad";
          }
        }else{
          e.result = false;
          e.message = "No se puede edificar en propiedades hipotecadas";
        }
      }else{
        e.result = false;
        e.message = "Ya existe un castillo en esta propiedad";
      }
    }else{
      e.result = false;
      e.message = "No se puede construir castillos en propiedades del banco";
    }

    return e;
  }

  demolishHouse(){
    let e = new Object();

    if(this.houses.length>0){
      if(!this.isMortgage){
        this.houses[0].makeDeed(undefined);
        this.houses[0].buildingOn(undefined);
        this.houses.shift();
        this.defineRental();
        e.result = true;
      }else{
        e.result = false;
        e.message = "No se puede demoler en propiedades hipotecadas"
      }
    }else{
      e.result = false;
      e.message = "No hay casas para demoler"
    }

    return e;
  }

  demolishCastle(){
    let e = new Object();

    if(this.hasACastle){
      if(!this.isMortgage){
        this.castle.makeDeed(undefined);
        this.castle.buildingOn(undefined);
        this.castle = undefined;
        this.hasACastle = false;
        this.defineRental();
      }else{
        e.result = false;
        e.message = "No se puede demoler en propiedades hipotecadas"
      }
    }
    else{
      e.result = false;
      e.message = "No hay castillo para demoler";
    }

    return e;
  }

  defineRental(){
    if(typeof this.owner !== 'undefined'){
      if(this.hasACastle){
        this.establisRental(4);
      }else{
        this.establisRental(this.houses.length);
      }
    }else{
      this.establisRental(-1);
    }
  }

  establisRental(id){
    switch(id){
      case -1: 
        this.rental = 0;
      break;

      case 0: 
        if(this.zoneBenefits && !this.isMortgage){
          this.rental = this.baseRental * 2;
        }else{
          this.rental = this.baseRental;
        }
      break;

      case 1: 
        this.rental = this.rentalWithAHouse;
      break;

      case 2: 
        this.rental = this.rentalWithTwoHouses;
      break;

      case 3: 
        this.rental = this.rentalWhitTreeHouses;
      break;   
      
      case 4:
        if(this.zoneBenefits && !this.isMortgage){
          this.rental = this.rentalWhitACastle * 2;
        }else{
          this.rental = this.rentalWhitACastle;
        }
    }
  }

  establishBenefits(){
    this.zoneBenefits = true;
    this.defineRental();
  }

  removeBenefits(){
    this.zoneBenefits = false;
    this.defineRental();
  }

}

class Line extends EstateProperty {
  constructor(id, name, price, basePassage, image) {
    super(id, name, price, image);
    this.basePassage = basePassage;
    this.passage = 0;
  }

  definePassage(passageValue){
    this.passage = passageValue;
  }
}

class CustomsPost extends EstateProperty {
  constructor(id, name, price, baseToll, image) {
    super(id, name, price, image);
    this.baseToll = baseToll;
    this.toll = 0;
  }

  defineToll(tollValue){
    this.toll = tollValue;
  }
}

/***************************************/
/*****     CLASES DE EDIFICIOS     *****/
/***************************************/
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

  makeDeed(newOwner){
    this.owner = newOwner;
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

/***************************************/
/*****        EL BANCO             *****/
/***************************************/
class Bank {
  constructor(bankerName) {
    this.players = [];
    this.titles = [];
    this.customsPosts = [];
    this.lines = [];
    this.houses = [];
    this.castles = [];
    this.createObjets();

    if (typeof bankerName !== 'undefined') {
      this.money = BASE_MONEY;
      this.bankerName = bankerName;
      console.log(this.players);
      this.newPlayer(bankerName);

    } else if (typeof localStorage.miBank !== 'undefined') {
      let temporal = JSON.parse(localStorage.miBank);
      this.money = temporal.money;
      this.bankerName = temporal.bankerName;

      //Se cargan en memoria los jugadores
      for (let i = 0; i < temporal.players.length; i++) {
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
    this.titles.push(new Title(8, "Poblado indio", 1800, "#FFBA20", 300, 900, 1800, 3600, 5400, "title_9.jpg"));

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
    this.customsPosts.push(new CustomsPost(3, "Paso Aduanas del rio", 4000, 800, 'customs_4.jpg'));

  }

  createBuildings() {
    this.houses = [];
    this.castles = [];
    for (let i = 0; i < MAX_HOUSES; i++) {
      if (i < MAX_CASTLES) {
        this.castles.push(new Castle(i, 3500));
      }
      this.houses.push(new House(i, 1000));
    }

  }

  newPlayer(playerName) {
    
    if(this.isUniqueName(playerName) && this.money >= (INITIAL_BALANCE + this.players.length * SALARY)){
      let id = this.players.length,
      acount = this.generateAcount();

      let player = new Player(id, playerName, acount);
      player.cashDeposit(INITIAL_BALANCE);
      this.money -= INITIAL_BALANCE;
      this.players.push(player);
  
      return true;
    }

    return false;    
  }

  isUniqueName(playerName){
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].name.toUpperCase() === playerName.toUpperCase()) {
        return false;
      }
    }

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

  paySalary(playerName){
    if(this.money >= SALARY){
      let player = recoveryPlayer(playerName);
      player.cashDeposit(SALARY);
      this.money -= SALARY;
      return true;
    }

    return false;
  }

  cashDeposit(playerName, amount){
    //Este metodo lo que hace es validar que el balance no supere en ingun momento
    //el dinero total que puede estar en circulacion
    console.log("Metodo llamado con los parametros (" + playerName + ", " + amount);
    let balance = this.money + amount;
    let player = recoveryPlayer(playerName);

    if(balance <= BASE_MONEY){
      console.log("El balance no ha sido superado");

      for(let i = 0; i < this.players.length; i++){
        balance += this.players[i].money;
      }

      if(balance <= BASE_MONEY){
        console.log("El balance es: " + balance)
        if(typeof player !== 'undefined'){
          player.cashDeposit(amount);
          return true;
        }
      }
    }

    console.log("El balance supera el monto maximo: " + balance);
    return false;
  }

  cashWithdrawal(playerName, amount){
    let player = recoveryPlayer(playerName);

    if(player.money >= amount){
      player.cashWithdrawal(amount);
      return true;
    }

    return false;
  }

  cashTransfer(playerSender, playerAddressee, amount){
    let player1 = recoveryPlayer(playerSender);
    let player2 = recoveryPlayer(playerAddressee);
    let e = new Object();

    if(player1.money>=amount){
      player1.cashWithdrawal(amount);
      player2.cashDeposit(amount);
      e.result = true;
      e.message = "Transferencia exitosa";
    }
    else{
      e.result = false;
      e.message = `El jugador ${player1.name} tiene saldo insuficiente`;
    }

    return e;

  }//Fin del metodo

  sellProperty(propertyName, newOwner){
    //TODO
  }

  mortgageProperty(propertyName){
    //TODO
  }

  withdrawalMortgage(propertyName){
    //TODO
  }

  buildHouse(titleName){
    //TODO
  }

  buildCastle(titleName){
    //TODO
  }

  demolishHouse(titleName){
    //TODO
  }

  demolishCastle(titleName){
    //TODO
  }
  //Este metodo verifica el bloque de color pasado como parametros y define los alquileres
  //Este metodo debe ser llamado cuando se venda un titulo, se edifique o destruya un edificio o se hipoteque
  //o des hipoteque una propiedad
  defineRentals(color){
    //TODO
  }

  definePassages(){
    //TODO
  }

  defineTolls(){
    //TODO
  }

  

  reloadState(){
    //TODO
  }

  recoveryPlayer(playerName){
    let player;

    for(let index = 0; index < this.players.length; index++){
      if(this.players[index].name === playerName){
        player = this.players[index];
        break;
      }//Fin de if
    }//Fin de for

    return player;
  }//Fin del metodo

  recoveryTitle(titleName){
    let title;
    for(let index = 0; index < this.titles.length; index++){
      if(this.titles[index].name === titleName){
        title = this.titles[index];
        break;
      }//Fin de if
    }//Fin de for

    return title;
  }//Fin del metodo

  recoveryLine(lineName){
    let line;
    for(let index = 0; index < this.lines.length; index++){
      if(this.lines[index].name === lineName){
        line = this.lines[index];
        break;
      }//Fin de if
    }//Fin de for

    return line;
  }//Fin del metodo

  recoveryCustomsPots(customsName){
    let customs;
    for(let index = 0; index < this.customsPosts.length; index++){
      if(this.customsPosts[index].name === customsName){
        customs = this.customsPosts[index];
        break;
      }
    }

    return customs;

  }//Fin del metodo
}//Fin de la clase

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
