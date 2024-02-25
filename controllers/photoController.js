import Photo from "../model/Photo.js";
import fs from "fs-extra";
import path from "path";
export const getAllPhotos = async (req, res) => {
  // console.log(req.query);
  // const photos = await Photo.find({}).sort("-dateCreated");

  // res.render("index", { photos });
  const page = req.query.page || 1;
  const photosPerPage = 3;
  const totalPhotos = await Photo.find().countDocuments();
  const photos = await Photo.find({})
    .sort("-dateCreated")
    .skip((page - 1) * photosPerPage)
    .limit(photosPerPage);
  res.render("index", {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photosPerPage),
  });
};

export const getPhoto = async (req, res) => {
  // console.log(req.params.id);
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
};

// export const createPhoto = async (req, res) => {
//   const uploadDir = "../public/upload/";
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//   }

//   let uploadedImage = req.files.image;
//   console.log(uploadedImage);
//   let uploadPath = uploadDir + uploadedImage.name;

//   uploadedImage.mv(uploadPath, async () => {
//     await Photo.create({
//       ...req.body,
//       image: "../public/upload/" + uploadedImage.name,
//     });
//     res.redirect("/");
//   });
// };

export const updatePhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();
  res.redirect(`/photos/${req.params.id}`);
};

export const deletePhoto = async (req, res) => {
  try {
    const uploadDir = "public/";
    const photo = await Photo.findOne({ _id: req.params.id });
    if (!photo) {
      return res.status(404).send("Fotoğraf bulunamadı.");
    }

    let deleteImage = path.join(uploadDir, photo.image);
    if (fs.existsSync(deleteImage)) {
      fs.unlinkSync(deleteImage);
    } else {
      console.log("Dosya bulunamadı:", deleteImage);
    }

    await Photo.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/");
  } catch (err) {
    console.error("Silme hatası:", err);
    res.status(500).send("Silme işlemi sırasında bir hata oluştu.");
  }
};
