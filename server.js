'use strict';

/* dependencies */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Logger
/* Database connect */
var mongoose = require("mongoose");

var fs = require('fs');
//Express
var app = express();
//Default location of Express Views - used in development mode
//let viewsPath = path.join(__dirname, '.tmp', 'views');

process.env.NODE_ENV='development';
app.use(express.static(__dirname + '/src/'));

// 3.Support for  json encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//-----------Express WWW Server-------------------
var port = process.env.PORT || 3003;

//-----------Connecting Mongo ------------------- // todo: synchronize mongo connection with app listen
mongoose.connect('mongodb://root:admin@ds151127.mlab.com:51127/runnerv2');
var Xpath     = require(__dirname + '/app.models.xpath.js');

var conn = mongoose.connection;
conn.once('open', function () {
    console.log('Mongoose connection successful');
});

app.get('/', function(req, res){res.render('index')});

app.get('/api/processXpaths/:file_name', function(req, res){
    var arr = [];

    var fileName = req.params.file_name;
    console.log("Starting processing Xpaths for", fileName);

    fs.readFile(__dirname + "/dist/" + fileName, 'utf8', function(err, data) {

        if(data) {

            var app_name = "test";
            if(fileName.indexOf("word") !== -1) {
                app_name = "word";
            } else if(fileName.indexOf("ppt") !== -1) {
                app_name = "ppt";
            } else if(fileName.indexOf("access") !== -1) {
                app_name = "access";
            } else if(fileName.indexOf("excel") !== -1) {
                app_name = "excel";
            }
            var jsonData = JSON.parse(data);

            for(var propertyName in jsonData) {
                var obj = {};
                obj.app_type = app_name;
                obj.xpath = {
                    "key": propertyName,
                    "value": jsonData[propertyName]
                };

                var xpath = new Xpath(obj);
                console.log("xpath processed: ", obj);

                xpath.save(function(err, xpathData) {
                    if (err) {
                        res.json({
                            "errors": {
                                "errorMessage": err,
                                "errorCode": "PROCESSING_ERROR"
                            }
                        });
                    }
                });
              //  arr.push(JSON.stringify(obj));
            }


           /* fs.writeFile(__dirname + "/final/" + fileName, arr, function(error) {
                if (error) {
                    console.error("write error:  " + error.message);
                } else {
                    console.log("Successful Write");
                }
            });*/

            console.log("All Xpaths ingested");



            res.json(data);
        } else {
            res.json({});
        }
    });
});

app.get('/api/getXpaths/:app_name', function(req, res){

    var xpathList = [];

    Xpath.find({'app_type': req.params.app_name}, function(err, xpathList){
        console.log('closing', xpathList);
        res.json(xpathList);
    });

    /*Xpath.find({'app_type': req.params.app_name}, function(err, xpathList){
        console.log('closing', xpathList);
        res.json(xpathList);
    }).batchSize(999999);*/

   /* Xpath.find({'app_type': req.params.app_name}).stream ()
        .on ("error", function (error){
            console.log(error);
        })
        .on ("data", function (doc){
            console.log(doc);
            xpathList.push (doc);
        })
        .on ("close", function (){
            console.log('closing');
            res.json({});
        });
*/



});

//-----------Start listening -------------------
app.listen(port);
