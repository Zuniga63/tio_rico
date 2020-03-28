//Conatastes que se guardan al cargar la pagina
const ACTUAL_LOCATION = location.href;
const BASE_MONEY = 300000;
const SALARY = 2000;
const INITIAL_BALANCE = 30000;

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



/********************************************************************
 **    A PARTIR DE AQUI SE DEFINEN LAS FUNCIONES GLOBALES          **
 *********************************************************************/

 //La siguiente funcion solo guarda el nombre del banquero de manera local
 //para que posteriormente pueda ser procesado cuando se recarge en la pagina principal
function createBanker(e){
    let bankerName = document.getElementById('bankerName').value;
    bankerName = bankerName.trim();

    if(bankerName.length!==0){
        localStorage.bankerName = bankerName;
        localStorage.gameSaved = true;
        location.href = "./principal.html";
    }
}

function loadState1(){
    //Primero habilito el boton para reiniciar
    document.getElementById('restar').addEventListener('click', ()=>{
      localStorage.clear();
      location.href = "./index.html";
    });

    //Escribo el nombre del banquero
    document.getElementById('bankerName').innerText="Banquero: " + localStorage.bankerName;


    // document.body.innerHTML = `<h1> Bienvenido ${localStorage.bankerName} </h1>
    // <input type="button" value="Reiniciar" id="reiniciar"/>`;
    // document.getElementById("reiniciar").addEventListener('click', ()=>{
    //     localStorage.clear();
    //     location.href = "./index.html";
    // })
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
    document.getElementById('index__button').addEventListener('click', createBanker);
  } else {
    console.log("Estas en la siguiente direccion: " + ACTUAL_LOCATION);
    //En este punto lo que el programa debe hacer es cargar los datos guardados en localstorage
    loadState1();
  }
});
