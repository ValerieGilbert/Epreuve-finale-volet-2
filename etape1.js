const fs = require("fs");
const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const app = express();
app.set('view engine', 'ejs'); // générateur de template 
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))  // pour utiliser le dossier public
app.use(bodyParser.json())  // pour traiter les données JSON
var db

MongoClient.connect('mongodb://127.0.0.1:27017/provinces', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(8081, () => {
    console.log('connexion à la BD et on écoute sur le port 8081')
  })
})

app.get('/',  (req, res) => {
   console.log('la route route get / = ' + req.url)
 
    var cursor = db.collection('provinces').find().toArray(function(err, resultat){
       if (err) return console.log(err)

    res.render('index.ejs', {provinces: resultat})

    }) 
    
})

app.get('/fichier',  (req, res) => {
  fs.readFile('public/text/collection_provinces.json', 'utf8', function (err, data) {
      if (err) return console.log(err)
      console.log('Lecture du json')
      res.send(data)

    })
})

app.post('fichier',  (req, res) => {
  db.collection('provinces').save(req.body, (err, result) => {
      if (err) return console.log(err)
      console.log('sauvegarder dans la BD')
      res.redirect('/')
    })
})

fs.readFile('public/text/collection_provinces.json', 'utf8', function (err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
});