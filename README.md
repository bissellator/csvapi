# csvapi
CSV API -- A read only API interface for CSV files

## Usage
CSVAPI is a small node script that creates an API server on a CSV file.  Everyone seems to have a spreadsheet, so this is just an easy way to take that data and make it querieable and sortable over a RESTful API.  This can easily be run in Docker or Lambda and is handy for fairly static, but highly accessed data.  It loads the entire CSV file into memory, but honestly csv files shouldn't get so huge for that to be a problem. 

Once up and running you can see the entire csv file rendered as json:

```
GET http://localhost:8000/

[
    {
        "dogname": "Buddy",
        "breed": "Golden Retriever",
        "color": "Golden",
        "dateofbirth": "2022-01-15",
        "favoritetoy": "Tennis Ball"
    },
    {
        "dogname": "Bella",
        "breed": "Labrador Retriever",
        "color": "Black",
        "dateofbirth": "2021-09-23",
        "favoritetoy": "Squeaky Toy"
    },
    {
        "dogname": "Max",
        "breed": "German Shepherd",
        "color": "Brown",
        "dateofbirth": "2023-03-12",
        "favoritetoy": "Frisbee"
    },
    {
        "dogname": "Charlie",
        "breed": "Poodle",
        "color": "White",
        "dateofbirth": "2022-11-07",
        "favoritetoy": "Plush Squirrel"
    }
...
```

You can filter on individual fields with their fieldname:

```
GET http://localhost:8000/?favoritetoy=ball

[
    {
        "dogname": "Buddy",
        "breed": "Golden Retriever",
        "color": "Golden",
        "dateofbirth": "2022-01-15",
        "favoritetoy": "Tennis Ball"
    },
    {
        "dogname": "Oliver",
        "breed": "Poodle",
        "color": "Black",
        "dateofbirth": "2023-02-17",
        "favoritetoy": "Tennis Ball"
    },
    {
        "dogname": "Zoe",
        "breed": "Husky",
        "color": "Gray and White",
        "dateofbirth": "2022-12-25",
        "favoritetoy": "Ball"
...
```
If you enter a filter that is not a supported fieldname you will get an informative error:

```
http://localhost:8000/?kludge=ball

{
    "error": "kludge is not a valid field",
    "validkeys": [
        "dogname",
        "breed",
        "color",
        "dateofbirth",
        "favoritetoy"
    ]
}
```

You can also add which field to sort on and optionally include sortBy=desc to reverse sort:

```
http://localhost:8000/?favoritetoy=ball&sortBy=dogname&sortOrder=desc

[
    {
        "dogname": "Zoe",
        "breed": "Husky",
        "color": "Gray and White",
        "dateofbirth": "2022-12-25",
        "favoritetoy": "Ball"
    },
    {
        "dogname": "Oliver",
        "breed": "Poodle",
        "color": "Black",
        "dateofbirth": "2023-02-17",
        "favoritetoy": "Tennis Ball"
    },
    {
        "dogname": "Lily",
        "breed": "Australian Shepherd",
        "color": "Blue Merle",
        "dateofbirth": "2024-01-11",
        "favoritetoy": "Ball"
    }
...
```
There is no writing to the original files so, POST, PUT, PATCH and DELETE will all reaturn a 405 method not allowed message

## Files

* csvapi.js -- nodejs script that reads the csv file and presents it as a queryable restful API in JSON
* text.csv -- sample csv file (sorry not a lot of variation in that thing)

## Dependencies
This requires the following node modules:

* http -- web host
* fs -- reads the csv file from the filesystem
* csv-parser -- converts the CSV file to a JSON object

## ToDo

* Add additional filters for pagination (size, start and offset)
* Add filter for operation (eq, gt, lt and like)
  
