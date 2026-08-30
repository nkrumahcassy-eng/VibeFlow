// ===============================
// VIBEFLOW MUSIC APP
// ===============================


// ===============================
// SONGS
// ===============================

const songs = [
  {
    title: "Midnight Vibes",
    artist: "VibeFlow Artist",
    mood: "late-night",
    cover: "images/midnight.jpg",
    audio: "music/midnight-vibes.mp3"
    
  },

  {
    title: "After Hours",
    artist: "VibeFlow Artist",
    mood: "soul",
    cover: "images/after-hours.jpg",
    audio: "music/after-hours.mp3"
    
  },

  {
    title: "Golden Nights",
    artist: "VibeFlow Artist",
    mood: "energy",
    cover: "images/golden-nights.jpg",
    audio: "music/golden-nights.mp3"
    
  }
];


// ===============================
// AUDIO
// ===============================

const audioPlayer =
  document.getElementById("audioPlayer");

const playerTitle =
  document.getElementById("playerTitle");

const playerArtist =
  document.getElementById("playerArtist");

const playerAlbum =
  document.getElementById("playerAlbum");

const mainPlay =
  document.getElementById("mainPlay");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");

const progress =
  document.getElementById("progress");

const currentTime =
  document.getElementById("currentTime");

const duration =
  document.getElementById("duration");


let currentSong = 0;


// ===============================
// PLAY SONG
// ===============================

function playSong(index) {

  if (!songs[index]) return;

  currentSong = index;

  const song = songs[index];

  audioPlayer.src = song.audio;

  playerTitle.textContent = song.title;

  playerArtist.textContent = song.artist;

  playerAlbum.style.backgroundImage =
    `url("${song.cover}")`;

  audioPlayer.play();

  mainPlay.textContent = "⏸";

}


// ===============================
// PLAY / PAUSE
// ===============================

mainPlay.addEventListener("click", () => {

  if (!audioPlayer.src) {

    playSong(currentSong);

    return;
  }


  if (audioPlayer.paused) {

    audioPlayer.play();

    mainPlay.textContent = "⏸";

  } else {

    audioPlayer.pause();

    mainPlay.textContent = "▶";

  }

});


// ===============================
// PREVIOUS SONG
// ===============================

prevBtn.addEventListener("click", () => {

  currentSong--;

  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }

  playSong(currentSong);

});


// ===============================
// NEXT SONG
// ===============================

nextBtn.addEventListener("click", () => {

  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  playSong(currentSong);

});


// ===============================
// AUTO NEXT SONG
// ===============================

audioPlayer.addEventListener("ended", () => {

  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  playSong(currentSong);

});


// ===============================
// TIME UPDATE
// ===============================

audioPlayer.addEventListener(
  "timeupdate",
  () => {

    if (!audioPlayer.duration) return;

    const percent =
      (audioPlayer.currentTime /
        audioPlayer.duration) * 100;

    progress.value = percent;

    currentTime.textContent =
      formatTime(audioPlayer.currentTime);

  }
);


// ===============================
// DURATION
// ===============================

audioPlayer.addEventListener(
  "loadedmetadata",
  () => {

    duration.textContent =
      formatTime(audioPlayer.duration);

  }
);


// ===============================
// PROGRESS BAR
// ===============================

progress.addEventListener("input", () => {

  if (!audioPlayer.duration) return;

  audioPlayer.currentTime =
    (progress.value / 100) *
    audioPlayer.duration;

});


// ===============================
// FORMAT TIME
// ===============================

function formatTime(seconds) {

  if (isNaN(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const remainingSeconds =
    Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;

}


// ===============================
// SONG CARD PLAY BUTTONS
// ===============================

const playButtons =
  document.querySelectorAll(".play-btn");

playButtons.forEach((button, index) => {

  button.addEventListener("click", () => {

    playSong(index);

  });

});


// ===============================
// FAVORITES
// ===============================

let favorites =
  JSON.parse(
    localStorage.getItem(
      "vibeflowFavorites"
    )
  ) || [];


const favoriteButtons =
  document.querySelectorAll(
    ".favorite-btn"
  );


function updateFavoriteButtons() {

  favoriteButtons.forEach(
    (button, index) => {

      if (favorites.includes(index)) {

        button.textContent = "♥";

        button.classList.add(
          "saved"
        );

      } else {

        button.textContent = "♡";

        button.classList.remove(
          "saved"
        );

      }

    }
  );

}


favoriteButtons.forEach(
  (button, index) => {

    button.addEventListener(
      "click",
      () => {

        if (
          favorites.includes(index)
        ) {

          favorites =
            favorites.filter(
              songIndex =>
                songIndex !== index
            );

        } else {

          favorites.push(index);

        }


        localStorage.setItem(
          "vibeflowFavorites",
          JSON.stringify(
            favorites
          )
        );


        updateFavoriteButtons();

        updateFavoriteCount();

      }
    );

  }
);


updateFavoriteButtons();


// ===============================
// FAVORITE COUNT
// ===============================

function updateFavoriteCount() {

  const favoriteCount =
    document.getElementById(
      "favoriteCount"
    );

  if (favoriteCount) {

    favoriteCount.textContent =
      favorites.length;

  }

}

updateFavoriteCount();


// ===============================
// SEARCH
// ===============================

const searchInput =
  document.getElementById(
    "searchInput"
  );

const searchResults =
  document.getElementById(
    "searchResults"
  );


if (
  searchInput &&
  searchResults
) {

  searchInput.addEventListener(
    "input",
    () => {

      const searchText =
        searchInput.value
          .toLowerCase()
          .trim();


      if (searchText === "") {

        searchResults.innerHTML = "";

        searchResults.style.display =
          "none";

        return;

      }


      const matches =
        songs.filter(song =>

          song.title
            .toLowerCase()
            .includes(searchText)

          ||

          song.artist
            .toLowerCase()
            .includes(searchText)

        );


      searchResults.style.display =
        "block";


      if (matches.length === 0) {

        searchResults.innerHTML = `
          <p style="
            color:#77728a;
            padding:20px 5px;
          ">
            No songs found 🎧
          </p>
        `;

        return;

      }


      searchResults.innerHTML =
        matches.map(song => {

          const index =
            songs.indexOf(song);


          return `
            <div class="search-result">

              <img
                src="${song.cover}"
                alt="${song.title}"
              >

              <div
                class="search-result-info"
              >

                <h3>
                  ${song.title}
                </h3>

                <p>
                  ${song.artist}
                </p>

              </div>

              <button
                onclick="playSong(${index})"
              >
                ▶
              </button>

            </div>
          `;

        }).join("");

    }
  );

}


// ===============================
// PAGE SECTIONS
// ===============================

const homeSection =
  document.getElementById(
    "homeSection"
  );

const searchSection =
  document.getElementById(
    "searchSection"
  );

const librarySection =
  document.getElementById(
    "librarySection"
  );

const profileSection =
  document.getElementById(
    "profileSection"
  );


// ===============================
// NAVIGATION BUTTONS
// ===============================

const homeNav =
  document.getElementById(
    "homeNav"
  );

const searchNav =
  document.getElementById(
    "searchNav"
  );

const libraryNav =
  document.getElementById(
    "libraryNav"
  );

const profileNav =
  document.getElementById(
    "profileNav"
  );

const profileTopBtn =
  document.getElementById(
    "profileTopBtn"
  );


// ===============================
// HIDE ALL PAGES
// ===============================

function hideAllPages() {

  homeSection.style.display =
    "none";

  searchSection.style.display =
    "none";

  librarySection.style.display =
    "none";

  profileSection.style.display =
    "none";

}


// ===============================
// NAV ACTIVE STATE
// ===============================

function clearActiveNav() {

  document
    .querySelectorAll(".nav-item")
    .forEach(item => {

      item.classList.remove(
        "active"
      );

    });

}


// ===============================
// HOME
// ===============================

function showHome() {

  hideAllPages();

  homeSection.style.display =
    "block";

  clearActiveNav();

  homeNav.classList.add(
    "active"
  );

}


// ===============================
// SEARCH PAGE
// ===============================

function showSearch() {

  hideAllPages();

  searchSection.style.display =
    "block";

  clearActiveNav();

  searchNav.classList.add(
    "active"
  );

  setTimeout(() => {

    searchInput.focus();

  }, 100);

}


// ===============================
// LIBRARY
// ===============================

function showLibrary() {

  hideAllPages();

  librarySection.style.display =
    "block";

  clearActiveNav();

  libraryNav.classList.add(
    "active"
  );

  displayLibrary();

}


// ===============================
// PROFILE
// ===============================

function showProfile() {

  hideAllPages();

  profileSection.style.display =
    "block";

  clearActiveNav();

  profileNav.classList.add(
    "active"
  );

  updateFavoriteCount();

}


// ===============================
// NAVIGATION EVENTS
// ===============================

homeNav.addEventListener(
  "click",
  showHome
);


searchNav.addEventListener(
  "click",
  showSearch
);


libraryNav.addEventListener(
  "click",
  showLibrary
);


profileNav.addEventListener(
  "click",
  showProfile
);


profileTopBtn.addEventListener(
  "click",
  showProfile
);


// ===============================
// DISPLAY LIBRARY
// ===============================

function displayLibrary() {

  const librarySongs =
    document.getElementById(
      "librarySongs"
    );


  if (!librarySongs) return;


  if (favorites.length === 0) {

    librarySongs.innerHTML = `
      <div style="
        text-align:center;
        padding:40px 10px;
        color:#77728a;
      ">

        <div style="
          font-size:40px;
          margin-bottom:12px;
        ">
          ♡
        </div>

        <h3 style="
          color:#ddd8ef;
          margin-bottom:7px;
        ">
          Your library is empty
        </h3>

        <p>
          Favorite songs and they'll
          appear here.
        </p>

      </div>
    `;

    return;

  }


  librarySongs.innerHTML =
    favorites.map(index => {

      const song = songs[index];


      return `
        <div class="library-song">

          <img
            src="${song.cover}"
            alt="${song.title}"
          >

          <div
            class="library-song-info"
          >

            <h3>
              ${song.title}
            </h3>

            <p>
              ${song.artist}
            </p>

          </div>

          <button
            onclick="playSong(${index})"
          >
            ▶
          </button>

        </div>
      `;

    }).join("");

}


// ===============================
// START ON HOME
// ===============================

showHome();
// ===============================
// PLAYLISTS
// ===============================

let playlists =
  JSON.parse(
    localStorage.getItem(
      "vibeflowPlaylists"
    )
  ) || [];


const playlistModal =
  document.getElementById(
    "playlistModal"
  );

const createPlaylistBtn =
  document.getElementById(
    "createPlaylistBtn"
  );

const closePlaylistModal =
  document.getElementById(
    "closePlaylistModal"
  );

const savePlaylistBtn =
  document.getElementById(
    "savePlaylistBtn"
  );

const playlistName =
  document.getElementById(
    "playlistName"
  );

const playlistList =
  document.getElementById(
    "playlistList"
  );


// OPEN MODAL

createPlaylistBtn.addEventListener(
  "click",
  () => {

    playlistModal.classList.add(
      "show"
    );

    playlistName.focus();

  }
);


// CLOSE MODAL

closePlaylistModal.addEventListener(
  "click",
  () => {

    playlistModal.classList.remove(
      "show"
    );

  }
);


// CLOSE WHEN CLICKING OUTSIDE

playlistModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === playlistModal
    ) {

      playlistModal.classList.remove(
        "show"
      );

    }

  }
);


// CREATE PLAYLIST

savePlaylistBtn.addEventListener(
  "click",
  () => {

    const name =
      playlistName.value.trim();


    if (!name) {

      playlistName.focus();

      return;

    }


    const newPlaylist = {

      id: Date.now(),

      name: name,

      songs: []

    };


    playlists.push(
      newPlaylist
    );


    localStorage.setItem(
      "vibeflowPlaylists",
      JSON.stringify(
        playlists
      )
    );


    playlistName.value = "";

    playlistModal.classList.remove(
      "show"
    );


    displayPlaylists();

  }
);


// DISPLAY PLAYLISTS

function displayPlaylists() {

  if (
    !playlistList
  ) return;


  if (
    playlists.length === 0
  ) {

    playlistList.innerHTML = `
      <p style="
        color:#77728a;
        font-size:12px;
        grid-column:1/-1;
        padding:15px 0;
      ">
        You haven't created a playlist yet.
      </p>
    `;

    return;

  }


  playlistList.innerHTML =
    playlists.map(
      playlist => {

        return `
          <div
            class="playlist-card"
          >

            <div
              class="playlist-cover"
            >
              🎧
            </div>

            <h3>
              ${playlist.name}
            </h3>

            <p>
              ${playlist.songs.length}
              songs
            </p>

          </div>
        `;

      }
    ).join("");

}


// INITIAL DISPLAY

displayPlaylists();
// ===============================
// PLAYLIST PICKER
// ===============================

const playlistPicker =
  document.getElementById("playlistPicker");

const pickerPlaylists =
  document.getElementById("pickerPlaylists");

const closePicker =
  document.getElementById("closePicker");

let selectedSongIndex = null;


// OPEN PLAYLIST PICKER

function openPlaylistPicker(songIndex) {

  selectedSongIndex = songIndex;

  displayPickerPlaylists();

  playlistPicker.classList.add("show");

}


// DISPLAY PLAYLISTS

function displayPlaylists() {

  if (!playlistList) return;


  if (playlists.length === 0) {

    playlistList.innerHTML = `
      <p style="
        color:#77728a;
        font-size:12px;
        grid-column:1/-1;
        padding:15px 0;
      ">
        You haven't created a playlist yet.
      </p>
    `;

    return;
  }


  playlistList.innerHTML =
    playlists.map(playlist => {

      return `
        <button
          class="playlist-card"
          onclick="openPlaylist(${playlist.id})"
        >

          <div class="playlist-cover">
            🎧
          </div>

          <h3>
            ${playlist.name}
          </h3>

          <p>
            ${playlist.songs.length} songs
          </p>

        </button>
      `;

    }).join("");

}


  pickerPlaylists.innerHTML =
    playlists.map(playlist => {

      return `
        <button
          class="picker-playlist"
          onclick="addSongToPlaylist(${playlist.id})"
        >

          <div class="picker-playlist-icon">
            🎧
          </div>

          <div>

            <strong>
              ${playlist.name}
            </strong>

            <small>
              ${playlist.songs.length} songs
            </small>

          </div>

        </button>
      `;

    }).join("");




// ADD SONG TO PLAYLIST

function addSongToPlaylist(playlistId) {

  const playlist =
    playlists.find(
      playlist =>
        playlist.id === playlistId
    );


  if (
    !playlist ||
    selectedSongIndex === null
  ) {
    return;
  }


  if (
    !playlist.songs.includes(
      selectedSongIndex
    )
  ) {

    playlist.songs.push(
      selectedSongIndex
    );

  }


  localStorage.setItem(
    "vibeflowPlaylists",
    JSON.stringify(playlists)
  );


  playlistPicker.classList.remove(
    "show"
  );


  displayPlaylists();

}


// CLOSE PICKER

closePicker.addEventListener(
  "click",
  () => {

    playlistPicker.classList.remove(
      "show"
    );

  }
);


// CLOSE WHEN CLICKING OUTSIDE

playlistPicker.addEventListener(
  "click",
  event => {

    if (
      event.target === playlistPicker
    ) {

      playlistPicker.classList.remove(
        "show"
      );

    }

  }
);
// ===============================
// OPEN PLAYLIST
// ===============================

const playlistPage =
  document.getElementById("playlistPage");

const playlistPageName =
  document.getElementById("playlistPageName");

const playlistPageCount =
  document.getElementById("playlistPageCount");

const playlistPageSongs =
  document.getElementById("playlistPageSongs");

const backToProfile =
  document.getElementById("backToProfile");


function openPlaylist(playlistId) {

  const playlist =
    playlists.find(
      item => item.id === playlistId
    );

  if (!playlist) return;


  // Hide other pages

  hideAllPages();


  // Show playlist page

  playlistPage.style.display =
    "block";


  // Playlist information

  playlistPageName.textContent =
    playlist.name;

  playlistPageCount.textContent =
    `${playlist.songs.length} ${
      playlist.songs.length === 1
        ? "song"
        : "songs"
    }`;


  // Empty playlist

  if (playlist.songs.length === 0) {

    playlistPageSongs.innerHTML = `
      <div class="empty-playlist">

        <div class="empty-playlist-icon">
          🎧
        </div>

        <h3>
          This playlist is empty
        </h3>

        <p>
          Add some songs to get started.
        </p>

      </div>
    `;

    return;

  }


  // Display playlist songs

  playlistPageSongs.innerHTML =
    playlist.songs.map(songIndex => {

      const song =
        songs[songIndex];

      if (!song) return "";


      return `
  <div class="playlist-song">

    <img
      src="${song.cover}"
      alt="${song.title}"
    >

    <div class="playlist-song-info">

      <h3>
        ${song.title}
      </h3>

      <p>
        ${song.artist}
      </p>

    </div>

    <button
      class="playlist-play-btn"
      onclick="playSong(${songIndex})"
    >
      ▶
    </button>

    <button
      class="playlist-remove-btn"
      onclick="removeSongFromPlaylist(
        ${playlist.id},
        ${songIndex}
      )"
    >
      ×
    </button>

  </div>
`;

    }).join("");

}


// ===============================
// BACK TO PROFILE
// ===============================

backToProfile.addEventListener(
  "click",
  () => {

    showProfile();

  }
);
// ===============================
// REMOVE SONG FROM PLAYLIST
// ===============================

function removeSongFromPlaylist(
  playlistId,
  songIndex
) {

  const playlist =
    playlists.find(
      item => item.id === playlistId
    );

  if (!playlist) return;


  playlist.songs =
    playlist.songs.filter(
      index => index !== songIndex
    );


  localStorage.setItem(
    "vibeflowPlaylists",
    JSON.stringify(playlists)
  );


  openPlaylist(playlistId);

  displayPlaylists();

}
// ===============================
// NOW PLAYING SCREEN
// ===============================

const nowPlayingPage =
  document.getElementById("nowPlayingPage");

const nowPlayingCover =
  document.getElementById("nowPlayingCover");

const nowPlayingTitle =
  document.getElementById("nowPlayingTitle");

const nowPlayingArtist =
  document.getElementById("nowPlayingArtist");

const nowPlayingProgress =
  document.getElementById("nowPlayingProgress");

const nowPlayingCurrent =
  document.getElementById("nowPlayingCurrent");

const nowPlayingDuration =
  document.getElementById("nowPlayingDuration");

const nowPlayingPlay =
  document.getElementById("nowPlayingPlay");

const nowPlayingPrev =
  document.getElementById("nowPlayingPrev");

const nowPlayingNext =
  document.getElementById("nowPlayingNext");

const closeNowPlaying =
  document.getElementById("closeNowPlaying");


// OPEN NOW PLAYING

function openNowPlaying() {

  const song = songs[currentSong];

  if (!song) return;

  nowPlayingCover.src =
    song.cover;

  nowPlayingTitle.textContent =
    song.title;

  nowPlayingArtist.textContent =
    song.artist;

  nowPlayingPage.style.display =
    "block";

  updateNowPlayingButton();

}


// CLOSE

closeNowPlaying.addEventListener(
  "click",
  () => {

    nowPlayingPage.style.display =
      "none";

  }
);


// PLAY / PAUSE

nowPlayingPlay.addEventListener(
  "click",
  () => {

    if (audioPlayer.paused) {

      audioPlayer.play();

    } else {

      audioPlayer.pause();

    }

  }
);


// UPDATE PLAY BUTTON

function updateNowPlayingButton() {

  nowPlayingPlay.textContent =
    audioPlayer.paused
      ? "▶"
      : "⏸";

}


// AUDIO STATE

audioPlayer.addEventListener(
  "play",
  updateNowPlayingButton
);

audioPlayer.addEventListener(
  "pause",
  updateNowPlayingButton
);


// PREVIOUS

nowPlayingPrev.addEventListener(
  "click",
  () => {

    currentSong--;

    if (currentSong < 0) {
      currentSong = songs.length - 1;
    }

    playSong(currentSong);

    openNowPlaying();

  }
);


// NEXT

nowPlayingNext.addEventListener(
  "click",
  () => {

    currentSong++;

    if (currentSong >= songs.length) {
      currentSong = 0;
    }

    playSong(currentSong);

    openNowPlaying();

  }
);


// UPDATE NOW PLAYING PROGRESS

audioPlayer.addEventListener(
  "timeupdate",
  () => {

    if (!audioPlayer.duration) return;

    const percent =
      (audioPlayer.currentTime /
        audioPlayer.duration) * 100;

    nowPlayingProgress.value =
      percent;

    nowPlayingCurrent.textContent =
      formatTime(
        audioPlayer.currentTime
      );

  }
);


// DURATION

audioPlayer.addEventListener(
  "loadedmetadata",
  () => {

    nowPlayingDuration.textContent =
      formatTime(
        audioPlayer.duration
      );

  }
);


// SEEK

nowPlayingProgress.addEventListener(
  "input",
  () => {

    if (!audioPlayer.duration) return;

    audioPlayer.currentTime =
      (nowPlayingProgress.value / 100) *
      audioPlayer.duration;

  }
);
// OPEN NOW PLAYING FROM MINI PLAYER

const miniPlayer =
  document.getElementById("miniPlayer");

if (miniPlayer) {

  miniPlayer.addEventListener(
    "click",
    (event) => {

      // Don't open when pressing
      // the player controls.

      if (
        event.target.closest(
          "button"
        ) ||
        event.target.closest(
          "input"
        )
      ) {
        return;
      }

      openNowPlaying();

    }
  );

}
// ===============================
// BROWSE BY MOOD
// ===============================

const moodButtons =
  document.querySelectorAll(".mood-card");


moodButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const selectedMood =
        button.dataset.mood;


      const filteredSongs =
        songs.filter(
          song =>
            song.mood === selectedMood
        );


      displayMoodSongs(
        filteredSongs,
        selectedMood
      );

    }
  );

});


// DISPLAY MOOD SONGS

function displayMoodSongs(
  filteredSongs,
  mood
) {

  console.log(
    `Showing ${filteredSongs.length} songs for ${mood}`
  );


  if (filteredSongs.length === 0) {

    alert(
      "No songs have been added to this mood yet."
    );

    return;

  }


  // Show the matching songs
  // in the main song grid.

  const songGrid =
    document.querySelector(
      ".music-grid"
    );


  if (!songGrid) return;


  songGrid.innerHTML =
    filteredSongs.map(
      (song, index) => {

        const originalIndex =
          songs.indexOf(song);


        return `
          <div class="music-card">

            <div class="album">

              <img
                src="${song.cover}"
                alt="${song.title}"
              >

            </div>

            <div class="song-info">

              <h3>
                ${song.title}
              </h3>

              <p>
                ${song.artist}
              </p>

            </div>

            <div class="card-actions">

              <button
                class="play-btn"
                onclick="playSong(${originalIndex})"
              >
                ▶
              </button>

              <button
                class="favorite-btn"
              >
                ♡
              </button>

              <button
                class="add-playlist-btn"
                onclick="openPlaylistPicker(${originalIndex})"
              >
                ⋯
              </button>

            </div>

          </div>
        `;

      }
    ).join("");

}
// ===============================
// VIBEFLOW OFFLINE SUPPORT
// ===============================

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .then(() => {
          console.log(
            "VibeFlow offline support ready."
          );
        })
        .catch(error => {
          console.log(
            "Offline support unavailable:",
            error
          );
        });

    }
  );

}