const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
// const db = require("./create-tables");


const db = require('./db');
const e = require("express");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.set('view engine', 'ejs');

const currentUserIdCookieName = "user_id"

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/signup.html')
})

// AUTH ROUTS

app.get('/signup', (req, res) => {
    res.clearCookie(currentUserIdCookieName);
    res.sendFile(__dirname + '/view/login.html')
})

app.post('/signup', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    const insertedUser = db.execute('INSERT INTO users(name, email, password) VALUES (?, ?, ?)', [name, email, password])

    console.log("POST /signup", name, email, password)

    res.cookie(currentUserIdCookieName, insertedUser.lastInsertRowid)
    res.redirect('/posts')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/view/login.html')
})

app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password])
    if (user === undefined || user.length === 0) {
        res.status(401).send("Unauthorized")
    }

    res.cookie(currentUserIdCookieName, user.id)
    res.redirect('/posts')
})

app.post('/logout', (req, res) => {
    res.clearCookie(currentUserIdCookieName);
    res.sendFile(__dirname + '/view/signup.html')
})

//////////////
// POSTS ROUTS
//////////////

app.get('/posts', (req, res) => {
    let userId = req.cookies[currentUserIdCookieName];
    if (userId === undefined) {
        res.status(401).send("Unauthorized")
    }

    // let allposts = db.query('SELECT * FROM posts', []);
    let allposts = db.query(`
        SELECT *, exists(SELECT *
            FROM followers f
            WHERE f.user_id = p.user_id AND f.follower_id = ?) as alreadyFollowed
        FROM posts p;
    `, [userId]);

    // res.sendFile(__dirname + '/view/posts.html')
    res.render(__dirname + '/view/posts', { posts: allposts })
})

app.post('/posts', (req, res) => {
    let userId = req.cookies[currentUserIdCookieName];
    if (userId === undefined) {
        res.status(401).send("Unauthorized")
    }

    let text = req.body.text

    const users = db.query('SELECT * FROM users WHERE id = ?', [userId])
    db.execute('INSERT INTO posts(text, user_name, user_id) VALUES (?, ?, ?)', [text, users[0].name, userId])
    let allposts = db.query('SELECT * FROM posts', []);
    console.log(allposts);
    // res.sendFile(__dirname + '/view/posts.html')
    res.render(__dirname + '/view/posts', { posts: allposts })
})

app.post('/follow/:userIdToFollow', (req, res) => {

    let currentUserId = req.cookies[currentUserIdCookieName];
    if (currentUserId === undefined) {
        res.status(401).send("Unauthorized")
    }

    let userIdToFollow = req.params.userIdToFollow;
    console.log("follow", userIdToFollow, currentUserId);

    db.execute('INSERT INTO followers (user_id, follower_id) VALUES (?, ?)', [userIdToFollow, currentUserId]);

    res.redirect("/posts");
})


app.post('/unfollow/:userIdToUnfollow', (req, res) => {

    let currentUserId = req.cookies[currentUserIdCookieName];
    if (currentUserId === undefined) {
        res.status(401).send("Unauthorized")
    }

    let userIdToUnfollow = req.params.userIdToUnfollow;
    console.log("unfollow", userIdToUnfollow, currentUserId);

    db.execute('DELETE FROM followers WHERE user_id = ? AND follower_id = ?', [userIdToUnfollow, currentUserId]);

    res.redirect("/posts");
})




//report
app.post('/report/:userIdToReport', (req, res) => {

    let currentUserId = req.cookies[currentUserIdCookieName];
    if (currentUserId === undefined) {
        res.status(401).send("Unauthorized")
    }

    let userIdToReport = req.params.userIdToReport;
    console.log("reported", userIdToReport, currentUserId);

    db.execute('INSERT INTO reports (user_id, report_id) VALUES (?, ?)', [userIdToReport, currentUserId]);

    res.redirect("/posts");
});

app.listen(3001, () => {
    console.log("Server is running on 3001");
});