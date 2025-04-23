const FCM = require('fcm-node');
const {firestore} = require("firebase-admin");
const constance = require('../constance/index')
var serverKey = 'AAAA1B7zZfc:APA91bGq3hOJ-QZmrMtnf5_63KsQvE75_E2HglUoiC3ITPqGrsV8O7IU3o9TOXhS4SGU4xfdmQ-mZcZ_7kxS3NGHVH9AJiz1tzRgZl9vmnk-OvTVh7_51dCEDrZ-VMvIuTvloTFMLngw';
var fcm = new FCM(serverKey);

//todo by canhpd
class NotificationController {
    index(req, res) {
        res.render('notifycation')
    }

    sendNotifiWithUser(req, res) {


        if (req.body.title == null ||
            req.body.body == null) {
            res.json({
                message: 'Cần truyền đủ tham số '
            })
            return
        }
        var message = {
            to: req.body.token,
            notification: {
                title: req.body.title,
                body: req.body.body,
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
            var qa = new QA('Chào bạn ', "Cảm ơn bạn đã gửi báo cáo")
            res.json({
                message: "Thanh cong",
                code: 200,
                isSuccess: true,
                data: qa
            })
        });
    }

    sendNotifiAllUser(req, res) {
        if (req.body.title == null ||
            req.body.text == null) {
            res.json({
                message: 'Cần truyền đủ tham số  '
            })
            return
        }
        var message = {
            to: constance.topic,
            notification: {
                title: req.body.title,
                body: req.body.text,
            },

            data: {
                title: 'ok',
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
            res.redirect('/index.html')
        });
    }

    sendNotifiAll() {

        var message = {
            to: constance.topic,
            notification: {
                title: "JavaLab",
                body: "Bắt đầu bài học hôm nay thôi nào ." +
                    " Hãy luyện tập mỗi ngày bạn nhé !",
            },
            //gửi json
            data: {
                title: 'JavaLab Xin Chào ',
                body: '{"body" : "Bắt đầu bài học hôm nay thôi nào "' +
                    ',"text" : "luyện tập mỗi ngày bạn nhé",' +
                    '"text1" : "0.00035"}'
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


}

class QA {


    title
    body


    constructor(title, body) {
        this.title = title;
        this.body = body;
    }
}


module.exports = new NotificationController()