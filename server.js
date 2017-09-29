const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.dev.html'));
});

app.listen(3333, () => {
    console.log('app is running');
});
