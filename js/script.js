function secondsToMinutesSeconds(seconds) {
    // Round seconds to nearest whole number
    seconds = Math.round(seconds);

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Ensure two digits for minutes and seconds
    var minutesStr = (minutes < 10 ? '0' : '') + minutes;
    var secondsStr = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    return minutesStr + ':' + secondsStr;
}

// Example usage:
// console.log(secondsToMinutesSeconds(123.456)); // Output: 02:03



let currentSong = new Audio();
let songs;
let currFolder;


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let lia = div.getElementsByTagName("a")
    // console.log(li)
    songs = [];
    for (let index = 0; index < lia.length; index++) {
        const element = lia[index];
        if (typeof element.href === 'string' && element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li><img src="/img/music.svg" class="invert">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Yashraj_K</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img src="/img/play.svg" class="invert">
                            </div></li>`;
    }
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "/img/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    // console.log(div)
    let anchors = div.getElementsByTagName("a")
    // console.log(anchors)
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]

        // console.log(e.href)
        if (e.href.includes("/songs/")) {
            // console.log(e.href)
            let folder = e.href.split("songs/").slice(-1)[0]
            // console.log(folder)
            // get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <!-- <div class="play"> -->
            <div class="play">
                <div class="play-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                        fill="#33333">
                        <path
                            d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                            stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>

            <!-- </div> -->

            <img src="songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>

        </div>`
        }
    }


    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
}



async function main() {
    await getSongs("songs/ncs");
    // console.log(songs);
    playMusic(songs[0], true)

    // display all the albums on the page
    displayAlbums()

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "/img/play.svg";
        }
    })
    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    //add an event listener to seekar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // console.log(percent);
        document.querySelector(".circle").style.left = percent + '%';
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
    //add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //add event listener for close button on left panel
    //add event listener for close button on left panel
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";

    });

    // add event listener to previous and next button
    previous.addEventListener("click", () => {
        console.log("previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs, index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })


    next.addEventListener("click", () => {
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(songs, index);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting value to ", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    // add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", (e) => {
        // console.log(e.target)
        // console.log("changing", e.target.svg)
        if (e.target.src.includes("volume.svg")) {
            currentSong.volume = 0;
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            currentSong.volume = .10;
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


}
main()
