// This viewer takes a TikTok video URL and displays it in a nice magenta box, and gives it a reload button in case you want to watch it again. 

// for example, these are hardcoded
// const example = 'https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854';


// grab elements we'll use 
// these are global! 
let reloadButton = document.getElementById("reload");
let divElmt = document.getElementById("tiktokDiv");
let continueButton = document.getElementById("continue");


// set up button
reloadButton.addEventListener("click",reloadVideo);

continueButton.addEventListener("click", continueButtonAction);

let example;
sendGetRequest("/getMostRecent")
.then(function(data) {
  console.log("data");
  example = data.url;
  addVideo(example,divElmt);
  changeNickname(data.nickname);
  loadTheVideos();
  })
  .catch(function(error) {
    console.log("Error occurred:", error)
  });

// add the blockquote element that TikTok wants to load the video into
// on start-up, load the videos


//get request function

async function sendGetRequest(url) {
  console.log("about to send get request - from videoViewer");
  let response = await fetch(url, { //fetch: sends a request from client to the server
    method: 'GET',
  });
  if (response.ok) { //
    let data = await response.json(); 
    return data;
  } else {
    throw Error(response.status);
  }
}


//change the nickname
function changeNickname(nickname){
  const nicknameID = document.getElementById("nickname");
  let msg = nicknameID.textContent;
  msg = msg.replace("nickname", nickname);
  nicknameID.textContent = msg;
}


// Add the blockquote element that tiktok will load the video into
async function addVideo(tiktokurl,divElmt) {

  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');
  block.className = "tiktok-embed";
  block.cite = tiktokurl;
  // have to be formal for attribute with dashes
  block.setAttribute("data-video-id",videoNumber);
  block.style = "width: 325px; height: 563px;"

  let section = document.createElement('section');
  block.appendChild(section);
  
  divElmt.appendChild(block);
}

// Ye olde JSONP trick; to run the script, attach it to the body
function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

// makes a script node which loads the TikTok embed script
function newTikTokScript() {
  let script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js"
  script.id = "tiktokScript"
  return script;
}

//continueButtonAction
function continueButtonAction(){
  window.location = "./myVideo.html";
}
// the reload button; takes out the blockquote and the scripts, and puts it all back in again.
// the browser thinks it's a new video and reloads it
function reloadVideo () {
  
  // get the two blockquotes
  let blockquotes  = document.getElementsByClassName("tiktok-embed");

  // and remove the indicated one
    block = blockquotes[0];
    console.log("block",block);
    let parent = block.parentNode;
    parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;

  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(example,divElmt);
  loadTheVideos();
}

