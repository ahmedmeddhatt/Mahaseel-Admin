const path = require('path');
const os = require('os');
const fs = require('fs');
const Request = require('../models/request.model');

// Imports the Google Cloud client library
const Busboy = require('busboy');
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
      keyFilename: path.join(__dirname, "../config/serviceAccount.json"),
      projectId: "takweed-eg"
});
const bucket = storage.bucket("gs://takweed-certificates");
const fcm = require('../services/fcm.service');

exports.reject = async (req, res , next) => {
      const reqCode = req.params.code;

      try {
            if (!reqCode) {
                  res.status(500).send({
                        'error': 'Invalid code',
                        'code': 'invalid_upload_file'
                  });
            }
            const req = await Request.findOneAndUpdate({ code: reqCode }, { status: "reject", certificate: null }).populate('user');
            let message = " رقم الطلب /  😢نأسف تم الغاء طلبك لتكويد مزرعه ❌" + req.code ;
            fcm.SendByToken(req.user.fcm,message ,
                  {
                        'key': 'screen',
                        'value': 'myCrops'
                  })
            res.json({
                  message
            });
      } catch (error) {
           next(error)
      }
}

exports.uploadFile = async (req, res) => {
      const reqCode = req.params.code;
      if (!req.headers['content-type']) {
            res.status(500).send({
                  'error': 'Invalid file',
                  'code': 'invalid_upload_file'
            });
      }
      const busboy = new Busboy({
            headers: req.headers,
            limits: {
                  fileSize: 2 * 1024 * 1024, // max image size to 2 MB
                  files: 1 // Limit to one file upload
            }
      });
      const tmpdir = os.tmpdir();
      let filepath = "";
      // This code will process each file uploaded.
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            console.log(`Process File: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
            filepath = path.join(tmpdir, filename);
            const writeStream = fs.createWriteStream(filepath);
            file.pipe(writeStream);
            // chnage Certificates URL 
      });
      // Triggered once all uploaded files are processed by Busboy.
      // We still need to wait for the disk writes (saves) to complete.
      busboy.on('finish', async () => {
            try {
                  await uploadToGCP(filepath);
                  let certificateLink = "https://us-central1-takweed-eg.cloudfunctions.net/client/request/" + reqCode + ".pdf";
                  const req = await Request.findOneAndUpdate({ code: reqCode }, { status: "accept", certificate: certificateLink }).populate('user');
                  fcm.SendByToken(req.user.fcm, "تم اصدار شهاده التكويد ✅ عميلنا العزيز يمكنك تحميل الشهادة من داخل التطبيق",
                        {
                              key: 'screen',
                              value: 'myCrops'
                        })
            }
            catch (error) {
                  res.status(500).json({
                        'message': 'error ocure',
                        error
                  });
            }
            fs.unlinkSync(filepath);
      });

      res.json({
            'status': 'Upload successful',
            'download': `https://us-central1-takweed-eg.cloudfunctions.net/admin/cert/download/${reqCode}.pdf`,
      });
      busboy.end(req.rawBody);
};


exports.download = async (req, res) => {
      try {
            const signedUrl = await bucket.file(req.params.name).getSignedUrl({
                  action: 'read',
                  expires: new Date(Date.now() + 20 * 60000),
            });
            res.redirect(signedUrl);
      } catch (err) {
            res.status(500).send({
                  message: "Could not download the file. " + err,
            });
      }
};


exports.getListFiles = async (req, res) => {
      try {
            const [files] = await bucket.getFiles();
            let fileInfos = [];
            files.forEach((file) => {
                  fileInfos.push({
                        name: file.name,
                        url: file.metadata.mediaLink,
                        file
                  });
            });

            res.status(200).send(fileInfos);
      } catch (err) {
            console.log(err);

            res.status(500).send({
                  message: "Unable to read list of files!",
            });
      }
};

async function uploadToGCP(fileName) {

      const options = {
            gzip: true,
            metadata: {
                  // (If the contents will change, use cacheControl: 'no-cache')
                  cacheControl: 'public, max-age=31536000',
            },
      };
      // storage file
      try {
            await storage
                  .bucket("gs://takweed-certificates")
                  .upload(fileName, options)

      } catch (error) {
            console.error(error)
      }
}
