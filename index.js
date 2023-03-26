const fs = require("fs");
const lookup = require("country-code-lookup");

try {
  let rawData = JSON.parse(fs.readFileSync("./airports.json"));
  if (rawData.response && rawData.response.length > 0) {
    const airports = rawData.response.map((airport) => {
      const country = lookup.byIso(airport.country_code);
      return {
        iata: airport.iata_code || '',
        icao: airport.icao_code || '',
        name: airport.name || '',
        country: country.country || '',
      };
    });
    fs.writeFileSync("./airports.json", JSON.stringify(airports));
  }
} catch (e) {
  console.log(e);
}
