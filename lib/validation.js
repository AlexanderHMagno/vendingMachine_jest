/* If we are loading our vending machine it has to have a restriction,
 * if we try to load with more products than the machine can hold should
 * return a message.
 * @param {array} inventory - Hold the inventory to be loaded
 * @param {array} slotInfo - This machine has a maximum number of slots,
 *                              and each slot has a capacity
 * Return {object} Contains the accepted and rejected objects
 * */
function MaximumCapacity(inventory, slotInfo) {
  let accepted = [];
  let rejected = [];
  const inveKeys = Object.keys(inventory);

  for (let x = 0; x < inveKeys.length; x++) {
    if (x < slotInfo.numberSlot) {
      if (inventory[inveKeys[x]].unit > slotInfo.capacity) {
        accepted.push({
          [inveKeys[x]]: {
            unit: slotInfo.capacity,
            value: inventory[inveKeys[x]].value
          }
        });
        rejected.push({
          [inveKeys[x]]: inventory[inveKeys[x]] - slotInfo.capacity
        });
      } else {
        accepted.push({ [inveKeys[x]]: inventory[inveKeys[x]] });
      }
    } else {
      rejected.push({ [inveKeys[x]]: inventory[inveKeys[x]] });
    }
  }
  accepted = accepted.reduce((a, c) => Object.assign(a, c), {});

  rejected = rejected.reduce((a, c) => Object.assign(a, c), {});
  return { accepted: accepted, rejected: rejected };
}

module.exports = MaximumCapacity;
