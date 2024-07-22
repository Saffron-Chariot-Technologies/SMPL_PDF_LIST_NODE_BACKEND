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
        fileSize: 40 * 1024 * 1024 // 20 MB size limit
    }
});


module.exports = upload_images;

/*
,
    fileFilter: (req, file, cb) => {
        const filetypes = /mp3/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(file.originalname.toLowerCase());

        if (mimetype && extname) {
            return cb(null, true); // Accept the file
        } else {
            return cb(new Error("Only .mp3 audio files are allowed!")); // Reject the file
        }
    }

*/