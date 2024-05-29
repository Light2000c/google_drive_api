
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

        upload(req, res, async function (err) {

            let data = req.body;

            // console.log(data);

            if (!data.firstname || !data.lastname) {
                return res.json({
                    status: "fail",
                    statusText: "Invalid data was sent in the request."
                });
            }

            


            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
            } else if (err) {
                console.log("An unknown error occurred when uploading.");
                return res.json({
                    status: 400,
                    message: "failed",
                })
            }

            console.log("files ==> ", req.files)


            const selfieImage = getFileByName(`${data.firstname}_${data.lastname}_selfieImg.jpg`, req);
            const frontImage = getFileByName(`${data.firstname}_${data.lastname}_frontImg.jpg`, req);
            const backImage = getFileByName(`${data.firstname}_${data.lastname}_backImg.jpg`, req);

            try {

                selfieImageResponse = sendToDrive("1qAKI5gV81JErugV-YmAq80Vz7NV-on8L", selfieImage);
                frontImageResponse = sendToDrive("1qAKI5gV81JErugV-YmAq80Vz7NV-on8L", frontImage);
                backImageResponse = sendToDrive("1qAKI5gV81JErugV-YmAq80Vz7NV-on8L", backImage);


                return res.json({
                    status: 200,
                    message: "success",
                })


            } catch (err) {
                return res.json({
                    status: 400,
                    message: "failed",
                })
            }

        })
    }
}


getFileByName = (name, req) => {
    return req.files.find(file => file.originalname === name);
}


sendToDrive = async (folderId, file) => {
    const response = await drive.files.create({
        requestBody: {
            name: file.originalname,
            mimeType: file.mimeType,
            parents: [`${folderId}`]
            // parents: ["1qAKI5gV81JErugV-YmAq80Vz7NV-on8L"]
        },
        media: {
            mimeType: file.mimeType,
            body: fs.createReadStream(file.path)
        },
        fields: "id,name"
    });

    // console.log(`File uploaded successfully -> ${JSON.stringify(response)}`);
    console.log(`File uploaded successfully -> ${response.data.id}`);
    console.log(`File uploaded successfully -> ${response.data.name}`);

    return response;
}