const express = require ('express');
const mongoose = require ('mongoose');
const flash = require( 'express-flash' );
const session = require( 'express-session' );

mongoose.connect('mongodb://localhost/Message_Board_db', {useNewUrlParser: true});

const {PrincipalModel} = require( './models/principalModel' );

const app = express ();

app.use(express.static(__dirname + "/static"));

app.set('views', __dirname+ '/views');
app.set ('view engine', 'ejs');

app.use(flash());
app.use(express.urlencoded({extendend:true}) );
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 20}//number in miliseconds 
}));

app.get ('/', function (request, response){
    PrincipalModel
        .getEntries()
        .then (data  => {
            response.render ('index', {entries:data});
        });
});

app.post ('/addMessage', function (request, response){
    const name= request.body.name;
    const startComment= request.body.message;

    if (name.length == 0 || startComment.length == 0 ){
        request.flash('error', 'All fields must be completed');
        response.redirect('/');
    }
    else{
        const newMessage = {
            name,
            startComment,
        };
    
        PrincipalModel
            .createEntry(newMessage)
            .then( result => {
                console.log("exito");
                response.redirect('/');
           })
            .catch( err => {
                console.log("Something goes wrong!");
                console.log(err);
            });
        response.redirect('/');
    }
});

app.post( '/addComment', function( request, response ){
    let commentName = request.body.commentName;
    let commentContent = request.body.commentContent;
    let id = request.body.id;
    
    if (commentName.length == 0 || commentContent.length == 0 ){
            request.flash('errorC', 'All fields must be completed');
            response.redirect('/');
    }
    else{
        PrincipalModel
        .getEntrybyId( id )
        .then( entryResult => {
            let newMessage = {
                commentName,
                commentContent
            };
            PrincipalModel
                    .updateEntryComment( entryResult._id, newMessage )
                    .then( result => {
                        response.redirect( '/' );
                });
            });
    };    
});

app.listen (8181, function (){
    console.log ("The user server is running on 8181")
});