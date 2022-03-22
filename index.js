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

// create and upload the file to the specific folder in google drive
// auth is the authenticated client, fileLocalPath is the path to the file to upload,
// filename will be the name of the file after uploading
// returns the file id in google drive
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
  // creates the file in google drive
  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  })
  return file.data.id
}

// returns the data of the file stored in google drive given the file id
const downloadFileData = async (auth, fileId) => {
  // initialize drive service
  const drive = google.drive({version: 'v3', auth})
  // get the file data from google drive
  const file = await drive.files.get({
    fileId: fileId,
    alt: 'media'
  })
  return file.data
}

// deletes the specific file from google drive given the file id
const deleteFile = async (auth, fileId) => {
  // initialize drive service
  const drive = google.drive({version: 'v3', auth})
  // delete the file from google drive
  await drive.files.delete({
    fileId: fileId
  })
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