import testalpacadocs from '@api/testalpacadocs';

// Set the base URL for the Data API
testalpacadocs.auth('PKI4Y56FE7ERWRFKNFZO', 'Mn5f9cLbqUkaNd0yTPhGtjDBDdKkzxBjWNhzaqWI', {
  base_url: 'https://data.alpaca.markets/v2/stocks/bars'
});

testalpacadocs.stockBars({
  symbols: 'AAPL',
  timeframe: '1Min',
  start: '2024-01-03T01%3A02%3A03.123456789Z',
  end: '2024-01-04T01%3A02%3A03.123456789Z',
  limit: '10',
  adjustment: 'raw',
  feed: 'sip',
  sort: 'asc'
})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err);