import Photo from "../model/Photo.js";
export const getAboutePage = (req, res) => {
  res.render("about");
};
export const photoEditPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render("edit", {
    photo,
  });
};
export const getAddPage = (req, res) => {
  // res.sendFile(path.resolve(__dirname, "temp/index.html"));
  res.render("add");
};
