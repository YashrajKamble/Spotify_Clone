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
            songs.push(element.href);
        }
    }
    return songs;
}
 async function main() {
    let songs =await getSongs();
    console.log(songs)
}

main();


