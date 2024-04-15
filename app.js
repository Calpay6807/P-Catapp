import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import fileUpload from "express-fileupload";
import Photo from "./model/Photo.js";
import fs from "fs-extra";
import {
  getAllPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
} from "./controllers/photoController.js";
import {
  getAboutePage,
  getAddPage,
  photoEditPage,
} from "./controllers/pageController.js";

const app = express();
mongoose
  .connect(
    "mongodb+srv://username:password@cluster0.bu0yoaf.mongodb.net/",
    { autoIndex: false }
  )
  .then(() => {
    console.log("db Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//template engine
app.set("view engine", "ejs");

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride("_method", {
    method: ["POST", "GET"],
  })
);
// routess
app.get("/", getAllPhotos);
app.get("/photos/:id", getPhoto);
app.post("/photos", async (req, res) => {
  const uploadDir = "./public/upload/";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  let uploadedImage = req.files.image;

  let uploadPath = uploadDir + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/upload/" + uploadedImage.name,
    });
    res.redirect("/");
  });
});
app.put("/photos/:id", updatePhoto);
app.delete("/photos/:id", deletePhoto);

app.get("/about", getAboutePage);
app.get("/add", getAddPage);
app.get("/photos/edit/:id", photoEditPage);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
