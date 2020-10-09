/* ***************************************************** SETUP ******************************************************* */
// modules
const runQuery = require("./mysqlCon");
const emailSender = require("./emailSender");
var validator = require("validator");
const passwordHash = require("password-hash");

/* ***************************************************** FUNCTIONS ******************************************************* */
// Login with checking the (users mails OR username)
function checkUser(user, password) {
  console.log("this is the user: " + user + password);
  return new Promise((resolve, reject) => {
    if (validator.isEmail(user)) {
      runQuery(`SELECT * FROM users where email like '${user}'`)
        .then((result) => {
          // console.log(result)
          if (result.length === 0) {
            reject(4);
          } else {
            if (passwordHash.verify(password, result[0].password)) {
              // result[0]._id = result[0].id
              if (result[0].verified) {
                resolve(result[0]);
              }
            } else {
              console.log("password wrong");
              reject(3);
            }
          }
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      runQuery(`SELECT * FROM users where username like '${user}'`)
        .then((result) => {
          console.log(result);
          if (result.length === 0) {
            reject(4);
          } else {
            if (passwordHash.verify(password, result[0].password)) {
              if (result[0].verified) {
                resolve(result[0]);
              }
            } else {
              reject(3);
            }
          }
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

// Register users
function registerUser(firstName, lastName, userName, email, password) {
  return new Promise((resolve, reject) => {
    runQuery(
      `INSERT INTO users (firstname, lastname, username, email, password) VALUES ('${firstName}','${lastName}','${userName}','${email}', '${passwordHash.generate(
        password
      )}')`
    )
      .then(() => {
        // resolve()

        // ********************************

        // email message
        let message = `Hello ${firstName} ${lastName},\n`;
        message += "Welcome to our website!\n";
        message +=
          "To verify your email address please click on the following link:\n";
        message += `http://localhost:3000/verify/${email}`;
        // message += `http://www.coding-school.org/verify/${email}`;
        emailSender
          .sendEmail(email, "Verify Email", message)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });

        // ********************************
      })
      .catch((err) => {
        if (err.errno === 1062) {
          reject("exist");
        } else {
          reject(err);
        }
      });
  });
}

// verify user
function verifyUser(email) {
  return new Promise((resolve, reject) => {
    runQuery(
      `UPDATE users SET users.verified = 1 WHERE users.email = '${email}'`
    )
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/* ***************************************************** EXPORT ******************************************************* */
module.exports = {
  checkUser,
  registerUser,
  verifyUser,
};
