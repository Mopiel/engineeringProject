const WebSocket = require("ws");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket("ws://localhost:8080/");

ws.on("open", function open() {
  ws.send("something");
});

ws.on("message", function incoming(data) {
  console.log(data);
});
