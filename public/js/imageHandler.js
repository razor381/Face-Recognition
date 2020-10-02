import axios from 'axios';

const analyzeImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append('image', image);

    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/analyze-face',
      data: formData,
    });

    return res.data.data.data;
  } catch (err) {
    return new Error(err.message);
  }
};

export default analyzeImage;
