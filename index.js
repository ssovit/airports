const fs = require("fs");
try {
  let rawData = JSON.parse(fs.readFileSync("./airports.json"));
  fs.writeFileSync("./airports.json", JSON.stringify(rawData.response));
} catch (e) {
  console.log(e);
}