import testalpacadocs from '@api/testalpacadocs';

testalpacadocs.auth('PKI4Y56FE7ERWRFKNFZO');
testalpacadocs.auth('Mn5f9cLbqUkaNd0yTPhGtjDBDdKkzxBjWNhzaqWI');

async function getSortedBpValues(ticker) {
  try {
    const start = new Date('2024-01-03T00:00:00Z').toISOString();
    const end = new Date('2025-01-04T09:30:00-04:00').toISOString();

    const quotes = await testalpacadocs.stockBars( {
      symbols: ticker,
      timeframe: '1Min',
      start: start,
      end: end,
      limit: 10,
      adjustment: 'raw',
      feed: 'sip',
      sort: 'asc',
    });

    const bpValues = [];
    for (const quote of quotes) {
      console.log(quote);
      if (quote.BidPrice) {
        bpValues.push(quote.BidPrice);
      }
    }

    return bpValues.reverse(); 
  } catch (err) {
    console.error('Fehler beim Abrufen der Aktienkurse:', err.message);
    return [];
  }
}

// Example usage:
getSortedBpValues('AAPL').then(bpValues => {
  console.log('Sorted BP values for AAPL:', bpValues);
});