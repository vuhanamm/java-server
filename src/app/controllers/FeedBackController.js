var nodemailer = require('nodemailer');
const constance = require('../constance/index')
const FCM = require('fcm-node');
const {firestore} = require("firebase-admin");
const User = require("../model/UserModel");

var serverKey = 'AAAA1B7zZfc:APA91bGq3hOJ-QZmrMtnf5_63KsQvE75_E2HglUoiC3ITPqGrsV8O7IU3o9TOXhS4SGU4xfdmQ-mZcZ_7kxS3NGHVH9AJiz1tzRgZl9vmnk-OvTVh7_51dCEDrZ-VMvIuTvloTFMLngw';
var fcm = new FCM(serverKey);

//todo by canhpd
//61b4699433357adc1beb637b device samsung s20
//561k3k12n4k1k212h3hh5124 device xiaomi k40
class FeedBackController {
    index(req, res) {
        res.render('login')
    }

    async adminsendMail(req, res) {
        const transporter = nodemailer.createTransport({
            host: constance.mailHost,
            port: constance.mailPort,
            secure: false,
            auth: {
                user: constance.adminEmail,
                pass: constance.adminPassword
            }
        })

        const options = {
            from: constance.adminEmail, // địa chỉ admin email  dùng để gửi
            to: req.body.email, // địa chỉ gửi đến
            subject: req.body.subject,// Tiêu đề của mail
            html: `
<style>
h3:{
color: #0527fa;
}
</style>
<h4 style="color: #2d4373;font-family: 'Candara'" class="text-primary m-0 font-weight-bold">${req.body.message}</h4>
    <h3 style="color: #2d4373;font-family: 'Candara'">Thank You & Best Regards.</h3>
        <p> ----------------------------------</p>
    <ul>  
      <li style="font-size: larger; color: #f34626;font-style: italic">Admin: Nguyen Hai Dang</li>
      <li style="color: #055ada">Company: JavaLab</li>
      <li style="color: #055ada">Email: dragonfly.javalab@gmail.com</li>
      <li style="color: #055ada">Phone: 0359424773</li>
      <li style="color: #055ada">Address: 1th floor,No.5 Trinh Van Bo,Xuan Phuong ,Nam Tu Liem, Ha Noi, Viet Nam</li>
    </ul>
`
        }

        // 'd2Mz5hmvwBg:APA91bG5h8XZfb-xyQ1C3wHn1Mu6wF1gJ_x0E4ltOtQp2TJL0VDsdM6cRcQFm7G2QueloeDVD90RLLOCWizf5c8TUB-o04mgrJ9kfK5jdW6PBcXsTlkdjJE__slfQ_9q59dT_fNcwIHc'
        if (req.body.tokenDevice != null) {
            var message = {
                to: req.body.tokenDevice,
                notification: {
                    title: constance.title + req.body.username,
                    body: constance.text,
                },

                data: {
                    title: 'success',
                    body: '{"name" : "admin_canhnamdinh"}'
                }
            };

            fcm.send(message, function (err, response) {
                if (err) {
                    console.log("Something has gone wrong!" + err);
                    console.log("Respponse:! " + response);
                } else {
                    console.log("Successfully sent with response: ", response);
                }

            });

        }


        transporter.sendMail(options, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/detail_pending?id=' + req.body.idQA)
            }
        });


    }

    async sendMailFeedBack(req, res) {
        var transport = nodemailer.createTransport({
            host: constance.mailHost,
            port: constance.mailPort,
            service: "Gmail",
            auth: {
                user: constance.adminEmail,
                pass: constance.adminPassword
            }

        });
        const options = {
            from: constance.adminEmail, // địa chỉ admin email  dùng để gửi
            to: req.query.email, // địa chỉ gửi đến
            subject: req.query.subject,// Tiêu đề của mail
            html: constance.auto + constance.autoMess
        }

        transport.sendMail(options, function (error, info) {
            if (error) {
                res.json({
                    code: 404,
                    message: error.message,
                    isSuccess: false,
                })
            } else {
                res.json({
                    code: 200,
                    isSuccess: true,
                    message: 'Success'
                })
            }
        });

    }

    nextFeedBack(req, res) {
        User.findOne({gmail: req.query.email}).then(user => {
            res.render('feedback', {
                email: req.query.email,
                idQA: req.query.id,
                tokenDevice: user.tokenDevice,
                name: user.username
            })
        })


    }
}

module.exports = new FeedBackController();