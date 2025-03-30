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
        futureStockPrices[i] = ExponentialMovingAverage(previousStockPrices[i], days);
    }

    const dataLength = Math.min(previousItemPrices.length, previousStockPrices[0].length);

    // console.log(transform(previousStockPrices, dataLength));
    // console.log(wrap(previousItemPrices, dataLength))

    const mlr = new MLR(transform(previousStockPrices, dataLength), wrap(previousItemPrices, dataLength));

    // console.log(mlr.predict(futureStockPrices));

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
 * The item prediction function expects a 1D array, but MLR expects a 2D array, so this just turns each element k in previousItemPrices into [k], 
 * and also trims down the data to days + 1
 * @param {} previousItemPrices 
 */
function wrap(previousItemPrices, length){
    let wrappedArray = new Array(length);
    for(let i = 0; i < length; ++i){
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
// export async function handleMultiGroupPredictions(predictionGroups, days = 30) {
//   try {
//     const allResults = {}; // final prediction result
//     for (const groupKey in predictionGroups) {
//       if (Object.hasOwnProperty.call(predictionGroups, groupKey)) {
//         const items = predictionGroups[groupKey];
//         const referenceKeys = groupKey.split(','); // split the keys
//         const referenceStocks = [];

// // fetching old data for the stocks
//         for (const referenceKey of referenceKeys) {
//           try {
//               console.log(referenceKey.trim());
//             const stockData = await getSortedStockValues(referenceKey.trim(), days * 2);
//             referenceStocks.push(stockData);
//           } catch (error) {
//             console.error(`Error fetching reference stock ${referenceKey}:`, error);
//           }
//         }
//         if (referenceStocks.length === 0) {
//           console.error(`No valid reference stocks for group ${groupKey}`);
//           allResults[groupKey] = { error: "No valid reference stocks" };
//           continue;
//         }
//         allResults[groupKey] = {}; // Iterate through all stocks to give predictions
//         for (const itemKey of items) {
//           try {
 
//             const itemData = await getSortedStockValues(itemKey, days * 2);
//             const prediction = predictFuturePrice(referenceStocks, itemData, days);
//             allResults[groupKey][itemKey] = prediction;
            
//             console.log(`Successfully predicted ${itemKey} using ${groupKey}: ${prediction}`);
//           } catch (error) {
//             console.error(`Error predicting ${itemKey} with ${groupKey}:`, error);
//             allResults[groupKey][itemKey] = null;
//           }
//         }
//       }
//     }
    
//     return allResults;
//   } catch (error) {
//     console.error("Error in handleMultiGroupPredictions:", error);
//     throw error;
//   }
// }

let assetStockDic = {
    "NES Cartridge Super Mario Bros": ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL"],
    "SNES Console": ["META", "TSLA", "AMD", "CRM", "ORCL"],
    "Sega Genesis Console": ["IBM", "CSCO", "QCOM", "ADBE"],
    "Pokémon Red Cartridges": ["SAP", "SNPS", "CDNS", "FTNT"],
    "Pokémon Blue Cartridges": ["NET", "NOW"]
  };
  

export async function predictFutureAssetPrice(key, days){
    const correspondingStocks = assetStockDic[key];

    // console.log(correspondingStocks);

    const stockPrices = new Array(correspondingStocks.length );
    // TODO: add code to find assetPrices here
    const assetPrice = assetPrices[key];

    for(let i = 0; i < correspondingStocks.length; ++i)
        stockPrices[i] = await getSortedStockValues(correspondingStocks[i], days + 1);

    // console.log(stockPrices);
    // console.log(assetPrice);

    return predictFuturePrice(stockPrices, assetPrice, days);
}



// NES Cartridge Super Mario Bros CSV data
const csvData1 = `Sell Date,Price
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

//SNES Console CSV data
const csvData2 = `Sell Date,Price
2025-03-05,$102.36
2025-02-04,$186.81
2025-02-04,$105.85
2025-02-03,$56.03
2025-02-02,$109.56
2025-02-02,$192.40
2025-02-01,$77.88
2025-02-01,$155.81
2025-02-01,$93.47
2025-02-01,$72.69
2025-01-21,$156.41
2025-01-21,$137.63
2025-01-12,$73.19
2025-01-10,$250.32
2025-01-01,$217.53
2024-11-29,$82.49
2024-11-09,$283.79
2024-11-05,$64.90
2024-11-02,$83.92
2024-10-13,$126.51
2024-09-29,$100.95
2024-07-29,$53.55
2024-07-21,$54.79
2024-02-04,$111.39
2023-08-23,$312.34
2023-07-12,$332.78
2023-06-15,$190.43
2023-05-03,$186.80`;

//Sega Genesis Model 1 Console csv Data
const csvData3 = `Sell Date,Price
2025-03-24,$255.49
2025-01-26,$219.99
2025-01-20,$269.99
2025-01-19,$124.99
2025-01-17,$90.00
2025-01-04,$299.99
2025-01-03,$80.00
2024-12-26,$79.95
2024-12-14,$250.00
2024-12-08,$77.56
2024-12-04,$109.61
2024-11-26,$129.00
2024-11-20,$150.00
2024-11-15,$199.00
2024-11-12,$89.99
2024-11-03,$50.00
2024-10-30,$164.99
2024-10-12,$128.50
2024-10-05,$275.00
2024-09-29,$108.50
2024-09-29,$74.80
2024-09-20,$75.00
2024-09-09,$399.99
2024-09-07,$375.00
2024-09-07,$239.99
2024-08-31,$150.00
2024-08-28,$155.00
2024-08-25,$134.95
2024-08-23,$64.99`;

//Pokemon Red GameBoy csv Data
const csvData4 = `Sell Date,Price
2025-03-29,$424.99
2025-03-24,$369.89
2025-03-21,$380.00
2025-03-16,$275.00
2025-03-08,$499.99
2025-03-07,$651.00
2025-03-02,$380.00
2025-02-28,$300.00
2025-02-27,$380.00
2025-02-26,$359.99
2025-02-25,$599.00
2025-02-24,$280.00
2025-02-24,$589.99
2025-02-22,$255.00
2025-02-22,$200.00
2025-02-19,$175.00
2025-02-19,$305.00
2025-02-16,$200.00
2025-02-13,$1,499.99
2025-02-13,$240.00
2025-02-09,$299.99
2025-02-09,$299.99
2025-02-06,$529.98
2025-02-04,$277.23
2025-02-02,$259.99
2025-02-02,$355.00
2025-02-01,$499.99
2025-01-31,$265.00
2025-01-31,$399.99
2025-01-25,$450.00`;

//Pokemon Blue GameBoy csv Data
const csvData5 = `Sell Date,Price
2025-03-29,$217.50
2025-03-26,$265.00
2025-03-20,$201.59
2025-03-19,$206.32
2025-03-08,$390.00
2025-03-02,$242.50
2025-02-28,$335.00
2025-02-24,$525.00
2025-02-24,$305.00
2025-02-22,$265.27
2025-02-20,$222.50
2025-02-19,$226.65
2025-02-18,$500.00
2025-02-17,$1,099.94
2025-02-05,$313.00
2025-01-31,$65.00
2025-01-19,$299.00
2025-01-18,$349.99
2025-01-17,$535.00
2025-01-13,$275.00
2025-01-05,$399.99
2024-12-31,$200.00
2024-12-19,$152.50
2024-12-16,$269.95
2024-12-16,$454.00
2024-12-15,$300.00
2024-12-14,$240.00
2024-12-12,$55.00
2024-12-06,$300.00
2024-12-02,$250.00`;

let csv1 = csvToArray(csvData1);
let csv2 = csvToArray(csvData2);
let csv3 = csvToArray(csvData3);
let csv4 = csvToArray(csvData4);
let csv5 = csvToArray(csvData5);

let assetPrices = {
    "NES Cartridge Super Mario Bros": csv1,
    "SNES Console": csv2,
    "Sega Genesis Console": csv3,
    "Pokémon Red Cartridges": csv4,
    "Pokémon Blue Cartridges": csv5
  }
  

// console.log(csvData.slice());


// const stockPrices = [
//     // await getSortedStockValues('AAPL', 500),
//     // await getSortedStockValues('MSFT', 500),
//     // await getSortedStockValues('NVDA', 500),
//     // await getSortedStockValues('AMZN'),
//     // await getSortedStockValues('TSLA'),
//     // await getSortedStockValues('META'),
//     // await getSortedStockValues('BRK.B'),
//     // await getSortedStockValues('JNJ'),
//     // await getSortedStockValues('XOM'),
//     // await getSortedStockValues('JPM'),
//     // await getSortedStockValues('V'),
//     // await getSortedStockValues('PG'),
//     // await getSortedStockValues('UNH'),
//     // await getSortedStockValues('HD'),
//     // await getSortedStockValues('MA'),
//     // await getSortedStockValues('CVX'),
//     // await getSortedStockValues('PFE'),
//     // await getSortedStockValues('ABBV'),
//     // await getSortedStockValues('PEP'),
//     // await getSortedStockValues('KO'),
//     // await getSortedStockValues('COST'),
//     // await getSortedStockValues('DIS'),
//     // await getSortedStockValues('NFLX'),
//     // await getSortedStockValues('ADBE'),
//     // await getSortedStockValues('PYPL'),
//     // await getSortedStockValues('INTC'),
//     // await getSortedStockValues('CSCO'),
//     // await getSortedStockValues('T'),
//     // await getSortedStockValues('VZ'),
//     // await getSortedStockValues('GS'),
//     // await getSortedStockValues('MS'),
//     // await getSortedStockValues('BA'),
//     // await getSortedStockValues('GE'),
//     // await getSortedStockValues('IBM'),
//     // await getSortedStockValues('CAT'),
//     // await getSortedStockValues('MMM'),
//     // await getSortedStockValues('HON'),
//     // await getSortedStockValues('LMT'),
//     // await getSortedStockValues('NKE'),
//     // await getSortedStockValues('SBUX'),
//     // await getSortedStockValues('MDT'),
//     // await getSortedStockValues('AMD'),
//     // await getSortedStockValues('NOW'),
//     // await getSortedStockValues('AMGN'),
//     // await getSortedStockValues('DHR'),
//     // await getSortedStockValues('BMY'),
//     // await getSortedStockValues('LOW'),
//     // await getSortedStockValues('TMO'),
//   ];




// /**
//  * Tests the implementation of the handleMultipleGrouppredictions methdd
//  * @returns A promise object containing prediction results
//  */
// async function testHandleMultiGroupPredictions() {
//   try {
//     const predictionGroups = {
//       "MSFT,AAPL,AMZN": ["GOOGL", "META", "NFLX"],
//       "JPM,GS,V": ["MA", "BAC", "WFC"],
//       "NVDA": ["AMD", "INTC"]
//     };

//     // console.log("Running predictions with groups:");
//     // console.log(JSON.stringify(predictionGroups, null, 2));

//     const days = 30;
//     const results = await handleMultiGroupPredictions(predictionGroups, days);

//     // console.log("\nPrediction Results:");
//     // console.log(JSON.stringify(results, null, 2));

//     let successCount = 0;
//     let failureCount = 0;
    
//     for (const groupKey in results) {
//       // console.log(`\nGroup: ${groupKey}`);
      
//       for (const itemKey in results[groupKey]) {
//         const prediction = results[groupKey][itemKey];
//         if (prediction === null) {
//           // console.log(`  × ${itemKey}: Failed to predict`);
//           failureCount++;
//         } else {
//           // console.log(`  ✓ ${itemKey}: $${prediction.toFixed(2)}`);
//           successCount++;
//         }
//       }
//     }
    
//     // console.log(`\nSuccessful predictions: ${successCount}`);
//     // console.log(`Failed predictions: ${failureCount}`);
//     if (successCount + failureCount > 0) {
//       // console.log(`Success rate: ${(successCount / (successCount + failureCount) * 100).toFixed(2)}%`);
//     }

//     // console.log("\nTest completed!");
//     return results;
//   } catch (error) {
//     // console.error("Test failed with error:", error);
//     throw error;
//   }
// }

// testHandleMultiGroupPredictions()
//   .then(results => {
//     if (results) {
//       // console.log("All predictions complete.");
//     }
//   })
//   .catch(error => {
//     // console.error("Error in test execution:", error);
//   });

// Call the function and store the result
//const priceList = await getSortedStockValues('GOOGL', 500);
//console.log(priceList.length);
// console.log(predictFuturePrice(stockPrices, priceList, 100));
// console.log(await predictFutureAssetPrice('SNES Console', 12));
// console.log(await predictFutureAssetPrice('Sega Genesis Console', 12));
// console.log(await predictFutureAssetPrice('Pokémon Red Cartridges', 12));
// console.log(await predictFutureAssetPrice('Pokémon Blue Cartridges', 12));
for(let i = 1; i < csv2.length; ++i)
    console.log(await predictFutureAssetPrice('SNES Console', i));

