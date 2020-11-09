const BeaconScanner = require("node-beacon-scanner");
const fetch = require("node-fetch");
const address = require("address");

const device = address.ip();

url = "http://192.168.1.14:4000/graphql";

var scanner = new BeaconScanner();
let array = [];

scanner.onadvertisement = (advertisement) => {
  if (
    !advertisement.iBeacon ||
    advertisement.iBeacon.uuid !== "11111111-1111-1111-1111-111111111111"
  )
    return;
  const { id, address, rssi, iBeacon } = advertisement;
  const { txPower, major, minor } = iBeacon;
  const index = array.findIndex((a) => a.id === major);
  if (index < 0)
    array.push({ id: major, device, rssi: [rssi], txPower, alarmcode: minor });
  else
    array[index] = {
      id: major,
      device,
      rssi: [...array[index].rssi, rssi],
      txPower,
      alarmcode: minor,
    };
};

scanner
  .startScan()
  .then(() => {
    console.log("Scanning for BLE devices...");
  })
  .catch((error) => {
    console.error(error);
  });

const sendData = (name, device, rssi, txpower, alarmcode) => {
  query = `mutation { updateBeacon( name: "${name}", device: "${device}", rssi: ${rssi},txpower: ${txpower}, ,alarmcode: ${alarmcode}) { id } }`;
  console.log(query);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((r) => r.json())
    .then((data) => data);
};

setInterval(() => {
  console.log(array);
  array.map((a) => {
    const avarange =
      Math.floor((100 * a.rssi.reduce((a, b) => a + b, 0)) / a.rssi.length) /
      100;
    sendData(a.id, a.device, avarange, a.txPower, a.alarmcode);
  });
  array = [];
}, 4 * 1000);
