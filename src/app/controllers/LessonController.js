const path = require('path')
const Lesson = require('../model/LessonModel')
const xlsx = require('xlsx');
const Topic = require('../model/TopicModel')
const Quiz = require('../model/QuizModel')
const Question = require('../model/QuestionModel')
const Process = require('../model/ProcessModel')
const User = require('../model/UserModel');
const UserModel = require('../model/UserModel');

class LessonController {
    async index(req, res) {
        var a = await Lesson.aggregate([
            {
                $lookup: {
                    from: "processes",       // other table name
                    localField: "_id",   // name of users table field
                    foreignField: "lessonId", // name of userinfo table field
                    as: "process"         // alias for userinfo table
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    totalTopic: 1,
                    count: { $size: "$process" },
                }
            }
        ]);
        res.render('lesson', { lesson: a });
    }

    async userLearned(req, res) {
        var process = await Process.find({ lessonId: req.query.lessonId }, { _id: 0, quizMarked: 1, userId: 1, lastModify: 1 }).sort({ quizMarked: -1 });
        var listData = [];
        for (var i of process) {
            var u = await UserModel.findOne({ _id: i.userId });
            if (u != null) {
                listData.push({
                    userId: i.userId,
                    mark: i.quizMarked,
                    username: u.username,
                    date: i.lastModify,
                    avatar: u.imageUrl
                })
            }
        }
        res.render('user-learned', { user: listData })

    }

    //read excel file:
    async importLessonFromExcelFile(req, res, next) {
        const workbook = xlsx.readFile(req.file.path);
        var sheet_name_list = workbook.SheetNames;
        if (sheet_name_list.length != 3) {
            res.send('<h1>File sai định dạng</h1>');
            return;
        }

        try {
            //import lesson
            let lessonSheet = workbook.Sheets[workbook.SheetNames[0]]
            var xlData = xlsx.utils.sheet_to_json(lessonSheet);
            var allLs = await Lesson.find({}, { title: 1, _id: 0 });
            if (allLs != null) {
                for (var zz of allLs) {
                    if (zz.title == xlData[0].title) {
                        res.send('<center> <h2 style="color: red">Lesson has existed</h2> </center>');
                        return;
                    }
                }
            }
            Lesson({
                title: xlData[0].title,
                totalTopic: xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]).length,
            }).save().then((newLesson) => {
                //import quiz:
                Quiz({
                    lessonId: newLesson._id,
                    name: xlData[0].quizName
                }).save().then((newQuiz) => {
                    //import question:
                    const questionSheet = workbook.Sheets[workbook.SheetNames[2]]
                    xlData = xlsx.utils.sheet_to_json(questionSheet);
                    var a = ' kkkkk';

                    for (var i of xlData) {
                        var arr = []
                        if (i.answerA != null && i.answerA.toString().trim() != '') {
                            arr.push(i.answerA);
                        }
                        if (i.answerB != null && i.answerB.toString().trim() != '') {
                            arr.push(i.answerB);
                        }
                        if (i.answerC != null && i.answerC.toString().trim() != '') {
                            arr.push(i.answerC);
                        }
                        if (i.answerD != null && i.answerD.toString().trim() != '') {
                            arr.push(i.answerD);
                        }
                        Question({
                            quizId: newQuiz._id,
                            STT: i.STT,
                            question: i.question,
                            answer: arr,
                            correctAnswer: i.correctAnswer,
                            lessonId: newLesson._id,
                        }).save().catch((error) => {
                            res.status(500).json({
                                success: false,
                                message: e.message,
                            });
                            return;
                        })
                    }
                }).catch((error) => {
                    res.status(500).json({
                        success: false,
                        message: 'Create failed. Please try again.',
                        error: error.message,
                    });
                    return;
                })
                let topicSheet = workbook.Sheets[workbook.SheetNames[1]]
                xlData = xlsx.utils.sheet_to_json(topicSheet);
                for (var i in xlData) {
                    Topic({
                        lessonId: newLesson._id,
                        title: xlData[i].title,
                        content: xlData[i].content
                    }).save().catch((error) => {
                        res.status(500).json({
                            success: false,
                            message: 'Create failed. Please try again.',
                            error: error.message,
                        });
                        return;
                    })
                }
            }).catch((error) => {
                res.status(500).json({
                    success: false,
                    message: 'Create failed. Please try again.',
                    error: error.message,
                });
                return;
            });
            res.redirect('/lesson.html')

        } catch (e) {
            res.json({
                success: false,
                message: 'Create failed. Please try again.',
                error: e.message,
            })
        }
    }


    //detete lesson:
    deleteLesson(req, res, next) {
        if (req.body.id == null) {
            res.json({ message: 'Cần truyền params id', status: false })
            return
        }
        Lesson.deleteOne({ _id: req.body.id }, function (err) {
            if (err) {
                res.json({ message: 'Delete failed', status: false })
                return
            }
            Topic.deleteMany({ lessonId: req.body.id }, function (err) {
                if (err) {
                    res.json({ message: 'Delete failed', status: false })
                    return
                }
            })
            Quiz.findOne({ lessonId: req.body.id }).then(quiz => {
                Quiz.deleteOne({ lessonId: req.body.id }, function (err) {
                    if (err) {
                        res.json({ message: 'Delete failed', status: false })
                        return
                    }
                })
                Question.deleteMany({ quizId: quiz._id }, function (err) {
                    if (err) {
                        res.json({ message: 'Delete failed', status: false })
                        return
                    }
                })
            })

            res.redirect('/lesson.html')
        })
    }

    getAllTopicWithNoFomart(req, res) {
        Topic.find({}).then(topics => {
            res.json({
                isSuccess: true,
                code: 200,
                message: "success",
                data: topics
            })
        }).catch(e => {
            res.json({
                status: false,
                message: e.message,
                code: 404
            })
        })
    }

    async getAllTopic(req, res) {
        try {
            var lessons = await Lesson.find({})
            var listData = []
            for (var i of lessons) {
                const topic = await Topic.find({ lessonId: i._id })
                console.log(topic)
                listData.push({
                    lessonID: i._id,
                    title: i.title,
                    topics: topic
                })
            }
            res.json({
                isSuccess: true,
                code: 200,
                message: "success",
                data: listData
            })
        } catch (e) {
            res.json({
                status: false,
                message: e.message,
                code: 404
            })
        }

    }
    async getAllQuiz(req, res) {
        try {
            const quiz = await Quiz.find()
            var listData = []
            for (var i of quiz) {
                const question = await Question.find({ quizId: i._id }).sort({ STT: 1 })
                listData.push({
                    _id: i._id,
                    lessonId: i.lessonId,
                    name: i.name,
                    question: question
                })
            }
            res.json({
                isSuccess: true,
                code: 200,
                message: "success",
                data: listData
            })
        } catch (e) {
            res.json({
                status: false,
                message: e.message,
                code: 404
            })
        }

    }

    async thongKeUser(req, res) {
        try {
            var data = new Map();
            var process = await Process.find({})
            for (var i of process) {
                if (!data.has(i.lessonId)) {
                    data.set(i.lessonId, 1)
                } else {
                    var count = Number(data.get(i.lessonId)) + 1
                    data.set(i.lessonId, count)
                }
            }

            var listId = []
            data.forEach((value, key) => {
                listId.push(key)
            })

            var listReturn = []
            for (var j of listId) {
                try {
                    var lesson = await Lesson.findOne({ _id: j })
                    if (lesson != null) {
                        listReturn.push({
                            _id: j,
                            title: lesson.title,
                            totalTopic: lesson.totalTopic,
                            activeCount: data.get(j),
                        })
                    }
                } catch (e) {
                    res.json({
                        status: false,
                        message: e.message,
                        code: 404
                    })
                }

            }
            res.json({
                isSuccess: true,
                code: 200,
                message: "success",
                data: listReturn
            })
        } catch (e) {
            res.json({
                status: false,
                message: e.message,
                code: 404
            })
        }
    }

}


class LessonMD {
    title
    topic
    _id
    constructor(title, totalTopic, _id) {
        this.title = title,
            this.totalTopic = totalTopic,
            this._id = _id
    }
}

module.exports = new LessonController()