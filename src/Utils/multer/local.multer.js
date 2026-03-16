import multer from "multer";
import path from "path";
import fs from "node:fs";

export const fileValidation = {
  images: ["image/jpeg", "image/png", "image/gif"],
  videos: ["video/mp4", "video/mpeg", "video/jpeg"],
  audios: ["audio/3gpp2", "audio/webm", "audio/mp4"],
  documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const localFileUpload = ({
  customPath = "general",
  validation = [],
}) => {
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

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new Error("Invalid file type"), false);
    }
  };

  return multer({ fileFilter, storage });
};
