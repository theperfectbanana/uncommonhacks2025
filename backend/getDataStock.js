import axios from 'axios';

const apiKey = 'PKI4Y56FE7ERWRFKNFZO';
const secretKey = 'Mn5f9cLbqUkaNd0yTPhGtjDBDdKkzxBjWNhzaqWI';

export async function getSortedStockValues(ticker) {
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
        start: '2019-01-03T01:02:03.123Z',
        end: '2024-03-19T01:02:03.123Z',
        limit: 500,
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

// Example usage:
// getSortedStockValues('AAPL').then(bpValues => {
//   console.log('Sorted BP values for AAPL:', bpValues);
// });