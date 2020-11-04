const Noble = require("noble");
const BeaconScanner = require("node-beacon-scanner");
const fetch = require("node-fetch");
const address = require('address');
console.log(address.ipv6())

url = "http://192.168.1.14:4000/graphql";

// var scanner = new BeaconScanner();

// scanner.onadvertisement = (advertisement) => {
//   if (advertisement.iBeacon.uuid !== "11111111-1111-1111-1111-111111111111")
//     return;
//   const {id} = advertisement
//   console.log(advertisement);
//   sendData(id,)
// };

// scanner
//   .startScan()
//   .then(() => {
//     console.log("Scanning for BLE devices...");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

const sendData = (name, device, rssi, txpower) => {
  query = `mutation { updateBeacon( name: "${name}", device: "${device}", rssi: ${rssi},txpower: ${txpower}) { id } }`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((r) => r.json())
    .then((data) => console.log("data returned:", data));
};

