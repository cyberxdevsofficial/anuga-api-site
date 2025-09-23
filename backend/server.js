const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const config = require("./config");

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Data paths
const usersPath = path.join(__dirname, "data/users.json");
const apisPath = path.join(__dirname, "data/apis.json");
const keysPath = path.join(__dirname, "data/keys.json");

// Ensure data files exist
fs.ensureFileSync(usersPath); fs.ensureFileSync(apisPath); fs.ensureFileSync(keysPath);
fs.writeJsonSync(usersPath, fs.readJsonSync(usersPath, {throws:false}) || []);
fs.writeJsonSync(apisPath, fs.readJsonSync(apisPath, {throws:false}) || []);
fs.writeJsonSync(keysPath, fs.readJsonSync(keysPath, {throws:false}) || []);

// Passport GitHub OAuth
passport.use(new GitHubStrategy({
  clientID: config.GITHUB_CLIENT_ID,
  clientSecret: config.GITHUB_CLIENT_SECRET,
  callbackURL: config.CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  const users = fs.readJsonSync(usersPath);
  let user = users.find(u => u.githubId === profile.id);
  if(!user){
    user = { id: uuidv4(), githubId: profile.id, username: profile.username, displayName: profile.displayName || profile.username };
    users.push(user);
    fs.writeJsonSync(usersPath, users);
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const users = fs.readJsonSync(usersPath);
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Auth routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => { res.redirect("/"); }
);
app.get("/auth/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

// Auth check
function ensureAuth(req, res, next){
  if(req.isAuthenticated()) return next();
  res.status(401).json({error:"Not authorized"});
}

// API routes
app.get("/api/user", (req,res)=>{
  if(!req.user) return res.json({loggedIn:false});
  res.json({loggedIn:true,user:req.user});
});

app.get("/api/my-apis", ensureAuth, (req,res)=>{
  const apis = fs.readJsonSync(apisPath);
  const myApis = apis.filter(a=>a.owner === req.user.id);
  res.json(myApis);
});

app.post("/api/add-api", ensureAuth, (req,res)=>{
  const {name,url,active} = req.body;
  if(!name || !url) return res.status(400).json({error:"Name and URL required"});
  const apis = fs.readJsonSync(apisPath);
  const api = { id: uuidv4(), owner:req.user.id, name, url, active:!!active, requests:0 };
  apis.push(api);
  fs.writeJsonSync(apisPath, apis);
  res.json(api);
});

app.get("/api/my-keys", ensureAuth, (req,res)=>{
  const keys = fs.readJsonSync(keysPath);
  const myKeys = keys.filter(k=>k.owner===req.user.id);
  res.json(myKeys);
});

app.post("/api/generate-key", ensureAuth, (req,res)=>{
  const keys = fs.readJsonSync(keysPath);
  const key = 'key_'+uuidv4().replace(/-/g,'').slice(0,24);
  const name = req.body.name || 'API_KEY';
  const apiKey = { owner:req.user.id, key, name, createdAt: new Date().toISOString() };
  keys.push(apiKey);
  fs.writeJsonSync(keysPath, keys);
  res.json(apiKey);
});

app.post("/api/revoke-key", ensureAuth, (req,res)=>{
  const {key} = req.body;
  let keys = fs.readJsonSync(keysPath);
  keys = keys.filter(k=>k.key!==key || k.owner!==req.user.id);
  fs.writeJsonSync(keysPath, keys);
  res.json({ok:true});
});

// Serve frontend
app.use(express.static(path.join(__dirname,"../frontend")));
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"../frontend/index.html")));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`🚀 Server running on port ${port}`));
