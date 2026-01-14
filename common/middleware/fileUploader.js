require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const AWS = require("aws-sdk");
const axios=require("axios")
const path=require("path");
const { API_URL } = require("../services");
// module.exports = {
//   fileUpload,
// };
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

/**
 @return returns only url of the uploaded files
*/
const uploadImage = async (file) => {
  const {data}=await axios.get(`${API_URL}/quizophy_AWS_settings`)
    const validFileTypes = ['image/png', 'image/jpg', 'image/jpeg','image/jfif','image/gif','video/mp4','video/mkv','video/x-matroska','video/mpeg','audio/mpeg','audio/mp3','video/mp3',"application/pdf"]
    if (!validFileTypes.includes(file.mimetype)) return 'File type not supported'
    const fileStream = fs.createReadStream(file.path)
    const params = {
        Bucket: data.value.quizophy_aws_s3_bucket_name, // pass your bucket name
        Key: file.filename,
        Body: fileStream,
        ACL: 'public-read',
        ContentType: file.mimetype
    };
    return new AWS.S3({
      accessKeyId:data.value.quizophy_aws_s3_access_key,
      secretAccessKey: data.value.quizophy_aws_s3_access_secret_key,
    }).upload(params).promise();
}


module.exports = { uploadImage, upload };