import aws from 'aws-sdk';
import config from '../config';
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';

const localStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const localUpload = multer({ storage: localStorage });

const router = express.Router();

router.post('/', localUpload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
const s3Instance = new aws.S3();
const s3Storage = multerS3({
  s3: s3Instance,
  bucket: 'amazona-bucket',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});
const s3Upload = multer({ storage: s3Storage });
router.post('/s3', s3Upload.single('image'), (req, res) => {
  res.send(req.file.location);
});

export default router;
