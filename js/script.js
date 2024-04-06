console.log("hello spotify");

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
console.log(secondsToMinutesSeconds(123.456)); // Output: 02:03








let currentSong = new Audio();
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let lia = div.getElementsByTagName("a")
    // console.log(li)
    let songs = [];
    for (let index = 0; index < lia.length; index++) {
        const element = lia[index];
        if (typeof element.href === 'string' && element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "/img/pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track);
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}





async function main() {
    let songs = await getSongs();
    // console.log(songs);
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
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
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    //add an event listener to seekar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        console.log(percent);
        document.querySelector(".circle").style.left = percent + '%';
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
    //add event listener for hamurger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

        //add event listener for close button on left pannel
         //add event listener for close button on left pannel
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";

    });

}
main()
