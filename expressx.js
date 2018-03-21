var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
function generateRandomString() {
  let output = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
  output += possible.charAt(Math.floor(Math.random() * possible.length));
  return output;
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, fullURL:urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {urls:urlDatabase};
  res.render("urls_index", templateVars);
});

app.get('/u/:shortURL', (req, res) => {
 let fullURL = urlDatabase[request.params.shortURL];
 res.redirect(fullURL);
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let fullURL = req.body.fullURL
  urlDatabase[shortURL] = fullURL
  res.redirect(`urls/${shortURL}`)
});

app.post("/urls/:id/delete", (req, res) => {
	 
	delete urlDatabase[req.params.id]
	res.redirect("/urls")
	
});	



app.post('/urls/:id/edit', (req, res) => {
  let newlongurl = req.body["newurl"]
  urlDatabase[req.params.id] = newlongurl
  res.redirect("/urls")
})



