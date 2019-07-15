const machine = require("../lib/creator");

describe(`When set vending machine, inventory limited by capacity and number of slots`, () => {
  it("should have a maximum of units depending on slot info", () => {
    expect(machine.maxInventory()).toEqual(true);
  });
});

describe(`When owner loads the inventory`, () => {
  it(`should return true if the final inventory of new items (after function)
   respects the max amount of slots (capacity and number) `, () => {
    expect(
      machine.maxInventory({ chocolate: { unit: 1000, value: 6 } })
    ).toEqual(true);
  });
  it(`should return an object with the new amount of cash Re-supply vending machine change`, () => {
    expect(
      machine.addMoneytoCash(
        { 0.1: 100, 0.25: 20, 0.5: 20, 1: 20, 2: 20 },
        { 0.1: 100, 1: 20, 2: 40 }
      )
    ).toEqual({ 0.1: 200, 0.25: 20, 0.5: 20, 1: 40, 2: 60 });
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

describe(`When owner reorganize inventory Allow variable products in any slot`, () => {
  it("should change the position of elements ", () => {
    expect(
      machine.reOrganizeSlots(
        {
          chocolate: { unit: 100, value: 2, position: 1 },
          kellogs: { unit: 200, value: 1.25, position: 2 },
          WaterBottle: { unit: 100, value: 1.75, position: 3 },
          Zero: { unit: 0, value: 2, position: 4 }
        },
        2,
        3
      )
    ).toEqual({
      chocolate: { unit: 100, value: 2, position: 1 },
      kellogs: { unit: 200, value: 1.25, position: 3 },
      WaterBottle: { unit: 100, value: 1.75, position: 2 },
      Zero: { unit: 0, value: 2, position: 4 }
    });
  });
});
