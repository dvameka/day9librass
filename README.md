## Best practice for API built for Books Library 🔎
1. Create file main.js
2. Load Libraries for the project
```
	const express = require('express');
	const path = require('path');
	const mysql = require('mysql');
	var cors = require('cors’);
```
Note: For security reasons, browsers restrict cross-origin *HTTP* requests initiated from within scripts. For example, *XMLHttpRequest* and the *Fetch* API follow the same-origin policy. This means that a web application using those APIs can only request *HTTP* resources from the same origin the application was loaded from, unless the response from the other origin includes the right *CORS* headers. When we define `var cors = require('cors’);`, so that we don’t get hit with CORS security errors when we transpile the codes.

3. Create an instance of express
`const app=express();`
And we define the API to use `app.use(cors());` to handle the single domain usage of the Local Host handling the Backend and Frontend testing.

4. Create and define MySQL statements for the APIs to query database for eg.
```
	1. const sqlsearchBook = "SELECT author_firstname, author_lastname,cover_thumbnail FROM books WHERE author_firstname LIKE ? OR author_lastname LIKE ? AND title LIKE ? ORDER BY title, author_lastname ASC limit ? offset 0";
```

5. Configure a connection pool to the database 
```
	1. const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONLIMIT
```

6. Create a re-useable function for API to query MySQL, wraps around with Promise
7. 
8. Start to create routes for the project
	* Define path to static URL for Public & Images to pull the contents eg. Images for the books’ cover.

8. Define Endpoints to execute the SQL Queries for  book title and author search with `app.get (PATH, (req, res) => {`
	* /Whenever possible console.log the output of the codes to ensure you are getting your desired results./
	* In every endpoint code snippet, define a function to catch error and console.log the errors for debugging.
9. Start the backend server and define the port 3000 if it’s undefined on command line. 
`const PORT=parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000`
10. Console.log the app server running when *nodemon* starts in Terminal / CLI console.
` app.listen(PORT, ()=>{console.info(Application started on port ${PORT} at ${new Date()});`
