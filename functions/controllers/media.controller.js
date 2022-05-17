const path = require('path');
const os = require('os');
const fs = require('fs');
// Imports the Google Cloud client library
const Busboy = require('busboy');
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
      keyFilename: path.join(__dirname, "../config/serviceAccount.json"),
      projectId: "takweed-eg"
});
const BUSCKET_NAME = "gs://takweed-eg.appspot.com/"
const bucket = storage.bucket(BUSCKET_NAME);

exports.uploadFile = async (req, res) => {
      const folder = req.params.folder;
      if (!req.headers['content-type']) {
            res.status(500).send({
                  'error': 'Invalid file',
                  'code': 'invalid_upload_file'
            });
      }
      const busboy = new Busboy({
            headers: req.headers,
            limits: {
                  fileSize: .5 * 1024 * 1024, // max image size to 2 MB
                  files: 1 // Limit to one file upload
            }
      });
      const tmpdir = os.tmpdir();
      let filepath = "";
      const newfile = String(Date.now());
      // This code will process each file uploaded.
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            console.log(`Process File: ${filename}, encoding: ${encoding}, mimetype: ${mimetype}`);
            filename = newfile.concat(filename)
            filepath = path.join(tmpdir, filename);
            const writeStream = fs.createWriteStream(filepath);
            file.pipe(writeStream);
            // chnage Certificates URL 

             // Triggered once all uploaded files are processed by Busboy.
      // We still need to wait for the disk writes (saves) to complete.
      busboy.on('finish', async () => {
            try {
                  const options = {            
                        gzip: true,
                        metadata: {
                              // (If the contents will change, use cacheControl: 'no-cache')
                              cacheControl: 'public, max-age=31536000',
                        },
                  };
                  const data = await storage
                  .bucket(BUSCKET_NAME)
                  .upload(filepath, options)     
                   
                  res.json({
                        'status': 'Upload successful',
                        link : `https://storage.googleapis.com/takweed-eg.appspot.com/${data[0].metadata.name}`,
                        data : data[0].metadata
                  });
            }
            catch (error) {
                  throw new Error(error)
            }
            fs.unlinkSync(filepath);
      });
      }); 
      busboy.end(req.rawBody);
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

exports.removeFile = async (req, res) => {
      const fileName = req.params.file
      try {
            await bucket.file(fileName).delete()
            res.status(200).send({     
                  message : `${fileName} has been deleted`
            });
      } catch (err) {
            console.log(err);
            res.status(500).send({
                  message: err,
            });
      }
};