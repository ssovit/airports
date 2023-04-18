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
      if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data");
      }
      const alt_names = JSON.parse(
        fs.readFileSync("./city_alt_names.json")
      );
      const updated = result.map((item) => {
        let alt_name=item.alt_name;
        try {
          alt_name=`${item.alt_name}, ${alt_names[item.country][item.city]}`;
        } catch (e) {
          //console.log(e);
        }
        alt_name=alt_name.replace(/,\s/g,",").replace(/\s+/g," ").trim(',').split(",").filter(i=>i.length>0);
        
        return {...item,alt_name};
      });
      fs.writeFileSync("./data/airports.json", JSON.stringify(updated));
    });
} catch (e) {
  console.log(e);
}
