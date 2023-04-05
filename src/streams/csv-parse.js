import { parse } from "csv-parse";
import fs from "node:fs";

const csvPath = new URL("file.csv", import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 
});

async function csvParser() {

  const linesParse = stream.pipe(csvParse)

  process.stdout.write("start\n");

  for await (const record of linesParse) {
    const [title, description] = record
    console.log(title, description)
    const response = await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })

    console.log(response)

  }

  process.stdout.write("...done\n");
}

csvParser()
