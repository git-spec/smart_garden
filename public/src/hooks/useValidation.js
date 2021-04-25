/**
* Check existing entry into input.
*
* @param    {Object}    input   Entries of inputs.
* @property {String}    var     input.
*
* @return   {Object}    Return object 'input' with values of true or false.
*/
export function validateInp(input) {
    for (let field in input) {
            input[field] = input[field].length === 0;
    };
    return {
        input
    };
}

/**
* Validate characters.
*
* @param    {Object}   user         Inputs of users.
* @property {Array}    name         User entries for letters.
* @property {Array}    char         User entries for user name.
* @property {String}   email        User entry for email.
* @property {Object}   password     User entry for password to check strength.
*
* @return   {Object}   Return object 'user' with values of true or false.
*/
export function validateChar(user = {name: [], char: [], email: null, password: {high: null, medium: null, low: null, base: null}}) {
    // check letters
    if (user.name) {
        user.name.forEach(item => {user.name[user.name.indexOf(item)] = !item.match(/^[A-ZÀ-Üa-zß-ü]+[\.]?[ \-]?([A-ZÀ-Üa-zß-ü ]*)$/g)});
    };
    // check characters
    if (user.char) {
        user.char.forEach(item => {user.char[user.char.indexOf(item)] = !item.match(/^([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)([A-ZÀ-Üa-zß-ü0-9!?@#$: \+\.\-]*)$/g)});
    };
    // check email
    if (user.email) {
        user.email = !user.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };
    // check strength of password
    if (user.password) {
        const highStrength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})', 'g');
        const mediumStrength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})', 'g');
        const lowStrength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{4,})', 'g');
        const baseStrength = new RegExp('^(?=.*[a-z])(?=.*[A-Z])|(?=.*[0-9])(?=.{2,})', 'g');
        if (Object.values(user.password).length) {
            for (const [key, value] of Object.entries(user.password)) {
                switch (key) {
                    case 'high':
                        user.password.high = highStrength.test(value);
                        break;
                    case 'medium':
                        user.password.medium = mediumStrength.test(value);
                        break;
                    case 'low':
                        user.password.low = lowStrength.test(value);
                        break;
                    case 'base':
                        user.password.base = baseStrength.test(value);
                        break;
                    default:
                        break;
                };
            };
        };
    };
    return {
        user
    };
}