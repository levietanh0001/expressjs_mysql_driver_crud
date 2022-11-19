// https://javascript.plainenglish.io/build-a-mysql-node-js-crud-app-2-mysql-integration-7f3c337a21d1
// https://medium.com/@Arnav-mah/joi-validation-with-node-js-and-postman-598fb0af8c61
const express = require("express")
const cors = require('cors')
const mysql = require("mysql")
const Joi = require("joi")


// 1. load env
var path = require('path')
const env_path = path.join(__dirname, '../.env')
require("dotenv").config(env_path)


// 2. init app and use middlewares
const app = express();
app.use(express.json()); 
app.use(cors())


// 3. connect to database
const db = mysql.createPool({
    host: process.env.DB_HOST, //localhost
    user: process.env.DB_USER, //root
    password: process.env.DB_PASSWORD, //password
    database: process.env.DB, //ravenbooks
});


// 4. schemas
function validateUser(user) {
    const testUserSchema = Joi.object({
        // firstName: Joi.string().required(),
        // middleName: Joi.string(),
        // lastName: Joi.string().required(),
        userName: Joi.string().alphanum().min(3).max(30).required(),
        sex: Joi.string().valid('male', 'female','transger', 'others').required(),
        email: Joi.string().email().required(),
        // password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        // confirm_password:Joi.string().equal(Joi.ref('password')).messages({'any.only': 'password does not match' }).required(),
        age: Joi.number().required().min(0).max(100),
        DOB: Joi.date().iso().min(new Date("1930-01-01")).required(),
        // address: {
        //     addressLine: Joi.string().max(50).required(),
        //     state: Joi.string().max(15).required(),
        //     country: Joi.string().max(20).required(),
        //     zipCode: Joi.string().max(7).required(),
        // },
        // phoneNumber: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
        // password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
        // confirmPassword: Joi.ref("password"),
        updated: Joi.date().default(new Date())
    });
    return testUserSchema.validate(user, {abortEarly: false})
}
app.post("/test-user", (req, res, next) => {
    const { error, value } = validateUser(req.body);
    if (error) {
        return res.send({"message": "Invalid Request", "result": error})
    }
    return res.send({"message": "Sucess", "result": value})
});


// 5. crud
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


// 6. run app
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('App is listening on port ' + listener.address().port)
})