const Question = require('../model/QuestionModel')
const Lesson = require('../model/LessonModel')

class UpdateQuestionController {
    //show view
    index(req, res) {
        if (req.query.id == null) {
            res.send('Cần truyền Id')
        }
        Question.findOne({_id: req.query.id}).then(ques => {
            var cr = '';
            if (ques.correctAnswer == 1) {
                cr = 'A';
            } else if (ques.correctAnswer == 2) {
                cr = 'B';
            } else if (ques.correctAnswer == 3) {
                cr = 'C';
            } else if (ques.correctAnswer == 4) {
                cr = 'D';
            } else {
                cr = ''
            }
            var a = {
                id: ques._id,
                question: ques.question,
                anA: ques.answer[0],
                anB: ques.answer[1],
                anC: ques.answer[2],
                anD: ques.answer[3],
                correct: cr
            }

            res.render('update_question', {ques: a})
        }).catch(e => res.json(e.message))
    }

    //update
    updateQuestion(req, res) {
        if (req.body.id == null) {
            res.json({message: 'Cần truyền params id', status: false})
            return
        }
        Question.findOne({_id: req.body.id}).then(question => {
            if (question != null) {
                var arr = []
                if (req.body.aA != null && req.body.aA.toString().trim() != '') {
                    arr.push(req.body.aA);
                }
                if (req.body.aB != null && req.body.aB.toString().trim() != '') {
                    arr.push(req.body.aB);
                }
                if (req.body.aC != null && req.body.aC.toString().trim() != '') {
                    arr.push(req.body.aC);
                }
                if (req.body.aD != null && req.body.aD.toString().trim() != '') {
                    arr.push(req.body.aD);
                }
                var cr = question.correctAnswer
                if (req.body.correct == 'A') {
                    cr = 1
                } else if (req.body.correct == 'B') {
                    cr = 2
                } else if (req.body.correct == 'C') {
                    cr = 3
                } else if (req.body.correct == 'D') {
                    cr = 4
                } else {
                    res.send('Correct answer is A,B,C or D')
                    return
                }
                question.question = req.body.question
                question.answer = arr
                question.correctAnswer = cr

                question.save().then(topic => {
                    res.redirect('/lesson.html')
                }).catch(e => res.send('Có lỗi'))
            } else {
                res.send('null roi bạn oi')
            }
        }).catch(e => res.send(e.message))


    }

//todo by canhnamdinh

    loadIndext(req, res) {
        if (req.query.questionId == null) {
            res.send('Cần truyền Id')
        }
        Question.findOne({_id: req.query.questionId}).then(ques => {
            console.log('data :\t' + ques)
            var cr = '';
            if (ques.correctAnswer == 1) {
                cr = 'A';
            } else if (ques.correctAnswer == 2) {
                cr = 'B';
            } else if (ques.correctAnswer == 3) {
                cr = 'C';
            } else if (ques.correctAnswer == 4) {
                cr = 'D';
            } else {
                cr = ''
            }
            var a = {
                id: ques._id,
                question: ques.question,
                anA: ques.answer[0],
                anB: ques.answer[1],
                anC: ques.answer[2],
                anD: ques.answer[3],
                correct: cr
            }

            res.render('update_questionv2', {ques: a, idQA: req.query.idQA, user: req.query.user})
        }).catch(e => res.json(e.message))
    }


}


module.exports = new UpdateQuestionController()