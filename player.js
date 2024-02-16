function greet() {
  // Get the current hour
  var currentTime = new Date().getHours();

  // Define the greeting messages and corresponding icons
  var greetingMessages = {
    morning: { message: "Buenas Dias! ", icon: "fas fa-sun" },
    afternoon: { message: "Buenos Tardes! ", icon: "fas fa-sun" },
    evening: { message: "Buenos Tardes! ", icon: "fas fa-moon" },
    night: { message: "Buenas Noches! ", icon: "fas fa-moon" },
  };

  // Determine the current greeting message and icon
  var greetingMessage, iconClass;

  if (currentTime >= 5 && currentTime < 12) {
    greetingMessage = greetingMessages.morning.message;
    iconClass = greetingMessages.morning.icon;
  } else if (currentTime >= 12 && currentTime < 18) {
    greetingMessage = greetingMessages.afternoon.message;
    iconClass = greetingMessages.afternoon.icon;
  } else if (currentTime >= 18 && currentTime < 22) {
    greetingMessage = greetingMessages.evening.message;
    iconClass = greetingMessages.evening.icon;
  } else {
    greetingMessage = greetingMessages.night.message;
    iconClass = greetingMessages.night.icon;
  }

  // Display the greeting message with icon on the webpage
  var greetingDiv = document.getElementById("greetingMessage");
  greetingDiv.innerHTML = ` ${greetingMessage}  Vasu  <i class="${iconClass}"></i> `;
}
greet();

let currentSong = new Audio();
let songs;
var songName;
const playIcon = document.getElementById("play");
const pauseIcon = document.getElementById("pause");
const prevIcon = document.getElementById("prev");
const nextIcon = document.getElementById("next");


function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remaingSec = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remaingSec).padStart(2, "0");
  return `${formattedMinutes} : ${formattedSeconds}`;
}

let currfolder;

async function valentine(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      var link = element.href;

      // Split the link based on '/'
      var parts = link.split("/");

      // Get the last part of the split array
      var lastPart = parts[parts.length - 1];

      // Split the last part based on '%20' (URL encoding for space)
      var songNameParts = lastPart.split("%20");
      // Replace '%20' with space and decode URI components
      songName = songNameParts
        .map((part) => decodeURIComponent(part))
        .join(" ");
      songs.push(songName);
    }
  }
  let songUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
            <i class="fa-solid fa-headphones" style="font-size: 1.9rem;"></i>
            <div class="info">
                <div class="song-nm">${song} </div>
                <div>Unknown</div>
            </div>
            <div class="playNow">
                <i id="play" class="fa-solid fa-circle-play" style="font-size: 1.9rem;"></i>
                <i id="pause" id="pause" class="fa-solid fa-pause" style="display: none;"></i>
            </div>
            </li>`;
  }

  // Attach an event listner to each song
  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".song-nm").innerHTML);
      playMusic(e.querySelector(".song-nm").innerHTML);
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

function updatePlayPauseIcon() {
    if (currentSong.paused) {
      playIcon.style.display = "inline";
      pauseIcon.style.display = "none";
    } else {
      playIcon.style.display = "none";
      pauseIcon.style.display = "inline";
    }
  
    // Attach event listener to the play and pause icons
    playIcon.addEventListener("click", function () {
      currentSong.play();
      updatePlayPauseIcon();
    });
  
    pauseIcon.addEventListener("click", function () {
      currentSong.pause();
      updatePlayPauseIcon();
    });
}

function prevNext() {
    prevIcon.addEventListener("click", () => {
      currentSong.pause();
      console.log("previous clicked");
      let index = songs.indexOf(
        decodeURIComponent(currentSong.src.split("/").pop())
      );
      console.log(songs, index);
      if (index - 1 >= 0) {
        playMusic(songs[index - 1]);
        updatePlayPauseIcon();
      }
    });
  
    nextIcon.addEventListener("click", () => {
      currentSong.pause();
      console.log("next clicked");
      let index = songs.indexOf(
        decodeURIComponent(currentSong.src.split("/").pop())
      );
      console.log(songs, index);
      if (index + 1 < songs.length) {
        playMusic(songs[index + 1]);
        updatePlayPauseIcon();
      }
    });
  }
  

  async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardContainer = document.querySelector(".card-container");
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[1];
            try {
                // get the metadata of the folder
                let infoResponse = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                if (!infoResponse.ok) {
                    throw new Error(`Failed to fetch info for folder ${folder}: ${infoResponse.statusText}`);
                }
                let info = await infoResponse.json();
                console.log(info);

                cardContainer.innerHTML += `
                    <div class="card" data-folder="${folder}">
                        <div class="play"><img src="play_button.png" alt=""></div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${info.title}</h2>
                        <p>${info.description}</p>
                    </div>`;
            } catch (error) {
                console.error(error);
            }
        }
    }

    // load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            console.log("fetching songs");
            songs = await valentine(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        });
    });
}


async function main() {
  // Get the list of all songs
  await valentine("songs/neha");
  console.log(songs);
  playMusic(songs[0], true);

  // display all the albums on the page
  await displayAlbums();

  updatePlayPauseIcon()

  // add an event listner to prev and next buttons
  prevNext();

  // listen for time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `
        ${secondsToMinutesSeconds(
          currentSong.currentTime
        )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
  });

  // add an event listner to add hamburger
  document.querySelector("#hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // add an event listner to close the library
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });




    const volumeRocker = document.querySelector(".volumeRocker");
    const volumeIcon = volumeRocker.querySelector("i");
    const volumeInput = document.querySelector(".range input");
    
    volumeInput.addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });
    
    volumeIcon.addEventListener("click", (e) => {
      if (volumeIcon.classList.contains("fa-volume-mute")) {
        volumeIcon.classList.remove("fa-volume-mute");
        volumeIcon.classList.add("fa-volume-up");
        currentSong.volume = 0; // Adjust the volume level when unmuted
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
      } else {
        volumeIcon.classList.remove("fa-volume-up");
        volumeIcon.classList.add("fa-volume-mute");
        currentSong.volume = 0; // Mute the volume
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
    });
    


}
main();
