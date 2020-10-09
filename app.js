/* ---------------------------------------- setup ---------------------------------------- */
const express = require('express');
const fs = require('fs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const cors = require('cors')

const app = express();

app.use(express.static(__dirname + '/public/build'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

// modules
const {checkHubNum} = require('./modules/devicesAuth');
const {registerUser} = require('./modules/usersAuth')
const {checkUser} = require('./modules/usersAuth')
const {verifyUser} = require('./modules/usersAuth')




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

app.post('/register', (req, res) => {
    // your post register handler here
    // console.log(req.body)
    // 2 data error
    // 1 user registered successfully
    // 3 user is exist
    // 4 server error
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const userName = req.body.userName.trim();
    const email = req.body.email.trim();
    const password = req.body.password;
    const repassword = req.body.repassword;
    if (firstName && lastName && userName && email && password && password == repassword){
        registerUser(entities.encode(firstName), entities.encode(lastName), entities.encode(userName), entities.encode(email), password).then(() => {
            res.json(1)
        }).catch(error => {
            console.log(error);
            if (error == "exist") {
                res.json(3)
            } else {
                res.json(4)
            }
        })
    } else{
            res.json(2)
        };
    
});

app.post('/login', (req, res) => {
    // 1 login success
    // 2 serverError
    // 3 password is wrong
    // 4 user not exist
    if (req.body.email && req.body.password) {
        checkUser(entities.encode(req.body.email.trim()), req.body.password).then(user => {
            // req.session.user = user
            res.json(1)
        }).catch(error => {
            console.log(error);
            if (error == 3) {
                res.json(3)
            } else {
                res.json(4)
            };
        })
    } else {
        res.json(2)
    };
    
});
// verify user
app.post('/verification', (req, res) => {
    verifyUser(req.body.email).then(() => {
        res.json(1);
    //   res.send("You've verified your account!");
    }).catch(err => {
        res.json(2)
      console.log(err);
    });
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
