export function momentumProjection(historicalPrices, days){
    let momentum = (historicalPrices[0] - historicalPrices[days])/historicalPrices[days];
    return historicalPrices[0] * momentum;
}