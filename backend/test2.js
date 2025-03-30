import axios from 'axios';

const apiKey = 'PKI4Y56FE7ERWRFKNFZO';
const secretKey = 'Mn5f9cLbqUkaNd0yTPhGtjDBDdKkzxBjWNhzaqWI';

const api = axios.create({
  baseURL: 'https://data.alpaca.markets/v2',
  headers: {
    'APCA-API-KEY-ID': apiKey,
    'APCA-API-SECRET-KEY': secretKey
  }
});

api.get('/stocks/bars', {
  params: {
    symbols: 'AAPL',
    timeframe: '1Day',
    start: '2024-01-03T01:02:03.123Z',
    end: '2025-01-04T01:02:03.123Z',
    limit: 10,
    adjustment: 'raw',
    feed: 'sip',
    sort: 'asc'
  }
})
.then(response => console.log(response.data.bars.AAPL))
.catch(error => console.error(error));