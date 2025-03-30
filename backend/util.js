'use strict';

/**
 * converts csv's of prices into a list of prices
 * @param {*} csvString csvData to be parsed
 * @returns list of prices with the most recent sale price at the start of the list
 */
export function csvToArray(csvString) {
    return csvString
        .split("\n")
        .slice(1) 
        .map(row => row.split(",")[1].replace("$", "")) 
        .filter(price => price !== undefined)
        .map(price => parseFloat(price)); 
}

// CSV data of price of NES Super Mario Bro's sales
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

// Test the function 
//const priceList = csvToArray(csvData);
// console.log("Price Data:", priceList);

