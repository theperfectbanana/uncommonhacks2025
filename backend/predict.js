import MLR from "ml-regression-multivariate-linear";
import { momentumProjection, ExponentialMovingAverage} from "./predictStock.js";
import {  csvToArray } from "./util.js";
import { getSortedStockValues } from "./getDataStock.js";
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



/**
 * this function expects a key from the frontend which is used to predict future prices of other stocks
 * @param {*} predictionGroups A dictionary where keys are seperated through commas
 * @param {*} days no. of days in the future that the prediction is taking place
 * @returns Promise an object that contains the predicted prices for the tocks
 */
export async function handleMultiGroupPredictions(predictionGroups, days = 30) {
  try {
    const allResults = {}; // final prediction result
    for (const groupKey in predictionGroups) {
      if (Object.hasOwnProperty.call(predictionGroups, groupKey)) {
        const items = predictionGroups[groupKey];
        const referenceKeys = groupKey.split(','); // split the keys
        const referenceStocks = [];

// fetching old data for the stocks
        for (const referenceKey of referenceKeys) {
          try {
              console.log(referenceKey.trim());
            const stockData = await getSortedStockValues(referenceKey.trim(), days * 2);
            referenceStocks.push(stockData);
          } catch (error) {
            console.error(`Error fetching reference stock ${referenceKey}:`, error);
          }
        }
        if (referenceStocks.length === 0) {
          console.error(`No valid reference stocks for group ${groupKey}`);
          allResults[groupKey] = { error: "No valid reference stocks" };
          continue;
        }
        allResults[groupKey] = {}; // Iterate through all stocks to give predictions
        for (const itemKey of items) {
          try {
 
            const itemData = await getSortedStockValues(itemKey, days * 2);
            const prediction = predictFuturePrice(referenceStocks, itemData, days);
            allResults[groupKey][itemKey] = prediction;
            
            console.log(`Successfully predicted ${itemKey} using ${groupKey}: ${prediction}`);
          } catch (error) {
            console.error(`Error predicting ${itemKey} with ${groupKey}:`, error);
            allResults[groupKey][itemKey] = null;
          }
        }
      }
    }
    
    return allResults;
  } catch (error) {
    console.error("Error in handleMultiGroupPredictions:", error);
    throw error;
  }
}

const stockPrices = [
    // await getSortedStockValues('AAPL', 500),
    // await getSortedStockValues('MSFT', 500),
    // await getSortedStockValues('NVDA', 500),
    // await getSortedStockValues('AMZN'),
    // await getSortedStockValues('TSLA'),
    // await getSortedStockValues('META'),
    // await getSortedStockValues('BRK.B'),
    // await getSortedStockValues('JNJ'),
    // await getSortedStockValues('XOM'),
    // await getSortedStockValues('JPM'),
    // await getSortedStockValues('V'),
    // await getSortedStockValues('PG'),
    // await getSortedStockValues('UNH'),
    // await getSortedStockValues('HD'),
    // await getSortedStockValues('MA'),
    // await getSortedStockValues('CVX'),
    // await getSortedStockValues('PFE'),
    // await getSortedStockValues('ABBV'),
    // await getSortedStockValues('PEP'),
    // await getSortedStockValues('KO'),
    // await getSortedStockValues('COST'),
    // await getSortedStockValues('DIS'),
    // await getSortedStockValues('NFLX'),
    // await getSortedStockValues('ADBE'),
    // await getSortedStockValues('PYPL'),
    // await getSortedStockValues('INTC'),
    // await getSortedStockValues('CSCO'),
    // await getSortedStockValues('T'),
    // await getSortedStockValues('VZ'),
    // await getSortedStockValues('GS'),
    // await getSortedStockValues('MS'),
    // await getSortedStockValues('BA'),
    // await getSortedStockValues('GE'),
    // await getSortedStockValues('IBM'),
    // await getSortedStockValues('CAT'),
    // await getSortedStockValues('MMM'),
    // await getSortedStockValues('HON'),
    // await getSortedStockValues('LMT'),
    // await getSortedStockValues('NKE'),
    // await getSortedStockValues('SBUX'),
    // await getSortedStockValues('MDT'),
    // await getSortedStockValues('AMD'),
    // await getSortedStockValues('NOW'),
    // await getSortedStockValues('AMGN'),
    // await getSortedStockValues('DHR'),
    // await getSortedStockValues('BMY'),
    // await getSortedStockValues('LOW'),
    // await getSortedStockValues('TMO'),
  ];




/**
 * Tests the implementation of the handleMultipleGrouppredictions methdd
 * @returns A promise object containing prediction results
 */
async function testHandleMultiGroupPredictions() {
  try {
    const predictionGroups = {
      "MSFT,AAPL,AMZN": ["GOOGL", "META", "NFLX"],
      "JPM,GS,V": ["MA", "BAC", "WFC"],
      "NVDA": ["AMD", "INTC"]
    };

    // console.log("Running predictions with groups:");
    // console.log(JSON.stringify(predictionGroups, null, 2));

    const days = 30;
    const results = await handleMultiGroupPredictions(predictionGroups, days);

    // console.log("\nPrediction Results:");
    // console.log(JSON.stringify(results, null, 2));

    let successCount = 0;
    let failureCount = 0;
    
    for (const groupKey in results) {
      // console.log(`\nGroup: ${groupKey}`);
      
      for (const itemKey in results[groupKey]) {
        const prediction = results[groupKey][itemKey];
        if (prediction === null) {
          // console.log(`  × ${itemKey}: Failed to predict`);
          failureCount++;
        } else {
          // console.log(`  ✓ ${itemKey}: $${prediction.toFixed(2)}`);
          successCount++;
        }
      }
    }
    
    // console.log(`\nSuccessful predictions: ${successCount}`);
    // console.log(`Failed predictions: ${failureCount}`);
    if (successCount + failureCount > 0) {
      // console.log(`Success rate: ${(successCount / (successCount + failureCount) * 100).toFixed(2)}%`);
    }

    // console.log("\nTest completed!");
    return results;
  } catch (error) {
    // console.error("Test failed with error:", error);
    throw error;
  }
}

testHandleMultiGroupPredictions()
  .then(results => {
    if (results) {
      // console.log("All predictions complete.");
    }
  })
  .catch(error => {
    // console.error("Error in test execution:", error);
  });

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
const priceList = await getSortedStockValues('GOOGL', 500);

console.log(priceList.length);

// console.log(predictFuturePrice(stockPrices, priceList, 100));