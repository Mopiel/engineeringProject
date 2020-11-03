const Noble = require("noble");
const BeaconScanner = require("node-beacon-scanner");

var scanner = new BeaconScanner();

scanner.onadvertisement = (advertisement) => {
  console.log(advertisement.iBeacon);
  if (
    advertisement &&
    advertisement["iBeacon"] &&
    advertisement["iBeacon"]["uuid"] === "11111111-1111-1111-1111-111111111111"
  )
    console.log(advertisement);
};

scanner
  .startScan()
  .then(() => {
    console.log("Scanning for BLE devices...");
  })
  .catch((error) => {
    console.error(error);
  });

// noble.on("discover", function (peripheral) {
//   var macAddress = peripheral.uuid;
//   var rss = peripheral.rssi;
//   var localName = "jakies";
//   console.log(peripheral.advertisement);
// });

// noble.on("stateChange", () => {
//   console.log("changed");
// });
