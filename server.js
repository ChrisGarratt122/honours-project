/**
 * @Author: Christopher Garratt <chris>
 * @Date: 07/10/2018
 * @Filename: server.js
 * @Last modified by: chris
 * @Last modified time: 26/01/2019
 */

//NPM install express and express session
const express = require('express');
const session = require('express-session');
//NPM install Bootstrap
//const bootstrap = require('bootstrap');
//Creating variable used to initialize express
const app = express();

//Telling express to use the public folder.
app.use(express.static('public'))

//Setting View Engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/content', function(req, res) {
  res.render('pages/content');
});

app.get('/warlds_end', function(req, res) {
  res.render('pages/warlds_end');
});

app.get('/360gallery', function(req, res) {
  res.render('pages/360gallery');
});

app.get('/virtualcity', function(req, res) {
  res.render('pages/virtualcity');
});

app.get('/st_andrews', function(req, res) {
  res.render('pages/st_andrews');
});

app.get('/citymenu', function(req, res) {
  res.render('pages/citymenu');
});

app.get('/gallerymenu', function(req, res) {
  res.render('pages/gallerymenu');
});

app.get('/a-tour', function(req, res) {
  res.render('pages/a-frame-tour');
});

app.listen(8080);
