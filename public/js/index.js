import 'babel-polyfill';
import Chart from 'chart.js';

const imageInput = document.getElementById('image');
const imageElement = document.getElementById('view-input-image');
const sendBtn = document.getElementById('analyze-button');

const barChart = document.getElementById('myChart');
const facialEl = document.getElementById('facepoints');

if (imageInput) {
  imageInput.addEventListener('change', (e) => {
    imageElement.src = URL.createObjectURL(e.target.files[0]);
    imageElement.dataset.imageUploaded = true;
  });
}

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    if (imageElement.dataset.imageUploaded === 'true') {
      sendBtn.innerHTML = 'Processing...';
    }
  });
}

if (barChart) {
  Chart.defaults.global.defaultFontColor = 'white';
  const myChart = new Chart(barChart, {
    type: 'bar',
    data: {
      labels: [...Object.keys(JSON.parse(barChart.dataset.emotions))],
      datasets: [{
        label: 'Emotions',
        data: [...Object.values(JSON.parse(barChart.dataset.emotions))],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      }],
    },
    options: {
      legend: {
        labels: {
          fontColor: 'white',
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    },
  });

  if (facialEl) {
    const ctx = facialEl.getContext('2d');

    const box = JSON.parse(barChart.dataset.boundingBox);
    const organs = JSON.parse(barChart.dataset.organs);

    const WIDTH = 500;
    const HEIGHT = 400;

    const boundFace = (boundBox) => {
      ctx.strokeStyle = '#CCFF00';
      ctx.strokeRect(
        WIDTH * boundBox.Left,
        HEIGHT * boundBox.Top,
        WIDTH * boundBox.Width,
        HEIGHT * boundBox.Height,
      );
    };

    boundFace(box);

    const mapPoints = (arr) => {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(WIDTH * arr[0].x, HEIGHT * arr[0].y);
      Object.values(arr).forEach(({ x, y }) => {
        ctx.lineTo(WIDTH * x, HEIGHT * y);
      });
      ctx.stroke();
    };

    const getOrganPoints = (faceObj) => {
      const resultObj = {
        leftBrowPoints: [
          faceObj.leftEyeBrowLeft,
          faceObj.leftEyeBrowRight,
          faceObj.leftEyeBrowUp,
        ],
        rightBrowPoints: [
          faceObj.rightEyeBrowLeft,
          faceObj.rightEyeBrowRight,
          faceObj.rightEyeBrowUp,
        ],
        rightEyePoints: [
          faceObj.rightEyeLeft,
          faceObj.rightEyeUp,
          faceObj.rightEyeRight,
          faceObj.rightEyeDown,
          faceObj.rightEyeLeft,
          faceObj.rightPupil,
          faceObj.eyeRight,
        ],
        leftEyePoints: [
          faceObj.leftEyeLeft,
          faceObj.leftEyeUp,
          faceObj.leftEyeRight,
          faceObj.leftEyeDown,
          faceObj.leftEyeLeft,
          faceObj.leftPupil,
          faceObj.eyeLeft,
        ],
        mouthPoints: [
          faceObj.mouthLeft,
          faceObj.mouthUp,
          faceObj.mouthRight,
          faceObj.mouthDown,
          faceObj.mouthLeft,
        ],
        nose: [
          faceObj.noseLeft,
          faceObj.nose,
          faceObj.noseRight,
        ],
        face: [
          faceObj.upperJawlineLeft,
          faceObj.midJawlineLeft,
          faceObj.chinBottom,
          faceObj.midJawlineRight,
          faceObj.upperJawlineRight,
        ],
      };
      return resultObj;
    };

    const organPoints = getOrganPoints(organs);

    Object.values(organPoints).forEach((arrPoints) => mapPoints(arrPoints));

    const onlyFaces = JSON.parse(barChart.dataset.raw).map((el) => el.Landmarks);
    const arrOrganPoints = onlyFaces.map((el) => {
      const result = {};

      el.forEach((prop) => {
        result[prop.Type] = { x: prop.X, y: prop.Y };
      });

      return result;
    });

    arrOrganPoints.forEach((el) => {
      const elPoints = getOrganPoints(el);
      Object.values(elPoints).forEach((arrPoints) => mapPoints(arrPoints));
    });

    const onlyBoundBoxes = JSON.parse(barChart.dataset.raw).map((el) => el.BoundingBox);
    onlyBoundBoxes.forEach((each) => {
      boundFace(each);
    });
  }
}
