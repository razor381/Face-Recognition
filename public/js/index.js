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

    ctx.strokeStyle = '#CCFF00';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      WIDTH * box.Left,
      HEIGHT * box.Top,
      WIDTH * box.Width,
      HEIGHT * box.Height,
    );

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

    const organPoints = {
      leftBrowPoints: [
        organs.leftEyeBrowLeft,
        organs.leftEyeBrowRight,
        organs.leftEyeBrowUp,
      ],
      rightBrowPoints: [
        organs.rightEyeBrowLeft,
        organs.rightEyeBrowRight,
        organs.rightEyeBrowUp,
      ],
      rightEyePoints: [
        organs.rightEyeLeft,
        organs.rightEyeUp,
        organs.rightEyeRight,
        organs.rightEyeDown,
        organs.rightEyeLeft,
        organs.rightPupil,
        organs.eyeRight,
      ],
      leftEyePoints: [
        organs.leftEyeLeft,
        organs.leftEyeUp,
        organs.leftEyeRight,
        organs.leftEyeDown,
        organs.leftEyeLeft,
        organs.leftPupil,
        organs.eyeLeft,
      ],
      mouthPoints: [
        organs.mouthLeft,
        organs.mouthUp,
        organs.mouthRight,
        organs.mouthDown,
        organs.mouthLeft,
      ],
      nose: [
        organs.noseLeft,
        organs.nose,
        organs.noseRight,
      ],
      face: [
        organs.upperJawlineLeft,
        organs.midJawlineLeft,
        organs.chinBottom,
        organs.midJawlineRight,
        organs.upperJawlineRight,
      ],
    };

    Object.values(organPoints).forEach((arrPoints) => mapPoints(arrPoints));
  }
}
