const fs = require('fs')
const {google} = require('googleapis')

// create and upload the file to the specific folder in google drive
// auth is the authenticated client, fileLocalPath is the path to the file to upload,
// filename will be the name of the file after uploading
// returns the file id in google drive
exports.createAndUploadFile = async (auth, fileLocalPath, filename) => {
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
  exports.downloadFileData = async (auth, fileId) => {
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
  exports.deleteFile = async (auth, fileId) => {
    // initialize drive service
    const drive = google.drive({version: 'v3', auth})
    // delete the file from google drive
    await drive.files.delete({
      fileId: fileId
    })
  }