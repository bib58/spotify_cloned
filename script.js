const folder = "trt";
const library = document.getElementById("library");

async function getSongsFromFolder(folder) {
    const res = await fetch(`/${folder}/`);
    const text = await res.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;

    const links = tempDiv.querySelectorAll("a");
    const songs = [];

    links.forEach(link => {
      const href = link.getAttribute("href");
      if (href && href.endsWith(".mp3")) {
        songs.push(`${folder}/${href}`);
      }
    });
    return songs;
}

async function loadLibrary() {
    const songs = await getSongsFromFolder(folder);

    library.innerHTML = `<h3>${folder}</h3>`;

    songs.forEach(song => {
      	const songDiv = document.createElement("div");
		
      	songDiv.innerHTML = "<i class='fas fa-music'></i> " + song.split("/").pop();
		songDiv.classList.add("song-item");
		songDiv.id = song.split("/").pop().replace(".mp3", "");

      	library.appendChild(songDiv);
    });
}

loadLibrary();


const seekbar = document.getElementById("seekbar");
const currentTimeSpan = document.getElementById("current-time");
const durationSpan = document.getElementById("duration");

let currentAudio = null;
let currentSongElement = null;


function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}


document.getElementById("library").addEventListener("click", (event) => {

  	if (event.target.classList.contains("song-item")) {
		const songElement = event.target;
		const songId = songElement.id;
		document.getElementById("song-info").innerHTML = `<b>${songId}</b>`;

		const songPath = `${folder}/${songId}.mp3`;


		if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
		}

		currentSongElement = songElement;
		currentAudio = new Audio(songPath);

	    currentAudio.addEventListener("loadedmetadata", () => {
            seekbar.max = Math.floor(currentAudio.duration);
            durationSpan.textContent = formatTime(currentAudio.duration);
        });

        currentAudio.addEventListener("timeupdate", () => {
            seekbar.value = Math.floor(currentAudio.currentTime);
            currentTimeSpan.textContent = formatTime(currentAudio.currentTime);
        });

        seekbar.addEventListener("input", () => {
            if (currentAudio) {
                currentAudio.currentTime = seekbar.value;
            }
        });
		currentAudio.play();
	}
});





function setupSeekbar(audio) {
	audio.addEventListener("loadedmetadata", () => {
		seekbar.max = Math.floor(audio.duration);
		durationSpan.textContent = formatTime(audio.duration);
	});

	audio.addEventListener("timeupdate", () => {
		seekbar.value = Math.floor(audio.currentTime);
		currentTimeSpan.textContent = formatTime(audio.currentTime);
	});

	seekbar.oninput = () => {
		audio.currentTime = seekbar.value;
	};
}

function playSong(songTitle, element = null) {
	const songPath = `${folder}/${songTitle}.mp3`;

	document.getElementById("song-info").innerHTML = `<b>${songTitle}</b>`;

	if (currentAudio) {
		currentAudio.pause();
		currentAudio.currentTime = 0;
	}

	currentAudio = new Audio(songPath);
	setupSeekbar(currentAudio);
	currentAudio.play();

	if (element) {
		currentSongElement = element;
	}
}

Array.from(document.getElementsByClassName("play-btn")).forEach((btn) => {
	btn.addEventListener("click", (event) => {
		const button = event.target.closest(".play-btn");
		const card = button.closest(".card");
		const songTitle = card.querySelector("h2").innerText.trim();
		playSong(songTitle);
	});
});

document.getElementById("piche").addEventListener("click", () => {
	if (!currentSongElement) return;

	const prevSibling = currentSongElement.previousElementSibling;
	if (prevSibling && prevSibling.classList.contains("song-item")) {
		const prevSongId = prevSibling.id;
		playSong(prevSongId, prevSibling);
	}
});

document.getElementById("age").addEventListener("click", () => {
	if (!currentSongElement) return;

	const nextSibling = currentSongElement.nextElementSibling;
	if (nextSibling && nextSibling.classList.contains("song-item")) {
		const nextSongId = nextSibling.id;
		playSong(nextSongId, nextSibling);
	}
});


document.getElementById("muteBtn").addEventListener("click", () => {
	if (currentAudio) {
		currentAudio.muted = !currentAudio.muted;
		document.getElementById("muteBtn").innerHTML = currentAudio.muted ? "<i class='fas fa-volume-up'></i>" : "<i class='fas fa-volume-mute'></i>";
	}
});


document.getElementById("play-pause").addEventListener("click", () => {
	if (currentAudio) {
		if (currentAudio.paused) {
			currentAudio.play();
			document.getElementById("play-pause").innerHTML = "<i class='fas fa-pause'></i>";
		} else {
			currentAudio.pause();
			document.getElementById("play-pause").innerHTML = "<i class='fas fa-play'></i>";
		}
	}
});

document.getElementById("reset").addEventListener("click", () => {
	if (currentAudio) {
		currentAudio.currentTime = 0;
		currentAudio.play();
	}
});


document.getElementById('ham_1').addEventListener('click', () => {
	document.querySelector(".left").style.left = "0";
	document.getElementById("ham_1").style.display = "none";
	document.getElementById("ham_2").style.display = "block";
});


document.getElementById('ham_2').addEventListener('click', () => {
	document.querySelector(".left").style.left = "-100vw";
	document.getElementById("ham_2").style.display = "none";
	document.getElementById("ham_1").style.display = "block";
});

document.getElementById("ban").addEventListener("click", () => {
	document.querySelector(".banner").style.display = "none";
});

