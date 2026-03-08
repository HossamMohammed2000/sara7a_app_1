import multer from "multer";
import path from "path";
import fs from "node:fs";

export const localFileUpload = ({ customPath = "general" }) => {
  const basePath = `uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let userBasePath = basePath;
      if (req.user?._id) userBasePath += `/${req.user._id}`;

      
      const fullPath = path.resolve(`./src/${userBasePath}`);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath); 
    },
    filename: function (req, file, cb) {
      const uniqueFilename =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + file.originalname;
        file.finalPath = `${basePath}/${req.user._id}/${uniqueFilename}`;
      cb(null, uniqueFilename);
    },
  });

  return multer({ storage });
};