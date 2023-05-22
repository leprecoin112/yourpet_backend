const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (file, name) => {
  const res = await cloudinary.uploader.upload(file, { public_id: name });
  return res.secure_url;
};

module.exports = cloudinaryUpload;
