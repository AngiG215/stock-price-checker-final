'use strict';
require('dotenv').config();
// 1. Cambia a 'test' para que se ejecuten las pruebas funcionales
process.env.NODE_ENV = 'test';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const app = express();

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"]
  }
}));
// Extras de seguridad que ayudan al aprobado
app.use(helmet.xssFilter());
app.use(helmet.noSniff());

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Listening on port " + port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        console.log('Tests are not valid:');
        console.log(e);
      }
    }, 3500);
  }
});

module.exports = app;
