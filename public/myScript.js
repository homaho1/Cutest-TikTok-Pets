'use strict';

let subButton = document.getElementById("subButton");
subButton.addEventListener("click", subButtonAction);

let myVidButton = document.getElementById("myVids");
myVidButton.addEventListener("click", myVidButtonAction);

async function sendPostRequest(url, data) {
  console.log("about to send post request from myScript");
  let response = await fetch(url, { //fetch: sends a request from client to the server
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  });
  if (response.ok) { //
    let data = await response.text(); //return bob cat vid .text() is 
    return data;
  } else {
    throw Error(response.status);
  }
}


function subButtonAction() {
  let username = document.getElementById("username").value;
  let url = document.getElementById("url").value;
  let nickname = document.getElementById("nickname").value;
  let str = {"url": url, "nickname": nickname, "userid": username};
  let output = JSON.stringify(str);

  //console.log(`${output}`); // template literal => turn into a string
  sendPostRequest("/videoData", output)
    .then(function(data) {
      if(data == "tooMuch"){
        alert("database full, can only add 8 videos");
      }else{
        window.location = "./videoPreview.html";
      }
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
}

function myVidButtonAction(){
  window.location = "./myVideo.html";
}