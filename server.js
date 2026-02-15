'use strict';
require('dotenv').config();
process.env.NODE_ENV = 'test';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

// 1. CONFIGURACIÓN DE SEGURIDAD (HELMET)
const helmet = require('helmet');

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
  }
}));

// 2. CONEXIÓN A LA BASE DE DATOS (Mongoose)
// He usado el link que pusiste en tu mensaje
const URI = "mongodb+srv://Angela2026:Angela2026@cluster0.xh78cmq.mongodb.net/?appName=Cluster0";

mongoose.connect(URI)
  .then(() => console.log("¡POR FIN! Conexión exitosa a MongoDB"))
  .catch(err => console.log("Error al conectar:", err));

// 3. MIDDLEWARES
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 4. RUTAS
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

fccTestingRoutes(app);
apiRoutes(app);    
    
app.use(function(req, res, next) {
  res.status(404).type('text').send('Not Found');
});

// 5. INICIO DEL SERVIDOR
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app;
