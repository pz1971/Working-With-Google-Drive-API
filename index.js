const express = require('express')
const fs = require('fs')
const multer = require('multer')
const {google} = require('googleapis')
const {GoogleAuth} = require('google-auth-library')


// submitted files will be stored here
var upload = multer({ dest: './uploads/' })

// service account credentials
const keyfile = './KEYFILE.json'
const scopes = ['https://www.googleapis.com/auth/drive']

const auth = new GoogleAuth({
  keyFile: keyfile,
  scopes: scopes
})

// auth is the authenticated client, fileLocalPath is the path to the file to upload,
// filename will be the name of the file after uploading
const createAndUploadFile = async (auth, fileLocalPath, filename) => {
  // initialize drive service
  const drive = google.drive({version: 'v3', auth})
  
  // 1UdYbKQlap5LhGhqPfXf8BwyDGoOcnb6a is the id of the folder where the file will be uploaded
  const fileMetadata = {
    name: filename,
    parents: ['1UdYbKQlap5LhGhqPfXf8BwyDGoOcnb6a']
  }
  const media = {
    // mimetype is different for different file types
    mimeType: 'text/plain',
    body: fs.createReadStream(fileLocalPath)
  }
  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  })
  console.log(`File ID: ${file.data.id}`)
}

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
        createAndUploadFile(auth, req.file.path, 'test.cpp')
      });
})

app.listen(5000) ;