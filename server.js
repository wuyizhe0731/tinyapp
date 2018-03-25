const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const app = express();
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(cookieSession({
  secret: 'fluffybunny',
}));

app.use(bodyParser.urlencoded({ extended: true }));


const usersDB = [
  { email: 'q@q.q', password: bcrypt.hashSync('q', 10) },
  { email: 'z@z.z', password: bcrypt.hashSync('z', 10) },
  
];
var urlDatabase = {
  "b2xVn2": { fullURL: "http://www.lighthouselabs.ca", uniqueid: 'server' },
  "9sm5xK": { fullURL: "http://www.google.com", uniqueid: 'server' }
};


function generateRandomString() {
  let output = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
  output += possible.charAt(Math.floor(Math.random() * possible.length));
  return output;
};


//console.log(usersDB);
app.get('/', (req, res) => {
  res.render('index', {
    //email: req.cookies.email
    email: req.session.email
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.sendStatus(400).send("not register");
  } else {
    const foundUser = usersDB.find(user => user.email === email);
    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
      res.sendStatus(401).send("not register or wrong password"); // I Don't Know You
    } else {
      // res.cookie('email', foundUser.email);
      req.session.email = foundUser.email;
      req.session.uniqueid = foundUser.uniqueid;
      res.redirect('/urls');
    }
  }
});
app.get('/register', (req,res)=>{
  let templateVars = {email: req.session.email}
  res.render('register',templateVars)
});
app.post('/register',(req, res)=>{
  const { remail, rpassword } = req.body;
  const foundUser = usersDB.find(user => user.email === remail);
  console.log(usersDB.email)
  if (foundUser){
    res.status(400).send("email already registered")
  }else{
    var newuser = {} , newuserarr = []
    newuser.email = req.body.remail;
    newuser.password = bcrypt.hashSync(req.body.rpassword, 10);
    newuser.uniqueid = generateRandomString()
    newuserarr.push(newuser);
    usersDB.push(newuser);
    req.session.uniqueid = newuser.uniqueid;
    res.redirect('/login')
    console.log(usersDB)  
  }
})

//------------------------------------------------------------

app.get("/urls/new", (req, res) => {
  if(req.session.email){
    let templateVars = {fullURL:urlDatabase[req.params.id],
                        email: req.session.email}
    res.render("urls_new",templateVars)
  }else{
      res.redirect("/")
  }
});


//generaterandom short url for new input
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let fullURL = req.body.fullURL;
  let urlobj = {};
  
  if (fullURL) {
    let urlobj = {fullURL : fullURL, uniqueid : req.session.uniqueid}
    urlDatabase[shortURL] = urlobj;
    res.redirect("/urls");
  } else {
    res.status(403).send("No Link entered")
  }

  console.log(urlDatabase);
  res.redirect(`urls/${shortURL}`)
});





//page -- url/short
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       fullURL:urlDatabase[req.params.id],
                       email: req.session.email};
  res.render("urls_show", templateVars);
});


//page -- url
app.get("/urls", (req, res) => {

  let templateVars = {urls:urlDatabase,
                      email: req.session.email };
  res.render("urls_index", templateVars);
});




















app.post("/urls/:id/delete", (req, res) => {
  if (req.session.uniqueid === urlDatabase[req.params.id].uniqueid) {
    delete urlDatabase[req.params.id];
    //delete newurladded[0];
    res.redirect("/urls");
  } else {
    res.status(403).send("Forbidden")
  }
});

app.post('/urls/:id/edit', (req, res) => {
  if (req.session.uniqueid === urlDatabase[uniqueid]){
    let newlongurl = req.body["newurl"]
    urlDatabase[req.params.id] = newlongurl
    res.redirect("/urls")}else{
      res.status(403).send("Forbidden")
    }
})









//redirect to full url
app.get('/u/:shortURL', (req, res) => {
 //let fullURL = urlDatabase[req.body.shortURL];
 let fullURL = urlDatabase[req.params.shortURL]
 let templateVars = {email: req.session.email}

 res.redirect(fullURL);
});




app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.get('/logout', (req, res) => {
  // res.clearCookie('email');
  req.session = null;
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});
