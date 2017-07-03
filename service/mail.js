var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: global.AppConfig.mail.host,
    port: global.AppConfig.mail.port,
    secure: !!(global.AppConfig.mail.port === 465), // secure:true for port 465, secure:false for port 587
    auth: {
        user: global.AppConfig.mail.username,
        pass: global.AppConfig.mail.password
    }
});

// // setup email data with unicode symbols
// var mailOptions = {
//     from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
//     to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world ?', // plain text body
//     html: '<b>Hello world ?</b>' // html body
// };
function errorHandler(error, info) {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
}
function send(mailOptions, callback) {
  // send mail with defined transport object
    mailOptions.from = '"' + global.AppConfig.mail.senderName + '" <' + global.AppConfig.mail.username + '>';
    transporter.sendMail(mailOptions, callback || errorHandler);
}

module.exports = { send: send };
