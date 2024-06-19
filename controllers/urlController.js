const Url = require("../models/Url");

const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: "AKIAVZ6E5QCDEKTIX46H",
  secretAccessKey: "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",
  region: "ap-south-1",
});

exports.createUrl = async (req, res) => {
  const { date } = req.body;
  const userId = req.user.userId;
  try {
    const file = req.file;
    // const fileContent = fs.readFileSync(req.file.path);

    const params = {
      Bucket: "smpl-pdf",
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    console.log(params);
    s3.upload(params, async (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).send(err);
      }
      // res.status(200).send({ url: data });
      const newUrl = new Url({ url: data.Location, userId, date });
      const savedData = await newUrl.save();

      res.status(201).json(savedData);
    });

    // const newUrl = new Url({ url, date, userId });
    // await newUrl.save();
    // res.status(201).json({ mesg: "kjbejr" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUrls = async (req, res) => {
  const userId = req.user.userId;
  try {
    const urls = await Url.find({ userId });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUrl = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const url = await Url.findById(id);
    if (!url) {
      return res.status(404).json({ msg: "Url not found" });
    }
    if (url.userId.toString() !== userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await Url.findByIdAndDelete(id); // Using findByIdAndDelete instead of remove
    res.json({ msg: "Url removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
