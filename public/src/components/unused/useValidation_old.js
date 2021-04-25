import React from 'react';

/**
* Check existing input.
* @param {String}   firstName   User entry for first name.
* @param {String}   lastName    User entry for last name.
* @param {String}   userName    User entry for user name.
* @param {String}   email       User entry for email.
* @param {String}   password    User entry for password.
* @param {String}   repassword    User entry for repassword.
* @param {String}   knewpassword    User entry for repassword.
* @param {String}   reknewpassword    User entry for repassword.
*/
export function validateInp(firstName, lastName, userName, email, password, repassword) {
    return {
        firstName: firstName.length === 0,
        lastName: lastName.length === 0,
        userName: userName.length === 0,
        email: email.length === 0,
        password: password.length === 0,
        repassword: repassword.length === 0
    };
}

/**
* Validate characters.
* @param {String}   firstName   User entry for first name.
* @param {String}   lastName    User entry for last name.
* @param {String}   userName    User entry for user name.
* @param {String}   email       User entry for email.
* @param {String}   password    User entry for password.
* @param {String}   street      User entry for street.
* @param {String}   city        User entry for city.
* @param {String}   zipCode     User entry for zipCode.
* @param {String}   country     User entry for country.
*/
export function validateChar(firstName = '', lastName = '', userName = '', email = '', password = '', street = '', city = '', zipCode = '', country = '') {
    const strongStrength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})', 'g');
    const mediumStrength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})', 'g');
    const lowStrength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{4,})', 'g');
    const noStrength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])|(?=.*[0-9])(?=.{2,})', 'g');
    return {
        // eslint-disable-next-line
        firstName: firstName ? !firstName.match(/^[A-ZÀ-Üa-zß-ü]+[\.]?[ \-]?([A-ZÀ-Üa-zß-ü ]*)$/g) : false,           // [^0-9!@#$%^&*()_+\=\[\]{};':"\\|,<>\/?]?
        // eslint-disable-next-line
        lastName: lastName ? !lastName.match(/^[A-ZÀ-Üa-zß-ü]+[\.]?[ \-]?([A-ZÀ-Üa-zß-ü ]*)$/g) : false,
        // eslint-disable-next-line
        userName: userName ? !userName.match(/^([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)$/g) : false,
        // eslint-disable-next-line
        email: email ? !email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) : false,
        // eslint-disable-next-line
        street: street ? !street.match(/^[A-ZÀ-Üa-zß-ü]+[\.]?[ \-]?([A-ZÀ-Üa-zß-ü ]*)$/g) : false,
        // eslint-disable-next-line
        city: city ? !city.match(/^[A-ZÀ-Üa-zß-ü]+[\.]?[ \-]?([A-ZÀ-Üa-zß-ü ]*)$/g) : false,
        // eslint-disable-next-line
        zipCode: zipCode ? !zipCode.match(/^([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)$/g) : false,
        // eslint-disable-next-line
        country: country ? !country.match(/^[A-ZÀ-Üa-zß-ü]+[\.]?[ \-]?([A-ZÀ-Üa-zß-ü ]*)$/g) : false,
        // eslint-disable-next-line
        strongPass: password ? strongStrength.test(password) : false,
        // eslint-disable-next-line
        mediumPass: password ? mediumStrength.test(password) : false,
        // eslint-disable-next-line
        lowPass: password ? lowStrength.test(password) : false,
        // eslint-disable-next-line
        noPass: password ? noStrength.test(password) : false
    };
}