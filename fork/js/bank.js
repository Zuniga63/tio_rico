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

/**
 * Corresponde a un movimiento financiero ya sea de un jugador o del banco
 */
class Transaction{
  /**
   * @constructor
   * @param {string} description Descripcion
   * @param {number} amount Importe de la transaccion
   */
  constructor(description, amount){
    this.transactionDate = new Date();
    this.description = description;
    this.amount = amount;
  }
}

class Person{
  constructor (money){
    this.money = money;
    this.transactions = [];
  }

  __addTransaction (description, amount){
    this.transactions.push(new Transaction(description, amount));
  }
}

/**
 * Plantilla para crear instancias de jugadores
 */
class Player extends Person{
  /**
   * @constructor
   * @param {numbrer} id Identificador del jugador
   * @param {string} name Nombre del jugador
   */
  constructor(id, name, password) {
    super(0);
    this.id = id;
    this.name = name;
    this.password = password;
  }

  /**
   * Hace un deposito en la cuenta del jugador
   * @param {number} amount Cantidad de efectivo a depositar
   */
  cashDeposit(amount) {
    if (amount > 0) {
      this.money += amount;
      this.__addTransaction("Deposito de efectivo", amount);
      return true;
    }

    return false;
  }

  /**
   * Si el jugador tiene fondos suficientes hace una retido de efectivo
   * @param {number} amount Cantidad de efectivo a retirar
   * @returns {boolean} False si no tiene fondos
   */
  cashWhitdrawal(amount) {
    if (amount > 0 && this.money >= amount) {
      this.money -= amount;
      this.__addTransaction("Retiro de efectivo", -amount);
      return true;
    }

    return false;
  }
}

/**
 * Conrolador de las operaciones con los jugadores y su dinero
 */
class Bank extends Person{
  /**
   * @constructor
   */
  constructor() {
    super(BASE_MONEY);
    this.players = [];
    this.__addTransaction('Constitucion del banco', BASE_MONEY);    
  }

  /**
   * Crea un nuevo jugador y le adiciona el saldo inicial solo si el nombre
   * es una cadena de texto y tiene una longitud mayor o igual a tres
   * @param {string} playerName 
   */
  createNewPlayer(playerName, password) {
    if (typeof playerName === 'string' && playerName.length >= 3) {
      playerName = playerName.trim();
      if(playerName.length >= 3){
        let coincidense = this.players.some(p => p.name.toUpperCase() === playerName.toUpperCase());
        
        if (!coincidense) {
          let newPlayer = new Player(this.players.length + 1, playerName, password);
          //Ahora lo que se hace es depositar el dinero inicial
          if (newPlayer.cashDeposit(INITIAL_BALANCE)) {
            this.money -= INITIAL_BALANCE;
            this.players.push(newPlayer);
            this.__addTransaction('Nuevo Jugador', -INITIAL_BALANCE);
            return true;
          }//Fin de if
        }//Fin de if
      }//Fin de if
    }//Fin de if

    return false;
  }

  paySalary (player){
    if(this.money >= SALARY){
      if(player.cashDeposit(SALARY)){
        this.__addTransaction(`Sueldo a ${player.name}`, -SALARY);
        this.money -= SALARY;
        return true;
      }
    }

    return false;
  }
}