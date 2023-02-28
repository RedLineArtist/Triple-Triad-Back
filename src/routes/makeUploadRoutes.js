import multer from "multer";

const upload = multer();

const makeUploadRoutes = ({ app }) => {
  app.post("/users/avatar", upload.single("avatar"), async (req, res) => {
    console.log(req.file);

    res.send("OK");
  });
};

export default makeUploadRoutes;
