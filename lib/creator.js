const VendingMachineModule = require("./vendingMachine");

/* {object} MachineInfo - 
{code:number, name:string, slot:{capacity:number, numberSlot:number}} */
const MachineInfo = {
  code: 2345,
  name: "Red1",
  slot: { capacity: 10, numberSlot: 4 }
};
/* {object} inventory - {productN:unitN ...} */
const inventory = {
  chocolate: { unit: 100, value: 2, position: 1 },
  kellogs: { unit: 200, value: 1.25, position: 2 },
  WaterBottle: { unit: 100, value: 1.75, position: 3 },
  Zero: { unit: 0, value: 2, position: 4 }
};
/* {object} cash - {valueN:unitN ...} */
const cash = { 0.1: 100, 0.25: 20, 0.5: 20, 1: 20, 2: 20 };

const machine = new VendingMachineModule(MachineInfo, inventory, cash);

module.exports = machine;
