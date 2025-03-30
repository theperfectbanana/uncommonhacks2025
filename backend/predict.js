import MLR from "ml-regression-multivariate-linear";
import { momentumProjection} from "./predictStock.js";
import { getStockData, csvToArray } from "./pullData.js";
/**
 * @param {array} previousStockPrices in the form [stock][day], length of day doesn't matter, this function takes in any bulk data and transforms it
 * @param {array} previousItemPrices in the form [day]
 * @param {int} days 
 */
function predictFuturePrice(previousStockPrices, previousItemPrices, days){
    let futureStockPrices = Array(previousStockPrices.length);

    for(let i = 0; i < futureStockPrices.length; ++i){
        futureStockPrices[i] = momentumProjection(previousStockPrices[i], days);
    }

    // console.log(futureStockPrices);
    // console.log(previousStockPrices);
    // console.log(transform(previousStockPrices, previousItemPrices.length));

    const mlr = new MLR(transform(previousStockPrices, previousItemPrices.length), wrap(previousItemPrices));

    return mlr.predict(futureStockPrices)[0];
}

/**
 * MLR expects [day][stock], while we like the data as [stock][price], so this function rotates it 
 * Also slices off any additional days of data that's greater that daysLength
 * @param {*} previousStockPrices 
 */
function transform(previousStockPrices, daysLength){
    const rows = daysLength;
    const cols = previousStockPrices.length;
    
    // Initialize with separate arrays for each row
    let transformedStockPrices = Array(rows);
    for (let i = 0; i < rows; i++) {
        transformedStockPrices[i] = Array(cols);
    }

    for(let stock = 0; stock < previousStockPrices.length; ++stock)
        for(let price = 0; price < daysLength; ++price)
            transformedStockPrices[price][stock] = previousStockPrices[stock][price];
        
    
    return transformedStockPrices;
}

/**
 * The item prediction function expects a 1D array, but MLR expects a 2D array, so this just turns each element k in previousItemPrices into [k]
 * @param {} previousItemPrices 
 */
function wrap(previousItemPrices){
    let wrappedArray = new Array(previousItemPrices.length);
    for(let i = 0; i < previousItemPrices.length; ++i){
        wrappedArray[i] = [previousItemPrices[i]];
    }

    return wrappedArray;
}

const stockPrices = [
 await getStockData('AAPL'),
 await  getStockData('MSFT'),
 await  getStockData('NVDA'),
 await  getStockData('GOOGL')
];

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
const priceList = await getStockData('GME');

console.log(predictFuturePrice(stockPrices, priceList, 2));