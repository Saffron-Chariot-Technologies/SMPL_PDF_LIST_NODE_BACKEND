const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const accessKeyId ="AKIAVZ6E5QCDEKTIX46H";
const secretAccessKey ="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";
const region ="ap-south-1";
const bucket ="smpl-pdf";

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
    region: region,
});

const s3Storage = multerS3({
    s3: s3,
    bucket: bucket,
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

const upload_images = multer({
    storage: s3Storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 10 MB size limit
    // },
    // fileFilter: (req, file, cb) => {
    //     // Allow all files except audio files (.wav and .mp3 only)
    //     if (file.mimetype.startsWith("audio/")) {
    //         const filetypes = /wav|mp3/;
    //         const extname = filetypes.test(file.originalname.toLowerCase());

    //         if (extname) {
    //             return cb(null, true);
    //         } else {
    //             return cb(new Error("Only .wav and .mp3 audio files are allowed!"));
    //         }
    //     }

    //     // Allow all non-audio files
    //     cb(null, true);
    }
});

module.exports = upload_images;