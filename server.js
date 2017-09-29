const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'))

app.get('/', function(req, res) {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.dev.html'))
})

app.listen(3333, function() {
    console.log('app is running');
})
