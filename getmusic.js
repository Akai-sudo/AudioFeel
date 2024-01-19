function loadTrack() {
    const trackPath = musicParams.musicFolder + musicParams.trackList[musicParams.currentTrackIndex];
    audioPlayer.src = trackPath;
    audioPlayer.load();
}

function nextTrack() {
    musicParams.currentTrackIndex = musicParams.currentTrackIndex + 1;
    if (musicParams.currentTrackIndex == musicParams.trackList.length) {
        musicParams.currentTrackIndex = 0;
    }
    loadTrack();
    audioPlayer.play();
}

function previousTrack() {
    if (musicParams.currentTrackIndex != 0) {
        musicParams.currentTrackIndex = musicParams.currentTrackIndex - 1;
    }
    loadTrack();
    audioPlayer.play();
}

document.addEventListener('DOMContentLoaded', function () {
    const audioPlayer = document.getElementById('audioPlayer');
    let wantToListen = true; //flag for control of song playing


    function playPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }


    // izvedi prvi komad
    // if (!isMouthOpened()) {
    loadTrack();
    // }

    //NASLEDNJI KOMAD PO KONCU
    audioPlayer.addEventListener('ended', function () {
        // let currentTrackI = (0 + 1) % musicParams.trackList.length;
        // loadTrack(); //todo
        musicParams.currentTrackIndex = musicParams.currentTrackIndex + 1;
        if (musicParams.currentTrackIndex == musicParams.trackList.length) {
            musicParams.currentTrackIndex = 0;
        }
        loadTrack();
        audioPlayer.play();
    });

    //SPACEBAR PLAY PAUSE
    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            playPause();
            // obdrzi komad
            wantToListen = false;
        }
    });

    async function emotionChangeAudio(emotion) {
        if (!wantToListen) return;

        if (emotion === "neutral") {
            musicParams.musicFolder = `music/neutral/`;
        } else if (emotion === "happy") {
            musicParams.musicFolder = `music/happy/`;
        } else if (emotion === "sad") {
            musicParams.musicFolder = `music/sad/`;
        } else if (emotion === "surprise") {
            musicParams.musicFolder = `music/surprise/`;
        } else if (emotion === "fear") {
            musicParams.musicFolder = `music/fear/`;
        } else if (emotion === "disgust") {
            musicParams.musicFolder = `music/disgust/`;
        } else if (emotion === "angry") {
            musicParams.musicFolder = `music/angry/`;
        }

        //nalozi prvi komad
        musicParams.currentTrackIndex = 0;
        loadTrack();
        audioPlayer.play();
    }

    // if (wantToListen) {
    //     //na kolko casa ze izvede
    //     setInterval(() => {
    //         const emotion = window.currentEmotion;
    //         emotionChangeAudio(emotion);
    //     }, 5000); // na 5 sekund
    // }
});












// document.addEventListener('DOMContentLoaded', function () {
//     const audioPlayer = document.getElementById('audioPlayer');
//     let wantToListen = true; //flag for control of song playing

//     function loadTrack() {
//         const trackPath = musicParams.musicFolder + musicParams.trackList[0];
//         audioPlayer.src = trackPath;
//         audioPlayer.load();
//     }

//     function playPause() {
//         if (audioPlayer.paused) {
//             audioPlayer.play();
//         } else {
//             audioPlayer.pause();
//         }
//     }
//     // function play() {
//     //     if (!audioPlayer.paused) {
//     //         wantToListen = true;
//     //         audioPlayer.play();
//     //     }
//     // }

//     // function pause() {
//     //     wantToListen = false;
//     //     if (audioPlayer.paused) {
//     //         audioPlayer.pause();
//     //     }
//     // }

//     // izvedi prvi komad
//     loadTrack();

//     //NASLEDNJI KOMAD PO KONCU
//     audioPlayer.addEventListener('ended', function () {
//         let currentTrackI = (0 + 1) % musicParams.trackList.length;
//         loadTrack(); //todo
//         // audioPlayer.play();
//     });

//     //SPACEBAR PLAY PAUSE
//     document.addEventListener('keydown', function (event) {
//         if (event.code === 'Space') {
//             playPause();
//             // pause();
//             // obdrzi komad
//             wantToListen = false;
//             // } else {
//             //     play();
//         }
//     });



//     async function emotionChangeAudio(emotion) {
//         //if (!wantToListen) return;

//         while (wantToListen) {
//             if (emotion === "neutral") {
//                 musicParams.musicFolder = `music/neutral/`;
//             } else if (emotion === "happy") {
//                 musicParams.musicFolder = `music/happy/`;
//             } else if (emotion === "sad") {
//                 musicParams.musicFolder = `music/sad/`;
//             } else if (emotion === "surprise") {
//                 musicParams.musicFolder = `music/surprise/`;
//             } else if (emotion === "fear") {
//                 musicParams.musicFolder = `music/fear/`;
//             } else if (emotion === "disgust") {
//                 musicParams.musicFolder = `music/disgust/`;
//             } else if (emotion === "angry") {
//                 musicParams.musicFolder = `music/angry/`;
//             }
//             // audioPlayer.play();
//         }
//         //nalozi prvi komad
//         musicParams.currentTrackIndex = 0;
//         loadTrack();
//         audioPlayer.play();
//     }

//     if (wantToListen) {
//         //na kolko casa ze izvede
//         setInterval(() => {
//             const emotion = window.currentEmotion;
//             emotionChangeAudio(emotion);
//         }, 5000); // na 5 sekund
//     }
// });
