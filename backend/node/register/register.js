require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//hash $2y$10$ZHUy3VQ8eMkDyjewYGxZI.FecWbKLPmkcz.GvgzJ9y82iDZogcCM. => password1
//hash $2y$10$UNeAO.2p2TNhsp7ncj/Ze.auUfhW/CpbWQyKK1YabyK9ICVL9m5tG => password2
//hash $2y$10$eHXEGNHiYK88BrXI7Taxz.LWXRhlb3Bow4zvLnySTLslTPe2uJfMu => password2

let users = [
    {id: 1, username: 'admin', password: '$2y$10$ZHUy3VQ8eMkDyjewYGxZI.FecWbKLPmkcz.GvgzJ9y82iDZogcCM.', role: 1},
    {id: 2, username: 'staff', password: '$2y$10$UNeAO.2p2TNhsp7ncj/Ze.auUfhW/CpbWQyKK1YabyK9ICVL9m5tG', role: 2},
    {id: 3, username: 'user1', password: '$2y$10$eHXEGNHiYK88BrXI7Taxz.LWXRhlb3Bow4zvLnySTLslTPe2uJfMu', role: 3},
];

passport.use(new localStrategy(async (username, password, done) => {
    const user = users.find(u => u.username === username);
    if(user && await bcrypt.compare(password, user.password)) {
        return done(null, user);
    }
    return done(null, false, {message: 'Invalid username or password'});
}))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const role = 3; // Auto-assign "user" role for all new registrations

    // Check for duplicate usernames
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return res.status(400).send('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword,
        role
    };

    users.push(newUser);
    res.status(200).send('Registration successful');
});

app.get('/register', (req, res) => {
    res.send(`
        <form action="/register" method="post">
            Username: <input type="text" name="username"/><br/>
            Password: <input type="password" name="password"/><br/>
            <button type="submit">Register</button>
        </form>
    `);
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

