//load file .env with start
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//use environment variables for the session secret
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const users = [
    {id: 1, username: 'admin', password: 'password1', role: 1},
    {id: 2, username: 'staff', password: 'password2', role: 2},
    {id: 3, username: 'user1', password: 'password3', role: 3},
];

passport.use(new localStrategy((username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return done(null, false, {message: 'Invalid username or password'});
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Redirect back to login with an error message
            return res.redirect('/login?error=true');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Redirect based on user role
            switch(req.user.role){
                case 1:
                    return res.redirect('/admin');
                case 2:
                    return res.redirect('/staff');
                case 3:
                    return res.redirect('/user');
                default:
                    return res.redirect('/login?error=true');
            }
        });
    })(req, res, next);
});


const acceptRole = (role) => {
    return (req, res, next) => {
        if(req.isAuthenticated() && req.user.role === role) next();
        else res.status(401).send('Unauthenticated');
    }
}

app.get('/admin', acceptRole(1), (req, res) => {
    res.send('Welcome to Admin');
})

app.get('/staff', acceptRole(2), (req, res) => {
    res.send('Welcome to Staff');
})

app.get('/user', acceptRole(3), (req, res) => {
    res.send('Welcome to User');
})

app.get('/login', (req, res) => {
    // Check for an error message in the query parameters
    const message = req.query.error ? 'Invalid username or password' : '';

    res.send(`
        <form action="/login" method="post">
            Username: <input type="text" name="username"/><br/>
            Password: <input type="password" name="password"/><br/>
            <button type="submit">Login</button>
            <p>${message}</p>
        </form>
    `);    
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});