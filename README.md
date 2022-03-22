# Working-With-Google-Drive-API

I'm using [service account](https://cloud.google.com/iam/docs/service-accounts) for this task.

**Steps:**
1. [Create](https://developers.google.com/workspace/guides/create-project) a project in google cloud console
2. [Enable](https://developers.google.com/workspace/guides/enable-apis) google drive api
3. [Create a Service Account](https://developers.google.com/workspace/guides/create-credentials#service-account)
4. Add a key (JSON) to that service account from the service accounts section. Download the key file.
5. Share a google drive folder with that service account.
6. Follow [nodejs quick start](https://developers.google.com/drive/api/v3/quickstart/nodejs)

**Usage:**
Set parent directory and mimeType in google-drive-functions.js <br>Also, you can modify the function createAndUploadFile to take parendDirectoryID and mimeType as parameters instead of setting them manually.
```js
const fileMetadata = {
    ...
    parents: ['ID_OF_THE_FOLDER_YOU_SHARED_WITH_THE_SERVICE_ACCOUNT']
    ...
  }
 ...
const media = {
    ...
    mimeType: 'text/plain',
    ...
  }
```

imports
```js
const {GoogleAuth} = require('google-auth-library')
const {createAndUploadFile, downloadFileData, deleteFile} = require('./google-drive-functions.js')
```
Authentication
```js
// service account credentials
const keyfile = './KEYFILE.json'
const scopes = ['https://www.googleapis.com/auth/drive']

// authentication
const auth = new GoogleAuth({
  keyFile: keyfile,
  scopes: scopes
})
```
Functions
```js
 // upload and get the file id
 // fileLocalPath is the local path of the file which includes it's local name
 // filename will the name of the file after uploading
 let fileId = await createAndUploadFile(auth, fileLocalPath, filename)
```
```js
// download file data
let fileData = await downloadFileData(auth, fileId)
```
```js
// delete the file from google drive
await deleteFile(auth, fileId)
```
