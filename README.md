# csvapi
CSV API -- A read only API interface for CSV files

## Usage
CSVAPI is a small node script that creates an API server on a CSV file.  Everyone seems to have a spreadsheet, so this is just an easy way to take that data and make it querieable and sortable over a RESTful API.  This can easily be run in Docker or Lambda and is handy for fairly static, but highly accessed data.  It loads the entire CSV file into memory, but honestly csv files shouldn't get so huge for that to be a problem. 

## Dependencies
This requires the following node modules:

* http -- web host
* fs -- reads the csv file from the filesystem
* csv-parser -- converts the CSV file to a JSON object

## ToDo

* Add additional filters for pagination (size, start and offset)
* Add filter for operation (eq, gt, lt and like)
  
