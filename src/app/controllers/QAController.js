const QA = require('../model/QAModel')

class QAController {
    index(req, res) {
        QA.find().then(qa => {
            var arr = []
            var arrQiz = []
            var arrSystem = []
            for (var i of qa) {
                if (i.type == false) {
                    var QA2 = new Pending(i.userId, i.title, i.user, i.content, i._id, i.status, i.idQuestionId, i.type)
                    arrSystem.push(QA2)
                } else {
                    var QA1 = new Pending(i.userId, i.title, i.user, i.content, i._id, i.status, i.idQuestionId, i.type)
                    arrQiz.push(QA1)
                }
                var QA = new Pending(i.userId, i.title, i.user, i.content, i._id, i.status, i.idQuestionId, i.type)
                arr.push(QA)
            }
            res.render('pending_request', { QIZ: arrQiz, SYTEM: arrSystem })
        }).catch(e => res.send('Loi ' + e.message))
    }

    //
    //addd
    addQA(req, res) {
        if (req.body.userId == null || req.body.user == null || req.body.content == null) {
            res.json({
                message: 'Cần truyền userId và content, title',
                isSuccess: false
            })
            return
        }
        QA({
            userId: req.body.userId,
            user: req.body.user,
            title: req.body.title,
            content: req.body.content,
            idQuestionId: req.body.idQuestionId,
            type: req.body.type,
            status: req.body.status
        }).save().then(qa => res.json({
            message: "Thanh cong",
            code: 200,
            isSuccess: true,
            data: qa
        })).catch(e => res.json({
            message: e.message,
            code: 404,
            isSuccess: false
        }))
    }

    updateQA(req, res) {
        if (req.body.id == null) {
            res.json({
                message: 'Cần truyền id ',
                isSuccess: false
            })
            return
        }
        QA.findOne({ _id: req.body.id }).then(qa => {
            qa.status = true
            //    res.redirect('/detail_pending?id=' + req.body.id)
            qa.save()
            res.redirect('/nextfeedback?email=' + req.body.username + '&id=' + req.body.id)
        })

    }

    deleteQA(req, res) {
        if (req.body.id == null) {
            res.json({ message: 'Cần truyền params id', status: false })
            return
        }
        QA.deleteOne({ _id: req.body.id }, function (err) {
            if (err) {
                res.json({ message: 'Delete failed', status: false, err: err })
                return
            }
            res.redirect('/pending_request')
        })
    }

    //todo by canhpd
    deltailPending(req, res) {
        if (req.query.id == null) {
            res.json({ message: 'id không được trống' })
            return
        }

        QA.find({ _id: req.query.id }).then(qa => {
            var list = []
            for (var i of qa) {
                var QA = new Pending(i.userId, i.title, i.user, i.content, i._id, i.status, i.idQuestionId, i.type)
                list.push(QA)

            }
            console.log(list)
            res.render('detail_pending', { QA: list })
        }).catch(e => res.json({ status: false, message: 'Lỗi', error: e.message }))
    }
}

class Pending {


    userId
    title
    user
    content
    _id
    status
    idQuestionId
    type


    constructor(userId, title, user, content, id, status, idQuestionId, type) {


        this.userId = userId;
        this.title = title;
        this.user = user;
        this.content = content;
        this._id = id;
        this.status = status;
        this.idQuestionId = idQuestionId;
        this.type = type;
    }
}


module.exports = new QAController()