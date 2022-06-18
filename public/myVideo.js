'use strict';


let playGameButton = document.getElementById("play");
let addNewButton = document.getElementById("addnew");

let names = document.getElementsByClassName("barContent");
let buttons = document.getElementsByClassName("delete");


sendGetRequest("/getList")
.then(function(jsonObj){
  let num = jsonObj.length;
  console.log("Number of object:", num);
  for(let i = 0; i < num; i++){
    // console.log("jsonObj[i].nickname is :",jsonObj[i].nickname);
    names[i].textContent = jsonObj[i].nickname;
    names[i].style.border = "2px solid gray";
    let button = buttons[i]; 
    button.addEventListener("click", function () { deleteButtonAction(i) });
  }
  if(num>=8){
    // playgameButton.addEventListener("click")
    playGameButton.addEventListener("click", playGameAction);
    addNewButton.style.opacity = "0.5";
    // addNewButton.style.color= "blue";
  }else{
    addNewButton.addEventListener("click", addNewButtonAction);
    playGameButton.style.opacity = "0.5";
  }
})

//deleteButton
function deleteButtonAction(i){
  let deleteNickname = names[i].textContent;
  console.log("ready to delete:",deleteNickname);
  let jsonStr = JSON.stringify(deleteNickname);
  console.log("ready to delete jsonStr:",jsonStr);
  // console.log("ready to delete num:" i);
  sendPostRequest("/delete", jsonStr);
}

//sendPostRequest to delete
async function sendPostRequest(url, data){
  console.log("about to send post request from myVideo");
  let response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'text/plain'},
    body: data
  });
  if(response.ok){
    window.location.reload();
  }else{
    throw Error(response.status);
  }
} 

// let addNewButton = document.getElementById("addnew");
// addNewButton.addEventListener("click", addNewButtonAction)
function addNewButtonAction(){
  window.location = "./tiktokpets.html";
}

function playGameAction(){
  window.location = "./compare.html";
}

async function sendGetRequest(url){
  console.log("sending first get request to get info of DB");
  let response = await fetch(url, { //fetch: sends a request from client to the server
    method: 'GET',
  });
  if (response.ok) { //
    let data = await response.json(); 
    // console.log("1:",data[0].nickname, "2:",data[1].nickname,"3:",data[2].nickname, "length:", data.length);
    return data;
  } else {
    throw Error(response.status);
  }
}
