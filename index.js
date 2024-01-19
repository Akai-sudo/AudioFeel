let eyesClosedStartTime = null;
window.musicParams = {
    musicFolder: 'music/neutral/',
    trackList: ['Mexico.mp3', 'Paris.mp3', 'TheManWhoSoldTheWorld.mp3', 'QuestionRéponse.mp3'],
    currentTrackIndex: 0,
};
// window.musicParams = {
//     musicFolder: '',
//     trackList: [],
//     currentTrackIndex: 0,
// };

//////////////////CAMERA SENTIMENT DETECTION/////////////////
function setText(text) {
    document.getElementById("status").innerText = text;
}

function setSongName(text) {
    document.getElementById("songMeta").innerText = text;
}

function setWinkText(text) {
    document.getElementById("wink").innerText = text;
}

function setMouthText(text) {
    document.getElementById("mouth").innerText = text;
}

function setVolumeText(text) {
    document.getElementById("volumeButton").innerText = "Volume " + text;
}

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const webcamElement = document.getElementById("webcam");
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
            navigatorAny.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true },
                stream => {
                    webcamElement.srcObject = stream;
                    webcamElement.addEventListener("loadeddata", resolve, false);
                },
                error => reject());
        }
        else {
            reject();
        }
    });
}

const emotions = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"];
let emotionModel = null;

let output = null;
let model = null;

let isEmotionDetectionInProgress = true;
let isMouthOpen = false;

const mouthButton = document.getElementById("mouth");
const audioPlayer = document.getElementById("audioPlayer");
const volumeButton = document.getElementById("volumeButton");

function toggleDetection() {
    // isDetectionPaused = !isDetectionPaused;
    // if (!isDetectionPaused) {
    //     trackFace(); // Restart detection
    // }
    //ce je odprej bil paused
    if (isMouthOpen) {
        isMouthOpen = false;
        // requestAnimationFrame(trackFace);
    } else if (!isMouthOpen) { //ce od prej se je predvajal
        isMouthOpen = true;
    }
}

async function predictEmotion(points) {
    let result = tf.tidy(() => {
        const xs = tf.stack([tf.tensor1d(points)]);
        return emotionModel.predict(xs);
    });
    let prediction = await result.data();
    result.dispose();
    // najbolj verjetno pocutje
    let id = prediction.indexOf(Math.max(...prediction));
    return emotions[id];
}

function isMouthOpened() {
    return isMouthOpen ? true : false;
}

async function trackFace() {

    const video = document.querySelector("video");
    const faces = await model.estimateFaces({
        input: video,
        returnTensors: false,
        flipHorizontal: false,
    });
    output.drawImage(
        video,
        0, 0, video.width, video.height,
        0, 0, video.width, video.height
    );

    let points = null;
    let areEyesClosed = false;

    faces.forEach(face => {
        //okvir obraza
        const x1 = face.boundingBox.topLeft[0];
        const y1 = face.boundingBox.topLeft[1];
        const x2 = face.boundingBox.bottomRight[0];
        const y2 = face.boundingBox.bottomRight[1];
        const bWidth = x2 - x1;
        const bHeight = y2 - y1;
        drawLine(output, x1, y1, x2, y1);
        drawLine(output, x2, y1, x2, y2);
        drawLine(output, x1, y2, x2, y2);
        drawLine(output, x1, y1, x1, y2);

        // obrazne znacilke
        const features = [
            "noseTip",
            "leftCheek",
            "rightCheek",
            "leftEyeLower1", "leftEyeUpper1",
            "rightEyeLower1", "rightEyeUpper1",
            "leftEyebrowLower", //"leftEyebrowUpper",
            "rightEyebrowLower", //"rightEyebrowUpper",
            "lipsLowerInner", //"lipsLowerOuter",
            "lipsUpperInner", //"lipsUpperOuter",
        ];
        points = [];
        //ZA DETECTANJE OBRAZNIH ZNACILK
        features.forEach(feature => {
            face.annotations[feature].forEach(x => {
                points.push((x[0] - x1) / bWidth);
                points.push((x[1] - y1) / bHeight);
            });
        });

        //ZA BLINKANJE OCI
        const eyeDist = Math.sqrt(
            (face.annotations.leftEyeUpper1[3][0] - face.annotations.rightEyeUpper1[3][0]) ** 2 +
            (face.annotations.leftEyeUpper1[3][1] - face.annotations.rightEyeUpper1[3][1]) ** 2 +
            (face.annotations.leftEyeUpper1[3][2] - face.annotations.rightEyeUpper1[3][2]) ** 2
        );
        const faceScale = eyeDist / 80;

        // Check for eyes closed
        const leftEyesDist = Math.sqrt(
            (face.annotations.leftEyeLower1[4][0] - face.annotations.leftEyeUpper1[4][0]) ** 2 +
            (face.annotations.leftEyeLower1[4][1] - face.annotations.leftEyeUpper1[4][1]) ** 2 +
            (face.annotations.leftEyeLower1[4][2] - face.annotations.leftEyeUpper1[4][2]) ** 2
        );
        const rightEyesDist = Math.sqrt(
            (face.annotations.rightEyeLower1[4][0] - face.annotations.rightEyeUpper1[4][0]) ** 2 +
            (face.annotations.rightEyeLower1[4][1] - face.annotations.rightEyeUpper1[4][1]) ** 2 +
            (face.annotations.rightEyeLower1[4][2] - face.annotations.rightEyeUpper1[4][2]) ** 2
        );


        // if (leftEyesDist / faceScale < 23.5) {
        //     areEyesClosed = true;
        // }
        // if (rightEyesDist / faceScale < 23.5) {
        //     areEyesClosed = true;
        // }
        // Set wink status based on distances
        isLeftWink = leftEyesDist / faceScale < 23.5;
        isRightWink = rightEyesDist / faceScale < 23.5;

        // Check for mouth open
        const lipsDist = Math.sqrt(
            (face.annotations.lipsLowerInner[5][0] - face.annotations.lipsUpperInner[5][0]) ** 2 +
            (face.annotations.lipsLowerInner[5][1] - face.annotations.lipsUpperInner[5][1]) ** 2 +
            (face.annotations.lipsLowerInner[5][2] - face.annotations.lipsUpperInner[5][2]) ** 2
        );
        // Scale to the relative face size
        if (lipsDist / faceScale > 20) {
            isMouthOpen = true;
        } else {
            isMouthOpen = false;
        }

        //ZAMIZATI Z OCMI MUTE VOLUME
        if (leftEyesDist / faceScale < 22.0 && rightEyesDist / faceScale < 22.0) {
            if (!eyesClosedStartTime) {
                // Eyes just closed, start the timer
                eyesClosedStartTime = Date.now();
            } else {
                // Eyes still closed, check the duration
                const duration = Date.now() - eyesClosedStartTime;
                if (duration >= 1000) {
                    if (audioPlayer.volume >= 0.1) {
                        audioPlayer.volume -= 0.1;
                        setVolumeText(audioPlayer.volume.toFixed(1));
                    }
                }
            }
        } else {
            // odprte oci, resetiri timer
            eyesClosedStartTime = null;
            if (audioPlayer.volume <= 0.9) {
                audioPlayer.volume += 0.1;
                setVolumeText(audioPlayer.volume.toFixed(1));
            }
        }
        // if (leftEyesDist / faceScale < 22 && rightEyesDist / faceScale < 22) {
        //     if (audioPlayer.volume > 0.11) {
        //         audioPlayer.volume -= 0.1;
        //         setVolumeText(audioPlayer.volume);
        //     }

        // } else {
        //     if (audioPlayer.volume < 0.9) {
        //         audioPlayer.volume += 0.1;
        //         setVolumeText(audioPlayer.volume);
        //     }
        // }

        if (!isMouthOpen) {   ///zaprta usta
            setMouthText("Closed mouth - Stopped detecting")
            isEmotionDetectionInProgress = false;
            mouthButton.style.backgroundColor = "#ff4545";
            mouthButton.style.color = "white";
            toggleDetection();
        } else {        //odprta usta
            setSongName(musicParams.trackList[musicParams.currentTrackIndex]); //iscemo skladbe, izpisi katere isce (na zadnji se ustavi?)
            setMouthText("Opened mouth - Proceed detecting")
            mouthButton.style.backgroundColor = "#c2fbd7";
            mouthButton.style.color = "green";
            toggleDetection();
            if (isLeftWink) {
                setWinkText("Left wink! -  Previous");
                previousTrack();
            } else if (isRightWink) {
                setWinkText("Right wink! - Next");
                nextTrack();
            } else {
                setWinkText("No wink found");
            }
            isEmotionDetectionInProgress = true;
        }

    });

    if (points) {
        let emotion = await predictEmotion(points);
        // while (!isMouthOpen) {

        // setInterval(() => {
        //         const emotion = window.currentEmotion;
        //         emotionChangeAudio(emotion);
        // }, musicParams.); 
        if (emotion == "neutral") {
            //console.log("NEUTRAL DELA");
            musicParams.musicFolder = `music/neutral/`;
            musicParams.trackList = ['Mexico.mp3', 'Paris.mp3', 'QuestionRéponse.mp3', 'TheManWhoSoldTheWorld.mp3'];
            musicParams.currentTrackIndex = 0;
            // loadTrack(audioPlayer);
            audioPlayer.play();
        } else if (emotion == "happy") {
            //console.log("HAPPY DELA");
            musicParams.musicFolder = `music/happy/`;
            musicParams.trackList = ['Paris.mp3', 'Martini.mp3', '12thFloorParty.mp3'];
            musicParams.currentTrackIndex = 0;
            // loadTrack(audioPlayer);
            audioPlayer.play();
        } else if (emotion == "sad") {
            //console.log("SAD DELA");
            musicParams.musicFolder = `music/sad/`;
            musicParams.trackList = ['LittlePoorMe.mp3', 'Warriors.mp3', 'TheManWhoSoldTheWorld.mp3'];
            musicParams.currentTrackIndex = 0;
            // loadTrack(audioPlayer);
            audioPlayer.play();
        } else if (emotion == "surprise") {
            //console.log("SUR DELA");
            musicParams.musicFolder = `music/surprise/`;
            musicParams.trackList = ['Skrillex.mp3', 'Mercury.mp3', 'Hayloft.mp3'];
            musicParams.currentTrackIndex = 0;
            // loadTrack(audioPlayer);
            audioPlayer.play();
        } else if (emotion == "fear") {
            //console.log("FEAR DELA");
            musicParams.musicFolder = `music/fear/`;
            musicParams.trackList = ['Tiamaranta.mp3', 'Puzzle.mp3', 'Toccata.mp3'];
            musicParams.currentTrackIndex = 0;
            // loadTrack(audioPlayer);
            audioPlayer.play();
        } else if (emotion == "disgust") {
            //console.log("DISGUST DELA");
            musicParams.musicFolder = `music/disgust/`;
            musicParams.trackList = ['King.mp3', 'Bronx.mp3'];
            musicParams.currentTrackIndex = 0;
            // loadTrack(audioPlayer);
            audioPlayer.play();
        } else if (emotion == "angry") {
            //console.log("DISGUST DELA");
            musicParams.musicFolder = `music/angry/`;
            musicParams.trackList = ['Harakiri.mp3', 'Captain.mp3', 'BluesPills.mp3'];
            musicParams.currentTrackIndex = 0;
            // loadTrack(audioPlayer);
            audioPlayer.play();
        }
        window.currentEmotion = emotion;
        // if (!isMouthOpen) {
        setText(`Detected emotion: ${emotion}`);
        // }
        // }
    }
    else {
        setText("No Face");
    }

    // if (!isDetectionPaused) {
    requestAnimationFrame(trackFace); // Continue detection
    // }
    //requestAnimationFrame(trackFace);

}

(async () => {
    await setupWebcam();
    const video = document.getElementById("webcam");
    video.play();
    let videoWidth = video.videoWidth;
    let videoHeight = video.videoHeight;
    //let ratio = videoHeight / videoWidth;

    video.width = videoWidth;
    video.height = videoHeight;

    let canvas = document.getElementById("output");
    canvas.width = video.width;
    canvas.height = video.height;

    output = canvas.getContext("2d");
    output.translate(canvas.width, 0);
    output.scale(-1, 1); // Mirror cam
    output.fillStyle = "#fdffb6";
    output.strokeStyle = "#fdffb6";
    output.lineWidth = 2;

    //FACEMARKS DETECTION
    model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );
    //AWAIT ZA LOAD EMOTION DETECTIONA
    emotionModel = await tf.loadLayersModel('web/model/facemo.json');

    setText("Loaded!");

    // await trackFace();
    trackFace();
})();