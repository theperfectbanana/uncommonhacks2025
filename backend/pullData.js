'use strict';
import fetch from 'node-fetch'; // If using Node.js v18+, remove this line.

async function getData(ticketer) {
    let encodedTicketer = encodeURIComponent(ticketer);
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodedTicketer}&outputsize=full&datatype=json&apikey=MYQCVHG7IL6Y4TG2`;

    try {
        let response = await fetch(url, { headers: { 'User-Agent': 'request' } });
        let data = await response.json();

        const timeSeries = data["Time Series (Daily)"];
        if (!timeSeries) return [];

        return Object.entries(timeSeries).map(([date, values]) => ({
            date,
            open: parseFloat(values["1. open"]),
            high: parseFloat(values["2. high"]),
            low: parseFloat(values["3. low"]),
            close: parseFloat(values["4. close"]),
            volume: parseInt(values["5. volume"])
        }));
    } catch (err) {
        console.error("Error fetching data:", err);
        return [];
    }
}

// **Example Usage**
(async () => {
    let stockData = await getData('AAPL');
    console.log("Stock Data:", stockData.slice(0, 5)); // ✅ Show first 5 values
})();
