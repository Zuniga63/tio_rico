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

    payMortgages(amount) {
        e = new Object();
        if (this.mortgage > 0 && this.mortgage >= amount) {
            this.mortgage += amount;
            return true;
        }

        return false;
    }

    addEstateProperty(property) {
        switch (property.toString()) {
            case "Title": {
                let repetido = false;
                for (let index = 0; index < this.titles.length; index++) {
                    if (property.id === this.titles[index].id) {
                        repetido = true;
                        break;
                    }
                }

                if (!repetido) {
                    this.titles.push(property);
                    this.titles.sort((a, b) => a.id - b.id);
                    this.countBuilding();
                    this.calculateNetFortune();
                    return true;
                }

                return false;
            }
            case "Line": {
                let repetido = false;
                for (let index = 0; index < this.lines.length; index++) {
                    if (property.id === this.lines[index].id) {
                        repetido = true;
                        break;
                    }
                }

                if (!repetido) {
                    this.lines.push(property);
                    this.lines.sort((a, b) => a.id - b.id);
                    this.calculateNetFortune();
                    return true;
                }

                return false;
            }
            case "CustomsPost": {
                let repetido = false;
                for (let index = 0; index < this.customsPosts.length; index++) {
                    if (property.id === this.customsPosts[index].id) {
                        repetido = true;
                        break;
                    }
                }

                if (!repetido) {
                    this.customsPosts.push(property);
                    this.customsPosts.sort((a, b) => a.id - b.id);
                    this.calculateNetFortune();
                    return true;
                }

                return false;
            }

        }
    }

    removeEstaeProperty(property) {
        let position;
        let encontrado = false;

        switch (property.toString()) {
            case "Title": {
                for (let index = 0; index < this.titles.length; index++) {
                    if (this.titles[index].id === property.id) {
                        position = index;
                        encontrado = true;
                        break;
                    }
                }

                if (encontrado) {
                    this.titles.slice(position, position);
                    this.countBuilding();
                    this.calculateNetFortune();
                    return true;
                }

                return false;
            }
            case "Line": {
                for (let index = 0; index < this.lines.length; index++) {
                    if (this.lines[index].id === property.id) {
                        position = index;
                        encontrado = true;
                        break;
                    }
                }

                if (encontrado) {
                    this.lines.slice(position, position);
                    return true;
                }

                return false;
            }
            case "CustomsPost": {
                for (let index = 0; index < this.customsPosts.length; index++) {
                    if (this.customsPosts[index].id === property.id) {
                        position = index;
                        encontrado = true;
                        this.calculateNetFortune();
                        break;
                    }
                }

                if (encontrado) {
                    this.lines.slice(position, position);
                    this.calculateNetFortune();
                    return true;
                }

                return false;
            }
        }
    }

    countBuilding() {
        let temporalHouses = 0;
        let temporalCastles = 0;
        for (let index = 0; index < this.titles.length; index++) {
            if (this.titles[index].hasACastle) {
                temporalCastles++;
            } else {
                temporalHouses += this.titles[index].houses.length;
            }
        }

        this.castles = temporalCastles;
        this.houses = temporalHouses;
    }

    calculateNetFortune() {
        let fortune = 0;
        fortune += this.money;
        fortune += this.houses * HOUSE_PRICE;
        fortune += this.castles * CASTLE_PRICE;
        fortune -= this.mortgage;
        for (let index = 0; index < this.titles.length; index++) {
            fortune += this.titles[index].price;
        }

        for (let index = 0; index < this.lines; index++) {
            fortune += this.lines[index].price;
        }

        for (let index = 0; index < this.customsPosts.length; index++) {
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
        this.mortgage = Math.floor(this.price / 2);
        return Math.floor(this.price / 2);
    }

    withdrawalMortgage() {
        this.isMortgage = false;
        this.mortgage = 0;
        console.log(`Se levantó la hipoteca de: ${this.name}`);
    }

    makeDeed(newOwner) {
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

    makeDeed(newOwner) {
        this.owner = newOwner;
        this.defineRental();
    }

    buildHouse(house) {
        let e = new Object();

        if (typeof this.owner !== 'undefined') {
            if (!this.isMortgage) {
                if (this.zoneBenefits) {
                    if (this.houses.length < 3) {
                        house.makeDeed(this.owner);
                        house.buildingOn(this);
                        this.houses.push(house);
                        this.defineRental();
                        e.result = true;
                    }
                    else {
                        e.result = false;
                        e.message = "No se pueden construir mas de tres casas";
                    }
                } else {
                    e.result = false;
                    e.message = "No se puede construir si no tienes las tres propiedades del mismo color"
                }
            } else {
                e.result = false;
                e.message = "No se puede construir en propiedades hipotecadas"
            }
        } else {
            e.result = false;
            e.message = "No se puede construir casas en propiedades del banco";
        }

        return e;
    }

    buildCastle(castle) {
        let e = new Object();

        if (typeof this.owner !== 'undefined') {
            if (!this.hasACastle) {
                if (!this.isMortgage) {
                    if (this.houses.length === 3) {
                        this.demolishHouse();
                        this.demolishHouse();
                        this.demolishHouse();

                        castle.makeDeed(this.owner);
                        castle.buildingOn(this);
                        this.castle = castle;
                        this.hasACastle = true;
                        this.defineRental();
                        e.result = true;
                    } else {
                        e.result = false;
                        e.message = "Deben haber tres casas en esta propiedad";
                    }
                } else {
                    e.result = false;
                    e.message = "No se puede edificar en propiedades hipotecadas";
                }
            } else {
                e.result = false;
                e.message = "Ya existe un castillo en esta propiedad";
            }
        } else {
            e.result = false;
            e.message = "No se puede construir castillos en propiedades del banco";
        }

        return e;
    }

    demolishHouse() {
        let e = new Object();

        if (this.houses.length > 0) {
            if (!this.isMortgage) {
                this.houses[0].makeDeed(undefined);
                this.houses[0].buildingOn(undefined);
                this.houses.shift();
                this.defineRental();
                e.result = true;
            } else {
                e.result = false;
                e.message = "No se puede demoler en propiedades hipotecadas"
            }
        } else {
            e.result = false;
            e.message = "No hay casas para demoler"
        }

        return e;
    }

    demolishCastle() {
        let e = new Object();

        if (this.hasACastle) {
            if (!this.isMortgage) {
                this.castle.makeDeed(undefined);
                this.castle.buildingOn(undefined);
                this.castle = undefined;
                this.hasACastle = false;
                this.defineRental();
            } else {
                e.result = false;
                e.message = "No se puede demoler en propiedades hipotecadas"
            }
        }
        else {
            e.result = false;
            e.message = "No hay castillo para demoler";
        }

        return e;
    }

    defineRental() {
        if (typeof this.owner !== 'undefined') {
            if (this.hasACastle) {
                this.establisRental(4);
            } else {
                this.establisRental(this.houses.length);
            }
        } else {
            this.establisRental(-1);
        }
    }

    establisRental(id) {
        switch (id) {
            case -1:
                this.rental = 0;
                break;

            case 0:
                if (this.zoneBenefits && !this.isMortgage) {
                    this.rental = this.baseRental * 2;
                } else {
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
                if (this.zoneBenefits && !this.isMortgage) {
                    this.rental = this.rentalWhitACastle * 2;
                } else {
                    this.rental = this.rentalWhitACastle;
                }
        }
    }

    establishBenefits() {
        this.zoneBenefits = true;
        this.defineRental();
    }

    removeBenefits() {
        this.zoneBenefits = false;
        this.defineRental();
    }

    toString() {
        return "Title";
    }

}

class Line extends EstateProperty {
    constructor(id, name, price, basePassage, image) {
        super(id, name, price, image);
        this.basePassage = basePassage;
        this.passage = 0;
    }

    definePassage(passageValue) {
        this.passage = passageValue;
    }

    toString() {
        return "Line";
    }
}

class CustomsPost extends EstateProperty {
    constructor(id, name, price, baseToll, image) {
        super(id, name, price, image);
        this.baseToll = baseToll;
        this.toll = 0;
    }

    defineToll(tollValue) {
        this.toll = tollValue;
    }

    toString() {
        return "CustomsPost";
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

    makeDeed(newOwner) {
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

        if (this.isUniqueName(playerName) && this.money >= (INITIAL_BALANCE + this.players.length * SALARY)) {
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

    isUniqueName(playerName) {
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

    paySalary(playerName) {
        if (this.money >= SALARY) {
            let player = recoveryPlayer(playerName);
            player.cashDeposit(SALARY);
            this.money -= SALARY;
            return true;
        }

        return false;
    }

    cashDeposit(playerName, amount) {
        //Este metodo lo que hace es validar que el balance no supere en ingun momento
        //el dinero total que puede estar en circulacion
        console.log("Metodo llamado con los parametros (" + playerName + ", " + amount);
        let balance = this.money + amount;
        let player = recoveryPlayer(playerName);

        if (balance <= BASE_MONEY) {
            console.log("El balance no ha sido superado");

            for (let i = 0; i < this.players.length; i++) {
                balance += this.players[i].money;
            }

            if (balance <= BASE_MONEY) {
                console.log("El balance es: " + balance)
                if (typeof player !== 'undefined') {
                    player.cashDeposit(amount);
                    return true;
                }
            }
        }

        console.log("El balance supera el monto maximo: " + balance);
        return false;
    }

    cashWithdrawal(playerName, amount) {
        let player = recoveryPlayer(playerName);

        if (player.money >= amount) {
            player.cashWithdrawal(amount);
            return true;
        }

        return false;
    }

    cashTransfer(playerSender, playerAddressee, amount) {
        let player1, player2;
        let e = new Object();

        if (playerSender !== playerAddressee) {
            player1 = this.recoveryPlayer(playerSender);
            player2 = this.recoveryPlayer(playerAddressee);
            if(typeof player1 !== 'undefined'){
                if(typeof player2 !== 'undefined'){
                    if (player1.money >= amount) {
                        player1.cashWithdrawal(amount);
                        player2.cashDeposit(amount);
                        e.result = true;
                        e.message = "Transferencia exitosa";
                    }
                    else {
                        e.result = false;
                        e.message = `El jugador ${player1.name} tiene saldo insuficiente`;
                    }    
                }else{
                    e.result = false;
                    e.message = "El destinatario no existe"; 
                }
            }else{
                e.result = false;
                e.message = "El remitente no existe";    
            }
        } else {
            e.result = false;
            e.message = "Tanto el emisor como el receptor son el mismo";
        }

        

        return e;

    }//Fin del metodo

    sellProperty(propertyName, newOwner) {
        //Primero recupero la propiedad que se está tratando de vender y el jugador que quiere
        //comprarla
        let property = this.recoveryProperty(propertyName);
        let buyer = this.recoveryPlayer(newOwner);
        let seller;


        if (typeof property.owner !== 'undefined') {
            console.log("La propiedad es de otro jugador");
            seller = property.owner;
            console.log("No hay soporte para ventas entre jugadores");
        } else {
            console.log("La propiedad es del banco");
            if (buyer.money >= property.price) {
                console.log("Se tiene dinero para comprar la propiedad");

                let price = property.price;
                buyer.cashWithdrawal(price);
                this.money += price;

                console.log("Se descontó el dinero del jugador");

                property.makeDeed(property);
                buyer.addEstateProperty(property);

            } else {
                console.log("El jugador no posee dinero suficiente");
            }
        }



    }

    mortgageProperty(propertyName) {
        //TODO
    }

    withdrawalMortgage(propertyName) {
        //TODO
    }

    buildHouse(titleName) {
        //TODO
    }

    buildCastle(titleName) {
        //TODO
    }

    demolishHouse(titleName) {
        //TODO
    }

    demolishCastle(titleName) {
        //TODO
    }
    //Este metodo verifica el bloque de color pasado como parametros y define los alquileres
    //Este metodo debe ser llamado cuando se venda un titulo, se edifique o destruya un edificio o se hipoteque
    //o des hipoteque una propiedad
    defineRentals(color) {
        //TODO
    }

    definePassages() {
        //TODO
    }

    defineTolls() {
        //TODO
    }

    reloadState() {
        //TODO
    }

    recoveryPlayer(playerName) {
        let player;

        for (let index = 0; index < this.players.length; index++) {
            if (this.players[index].name === playerName) {
                player = this.players[index];
                break;
            }//Fin de if
        }//Fin de for

        return player;
    }//Fin del metodo

    recoveryProperty(propertyName) {
        if (propertyName.includes('Línea')) {
            return this.recoveryLine(propertyName);
        } else if (propertyName.includes('Paso')) {
            return this.recoveryCustomsPots(propertyName);
        } else {
            return this.recoveryTitle(propertyName);
        }
    }

    recoveryTitle(titleName) {
        let title;
        for (let index = 0; index < this.titles.length; index++) {
            if (this.titles[index].name === titleName) {
                title = this.titles[index];
                break;
            }//Fin de if
        }//Fin de for

        return title;
    }//Fin del metodo

    recoveryLine(lineName) {
        let line;
        for (let index = 0; index < this.lines.length; index++) {
            if (this.lines[index].name === lineName) {
                line = this.lines[index];
                break;
            }//Fin de if
        }//Fin de for

        return line;
    }//Fin del metodo

    recoveryCustomsPots(customsName) {
        let customs;
        for (let index = 0; index < this.customsPosts.length; index++) {
            if (this.customsPosts[index].name === customsName) {
                customs = this.customsPosts[index];
                break;
            }
        }

        return customs;

    }//Fin del metodo
}//Fin de la clase

