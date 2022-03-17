const express = require('express')
const fs = require('fs')
const multer = require('multer')
var upload = multer({ dest: './uploads/' })

const app = express()
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index', {fileContent: ''})
})

app.post('/', (req, res) => {
    res.render('index', {fileContent: ''})
})

app.post('/uploadFile', upload.single('cpp_file'), (req, res) => {
    fs.readFile(req.file.path, 'utf-8', function(err,data){
        if(err){
          res.end(err);
        }
        res.render('index', {fileContent: data.toString()});
      });
})

app.listen(5000) ;