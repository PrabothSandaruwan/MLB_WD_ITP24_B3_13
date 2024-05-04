const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require('body-parser') 
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");

//body parser and url enc
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const PORT = process.env.PORT || 8070;

// use middleware
app.use(cors());
app.use(bodyparser.json());
app.use(cookieParser());

//const URL = process.env.MONGO_DB_URL;
//const URL = process.env.MONGO_DB_URL;

const URL = process.env.MONGODB_URL_STORE


// routes




//payment method
const path = require('path') 

var Publishable_Key = "pk_test_51MjWJsHqyuBHx39JVGag9na7VxAeKr77ZNOz82EaXCsF4Zbtpubm6EXH0wanjMNHS0z22sKmO6WggvN8IwEL6k4a00qvEsEBXf"
var Secret_Key = "sk_test_51MjWJsHqyuBHx39JbjE5xUsiXJR4P6D5ICQXsKvtbUvCYuWAPgie21j28ztOz2JLRCIPzY1sa5zZk6G6vsYI2ett00byGHI1vK"

const stripe = require('stripe')(Secret_Key) 

const port = process.env.PORT || 3001

app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 

app.get('/pay', function(req, res){ 
	res.render('Home', { 
	key: Publishable_Key 
	}) 
}) 

app.post('/payment', function(req, res){ 

	// Moreover you can take more details from user 
	// like Address, Name, etc from form 
	stripe.customers.create({ 
		email: req.body.stripeEmail, 
		source: req.body.stripeToken, 
		name: '', 
		address: { 
			line1: 'Meegahapitiya', 
			postal_code: '91050',
			city: 'Dambagalla', 
			state: 'Monaragala', 
			country: 'SriLanka', 
		} 
	}) 
	.then((customer) => { 

		return stripe.charges.create({ 
			amount: 7000,	 // Charing Rs 25 
			description: 'Education', 
			currency: 'USD', 
			customer: customer.id 
		}); 
	}) 
	.then((charge) => { 
		res.redirect(`http://localhost:3000/success`) // If no error occurs 
	}) 
	.catch((err) => { 
		res.send(err)	 // If some error occurs 
	}); 
})

app.listen(port, function(error){ 
	if(error) throw error 
	console.log("Server created Successfully") 
}) 


