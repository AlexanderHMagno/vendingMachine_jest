const machine = require("../lib/creator");

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
  it("should return the difference if the deposited value is minor than product value", () => {
    expect(() => {
      expect(machine.returnChangeToUser(2, 3)).toEqual(1);
    });
  });
  it("should return the change in an efficient way", () => {
    expect(() => {
      expect(
        machine.fewestNumberOfCoins(machine.returnChangeToUser(2, 4, 88))
      ).toEqual({ "2": 1, "0.5": 1, "0.25": 1, "0.1": 1 });
    });
  });
});
