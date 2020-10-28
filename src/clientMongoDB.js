const mongoClient = require("mongodb").MongoClient;

const url = "mongoose";
const dbname = "projects";

mongoClient.connect(url, {}, (error, client) => {
  if (error) {
    console.log("Can not connect to the database");
  }
  const db = client.db(dbname);
  const result = db
    .collection("beacon")
    .find({})
    .toArray((error, result) => {
      console.log(result);
    });
});
