'use strict';
const { stringify } = require('querystring');
var request = require('request');

function getData(ticketer){

    let encodedTicketer = encodeURIComponent(ticketer);

    // replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ticketer+'&interval=5min&outputsize=full&datatype=json&apikey=MYQCVHG7IL6Y4TG2';

    console.log(`Ticketer: ${ticketer}`); // Check if ticketer is correctly assigned
    console.log(`URL: ${url}`);

    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {
        console.log('Error:', err);
        } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        } else {
        // data is successfully parsed as a JSON object:
        console.log(data);
        }
    });
}

getData('AAPL'); // Pass a valid stock symbol