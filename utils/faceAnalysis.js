const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_REGION,
});

const rekognition = new AWS.Rekognition({ region: process.env.AWS_REGION });

module.exports = (image) => new Promise((resolve, reject) => {
  const params = {
    Image: {
      Bytes: Buffer.from(image),
    },
    Attributes: [
      'ALL',
    ],
  };
  rekognition.detectFaces(params, (err, data) => {
    if (err) {
      return reject(err);
    }
    return resolve(data.FaceDetails[0]);
  });
});
