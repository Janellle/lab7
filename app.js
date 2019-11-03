const express = require("express");
const app = express();
var shuffle = require('shuffle-array');

app.set("view engine", "ejs");
app.use(express.static("public")); // folder for images, css, js

const request = require('request');

// routes
app.get("/", async function(req, res){
    //let keyword = req.query.keyword;
    
    let parsedData = await getImages("otters");
    shuffle(parsedData.hits);
    
    console.log("parsedData: " + parsedData);
    res.render("index", {"image1": parsedData.hits[0].largeImageURL,
                         "image2": parsedData.hits[1].largeImageURL,
                         "image3": parsedData.hits[2].largeImageURL,
                         "image4": parsedData.hits[3].largeImageURL,
                         "likes1": parsedData.hits[0].likes,
                         "likes2": parsedData.hits[1].likes,
                         "likes3": parsedData.hits[2].likes,
                         "likes4": parsedData.hits[3].likes
    });
    
    //res.render("index");
});  //root route


app.get("/results", async function(req, res){
    
    let keyword = req.query.keyword; // gets the value that the user typed
    let orientation = req.query.orientation;
    
    let parsedData = await getImages(keyword, orientation);
    
    shuffle(parsedData.hits);
    
    res.render("results",{"image1": parsedData.hits[0].largeImageURL,
                          "image2": parsedData.hits[1].largeImageURL,
                          "image3": parsedData.hits[2].largeImageURL,
                          "image4": parsedData.hits[3].largeImageURL,
                          "likes1": parsedData.hits[0].likes,
                          "likes2": parsedData.hits[1].likes,
                          "likes3": parsedData.hits[2].likes,
                          "likes4": parsedData.hits[3].likes
    });

    
}); // results route




//returns all data from the Pixabay API as JSON format
function getImages(keyword, orientation){
    
    return new Promise(function(resolve, reject){
        request('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='+keyword+'&orientation='+orientation, function (error, response, body) {
            if (!error && response.statusCode == 200) { // no issues in the request
            
                let parsedData = JSON.parse(body); // converts string to JSON
                
                resolve(parsedData);
                
                /*let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
                //res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
                res.render("index", {"image": parsedData.hits[randomIndex].largeImageURL});*/
                
                //res.render("results", {"images":parsedData});
            }
            else {
                console.log(response.statusCode);
                console.log(error);
            }
        }); // request
    });
}

// starting server
app.listen(process.env.PORT, process.env.IP, function (){
    console.log("Express server is running...");
});