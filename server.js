const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const urlRoutes = require("./routes/urlRoutes");
const callstatusRoutes = require("./routes/callStatusRouters");


const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3008;
const DB_URI = "mongodb+srv://dbUser:abhayaks@cluster0.a0wvhwr.mongodb.net/";
// WYHbdCbygXg74QGl
app.use(bodyParser.json());
// app.use(cors({
//   origin: "*"
// }));

app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // If needed
}));

mongoose
  .connect(DB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


console.log("hgshgfvshggdfdgw");

app.use("/api/callStatus", callstatusRoutes);
app.use("/api/users", userRoutes);
app.use("/api/urls", urlRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Working Fine" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

