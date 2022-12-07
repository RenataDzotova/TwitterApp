const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
// const db = require("./create-tables");


const db = require('./db');
const e = require("express");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.set('view engine', 'ejs');

const currentUserIdCookieName = "user_id"

// AUTH ROUTS

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/view/signup.html')
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

app.get('/logout', (req, res) => {
    res.clearCookie(currentUserIdCookieName);
    res.sendFile(__dirname + '/view/login.html')
})

//////////////
// POSTS ROUTS
//////////////

app.get('/posts', (req, res) => {
    let userId = req.cookies[currentUserIdCookieName];
    if (userId === undefined) {
        res.status(401).send("Unauthorized")
    }

    let posts = db.query('SELECT * FROM posts', []);

    // res.sendFile(__dirname + '/view/posts.html')
    res.render(__dirname + '/view/posts', { posts:posts })
})

app.post('/posts', (req, res) => {
    let userId = req.cookies[currentUserIdCookieName];
    if (userId === undefined) {
        res.status(401).send("Unauthorized")
    }

    let text = req.body.text

    const users = db.query('SELECT * FROM users WHERE id = ?', [userId])
    db.execute('INSERT INTO posts(text, user_name) VALUES (?, ?)', [text, users[0].name])
    let posts = db.query('SELECT * FROM posts', []);

    // res.sendFile(__dirname + '/view/posts.html')
    res.render(__dirname + '/view/posts', { posts:posts })
})

app.listen(3001, () => {
    console.log("Server is running on 3001");
});


// app.get('/data', (req, res)=>{
//   db.all('SELECT * FROM users', (err, data)=>{
//       res.json(data)
//   })
// })
//
// app.get('/', (req, res)=>{
//
//   res.sendFile(__dirname + '/index.html')
//
// })
//
//
//
// let posts = [];
//
// app.get("/new-post", (req, res) => {
//   const post = req.query.post;
//   posts.push(post);
//   console.log(post);
//   res.json({message: "post saved"})
// });
//
// app.get("/get-posts", (req, res) => {
//   res.json({ posts });
// });


// app.post("/add-user", (req, res) => {
//   const name = req.body.name;
//   const email = req.body.email;
//   const password = req.body.password;

//   db.run(
//     "INSERT INTO UserInfo (FirstName, Email, Password) VALUES (?, ?, ?)",
//     [name, email, password],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(result);
//         res.send("values inserted");
//       }
//     }
//   );
// });