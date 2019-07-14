const machine = require("../lib/creator");

machine.checkMoneyDepositByUser({ 0.1: 10, 0.25: 200 });
machine.addMoneytoCash();

describe(`When set vending machine, inventory limited by 
capacity and number of slots`, () => {
  it("should have a maximum of units depending on slot info", () => {
    expect(machine.maxInventory()).toEqual(true);
  });
});

describe(`When owner loads the inventory`, () => {
  it(`should return true if the final charge of new items
   respects the max amount of slots (capacity and number) `, () => {
    expect(
      machine.maxInventory({ chocolate: { unit: 1000, value: 6 } })
    ).toEqual(true);
  });
});

describe(`When user buys a product`, () => {
  it("should return an error if we don't have the product in inventory", () => {
    expect(() => machine.userBuyProduct("rice", 0)).toThrowError(
      "We don't have that product in the inventory"
    );
  });
  it("should return the match value, when user deposit coins", () => {
    expect(machine.checkMoneyDepositByUser({ 10: 10, 25: 2 })).toEqual(150);
  });
  it("should return an error, if user doesnt pass the right amount of money", () => {
    expect(() => {
      machine.currentCash.value = 1;
      machine.userBuyProduct("chocolate");
    }).toThrowError("Please deposit more money");
  });
  it("should return an error, if machine doesnt have inventory", () => {
    expect(() => {
      machine.currentCash.value = 10;
      machine.userBuyProduct("Zero");
    }).toThrowError("Sold Out");
  });
});
