const fs = require("fs");
try {
  let rawData = JSON.parse(fs.readFileSync("./airports.json"));
  if (rawData.response && rawData.response.length > 0) {
    fs.writeFileSync("./airports.json", JSON.stringify(rawData.response));
  }
} catch (e) {
  console.log(e);
}
