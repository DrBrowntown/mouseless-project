const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let pixels;

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error('OH NO!!!', err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take pixels out
        pixels = ctx.getImageData(0, 0, width, height);
        // mess with them
        // pixels = redEffect(pixels);

        

        // pixels = greenScreen(pixels);
        // put them back
        ctx.putImageData(pixels, 0, 0);

    }, 16);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome" />`;
    strip.insertBefore(link, strip.firstChild);
}

// function redEffect(pixels) {
//     for(let i = 0; i < pixels.data.length; i+=4) {
//         pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
//         pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
//         pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
//     }
//     return pixels;
// }

// function rgbSplit(pixels) {
//     for(let i = 0; i < pixels.data.length; i+=4) {
//         pixels.data[i - 150] = pixels.data[i + 0]; // RED
//         pixels.data[i + 100] = pixels.data[i + 1]; // GREEN
//         pixels.data[i -150] = pixels.data[i + 2]; // Blue

//     }
//     return pixels;
// }

// function greenScreen(pixels) {
//   const levels = {};

//   document.querySelectorAll('.rgb input').forEach((input) => {
//     levels[input.name] = input.value;
//   });

//   for (i = 0; i < pixels.data.length; i = i + 4) {
//     red = pixels.data[i + 0];
//     green = pixels.data[i + 1];
//     blue = pixels.data[i + 2];
//     alpha = pixels.data[i + 3];

//     if (red >= levels.rmin
//     // If any of the pixels are in between the min and max values
//       && green >= levels.gmin
//       && blue >= levels.bmin
//       && red <= levels.rmax
//       && green <= levels.gmax
//       && blue <= levels.bmax) {
//       // take it out!
//       pixels.data[i + 3] = 0;
//     }
//   }

//   return pixels;
// }

getVideo();


video.addEventListener('canplay', paintToCanvas);

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result', e => {
// console.log(e);
const transcript = Array.from(e.results)
  .map(result => result[0])
  .map(result => result.transcript)
  .join('')

  p.textContent = transcript;
  if(e.results[0].isFinal) {
    p = document.createElement('p');
    words.appendChild(p);
  }
  if(transcript.includes('cheese')) {

    takePhoto();
  }
  if(transcript.includes('Ruby')) {
    console.log('ruby');
    pixels = rgbSplit(pixels);
    return pixels;
  }
  
console.log(transcript);
});
recognition.addEventListener('end', recognition.start);
recognition.start();
