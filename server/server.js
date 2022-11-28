const express = require("express");
const cors = require("cors");
var db = require("./create-tables");
const app = express();

app.use(cors());
app.use(express.json());


app.post("/add-user", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  db.run(
    "INSERT INTO UserInfo (FirstName, Email, Password) VALUES (?, ?, ?)",
    [name, email, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.send("values inserted");
      }
    }
  );
});

app.get("/get-users", (req, res) => {
  db.each("SELECT * FROM UserInfo", (err, result) => {
      console.log(result);
  });
  res.end("users info shown");
});

let posts = [];

app.get("/new-post", (req, res) => {
  const post = req.query.post;
  posts.push(post);
  console.log(post);
  res.json({message: "post saved"})
});

app.get("/get-posts", (req, res) => {
  res.json({ posts });
});


app.listen(3001, () => {
  console.log("Server is running on 3001");
});