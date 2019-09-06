app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'MyVoiceIsMyPassportVerifyMe',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// sets up passport
passport.use('oidc', new OidcStrategy({
  issuer: 'https://nrtsapp.azurewebsites.net/oauth2',
  authorizationURL: 'https://nrtsapp.azurewebsites.net/oauth2/v2.0/authorize',
  tokenURL: 'https://nrtsapp.azurewebsites.net/oauth2/v2.0/token',
  userInfoURL: 'https://nrtsapp.azurewebsites.net/oauth2/v2.0/userinfo',
  clientID: 'b530135e-da99-4bbb-adb7-c49881141142',
  clientSecret: '3Wmp=U+=Ls91gku5etZvma@.0XMwq1Lj',
  callbackURL: 'https://nrtsapp.azurewebsites.net/callback',
  scope: 'openid profile'
}, (issuer, sub, profile, accessToken, refreshToken, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

//kicks off login flow
app.use('/login', passport.authenticate('oidc'));

//handles the callback from the OIDC provider
app.use('/authorization-code/callback',
  passport.authenticate('oidc', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('/');
  }
);

// handles logout route
app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//create a profile page that shows the logged in user's name
app.use('/profile', (req, res) => {
    res.render('profile', { title: 'Express', user: req.user });
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//middleware function
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login')
}

// checks the request's isAuthenticated() and passes the request on to the next handler if user is logged in, otherwise redirects to the login page to kickoff login process
app.use('/profile', ensureLoggedIn, (req, res) => {
  res.render('profile', { title: 'Express', user: req.user });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
