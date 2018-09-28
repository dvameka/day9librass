require('dotenv').config()

//Load libraries
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const hbs = require('express-handlebars');
var cors = require('cors');


// create an instance of express
const app=express();
app.use(cors());

const sqlBooks = "SELECT * FROM books";

const sqlsearchTitle = "SELECT title,cover_thumbnail FROM books WHERE title LIKE ?"; //"?" is subtituted by args

const sqlsearchBook = "SELECT author_firstname, author_lastname,cover_thumbnail FROM books WHERE author_firstname LIKE ? OR author_lastname LIKE ? AND title LIKE ? ORDER BY title, author_lastname ASC limit ? offset 0";

const sqlDefaultList = "SELECT title, author_firstname, author_lastname,cover_thumbnail FROM books ORDER BY title ASC limit 10";

const sqlGet = "SELECT title, author_firstname, author_lastname, cover_thumbnail FROM books WHERE title LIKE ? AND author_firstname LIKE ?"; 



const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONLIMIT
})

/* Config. express to use handlebars as the rendering engine
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir:__dirname + '/views/layouts/'
}));

app.set('views',path.join(__dirname, '/views'));
app.set('view engine','hbs');
*/

//Create a reuseable function to query MySQL, wraps around with Promise
var makeQuery = (sql, pool)=>{
    console.log("SQL statement >>> ",sql);

    return  (args)=>{
        let queryPromise = new Promise((resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    reject(err);
                    return;
                }
                console.log("args>>> ", args);
                connection.query(sql, args || {}, (err,results)=>{
                    connection.release();
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                })
            });

        });
        return queryPromise;

    }
}

var getTitle = makeQuery(sqlsearchTitle, pool);
var getAuthor = makeQuery(sqlsearchBook, pool);
var findBook = makeQuery(sqlsearchBook, pool);
var UpdateBookList = makeQuery(sqlDefaultList, pool);


//create routes


app.use(
    express.static( // middleware to serve public path
        path.join(__dirname + '/public')
    )
);

app.use(
    express.static( // middleware to serve static file
        path.join(__dirname,'/images')
    )
);

app.get((req,res)=>{
    res.status(500);
    res.type('text/html');
    res.type('jpg')
    res.send('<h1>Not Found</h1>');
    end;
})

app.get('/bookslib',(req,res)=>{
    
        let authname = req.query.authname;    
        let bktitle = req.query.bktitle; 
        let pglimit = +(req.query.pglimit);
            if (pglimit == 0 ) {
                pglimit = 10;
            }
        let params = [authname, authname, bktitle, pglimit];
            
        console.log("params search>>> ", params);
        findBook(params).then((results)=>{
            res.json(results);
        }).catch((error)=>{
            console.log(error);
            res.status(500).json(error);
        });
    });


//Start web server
//start server on port 3000 if undefined on command line
const PORT=parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000

app.listen(PORT, ()=>{
    console.info(`Application started on port ${PORT} at ${new Date()}`);
});