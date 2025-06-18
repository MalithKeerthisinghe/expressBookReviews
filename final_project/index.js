const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({secret:"fingerpint",resave:true,saveUninitialized:true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Check if session exists and has a valid access token
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        
        // Verify JWT token
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (err) {
                return res.status(403).json({message: "User not authenticated"});
            }
            
            // Attach user data to request object
            req.user = user;
            next();
        });
    } else {
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));