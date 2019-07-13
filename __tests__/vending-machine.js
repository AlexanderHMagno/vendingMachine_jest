const vendingMachineModule = require("../lib/vendingMachine");

describe("when destination is exactly one jump away", () => {
  it("should return 1", () => {
    expect(vendingMachineModule()).toEqual(1);
  });
});
