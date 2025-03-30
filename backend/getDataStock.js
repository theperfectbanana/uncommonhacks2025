import axios from 'axios';

const apiKey = 'PKI4Y56FE7ERWRFKNFZO';
const secretKey = 'Mn5f9cLbqUkaNd0yTPhGtjDBDdKkzxBjWNhzaqWI';

export async function getSortedStockValues(ticker, days) {
  try {
    const api = axios.create({
      baseURL: 'https://data.alpaca.markets/v2',
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': secretKey
      }
    });
    
    const response = await api.get('/stocks/bars', {
      params: {
        symbols: ticker,
        timeframe: '1Day',
        start: getPastDate(days),
        end: getPastDate(0),
        limit: days,
        adjustment: 'raw',
        feed: 'sip',
        sort: 'asc'
      }
    });

    // The Alpaca API returns data in a specific format
    // The structure is typically: response.data.bars[ticker]
    const quotes = response.data.bars[ticker] || [];
    
    const bpValues = quotes.map(quote => quote.c); // Extract closing prices
    
    return bpValues.reverse(); // Reverse to get most recent first
  } catch (err) {
    console.error('Error fetching stock quotes:', err.message);
    return [];
  }
}

function getPastDate(n) {
  const date = new Date(); // Create a Date object from the current date
  date.setDate(date.getDate() - n - 1);  // Subtract 'n' days from the current date
  return date.toISOString(); // Return the date in YYYY-MM-DD format
}

// Example usage:
getSortedStockValues('AAPL', 500).then(bpValues => {
  console.log('Sorted BP values for AAPL:', bpValues);
});

console.log(new Date().toISOString());