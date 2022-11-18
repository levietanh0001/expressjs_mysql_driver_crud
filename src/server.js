// https://javascript.plainenglish.io/build-a-mysql-node-js-crud-app-2-mysql-integration-7f3c337a21d1

const express = require("express")
const cors = require('cors')
require("dotenv").config()
const mysql = require("mysql")

var path = require('path')
const env_path = path.join(__dirname, '../.env')


const app = express();
app.use(express.json()); 


//create connection to database
const db = mysql.createPool({
    host: process.env.DB_HOST, //localhost
    user: process.env.DB_USER, //root
    password: process.env.DB_PASSWORD, //password
    database: process.env.DB, //ravenbooks
});


app.get("/test-table", (req, res) => {
    const select_customers = "SELECT * FROM customers"
    db.query(select_customers, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});
app.post("/test-table", (req, res) => {
    const insertQuery = "INSERT INTO test_table SET ?";
    let data = {
        name: req.body.name,
        age: req.body.age
    }
    db.query(insertQuery, data, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});
app.put("/test-table", (req, res) => {
    const updateQuery = "UPDATE test_table SET name=? WHERE name=?";
    let data = [req.body.name, req.query.name]
    db.query(updateQuery, data, 
        (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});
app.delete("/test-table", (req, res) => {
    const deleteQuery = "DELETE FROM test_table WHERE name=?";
    let data = [req.query.name]
    db.query(deleteQuery, data, 
        (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening on port ' + listener.address().port)
})