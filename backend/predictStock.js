/**
 * Uses Moment Projection (calculating the % difference between two points) to estimate future stock values, better short term
 * @param {*} historicalPrices 
 * @param {*} days 
 * @returns 
 */
export function momentumProjection(historicalPrices, days){
    let momentum = (historicalPrices[0] - historicalPrices[days])/historicalPrices[days];
    return historicalPrices[0] * momentum;
}

/**
 * Uses an Exponential Moving Average to calculate future prices, more stable over the long term
 * @param {*} historicalPrices 
 * @param {*} days 
 * @returns 
 */
export function ExponentialMovingAverage(historicalPrices, days){
    const alpha = 2 / (days + 1); // Smoothing factor
    let closes = historicalPrices.slice(0);
    let ema = closes[0]; // Initialize EMA with the first closing price

    // Apply the EMA formula
    for (let i = 1; i < closes.length; i++) {
        ema = (closes[i] * alpha) + (ema * (1 - alpha));
    }

    console.log(ema);

    return ema;
}