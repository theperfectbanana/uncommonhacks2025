import fs from "fs";
import axios from "axios";

// Load the JSON data
const assets = JSON.parse(fs.readFileSync("retro_game_assets.json", "utf8"));

// Function to find stock symbol and current price by asset ID
function findStockById(assetId) {
  const asset = assets.find((a) => a.id === assetId);
  if (!asset) {
    throw new Error(`Asset with ID ${assetId} not found.`);
  }
  return { stock: asset.stock, currentPrice: asset.current_market_price };
}

// Function to fetch historical stock data from an API
async function fetchStockData(stockSymbol) {
  const apiKey = "a5fdf9dcaed56e19197bcad5f4cd6049"; // Replace with your Marketstack API key
  const url = `http://api.marketstack.com/v1/eod?access_key=${apiKey}&symbols=${stockSymbol}&limit=30`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data || !data.data || data.data.length === 0) {
      throw new Error(`No time series data found for stock: ${stockSymbol}`);
    }

    // Extract closing prices from the last 30 days
    const prices = data.data.map((entry) => entry.close);
    return prices;
  } catch (error) {
    console.error(`Error fetching stock data for ${stockSymbol}:`, error.message);
    throw error;
  }
}

// Function to predict future stock value using momentum logic
function predictStockValue(prices) {
  const recentMomentum =
    (prices[0] - prices[prices.length - 1]) / prices[prices.length - 1];

  // Cap momentum effect to avoid drastic reductions
  const cappedMomentum = Math.max(recentMomentum, -0.05); // Prevent excessive negativity

  const predictedValue = prices[0] * (1 + cappedMomentum);

  // Ensure non-negative stock value
  return Math.max(predictedValue, prices[0]); // Ensure no reduction below current price
}

// Function to get rarity factor by ID
function getRarityFactorById(assetId) {
  // Find the asset object by ID
  const asset = assets.find((item) => item.id === assetId);

  // Check if the asset exists
  if (!asset) {
    throw new Error(`Asset with ID ${assetId} not found.`);
  }

  // Return the rarity factor
  return asset.rarity_factor;
}

// Function to predict asset price based on stock value
function predictAssetPrice(
  currentAssetPrice, // Changed from static "currentPrice" to dynamic "currentAssetPrice"
  predictedStockReturn,
  rarityFactor = 1,
  volatilityFactor = 1.2
) {
  const baselineGrowthRate = rarityFactor * 0.01; 
  const predictedPrice =
    currentAssetPrice * (1 + predictedStockReturn * volatilityFactor) +
    currentAssetPrice * baselineGrowthRate;

  // Ensure non-negative asset price and enforce appreciation over time
  return Math.max(predictedPrice, currentAssetPrice * (1 + baselineGrowthRate));
}

// Main function to calculate predicted asset values over 12 months
async function predictAssetValues(assetId) {
  try {
    // Step 1: Find stock symbol and current price by ID
    const { stock, currentPrice } = findStockById(assetId);

    // Step 2: Fetch historical stock data
    const prices = await fetchStockData(stock);

    // Step 3: Predict monthly asset values for the next 12 months
    let predictedPrices = [];
    let currentAssetPrice = currentPrice; // Initialize with the JSON's current price
    let currentStockPrice = prices[0];

    for (let i = 0; i < 12; i++) {
      // Predict next month's stock price
      const predictedStockPrice = predictStockValue(prices);

      // Calculate stock return (capped to avoid extreme negativity)
      const predictedStockReturn = Math.max(
        (predictedStockPrice - currentStockPrice) / currentStockPrice,
        -0.05 // Cap negative returns at -5%
      );

      // Predict asset price based on PREVIOUS MONTH'S PRICE
      currentAssetPrice = predictAssetPrice(
        currentAssetPrice, // Updated to use dynamic value
        predictedStockReturn,
        getRarityFactorById(assetId)
      );

      // Store predicted asset price
      predictedPrices.push(currentAssetPrice);

      // Update stock prices for next iteration
      currentStockPrice = predictedStockPrice;
      prices.unshift(predictedStockPrice);
    }

    return predictedPrices;
  } catch (error) {
    console.error("Error predicting asset values:", error.message);
    throw error;
  }
}

// Example usage:
(async () => {
  try {
    const assetId = 1; // Replace with desired asset ID
    const predictions = await predictAssetValues(assetId);
    console.log("Predicted Asset Values for the Next 12 Months:", predictions);
  } catch (error) {
    console.error(error.message);
  }
})();
