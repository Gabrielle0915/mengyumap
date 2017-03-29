var path = require('path');
var express = require('express');
var request = require('request');
var app = express();

var GOOGLE_KEY = 'AIzaSyAUskRwMCXWvs6l5EIJu48d7YSsMJjvtws';
var places_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

app.get('/', function (req, res) {
  res.send('Hello World!')
});

// when url match nearby_search, it will implement the function and send the html
app.get('/nearbysearch', function(req, res) {
    res.sendFile(path.join(__dirname + '/templates/nearby_search.html'));
});

// add a url path to avoid 'Access-Control-Allow-Origin' error
app.get('/places-info', function(req, api_res) {
    var radius = req.query.radius ? req.query.radius : 150;
    var params = {
        'key': GOOGLE_KEY,
        'location': req.query.lat + ',' + req.query.lng,
        'radius': radius,
        'type': req.query.type
    };
    // send request to backend
    request({url: places_url, qs: params}, function(err, res, body) {
        // 200 is HTTP Status Code: OK
        if (res.statusCode == 200) {
            console.log(body)
            api_res.json(body)
        }
    });
});

// server should have a function to handle /css and /js in url
app.use('/css', express.static('css'))
app.use('/js', express.static('js'))

app.listen(8080, function() {
    console.log('app started on port 8080');
});
