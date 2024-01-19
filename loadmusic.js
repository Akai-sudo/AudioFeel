// document.addEventListener('DOMContentLoaded', function () {
//     const audioPlayer = document.getElementById('audioPlayer');
//     const musicFolder = 'music/neutral/'; // Path to your music folder
//     const trackList = [
//         'Mexico.mp3'
//         // Add more MP3 files as needed
//     ];

//     //let currentTrackIbi = 0;

//     function loadTrack() {
//         const trackPath = musicFolder + trackList[0];
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

//     // Load the initial track
//     loadTrack();

//     // Event listeners
//     audioPlayer.addEventListener('ended', function () {
//         // Auto-advance to the next track when the current track ends
//         let currentTrackI = (0 + 1) % trackList.length;
//         loadTrack();
//         audioPlayer.play();
//     });

//     document.addEventListener('keydown', function (event) {
//         // Use the spacebar to play/pause the audio
//         if (event.code === 'Space') {
//             playPause();
//         }
//     });
// });


// let currentTrackIndex = 0;

// document.addEventListener('DOMContentLoaded', function () {
//     const audioPlayer = document.getElementById('audioPlayer');
//     const musicFolder = 'music/sad/'; // Path to your music folder
//     const trackList = [
//         'LittlePoorMe.mp3'
//         // Add more MP3 files as needed
//     ];


//     // function loadTrack() {
//     //     const trackPath = musicParams.musicFolder + musicParams.trackList[currentTrackIndex];
//     //     audioPlayer.src = trackPath;
//     //     audioPlayer.load();
//     // }

//     function loadTrack(trackIndex) {
//         const trackPath = musicFolder + trackList[trackIndex];
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

//     // Load the initial track
//     loadTrack(currentTrackIndex);

//     // Event listeners
//     audioPlayer.addEventListener('ended', function () {
//         // Auto-advance to the next track when the current track ends
//         currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
//         loadTrack(currentTrackIndex);
//         console.log("CURRENT TRACK:", currentTrackIndex);
//         audioPlayer.play();
//     });

//     document.addEventListener('keydown', function (event) {
//         // Use the spacebar to play/pause the audio
//         if (event.code === 'Space') {
//             playPause();
//         }
//     });
// });




// //LOGIKA PREDVJANJA KOMADOV GLEDE NA SPOCUTJE
// // if (emotion == "neutral") {
// //     console.log("NEUTRAL DELA")
// //     const musicFolder = `music/neutral/`;
// //     trackList = [
// //         'Mexico.mp3'
// //         // Add more tracks as needed
// //     ];
// //     currentTrackIndex = 0;
// //     loadTrack(musicFolder, trackList, currentTrackIndex);
// //     audioPlayer.play();
// // } else if (emotion == "happy") {
// //     console.log("HAPPY DELA")
// //     const musicFolder = `music/happy/`;
// //     trackList = [
// //         'Paris.mp3'

// //     ];
// //     currentTrackIndex = 0;
// //     loadTrack(musicFolder, trackList, currentTrackIndex);
// //     audioPlayer.play();
// // } else if (emotion == "sad") {
// //     console.log("SAD DELA")
// //     const musicFolder = `music/sad/`;
// //     trackList = [
// //         'LittlePoorMe.mp3'

// //     ];
// //     currentTrackIndex = 0;
// //     loadTrack(musicFolder, trackList, currentTrackIndex);
// //     audioPlayer.play();
// // } else if (emotion == "surprise") {
// //     console.log("SURPRISE DELA")
// //     const musicFolder = `music/surprise/`;
// //     trackList = [
// //         'Skrillex.mp3'

// //     ];
// //     currentTrackIndex = 0;
// //     loadTrack(musicFolder, trackList, currentTrackIndex);
// //     audioPlayer.play();
// // } else if (emotion == "fear") {
// //     console.log("FEAR DELA")
// //     const musicFolder = `music/fear/`;
// //     trackList = [
// //         'Tiamaranta.mp3'

// //     ];
// //     currentTrackIndex = 0;
// //     loadTrack(musicFolder, trackList, currentTrackIndex);
// //     audioPlayer.play();
// // } else if (emotion == "disgust") {
// //     console.log("DISGUST DELA")
// //     const musicFolder = `music/disgust/`;
// //     trackList = [
// //         'King.mp3'

// //     ];
// //     currentTrackIndex = 0;
// //     loadTrack(musicFolder, trackList, currentTrackIndex);
// //     audioPlayer.play();
// // } else if (emotion == "angry") {
// //     console.log("SAD DELA")
// //     const musicFolder = `music/angry/`;
// //     trackList = [
// //         'Harakiri.mp3'

// //     ];
// //     currentTrackIndex = 0;
// //     loadTrack(musicFolder, trackList, currentTrackIndex);
// //     audioPlayer.play();
// // } else {
// //     console.log("ELSE DELA")
// //     const musicFolder = `music/angry/`;
// //     trackList = [
// //         'Harakiri.mp3'

// //     ];
// //     currentTrackIndex = 0;
// //     loadTrack(musicFolder, trackList, currentTrackIndex);
// //     audioPlayer.play();
// // }

// // })();
