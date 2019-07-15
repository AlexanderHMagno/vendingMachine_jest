const MaximumCapacity = require("./validation");

class vendingMachine {
  constructor(machineInfo, inventory, cash) {
    this.machineInfo = machineInfo;
    this.cash = cash;
    this.proccesedInventory = MaximumCapacity(inventory, this.machineInfo.slot);
    this.inventory = this.proccesedInventory.accepted;
    this.currentCash = 0;
  }
  ShowMachine() {
    return this.machineInfo;
  }
  ShowInventory() {
    return this.inventory;
  }
  ShowCash() {
    return this.cash;
  }
  maxInventory() {
    let newObject = Object.entries(this.inventory)
      .map(x => x[1].unit <= this.machineInfo.slot.capacity)
      .filter(x => x === false).length;
    return newObject === 0;
  }
  userBuyProduct(product) {
    let pInfo = this.inventory[product];
    if (pInfo === undefined) {
      throw new Error("We don't have that product in the inventory");
    }
    //1 check if the user, have enough cash,
    if (pInfo.value > this.currentCash.value) {
      throw new Error("Please deposit more money");
    }
    //2 check if product is not available
    if (pInfo.unit < 1) {
      throw new Error("Sold Out");
    }
    //3 return product
    console.log(`Take your ${product} from the dispenser door`);
    //4 rest inventory
    pInfo.unit--;
    //5 add value
    this.addMoneytoCash();
    //6 return change
    let returnCash = returnChangeToUser(pInfo.value, this.currentCash);
    let returnCoins = fewestNumberOfCoins(returnCash);

    //7 update cash (Cash out (change))
    updateInventoryAfterSell(returnCoins);
    return pInfo;
  }
  refillInventory(newInventory) {
    Object.keys(newInventory).map(item => {
      if (this.inventory[item]) {
        this.inventory[item].unit += newInventory[item].unit;
        this.inventory[item].value = newInventory[item].value;
      } else {
        this.inventory[item] = newInventory[item];
      }
    });
    this.inventory = MaximumCapacity(
      this.inventory,
      this.machineInfo.slot
    ).accepted;

    if (
      Object.keys(this.inventory).filter(
        item => item.unit > this.machineInfo.slot.capacity
      ).length === 0
    ) {
      return true;
    }
  }
  checkMoneyDepositByUser(value) {
    if (typeof value === "object") {
      this.currentCash = {
        value: Object.keys(value).reduce((a, c) => {
          return a + c * value[c];
        }, 0),
        denomination: value
      };
    } else {
      this.currentCash.value += value;
    }
    return this.currentCash.value;
  }

  addMoneytoCash() {
    let InsertedMoney = Object.keys(this.currentCash.denomination);
    for (let x = 0; x < InsertedMoney.length; x++) {
      if (this.cash[InsertedMoney[x]]) {
        this.cash[InsertedMoney[x]] += this.currentCash.denomination[
          InsertedMoney[x]
        ];
      } else {
        this.cash[InsertedMoney[x]] = this.currentCash.denomination[
          InsertedMoney[x]
        ];
      }
    }
  }
  returnChangeToUser(pValue, deposited) {
    if (deposited > pValue) {
      return deposited - pValue;
    } else {
      return 0;
    }
  }
  fewestNumberOfCoins(valueToReturn) {
    let objectToReturn = {};
    let OrderedCoins = Object.keys(this.cash).sort((a, b) => b - a);

    for (let x = 0; valueToReturn > 0.1; x++) {
      if (valueToReturn / OrderedCoins[x] < 1) continue;

      objectToReturn[OrderedCoins[x]] = Math.floor(
        valueToReturn / OrderedCoins[x]
      );
      valueToReturn = valueToReturn % OrderedCoins[x];
    }

    return objectToReturn;
  }
  updateInventoryAfterSell(cashOut) {
    let typeCashOut = Object.keys(cashOut);
    for (let x = 0; x < typeCashOut.length; x++) {
      this.cash[typeCashOut[x]] -= cashOut[typeCashOut[x]];
    }
  }
}

module.exports = vendingMachine;
