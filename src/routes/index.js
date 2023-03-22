const express = require('express');
const app = express();
const controllers = require('../controllers/index')


app.get('/files/data', controllers.getFileData);

app.get('/files/list', controllers.listFilenames);

module.exports = app;