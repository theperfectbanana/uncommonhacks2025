require('dotenv').config();
const Alpaca = require('@alpacahq/alpaca-trade-api');

const alpaca = new Alpaca({
  keyId: 'PKI4Y56FE7ERWRFKNFZO',
  secretKey: 'Mn5f9cLbqUkaNd0yTPhGtjDBDdKkzxBjWNhzaqWI',
  paper: true, // Set to false for live trading
});

async function getSortedBpValues(ticker) {
  try {
    const start = new Date('2024-01-03T00:00:00Z').toISOString();
    const end = new Date('2025-01-04T09:30:00-04:00').toISOString();

    const quotes = await alpaca.getQuotesV2(ticker, {
      start,
      end,
      timeframe: '1D',
      limit: 1000,
      feed: 'sip',
      sort: 'asc',
    });

    const bpValues = [];
    for await (let quote of quotes) {
      console.log(quote);
      bpValues.push(quote.BidPrice); // Assuming 'bp' is the bid price
    }

    return bpValues.reverse(); // Reverse to get most recent first
  } catch (err) {
    console.error('Error fetching stock quotes:', err.message);
    return [];
  }
}

// Example usage:
// getSortedBpValues('AAPL').then(bpValues => {
//   console.log('Sorted BP values for AAPL:', bpValues);
// });