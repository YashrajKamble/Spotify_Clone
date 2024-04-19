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





async function main() {
    await getSongs("songs/ncs");
    // console.log(songs);
    playMusic(songs[0], true)



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

    //add event listener for close button on left pannel
    //add event listener for close button on left pannel
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";

    });

    // add event listenser to previous and next button
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

    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
}
main()
