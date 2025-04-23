class LoginController {

    index(req, res) {
        res.render('login')
    }

    login(req, res) {
        if (req.body.email == 'admin' && req.body.password == 'admin') {
            res.redirect('/index.html')
        } else {
            res.render('login', {
                message: 'Username or Password Invalid',
                currentUsername: req.body.email,
                currentPass: req.body.password
            })
        }
    }

}

module.exports = new LoginController()