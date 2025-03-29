'use strict';
import fetch from 'node-fetch'; // If using Node.js v18+, remove this line.

export async function getStockData(ticketer) {
    let encodedTicketer = encodeURIComponent(ticketer);
    var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodedTicketer}&outputsize=full&datatype=json&apikey=MYQCVHG7IL6Y4TG2`;

    try {
        let response = await fetch(url, { headers: { 'User-Agent': 'request' } });
        let data = await response.json();

        const timeSeries = data["Time Series (Daily)"];
        if (!timeSeries) return [];

        return Object.entries(timeSeries)
            .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date descending
            .map(([date, values]) => parseFloat(values["1. open"]));
    } catch (err) {
        console.error("Error fetching data:", err);
        return [];
    }
}

// **Example Usage**
(async () => {
   let stockData = await getStockData('AAPL');
   console.log("Stock Data:", stockData.slice(0, 5)); // ✅ Show first 5 values
})();

export function csvToArray(csvString) {
    return csvString
        .split("\n") // Split rows
        .slice(1) // Remove header
        .map(row => row.split(",")[1].replace("$", "")) // Extract price and remove $
        .filter(price => price !== undefined)
        .map(price => parseFloat(price)); // Convert to float values
}

// Example CSV data
const csvData = `Sell Date,Price
2025-03-29,$9.99
2025-03-28,$27.55
2025-03-27,$2.99
2025-03-26,$12.70
2025-03-26,$10.50
2025-03-26,$2.29
2025-03-26,$17.49
2025-03-24,$9.99
2025-03-23,$23.49
2025-03-22,$12.70
2025-03-19,$15.99
2025-03-17,$39.99
2025-03-16,$17.99
2025-03-15,$16.89
2025-03-15,$14.95
2025-03-14,$19.99
2025-03-14,$20.00
2025-03-13,$17.00
2025-03-13,$39.99
2025-03-12,$33.99
2025-03-11,$15.00
2025-03-11,$20.00
2025-03-10,$10.00
2025-03-10,$34.99
2025-03-09,$22.99
2025-03-09,$26.99
2025-03-09,$16.25
2025-03-09,$10.95
2025-03-09,$23.29
2025-03-09,$10.49`;

// Call the function and store the result
const priceList = csvToArray(csvData);
console.log("Price Data:", priceList); // Output the sorted price list
