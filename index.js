"use strict"
// index.js
// This is our main server file

// include express
const express = require("express");

// create object to interface with express
const fetch = require("cross-fetch");

const db = require('./sqlWrap');
const win = require("./pickWinner");

const app = express();

const bodyParser = require('body-parser');
// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging

// make all the files in 'public' available 
app.use(express.static("public"));


app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
});

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myVideo.html");
});

// Need to add response if page not found!
// end of pipeline specification

app.use(bodyParser.text());

app.use(express.json());
// Now listen for HTTP requests

function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  console.log(n);
  return n;
}

app.post('/videoData', (req, res) => {
  console.log("Server recieved a POST request at", req.body);
  // let vidObj = JSON.parse(req.body);
  let vidObj = req.body;
  // console.log("Print vidObj:", vidObj);
  postRequestHandler(vidObj, res);
});

app.get("/getMostRecent", (req, res) => {
  console.log("Server Recieved a GET request");
  returnNewestVid(res);
});

app.get("/getList", async (req,res) => {
  let list = await dumpVideoTable();
  // let obj = await getVideo("hi");
  // console.log("from getlist:", list);
  // console.log(obj.length);
  res.json(list);
});

app.post("/delete", async (req, res) => {
  let deleteObj = JSON.parse(req.body);
  // let deleteObj = req.body;
  console.log("Print deleteObj:", deleteObj);
  const sql = 'delete from videoTable where nickname = ?';
  await db.run(sql, [deleteObj]);
  res.send();
});


app.get("/getTwoVideos", async function(req,res){
  // console.log("gettign two videos");
  let n1 = getRandomInt(8);
  let n2 = getRandomInt(8);
  while(n1 == n2){
    n2 = getRandomInt(8);
  }
  let sql = 'select * from VideoTable';
  let table =  await db.all(sql);
  // console.log(table);
  // console.log(table[n1]["rowIdNum"], table[n2]["rowIdNum"]);
  let result = {};
  result[0] = table[n1];
  result[1] = table[n2];
  // console.log(result);
  res.json(result);
});

app.post("/insertPref", async function(req,res){
  console.log(req.body);
  let json = req.body;
  const sql = "insert into PrefTable (better,worse) values (?,?)"
  console.log(json["better"],json["worse"]);
  await db.run(sql,[json["better"], json["worse"]]);
  // await db.run("delete from PrefTable");
  let table = await dumpPrefTable();
  console.log("pref table's length is: ", table.length);
  if(table.length >= 15){
    res.send("pick winner");
  }else{
    res.send("continue");
  }
});

app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,true);
  console.log("winner's rowIdNum is:", winner);
  // you'll need to send back a more meaningful response here.
  const sql = "select * from VideoTable where rowIdNum = ?";
  let winnerObj = await db.get(sql,[winner]);
  console.log("winnerObj is:", winnerObj);
  res.json(winnerObj);
  } catch(err) {
    res.status(500).send(err);
  }
});

app.use(function(req, res){ 
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


async function postRequestHandler(vidObj, res){
  console.log("vidObj", vidObj);
  let len = await checkVideoNumber(vidObj.userid);
  console.log("len is ",len);
  if(len>=8){
    res.send("tooMuch");
  }else{
    // await dumpTable();
    await updateLastestFlag(vidObj.userid);
    // await dumpTable();
    await insertVideo(vidObj);
    // await dumpTable();
    res.send();
  }
}


// ******************************************** //
// Define async functions to perform the database 
// operations we need

// An async function to insert a video into the database

// async function insertAndCount(vidObj) {

//   await insertVideo(vidObj);
//   const tableContents = await dumpTable();
//   console.log(tableContents.length);
// }
async function returnNewestVid(res) {
  // let wholeTable = await dumpTable();
  // let len = wholeTable.length;
  // console.log("The lenght of the whole table is",len);
  const sql = 'select * from VideoTable where flag = TRUE';
  let result = await db.get(sql);
  console.log("The result sending back is",result);
  res.json(result);
}

async function insertVideo(v) {
  const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";
  
await db.run(sql,[v.url, v.nickname, v.userid]);
  // console.log("vidObj inserted - from insertVideo");
}

async function updateLastestFlag(userid){
  const sql = 'update VideoTable set flag = FALSE where flag = TRUE';
  await db.run(sql);
  console.log("Flag changed");
}
// an async function to get a video's database row by its nickname
async function getVideo(nickname) {
  // warning! You can only use ? to replace table data, not table name or column name.
  const sql = 'select * from VideoTable where nickname = ?';
  let result = await db.get(sql, [nickname]);
  return result;
}

// an async function to get the whole contents of the database 
async function dumpVideoTable() {
  const sql = "select * from VideoTable";
  let result = await db.all(sql);
  // console.log("dumpTable:",result);
  return result;
}

async function dumpPrefTable() {
  const sql = "select * from PrefTable";
  let result = await db.all(sql);
  // console.log("dumpTable:",result);
  return result;
}

async function checkVideoNumber(userid){
  const sql = 'select * from VideoTable';
  let result = await db.all(sql);
  console.log("The DB has ",result.length);
  let len = result.length;
  return len;
}