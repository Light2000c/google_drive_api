
const multer = require("multer");
const os = require("os");
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');



const KEY_FILE_PATH = path.join(__dirname, '../cred.json');

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
})


const drive = google.drive({
    version: 'v3',
    auth: auth
});


const storage = multer.diskStorage({ destination: os.tmpdir(), filename: (req, file, callback) => callback(null, `${file.originalname}`) });

// const upload = multer({ storage: storage }).single("drive_file");
const upload = multer({ storage: storage }).array("drive_file", 3);




module.exports = {

    UploadToDrive: (req, res) => {

        upload(req, res, async  function (err) {


            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading.");
            }

            try {

                const file = req.file;

                const response =  await drive.files.create({
                    requestBody: {
                        name: file.originalname,
                        mimeType: file.mimeType,
                        parents: ["1qAKI5gV81JErugV-YmAq80Vz7NV-on8L"]
                    },
                    media: {
                        mimeType: file.mimeType,
                        body: fs.createReadStream(file.path)
                    },
                    fields: "id,name"
                });

                console.log(`File uploaded successfully -> ${JSON.stringify(response)}`);

                return res.json({
                    status: 1,
                    message: "success",
                    file_id: response.data.id,
                    file_name: response.data.name
                })


            } catch (err) {
                console.log("Error ==> ", err);
            }

        })
    }
}