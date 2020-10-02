const multer = require('multer');
const rekognize = require('../utils/faceAnalysis');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) return cb(null, true);
  return cb(null, false);
};

const photoUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

const filterFields = (analysis, allowedFields) => {
  const filteredObject = {};
  Object.keys(analysis).forEach((field) => {
    if (allowedFields.includes(field)) filteredObject[field] = analysis[field];
  });
  return filteredObject;
};

const convertArrToObj = (arr, isLandmarks = false) => {
  const outputObj = {};
  if (!isLandmarks) {
    arr.forEach((el) => {
      outputObj[el.Type.toLowerCase()] = (Math.round(el.Confidence * 100) / 100);
    });
  } else {
    arr.forEach((el) => {
      outputObj[el.Type] = {
        x: el.X,
        y: el.Y,
      };
    });
  }
  return outputObj;
};

exports.uploadImage = photoUpload.single('image');

exports.getHome = (req, res) => {
  res.status(200).render('home', {
    message: 'Upload an image',
  });
};

exports.analyzeFace = async (req, res) => {
  try {
    const analysis = await rekognize(req.file.buffer);
    const allowedFields = [
      'AgeRange',
      'Smile',
      'Eyeglasses',
      'Sunglasses',
      'Gender',
      'Beard',
      'Mustache',
      'EyesOpen',
      'MouthOpen',
    ];

    const filteredAnalysis = filterFields(analysis, allowedFields);
    const emotionObj = convertArrToObj(analysis.Emotions);
    const landmarkObj = convertArrToObj(analysis.Landmarks, true);
    const imageSrc = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;

    res.status(200).render('home', {
      ...filteredAnalysis,
      uploadedImg: imageSrc,
      age: analysis.AgeRange,
      emotions: emotionObj,
      boundingBox: analysis.BoundingBox,
      landmarks: landmarkObj,
    });
  } catch (err) {
    res.status(400).render('home', {
      message: 'Error detecting face in given picture, Try again!',
    });
  }
};
