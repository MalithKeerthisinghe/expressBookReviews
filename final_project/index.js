const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({ secret: "fingerprint", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        jwt.verify(token, "fingerprint_customer", (err, user) => {
            if (err) {
                return res.status(403).json({ message: "User not authenticated" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

app.use("/", genl_routes); // Mount at root
app.use("/customer", customer_routes);

const PORT = 5001;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));