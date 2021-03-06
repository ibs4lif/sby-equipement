var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var okrabyte = require("okrabyte");

// okrabyte.decodeFile("../img/hello_world.png", function(error, data){
//   console.log(data); // Hello World!
// });
var fs = require("fs");
var buffer = fs.readFileSync("../img/hello_world.png");
okrabyte.decodeBuffer(buffer, function(error, data){
  console.log(data); // Hello World!
});

// var ocr = require('colissimo-ocr');
// ocr.guessTextFromImage("../img/hello_world.png", function(err, str) {
//     if (err)
//         console.log('Error: ' + err);
//     else
//         console.log('Text: ' + str);
// });
// ==========================================================================================






// ==========================================================================================

// ==========================================================================================
//Pour convertir les fichier csv en format json
// var transform = require('csv-to-json-stream');
// var fs = require('fs');
// var writeStream= fs .createWriteStream("myOutput.json");
// fs.createReadStream('input.csv')
//   .pipe(transform({
//     delimiter: '\t',
//     map: {
//       'EAN': 0,
//       'SAP': 1,
//       'FRANCAIS': 2,
//       'ENGLISH': 3,
//     },
//     skipHeader: true
//   }))
//   .pipe(writeStream);
//   // .pipe(process.stdout);
// ==========================================================================================

var routes = require('./routes/router');
// var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname + "../../")));
app.use(cors());

app.options('*', cors());


app.use('/',routes);
app.use('/contactlist', routes);
app.use('/departmentList', routes);
app.use('/departmentEmployees', routes);
app.use('/departmentProcedures', routes);
app.use('/departmentQuestions', routes);
app.use('/user', routes);
app.use('/questions', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
