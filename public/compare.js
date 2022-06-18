let videoElmts = document.getElementsByClassName("tiktokDiv");

const nicknames = document.getElementsByClassName("nickname");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");

let unlovedButtons = document.getElementsByClassName("unloved");
let lovedButtons = document.getElementsByClassName("loved");

let nextButton = document.getElementById("next");


for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  let button = heartButtons[i];
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  button.addEventListener("click", function(){ heartButtonAction(i) })
} // for loop

let urls = [];
let vid1Id, vid2Id;
//
sendGetRequest("/getTwoVideos")
.then(function(twoVideosURL){
  console.log("first url:", twoVideosURL[0]["url"]);
  console.log("second url", twoVideosURL[1]["url"]);
  vid1Id = twoVideosURL[0]["rowIdNum"];
  vid2Id = twoVideosURL[1]["rowIdNum"];
  console.log("urls", urls);
  urls = [ twoVideosURL[0]["url"], twoVideosURL[1]["url"]];
  console.log("real urls:",urls);
  for(let i = 0; i < 2; i++){
    nicknames[i].textContent = twoVideosURL[i]["nickname"];
  }
  // let msg = nicknameID.textContent;
  // msg = msg.replace("nickname", nickname);
  // nicknameID.textContent = msg;

  for (let i=0; i<2; i++) {
      addVideo(urls[i],videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
})  
.catch( function(err) {
  console.log("GET request error",err);
});
// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
// const urls1 = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
// "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];
// console.log(urls1);

function heartButtonAction(i){
  unlovedButtons[i].style.display = "none";
  lovedButtons[i].style.display = "inline";
  if(i == 0){
    unlovedButtons[1].style.display = "inline";
    lovedButtons[1].style.display = "none";
  }else{
    unlovedButtons[0].style.display = "inline";
    lovedButtons[0].style.display = "none";
  }
  nextButton.addEventListener("click", nextButtonAction);
}

function nextButtonAction(){
  let jsonObj = {};
  if(lovedButtons[0].style.display == "inline"){
    jsonObj = {
      "better" : vid1Id,
      "worse" : vid2Id
    }
  }else{
    jsonObj = {
      "better" : vid2Id,
      "worse" : vid1Id
    }
  }
  console.log(jsonObj);
  sendPostRequest("/insertPref",jsonObj)
  .then(function(response){
    console.log(response);
    if(response == "continue"){
      console.log("response is continue");
      window.location.reload();
    }else if(response == "pick winner"){
      console.log("response is pick winner");
      window.location = "./winner.html";
    }
  })
  .catch(function(err){
    console.log(err);
  })
}

    