// import { nextTick } from "q";

const passport = require('koa-passport');
const OidcStrategy = require('passport').Strategy;
const config = require('../serverConfig');
// const { promisify } = require('util');


passport.use('oidc',
    new OidcStrategy(
        {
            issuer: 'https://nrtsapp.azurewebsites.net/oauth2',
            authorizationURL: 'https://nrtsapp.azurewebsites.net/oauth2/v2.0/authorize',
            tokenURL: 'https://nrtsapp.azurewebsites.net/oauth2/v2.0/token',
            userInfoURL: 'https://nrtsapp.azurewebsites.net/oauth2/v2.0/userinfo',
            clientID: 'b530135e-da99-4bbb-adb7-c49881141142',
            clientSecret: '3Wmp=U+=Ls91gku5etZvma@.0XMwq1Lj',
            callbackURL: 'https://nrtsapp.azurewebsites.net/callback',
            scope: 'openid profile'
        }, 
    (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

exports.ensureLoggedIn = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next();
  } else {
    ctx.redirect('/');
  }
};

export {};