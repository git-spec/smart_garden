/* ***************************************************** SETUP ******************************************************* */
// modules
const {runQuery} = require("./mysqlCon");
const emailSender = require("./emailSender");
var validator = require("validator");
const passwordHash = require("password-hash");

/* ***************************************************** FUNCTIONS ******************************************************* */
// Login with checking the (users mails OR username)
function checkUser(user, password) {
  // console.log("this is the user: " + user + password);
  return new Promise((resolve, reject) => {
    if (validator.isEmail(user)) {
      runQuery(`SELECT * FROM users where email like '${user}'`)
        .then((result) => {
          if (result.length === 0) {
            reject(4);
          } else {
            if (passwordHash.verify(password, result[0].password)) {
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
          // console.log(result);
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
      `INSERT INTO users (firstname, lastname, username, email, password, verified) 
      VALUES ('${firstName}','${lastName}','${userName}','${email}', '${passwordHash.generate(password)}', 0)`
    ).then(() => {
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

// edit user
function editUser(id, firstName, lastName, userName, city, password) {
  return new Promise((resolve, reject) => {
    runQuery(
      `UPDATE users SET users.firstname = '${firstName}', users.lastname = '${lastName}', users.username = '${userName}', users.city = '${city}', users.password = '${passwordHash.generate(password)}' WHERE users.id = ${id}`
    )
      .then((result) => {
        resolve(result);
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

// send verify confirm message
function confirmVerifiedUser(email) {
  return new Promise((resolve, reject) => {
   // email message
        let message = `Thank You For Register,\n`;
        message += "Welcome to our website!\n";
        message +=
          "Your mail is verified now you can login and enjoy\n";
        message += `http://localhost:3000/login`;
        emailSender
          .sendEmail(email, "Confirm Verifying Email", message)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
  });
}

// send link to reset users password
function sendResetLink(email) {
  return new Promise((resolve, reject) => {
    runQuery(
      `SELECT * FROM users where email like '${email}'`
    )
      .then((result) => {
        if (result.length) {
          // email message
               let message = `Click here To reset your password: \n`;
               message += `http://localhost:3000/reset/${result[0].id * 135531}/${email}`;
               emailSender
                 .sendEmail(email, "Reset Password Account", message)
                 .then(() => {
                   resolve();
                 })
                 .catch((error) => {
                   reject(error);
                 });
          resolve(result);
        } else {
          reject(4);
        }
      })
      .catch((err) => {
        reject(2);
      });
  });
}


// UPDATE `users` SET `password`= 1234 WHERE  `email` like 'hamoudshwiri@gmail.com' AND id LIKE 12  ${passwordHash.generate(pass)}
// UPDATE `users` SET `password`= 1234 WHERE  `email` = 'hamoudshwiri@gmail.com' AND id = 12

// send link to reset users password
function resetPass(email, id, pass) {
  return new Promise((resolve, reject) => {
    const Id = id /135531
    runQuery(
      `UPDATE users SET password = '${passwordHash.generate(pass)}' WHERE email like '${email}' and id = ${Id}`
    )
      .then((result) => {
        console.log('here is the result '+ result);
        if (result) {
          // email message
               let message = `We have successfully changed your password\n`;
               message += `you can login now with your new password `;
               message += `http://localhost:3000/login`;
               emailSender
                 .sendEmail(email, "Reset Password is success", message)
                 .then(() => {
                   resolve();
                 })
                 .catch((error) => {
                   reject(error);
                 });
          resolve(result);
        } else {
          reject(4);
        }
      })
      .catch((err) => {
        reject(2);
        console.log(err);
      });
  });
}

/* ***************************************************** EXPORT ******************************************************* */
module.exports = {
  editUser,
  checkUser,
  registerUser,
  verifyUser,
  confirmVerifiedUser,
  sendResetLink,
  resetPass
};
