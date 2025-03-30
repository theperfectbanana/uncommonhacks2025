import axios from 'axios';

const apiKey = 'PKI4Y56FE7ERWRFKNFZO';
const secretKey = 'Mn5f9cLbqUkaNd0yTPhGtjDBDdKkzxBjWNhzaqWI';


/**
 * //takes in a string that represents a stock and number of days in the future you want to predict and output a predicted price
 * @param {*} ticker stock ticker
 * @param {*} days days in the future you want to predict
 * @returns float of predicted price of stock
 */
export async function getSortedStockValues(ticker, days) {
  try {
    const api = axios.create({
      baseURL: 'https://data.alpaca.markets/v2',
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey
      }
    });
    
    //call api
    const response = await api.get('/stocks/bars', {
      params: {
        symbols: ticker,
        timeframe: '1Day',
        start: getPastDate(2*days),
        end: getPastDate(1),
        limit: days,
        adjustment: 'raw',
        feed: 'sip',
        sort: 'asc'
      }
    });

    //store closing prices and reverse it to ensure the most recent price is first
    const quotes = response.data.bars[ticker] || [];
    
    const bpValues = quotes.map(quote => quote.c); 
    
    return bpValues.reverse();
  } catch (err) {
    console.error('Error fetching stock quotes:', err.message);
    return [];
  }
}

/**
 * returns date n days ago
 * @param {*} n number of days in the past
 * @returns string of date n days ago
 */
function getPastDate(n) {
  const date = new Date(); 
  date.setDate(date.getDate() - n);  
  return date.toISOString(); 
}

// // Test
// getSortedStockValues('AAPL', 500).then(bpValues => {
//   console.log('Sorted BP values for AAPL:', bpValues);
// });