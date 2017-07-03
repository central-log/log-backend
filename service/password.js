var minLen = 6, maxLen = 16;

function check(password) {
    if (!password) {
        return false;
    }
    if (password.length > maxLen || password.length < minLen) {
        return false;
    }
    return true;
}

function generate() {
    var password = [];
    var idx, length = 6;
    var randomChar;

    for (idx = 0; idx <= length; idx++) {
        randomChar = parseInt(Math.random() * 26, 10);
        password.push(String.fromCharCode(65 + randomChar));
        password.push(parseInt(Math.random() * 10, 10));
    }
    return password.join('');
}

module.exports = { check: check, generate: generate };
