import MLR from "ml-regression-multivariate-linear";
import { momentumProjection} from "./predictStock.js";

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
    // console.log(transform(previousStockPrices));

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

const x = [
    [200, 100, 50, 3],
    [484,242,121, 3],
    [4000, 2000, 1000, 3],
    [4,2,1, 3]
  ];
  
  // Corresponding asset value changes
  const y = [
   4,2,1
  ];

  console.log(predictFuturePrice(x,y,2));