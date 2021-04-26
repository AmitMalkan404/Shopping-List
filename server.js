const express = require('express');
const app = express();

app.use(
    express.urlencoded({
      extended: true
    })
  )
  
app.use(express.json())
const port = 8080;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type'); 
  next();
})

var sidelist = {};

var mainlist = {};
var i = 0;
var j = 0;

/////////////////////////// SIDE LIST /////////////////////////// 
app.get('/api/side/send', function (req, res) {
  console.log("SIDE : Send list request");
  var sideArr = Object.values(sidelist);
  const keys = Object.keys(sidelist);
  for (let i = 0; i < sideArr.length; i++) {
    var value = sideArr[i];
    var key = keys[i];
    if (value == '') {
      delete sidelist[key];
    }
  }
  res.send(sidelist);
});

app.get('/api/side/delete/:prod', function (req, res) {
  console.log("SIDE : Delete request");
  var prod = req.params.prod;
  const values = Object.values(sidelist);
  const keys = Object.keys(sidelist);
  for (let i = 0; i < values.length; i++) {
    var value = values[i];
    var key = keys[i];
    if (value == prod) {
      delete sidelist[key];
    }
  }
  console.log(sidelist)
  res.send(200);
});

// Recieving new json of product and amount - adding it to the list
app.post('/api/side/add', function (req, res) {
    console.log("SIDE : Add request");
    i++;
    console.log(req.body);
    product = req.body.product;
    const values = Object.values(sidelist);
    var flag = false;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (value == product) {
        flag = true;
      }
    }
    if (flag == false) {
      sidelist["product"+i] = product
    }
    console.log(sidelist);
    res.send(200);
});


/////////////////////////// MAIN LIST /////////////////////////// 
app.get('/api/main/send', function (req, res) {
  console.log("MAIN : Send list request");  
  res.send(mainlist);
});

app.get('/api/main/deleteAll', function (req, res) {
  console.log("MAIN : Delete list request");  
  mainlist = {}
  j = 0;
  res.send(200);
});

app.get('/api/main/delete/:prod', function (req, res) {
  console.log("MAIN : Delete request");
  var prod = req.params.prod;
  const values = Object.values(mainlist);
  const keys = Object.keys(mainlist);
  for (let k = 0; k < values.length; k++) {
    var value = values[k];
    var key = keys[k];
    if (value.product == prod) {
      delete mainlist[key];
    }
  }
  if (isEmpty(mainlist)) {
    j = 0;
  }
  console.log(mainlist);
  res.send(200);
});

app.post('/api/main/edit', function (req, res) {
  console.log("MAIN : Edit request");
  console.log(req.body);
  var product = req.body.product;
  var amount = req.body.amount;
  var check = req.body.check;
  const values = Object.values(mainlist);
  const keys = Object.keys(mainlist);
  var flag = false;
  for (let k = 0; k < values.length; k++) {
    var value = values[k];
    var key = keys[k];
    if (value.product == product) {
      delete mainlist[key];
      mainlist[key] = req.body;
    }
  }
  if (flag == false) {
  }
  console.log(mainlist);
  res.send(200);
});

// Recieving new json of product and amount - adding it to the list
app.post('/api/main/add', function (req, res) {
    console.log("MAIN : Add request");
    j++;
    console.log(req.body);
    product = req.body.product;
    amount = req.body.amount;
    check = req.body.check;
    //res.status(200).send("The server liked your JSON ;)");
    const values = Object.values(mainlist);
    var flag = false;
    for (let k = 0; k < values.length; k++) {
      const value = values[k].product;
      if (value == product) {
        flag = true;
      }
    }
    if (flag == false) {
      mainlist["line"+j] = req.body;
    }
    console.log(mainlist);
    res.send(200);
});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/////////////////////////// mysql ///////////////////////////





//running! do not disturb!
app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
});
