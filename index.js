const express = require('express')
const fs = require('fs')
const multer = require('multer')

const {GoogleAuth} = require('google-auth-library')

const {createAndUploadFile, downloadFileData, deleteFile} = require('./google-drive-functions.js')

// submitted files will be stored here
var upload = multer({ dest: './uploads/' })

// service account credentials
const keyfile = './KEYFILE.json'
const scopes = ['https://www.googleapis.com/auth/drive']

// authentication
const auth = new GoogleAuth({
  keyFile: keyfile,
  scopes: scopes
})

const app = express()
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index', {fileContent: ''})
})

app.post('/', (req, res) => {
    res.render('index', {fileContent: ''})
})

app.post('/uploadFile', upload.single('cpp_file'), (req, res) => {
    fs.readFile(req.file.path, 'utf-8', async function(err,data){
      if(err){
          res.end(err);
        }
        // upload and get the file id
        let fileId = await createAndUploadFile(auth, req.file.path, 'test.cpp')
        // download file data
        let fileData = await downloadFileData(auth, fileId)
        res.render('index', {fileContent: fileData.toString()})
        // delete the file from google drive
        await deleteFile(auth, fileId)
      });
})

app.listen(5000) ;