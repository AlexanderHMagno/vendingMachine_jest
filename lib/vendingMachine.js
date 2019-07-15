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
  /* when the owner set or load the vending machine, inventory will be limited by
   *    capacity and number of slots, owner can't deposit more items than slots or capacity
   * @parameter {NONE}
   * Return {Boolean} true if the all slots hold max the max number of items.
   */
  maxInventory() {
    let newObject = Object.entries(this.inventory)
      .map(x => x[1].unit <= this.machineInfo.slot.capacity)
      .filter(x => x === false).length;
    return newObject === 0;
  }
  /* When user buy a new product, machine will verify:
   *             (inventory, depositedMoney, product exist,add money,return change)
   * @parameter {string} product Name of the product to buy;
   * Return {Boolean}
   */
  userBuyProduct(product) {
    if (!product) throw new Error("Please Verify Your Product input");
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
    this.addMoneytoCash(this.cash, this.currentCash.denomination);
    //6 return change
    let returnCash = returnChangeToUser(pInfo.value, this.currentCash);
    let returnCoins = fewestNumberOfCoins(returnCash);

    //7 update cash (Cash out (change))
    updateCashAfterSell(returnCoins);
    //8 empyt deposited cash
    this.currentCash = 0;
    return pInfo;
  }
  /* When the owner refill the machine (this will verify the new product can be added)
   * @parameter {object} newInventory - Add Inventory to the existing.
   * Return {Boolean} true - if the machine control the maximum product
   *                        chocolate.unit 1000 ->10(max capacity)
   */
  refillInventory(newInventory) {
    if (!newInventory) throw new Error("Please Verify Object newInvetory");
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

  /* This will hold the cash deposited by the user this is not part of the cash (yet)
   * @parameter {object} value- user is gonna deposit a combination of coins
   * Return {Boolean} return the new deposited object
   */
  checkMoneyDepositByUser(value) {
    if (!value) throw new Error("Please Verify your input information");
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

  /* When the machine receives aditional money (owner or customer)
   * @parameter {object} current - Current cash on the machine
   * @parameter {object} newCash - Adittional money that will be added to machine.
   * Return {object} return the new cash object
   */
  addMoneytoCash(current, newCash) {
    if (!(current && newCash))
      throw new Error("Please Verify your input information ");
    let InsertedMoney = Object.keys(newCash);
    for (let x = 0; x < InsertedMoney.length; x++) {
      if (current[InsertedMoney[x]]) {
        current[InsertedMoney[x]] += newCash[InsertedMoney[x]];
      } else {
        current[InsertedMoney[x]] = newCash[InsertedMoney[x]];
      }
    }
    this.cash = current;
    return current;
  }
  /* This function will check the difference between the deposited money and product's price
   * @parameter {number} pValue - product's price.
   * @parameter {number} deposited - money deposited by the user.
   * Return {number} Return the difference between price and deposited money
   */
  returnChangeToUser(pValue, deposited) {
    if (!(pValue && deposited))
      throw new Error("please add the product Value and Deposit");
    if (deposited > pValue) {
      return deposited - pValue;
    } else {
      return 0;
    }
  }
  /* this function will check what's the best possible combination of coins to return
   * @parameter {number} valueToReturn - Difference between the deposited money and product price
   * Return {object} Containing the best possible combination of coins to return
   */
  fewestNumberOfCoins(valueToReturn) {
    if (!valueToReturn) throw new Error("please Add the correct cash Object");
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
  /* It will update the cash parameters when the machine return the surplus to the customers
   * @parameter {object} cashOut - Object holding the type and amount of coins to return
   * Return {None}
   */
  updateCashAfterSell(cashOut) {
    if (!cashOut) throw new Error("please Add the correct cash Object");
    let typeCashOut = Object.keys(cashOut);
    for (let x = 0; x < typeCashOut.length; x++) {
      this.cash[typeCashOut[x]] -= cashOut[typeCashOut[x]];
    }
  }
  /* If the owner wants to reorganize the inventory
   * @parameter {Object} displayedItems - machine Inventory Object
   * @parameter {number} position1 - initial position to swap
   * @parameter {number} positon2 - final position to Swap
   * Return {Object} new Object with swaped positions
   */
  reOrganizeSlots(displayedItems, position1, position2) {
    if (!(displayedItems && position1 & position2))
      throw new Error("Please pass an Object with the swapping positions");

    if (Math.max(position1, position2) > this.machineInfo.slot.numberSlot) {
      return `this machine has ${this.machineInfo.slot.numberSlot} slots`;
    } else {
      let keys = Object.keys(displayedItems);
      for (let x = 0; x < keys.length; x++) {
        if (displayedItems[keys[x]].position === position1) {
          displayedItems[keys[x]].position = position2;
        } else if (displayedItems[keys[x]].position === position2) {
          displayedItems[keys[x]].position = position1;
        }
      }
    }
    return displayedItems;
  }
}

module.exports = vendingMachine;
