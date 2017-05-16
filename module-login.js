module.exports = {
  init: function(app) {
    /* --------------------Module Login--------------------------*/
    // login
    app.post('/common/loginPwd', function(req, res) {
      console.log(req.body);
      var email = req.body.emailOrMobile;
      var password = req.body.password;
      console.log(email, password, email == '123@123.com' && password == '123')
      if (email == '123@123.com' && password == '123') {
        res.json({
          "respCode": "_200",
          "result": {
            "status": "PASS",
            "gotoUrl": "http://192.168.2.177:8886/techops?_dt=zXVfgnnlKklWE1XzhqfYss+HMuMHnTrBCBDRWVLG+NgQ="
          }
        })
      } else {
        res.sendStatus(499);
      }
    });

    // logout
    app.get('/ua/logout/:status', function(req, res) {
      console.log(req, req.params.status);
      if (req.params.status == 0) {
        res.sendStatus(204);
      } else {
        res.sendStatus(499);
      }
    });

    // reset password
    app.post('/common/resetPwd', function(req, res) {
      console.log(req.body);
      var password = req.body.password;
      if (password == '123') {
        res.sendStatus(204);
      } else {
        res.sendStatus(499);
      }
    });

    // send Captcha to Email
    app.get('/common/sendCaptchaToEmail/:status', function(req, res) {
      console.log(req, req.params.status);
      if (req.params.status == 0) {
        res.sendStatus(204);
      } else {
        res.sendStatus(499);
      }
    });

    // verify Captch
    app.get('/common/verifyCaptcha/', function(req, res) {
      console.log(req, req.query.captcha);
      if (req.query.captcha == '123') {
        res.sendStatus(204);
      } else {
        res.sendStatus(499);
      }
    });

    // verify Email Captch
    app.get('/common/verifyEmailCaptcha', function(req, res) {
      console.log(req);
      console.log(req.query.emailCaptcha);
      var captcha = req.query.emailCaptcha;
      if (captcha == '123') {
        res.sendStatus(204);
      } else {
        res.sendStatus(499);
      }
    });

    // modify password
    app.post('/action/modifyPwd', function(req, res) {
      console.log(req.body);
      var oldpassword = req.body.oldpassword;
      var newpassword = req.body.newpassword;
      if (oldpassword == '123' && newpassword == '123') {
        res.sendStatus(204);
      } else {
        res.sendStatus(499);
      }
    });
  }
}
