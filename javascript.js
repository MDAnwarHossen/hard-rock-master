//......................... API URL.......................................................................
const apiURL = "https://api.lyrics.ovh";


//...........................Search Button Click Event Handler .................................................
document.getElementById('explore-button').addEventListener('click', () =>{
    const searchText = document.getElementById('input-text').value.trim();
    document.getElementById('result').innerHTML = "";
    document.getElementById('lyrics').innerHTML = "";
    fetchSong(searchText);
})

//............................Fetch Song............................................................
async function fetchSong(inputText) {
    const output = await fetch(`${apiURL}/suggest/${inputText}`);
    const data = await output.json();
    displayResult(data);

}

//................................ Display lyrics title and artist........................................
const displayResult = data => {
    if (data.total == 0) { 
        document.getElementById('result').innerHTML = "Sorry, we couldn't find a match for you this time. Please try another keyword " // If nothing found
    } else {
        document.getElementById('result').innerHTML = `
         ${data.data.slice(0,10) // showing first 10 result
        .map(
          songInfo => `
          <div class="single-result row align-items-center my-3 p-3">
            <div class="col-md-9">
                <h3 class="lyrics-name">${songInfo.title}</h3>
                <p class="author lead mb-1">Album by <span>${songInfo.artist.name}</span></p>
            </div>
            <div class="col-md-3 text-md-right text-center">
            <button class="btn btn-success" data-artist="${songInfo.artist.name}" data-song-title="${songInfo.title}" >Get Lyrics</button>
            </div>
          </div>
        `
        )
        .join('')}`
    }
};

// .....................Lyrics Button Click Event Handler...................................................
document.getElementById('result').addEventListener('click', event => {
    const clickedElement = event.target;

    if (clickedElement.tagName == "BUTTON") {
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute("data-song-title");

        fetchLyrics(artist, songTitle);
    }
});

//....................... Fetching lyrics by artist and title................................................
async function fetchLyrics(artist, songTitle) {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await response.json();
    document.getElementById('result').innerHTML = "";

    if (data.error) {

        setTimeout(() => document.getElementById('lyrics').innerHTML = "This lyrics is not available right now. Please try again later", 500);
        
    
    } else {
        const lyricsLines = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

        document.getElementById('lyrics').innerHTML = `
        
          <h2 class="text-success mb-4">${artist}</strong> - ${songTitle}</h2>
          <pre class="lyric text-white">
          ${lyricsLines}
          </pre>`;
    }
}