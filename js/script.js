console.log("hello spotify");


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
async function main() {
    let songs = await getSongs();
    console.log(songs);

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
                            </div>
       </li>`;
    }

    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    })
}

main();


