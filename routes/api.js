'use strict';
const StockModel = require('../models'); // Importamos el modelo
const axios = require('axios');
const crypto = require('crypto'); // Herramienta para consultar precios en internet

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query; // Aquí recibimos el nombre de la acción (ej: goog)
    if (!stock) return res.json({ error: 'no stock provided' });

      const stocks = Array.isArray(stock) ? stock : [stock];
      const anonymizedIp = crypto.createHash('sha256').update(req.ip).digest('hex');
      // Esta función va a buscar el precio a la API de freeCodeCamp
       try{
        const stockData = await Promise.all(stocks.map(async (symbol) => {
        const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
        const latestPrice = response.data.latestPrice || 0;

        let stockRecord = await StockModel.findOne({ stock: symbol.toUpperCase() });
          if (!stockRecord) {
            stockRecord = await StockModel.create({ stock: symbol.toUpperCase(), likes: [] });
          }

          if (like === 'true' && !stockRecord.likes.includes(anonymizedIp)) {
            stockRecord.likes.push(anonymizedIp);
            await stockRecord.save();
          }

          return {
            stock: symbol.toUpperCase(),
            price: latestPrice,
            likes: stockRecord.likes.length
          };
        }));

        // RESPUESTA FINAL
        if (stocks.length === 2) {
          return res.json({ // Usamos return aquí
            stockData: [
              { stock: stockData[0].stock, price: stockData[0].price, rel_likes: stockData[0].likes - stockData[1].likes },
              { stock: stockData[1].stock, price: stockData[1].price, rel_likes: stockData[1].likes - stockData[0].likes }
            ]
          });
        }
        return res.json({ stockData: stockData[0] }); // Y return aquí

      } catch (err) {
        console.error(err);
        return res.json({ error: "error en la base de datos o API" });
      }
    });
};
