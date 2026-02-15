const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  test('1. Ver un stock: solicitud GET a /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.property(res.body.stockData, 'price');
        done();
      });
  });

  test('2. Ver una acción y darle me gusta', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, 'AAPL');
        assert.isAtLeast(res.body.stockData.likes, 1);
        done();
      });
  });

  test('3. Ver la misma acción y darle me gusta de nuevo', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body.stockData, 'likes');
        done();
      });
  });

  test('4. Visualizando dos acciones', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: ['MSFT', 'AMZN'] })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData[0].stock, 'MSFT');
        assert.equal(res.body.stockData[1].stock, 'AMZN');
        done();
      });
  });

  test('5. Ver dos acciones y darles "me gusta"', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: ['MSFT', 'AMZN'], like: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.property(res.body.stockData[1], 'rel_likes');
        done();
      });
  });

});