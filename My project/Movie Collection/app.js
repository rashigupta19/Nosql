var express=require("express");
var bodyParser=require("body-parser");
  
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rashi:rashi1911@rashi.rjwt5.mongodb.net/app?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
var db=mongoose.connection;
db.on('error', console.log.bind(console, "DB Connection Failed.."));
db.once('open', function(callback){
    console.log("DB Connection Created..");
})

var app=express() 


const ejs = require('ejs');
const { kStringMaxLength } = require('buffer');

app.set('view engine', 'ejs');


const moviesSchema = {
    title: String,
    genre: String,
    year: String
}

const Movie = mongoose.model('Movie', moviesSchema);

app.get('/home', (req, res) => {
   
 
  
    Movie.find({}, function(err, movies) {
        res.render('index', {
            moviesList: movies
        })
    }
    )

})
app.get('/search', (req, res) => {
    var loc = req.url;
    var url = new URL("http://i" + loc);
    var c = url.searchParams.get("movie");

    Movie.find({ "title" : c }, function(err, movies) {
        res.render('index', {
            moviesList: movies
        })
    }
    )

})


  
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
  
app.post('/register', function(request,response){
    var name = request.body.name;
    var email = request.body.email;
    var pass = request.body.password;
    var phone = request.body.phone;
  
    var data = {
        "name": name,
        "email":email,
        "password":pass,
        "phone":phone
    }
db.collection('details').insertOne(data,function(err, collection){
        if (err) throw err;
        console.log("Record inserted Successfully");
              
    });
          
    return response.redirect('signed_up.html');
});


app.post('/check_login', function (request,response){
    var email = request.body.email;
    var pass = request.body.password;

    

    db.collection('details').findOne({"email":email}, function(err, result) {
        if (err) {throw err;}
        else if(result==null){ 
            return response.redirect('login.html');
        }
        else if(result.email==email && result.password==pass ){
            response.redirect('logged_in.html');
        }

        else{ 
            return response.redirect('login.html');
        }
    });

});

  
app.get('/login', function (request, response){
    return response.redirect('login.html');

  });


app.get('/', function (request, response){
    response.set({
    'Access-control-Allow-Origin': '*'
    });
    return response.redirect('index.html');
}).listen(1710)
  
  
console.log("Listening at port 1710");
