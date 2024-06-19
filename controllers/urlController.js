const Url = require("../models/Url");

exports.createUrl = async (req, res) => {
  const { url, date } = req.body;
  const userId = req.user.userId;
  try {
    console.log("setp 2", userId);

    const newUrl = new Url({ url, date, userId });
    console.log("setp 2");
    await newUrl.save();
    res.status(201).json(newUrl);
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUrls = async (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
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
