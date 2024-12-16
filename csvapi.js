// CSV API -- A read only API interface for CSV files
// Michael Bissell
// https://github.com/bissellator
// December 2024

const http = require('http');
const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = 'text.csv'; // Path to your CSV file

// Function to rename column headers to JSON compliant fieldnames
const tolowercase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Remove non-alphanumeric characters
};

// Define the array to hold parsed data
const jsonData = [];

// Read and parse the CSV file
fs.createReadStream(csvFilePath)
.pipe(
  csv({
    mapHeaders: ({ header }) => tolowercase(header), // Transform headers to lowercase and remove non alphanumeric characters
  })
)
  .on('data', (row) => {
    jsonData.push(row);
  })
  .on('end', () => {
    // Configure reserved query parameters
    var qpRes = ["sortOrder", "sortBy"]

    // Configure available fieldnames from the csv->json object
    var fieldnames = []
    Object.keys(jsonData[0]).forEach(key => {
      fieldnames.push(key)
    });


    // Create the server
    const PORT = 8000; // Change the port if needed
    const server = http.createServer((req, res) => {

    // only supporting GET in this version
    if (req.method === 'GET') {
      res.setHeader('Content-type', 'application/json');
      var payload = jsonData;

      // Get Path Variables and query parameters
      var urlparts = req.url.split("/");
      var queryparams = req.url.split('?')[1]
      var qp = {}
      if (typeof(queryparams) != 'undefined') {
        queryparams = queryparams.split('&')
      }
      else {
        queryparams = []
      }

      // fixes a path ending in ? with no params
      if (queryparams.length == 1 && queryparams[0].length == 0) {queryparams = []}

      // Create a JSON object of the queryparams without reserved words such as sortBy
      var q = 0
      while (q < queryparams.length) {
        var tmp = queryparams[q].split('=')
          qp[tmp[0]] = tmp[1]
        q++
      }

      // Filter JSON object based on fieldname filters in queryparams (e.g. firstname=michael)
      // Defaults to case-insesitive substring
      for (const key of Object.keys(qp)) {
        if (fieldnames.includes(key)) {
          if (!qpRes.includes(key)) {
            payload = payload.filter(item =>
              item[key].toLowerCase().includes(qp[key].toLowerCase())
            );
          }
        }
       else {
         if (!qpRes.includes(key)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `${key} is not a valid field`, validkeys: fieldnames }));
            return; // Ensure the function exits after ending the response
           }
         }
      }

      if (qp.sortBy) {
          payload = payload.sort(function(a, b) {
            if (a[qp.sortBy] < b[qp.sortBy]) return -1;
            if (a[qp.sortBy] > b[qp.sortBy]) return 1;
            return 0;
          });

          // Optionally reverse sort
          if (qp.sortOrder) {
            if (qp.sortOrder === 'desc') {
              payload.reverse();
            }
          }
        }

        res.writeHead(200);
        return res.end(JSON.stringify(payload));
      }
      else {
        res.setHeader('Content-type', 'application/json');
        res.writeHead(405);

        return res.end(JSON.stringify(
          {
            error: "method not supported"
          }
        ));
      }
    });

    // Start the server
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
  });
