const path = require('path')
const Program = require('../model/ProgramModel')
const ProgramDetail = require('../model/ProgramDetailModel')
const xlsx = require('xlsx');
const fs = require('fs')


class AddProgramController {
    index(req, res) {
        res.render('add_program')
    }

    importProgram(req, res, next) {
        var imageLink = ''
        if (req.files['image'].length > 0) {
            imageLink = '/uploads/' + req.files['image'][0].filename
        } else {
            imageLink = 'https://firebasestorage.googleapis.com/v0/b/managefood-8ae7b.appspot.com/o/default.png?alt=media&token=a91c3db6-9948-4e18-9e34-2c10ececc527'
        }
        Program({
            name: req.body.name,
            image: imageLink
        }).save().then(program => {
            const workbook = xlsx.readFile(req.files['excel_file'][0].path)
            let lessonSheet = workbook.Sheets[workbook.SheetNames[0]]
            var xlData = xlsx.utils.sheet_to_json(lessonSheet);
            for (var data of xlData) {
                ProgramDetail({
                    programId: program._id,
                    title: data.title,
                    content: data.content
                }).save().catch(e => res.json({message: 'Lỗi đọc file excel', error: e}))
            }
            res.redirect('/programs.html')
        })
    }

}


module.exports = new AddProgramController();