import MLR from "ml-regression-multivariate-linear";
import { momentumProjection, ExponentialMovingAverage} from "./predictStock.js";
import {  csvToArray } from "./pullData.js";
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

export async function handleMultiGroupPredictions(predictionGroups, days = 30) {
    try {
      const allResults = {};
      for (const groupKey in predictionGroups) {
        if (Object.hasOwnProperty.call(predictionGroups, groupKey)) {
          const items = predictionGroups[groupKey];
          const referenceKeys = groupKey.split(',');
          const referenceStocks = [];

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
          allResults[groupKey] = {};
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

  
//   async function testHandleMultiGroupPredictions() {
//     try {
//       // Sample prediction groups including some potentially invalid tickers
//       const predictionGroups = {
//         // Tech stocks as reference for gaming companies
//         "MSFT,AAPL,NVDA,INVALID1": ["NTDOY", "CCOEY", "KNMCY", "FAKEGAME"],
        
//         // Another group with different reference stocks
//         "GOOGL,AMZN": ["NTDOY", "DIS", "NONEXISTENT"],
        
//         // Test with a single reference stock
//         "NVDA": ["AMD", "INTC"],
        
//         // Completely invalid group
//         "BADSTOCK": ["ALSOFAKE"]
//       };
  
//       console.log("Starting validation of stock tickers...");
//       s
//       const validatedGroups = await validatePredictionGroups(predictionGroups);
      
//       console.log("\nValidation complete.");
//       console.log("Original groups:", Object.keys(predictionGroups).length);
//       console.log("Validated groups:", Object.keys(validatedGroups).length);
     
//       if (Object.keys(validatedGroups).length === 0) {
//         console.log("No valid prediction groups to process. Test aborted.");
//         return null;
//       }
      
//       console.log("\nRunning predictions with validated groups:");
//       console.log(JSON.stringify(validatedGroups, null, 2));

//       const days = 30;
//       const results = await handleMultiGroupPredictions(validatedGroups, days);

//       console.log("\nPrediction Results:");
//       console.log(JSON.stringify(results, null, 2));
  
//       let successCount = 0;
//       let failureCount = 0;
      
//       for (const groupKey in results) {
//         console.log(`\nGroup: ${groupKey}`);
        
//         for (const itemKey in results[groupKey]) {
//           const prediction = results[groupKey][itemKey];
//           if (prediction === null) {
//             console.log(`  × ${itemKey}: Failed to predict`);
//             failureCount++;
//           } else {
//             console.log(`  ✓ ${itemKey}: $${prediction.toFixed(2)}`);
//             successCount++;
//           }
//         }
//       }
      
//       console.log(`\nSuccessful predictions: ${successCount}`);
//       console.log(`Failed predictions: ${failureCount}`);
//       console.log(`Success rate: ${(successCount / (successCount + failureCount) * 100).toFixed(2)}%`);
  
//       console.log("\nTest completed!");
//       return results;
//     } catch (error) {
//       console.error("Test failed with error:", error);
//       throw error;
//     }
//   }
  
  
//   testHandleMultiGroupPredictions()
//     .then(results => {
//       if (results) {
//         console.log("All predictions complete.");
//       }
//     })
//     .catch(error => {
//       console.error("Error in test execution:", error);
//     });









    // export async function stockExists(ticker, timeout = 5000) {
    //     try {
    //       const stockDataPromise = getSortedStockValues(ticker, 1); // Just get 1 day of data to minimize API usage
          
    //       // Create a timeout promise
    //       const timeoutPromise = new Promise((_, reject) => {
    //         setTimeout(() => reject(new Error(`Timeout checking stock ${ticker}`)), timeout);
    //       });
          
    //       // Race the stock data promise against the timeout
    //       const result = await Promise.race([stockDataPromise, timeoutPromise]);
          
    //       // If we got here, the stock data was retrieved successfully
    //       // Additional validation: ensure we got at least one data point
    //       return Array.isArray(result) && result.length > 0;
    //     } catch (error) {
    //       console.warn(`Stock ${ticker} doesn't exist or couldn't be retrieved: ${error.message}`);
    //       return false;
    //     }
    //   }
      
    //   /**
    //    * Filters a prediction group to only include valid stock tickers
    //    * @param {Object} predictionGroups - The prediction groups object
    //    * @returns {Promise<Object>} - Promise resolving to filtered prediction groups
    //    */
    //   export async function validatePredictionGroups(predictionGroups) {
    //     const validatedGroups = {};
        
    //     for (const groupKey in predictionGroups) {
    //       if (Object.hasOwnProperty.call(predictionGroups, groupKey)) {
    //         // Check reference stocks (group keys)
    //         const referenceKeys = groupKey.split(',');
    //         const validReferenceKeys = [];
            
    //         // Validate each reference stock
    //         for (const key of referenceKeys) {
    //           const trimmedKey = key.trim();
    //           if (await stockExists(trimmedKey)) {
    //             validReferenceKeys.push(trimmedKey);
    //           } else {
    //             console.warn(`Reference stock ${trimmedKey} is invalid and will be removed`);
    //           }
    //         }
            
    //         // If we have at least one valid reference stock
    //         if (validReferenceKeys.length > 0) {
    //           const newGroupKey = validReferenceKeys.join(',');
              
    //           // Validate the items to predict
    //           const itemsToCheck = predictionGroups[groupKey];
    //           const validItems = [];
              
    //           for (const item of itemsToCheck) {
    //             if (await stockExists(item)) {
    //               validItems.push(item);
    //             } else {
    //               console.warn(`Item stock ${item} is invalid and will be removed`);
    //             }
    //           }
              
    //           // If we have valid items to predict
    //           if (validItems.length > 0) {
    //             validatedGroups[newGroupKey] = validItems;
    //           }
    //         }
    //       }
    //     }
        
    //     return validatedGroups;
    //   }

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