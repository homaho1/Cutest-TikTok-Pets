// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

let nickname = document.getElementById("nickname");

// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.
sendGetRequest("/getWinner")
.then(function(response){
  console.log("response url:", response["url"]);
  console.log("response nickname", response["nickname"]);
  nickname.textContent = response["nickname"];
  showWinningVideo(response["url"]);
});




function showWinningVideo(url) {
  
  let winningUrl = url;
  addVideo(winningUrl, divElmt);
  loadTheVideos();
}
