/* ---------------------------------------- setup ---------------------------------------- */
const express = require('express');
const fs = require('fs');
const cors = require('cors')

const app = express();

app.use(express.static(__dirname + '/public/build'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

// modules
const {checkHubNum} = require('./modules/devicesAuth');

/* ---------------------------------------- post routes ---------------------------------------- */
app.post('/checkhubnum', (req, res) => {
    // 1 serialnumber found
    // 2 serialnumber not found
    // 3 server error
    const num = req.body.num.trim();
    if (num) {
        checkHubNum(num).then(data => {
            res.json(1);
        }).catch(err => {
            // console.log(err);
            if (err === "not found") {
                res.json(2);
            } else {
                res.json(3);
            }
        });
    } else {
        res.json(3);
    }
});

/* ---------------------------------------- use routes ---------------------------------------- */
app.use('/', (req, res) => {
    const html = fs.readFileSync(__dirname + '/public/build/index.html', 'utf-8');
    res.send(html);
});

/* ---------------------------------------- localhost ---------------------------------------- */
app.listen(port, () => {
    console.log(`App is listening to port: ${port}`);
});
