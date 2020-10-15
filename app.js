const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static(__dirname + '/public/build'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const port = process.env.PORT || 5000;

app.use('/', (req, res) => {
    const html = fs.readFileSync(__dirname + '/public/build/index.html', 'utf-8');
    res.send(html);
});

app.listen(port, () => {
    console.log(`App is listening to port: ${port}`);
});


/*
robot.txt
# https://www.robotstxt.org/robotstxt.html
#User-agent: *
#Disallow:

*/ 