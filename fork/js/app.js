const app = new Vue({
  el: '#app',
  data: {
    author: "Andrés Felipe Zuñiga",
    version: "0.1",
    myBank: new Bank(),
    banker: null,
    loby: {
      visible: true,
      bankerName: "Andrés Felipe",
      bankerPassword: "0000"
    },
    views: {
      dashboard: { name: 'Dashboard', icon: 'fas fa-chart-line', visible: false },
      transfer: { name: 'Transferencia', icon: 'fas fa-random', visible: false },
      deposit: { name: 'Transaccion', icon: 'fas fa-money-bill-alt', visible: false },
      sale: { name: 'Ventas y Compras', icon: 'fas fa-cash-register', visible: false },
      awards: { name: 'Premios', icon: 'fas fa-gift', visible: false },
      // taxes: { name: 'Impuestos', icon: 'fas fa-gavel', visible: false },
      // history: { name: 'Historial', icon: 'fas fa-book', visible: false },
      // config: { name: 'Configuración', icon: 'fas fa-tools', visible: false },
    },
    modals: {
      newPlayer: {
        visible: false,
        playerName: "",
        password: "",
      },
    },
    navItems: [
      { name: 'Dashboard', icon: 'fas fa-chart-line', visible: false },
      { name: 'Transferencia', icon: 'fas fa-random' },
      { name: 'Deposito', icon: 'fas fa-money-bill-alt' },
      { name: 'Retiro', icon: 'fas fa-money-bill-alt' },
      { name: 'Ventas', icon: 'fas fa-cash-register' },
      { name: 'Historial', icon: 'fas fa-book' },
      { name: 'Configuración', icon: 'fas fa-tools' },
    ],
  },
  methods: {
    createTheBanker() {
      let result = this.myBank.createNewPlayer(this.loby.bankerName, this.loby.bankerPassword);
      this.banker = this.myBank.players[0];
      this.loby.visible = !result;
      this.views.dashboard.visible = true;
    },
    showMenuCollpased() {
      const mainNavMenuCollapsed = document.getElementById('mainNavMenuCollapsed');
      mainNavMenuCollapsed.classList.toggle('show');
    },
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat('es-Co', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(value);
      return formatted;
    },
    createNewPlayer() {
      let result = false;
      let modal = this.modals.newPlayer;
      let playerName = modal.playerName.trim();
      let password = modal.password.trim();

      result = this.myBank.createNewPlayer(playerName, password);
      if (result) {
        modal.visible = false;
        modal.playerName = "";
        modal.password = "";
      }//Fin de if
    },
    paySalary(player) {
      if(confirm(`Se va a realizar el pago de salario a ${player.name}`)){
        this.myBank.paySalary(player);
      }
    },
    closeNewPlayerModal(){
      this.modals.newPlayer.visible = false;
      this.modals.newPlayer.playerName = '';
      this.modals.newPlayer.password = '';
    },
  },
  computed: {
    bankerIsDefined() {
      let contentName = this.loby.bankerName.trim();
      if (contentName.length >= 3 && this.loby.bankerPassword.length >= 4) {
        return true;
      }

      return false;
    },
    playersMoney() {
      let money = 0;
      this.myBank.players.forEach(player => {
        money += player.money;
      });

      return this.formatCurrency(money);
    },
    validateNewPlayer() {
      let result = false;
      let modal = this.modals.newPlayer;
      let playerName = modal.playerName.trim();
      let password = modal.password.trim();

      if (playerName && playerName.length >= 3 && password && password.length >= 4) {
        result = true
      }//Fin de if
      return result;
    }
  },
  created() {
    this.myBank = new Bank();
    this.createTheBanker();
  }
})
