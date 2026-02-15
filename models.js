const mongoose = require('mongoose');
const { Schema } = mongoose;

const stockSchema = new Schema({
  stock: { type: String, required: true },
  likes: { type: [String], default: [] } // Guardaremos un array de IPs (hasheadas)
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;