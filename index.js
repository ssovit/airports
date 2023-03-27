const fs = require("fs");
const lookup = require("country-code-lookup");
const needle = require("needle");
const csvParser = require("csv-parser");
try {
  let result = [];
  needle
    .get("https://davidmegginson.github.io/ourairports-data/airports.csv")
    .pipe(csvParser())
    .on(
      "data",
      ({
        iata_code,
        iso_country,
        type,
        gps_code,
        name,
        keywords,
        municipality,
      }) => {
        if (iata_code.length > 0) {
          if (
            ["small_airport", "medium_airport", "large_airport"].includes(type)
          ) {
            const { country } = lookup.byIso(iso_country);
            result.push({
              name: name,
              alt_name: keywords,
              country,
              country_code: iso_country,
              city: municipality,
              iata: iata_code,
              icao: gps_code,
            });
          }
        }
      }
    )
    .on("done", (err) => {
      fs.writeFileSync("./data/airports.json", JSON.stringify(result));
    });
} catch (e) {
  console.log(e);
}
