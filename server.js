const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();

const DB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

DB.connect((err)=>{
    if (err){
        console.log("Error connecting to database");
    }

    console.log("Connected to database successfully");

})

app.get('/', (req, res)=>{
    res.send("Hello World")
});
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Question 1 

app.get('/patients', (req, res)=>{
    DB.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, result)=>{
        if (err){
            console.log("Error retrieving data from database", err);
            return res.status(500).send('Error executing query');
    
        }
        res.render('patients', {patients: result});
    })
});

// Question 2 
app.get('/providers', (req, res) => {
    DB.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, result) => {
        if (err) {
            console.log("Error retrieving data from database", err);
            return res.status(500).send('Error executing query');
        }
        res.render('providers', {providers: result});
    });
});


// Question 3
app.get('/patient', (req, res) => {
    const firstName = req.query.first_name; 
    if (!firstName) {
      return res.status(400).send('First name is required');
    }
  
    const query = 'SELECT * FROM patients WHERE first_name = ?';
    DB.query(query, [firstName], (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        return res.status(500).send('Error executing query');
      }
      res.render('patients', { patients: results });
    });
  });

  // Question 4
app.get('/providersBySpecialty', (req, res) => {
    const specialty = req.query.specialty;
  
    if (!specialty) {
      return res.status(400).send('Specialty is required');
    }
  
    DB.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
      if (err) {
        console.error('Error executing query', err);
        return res.status(500).send('Error executing query');
      }
  
      res.render('providers', { providers: results }); 
    });
  });
  

const PORT = process.env.SERVER_PORT; 

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
