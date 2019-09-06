require('dotenv').config({ path: require('find-config')('.env') });
const Koa = require('koa');
const Router = require('koa-router');
const koaLogger = require('koa-logger');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const send = require('koa-send');
const path = require('path');
const session = require('koa-session');
//Add config for calls
const config = require('./serverConfig');
const includes = require('lodash/includes');

const app = new Koa();

app.use(function* index() {
    yield send(this, './dist/index');
});

app.proxy = true;

// sessions
app.keys = [process.env.KOA_SESSION_SECRET];

app.use(
  session(
    {
        secret: 'supersecretpassword',
        resave: false,
        saveUninitialized: true
    },
    app,
  ),
);
app.use(koaLogger());

// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (error) {
//     ctx.status = error.status || 500;
//     ctx.type = 'json';
//     ctx.body = {
//       message: error.message,
//       type: error.type,
//     };
//     ctx.app.emit('error', error, ctx);
//   }
// });

const corsOptions = {
    credentials: true,
};
app.use(cors(corsOptions));

const passport = require('koa-passport');

app.use(passport.initialize());
app.use(passport.session());

const auth = require('./controllers/auth');

app.use(serve(path.join(process.env.PWD, '/dist')));

const router = new Router();
router
  .post('/login', ctx => passport.authenticate('oidc', (err, user) => {
    if (!user) {
      ctx.throw(401, err);
    } else {
      ctx.body = user;
      return ctx.login(user);
    }
  })(ctx))
  .get('/users/profile', auth.getLoggedUser)
  .get('/logout', (ctx) => {
    ctx.logout();
    ctx.body = {};
  })
  .get('/auth', passport.authenticate('oidc'))
  .get(
    '/auth/callback',
    passport.authenticate('oidc', {
      successRedirect: '/oidc/success/',
      failureRedirect: '/error',
    }),
  );

app.use(router.routes()).use(router.allowedMethods());

// this last koa middleware catches any request that isn't handled by
// koa-static or koa-router, ie your index.html in your example
app.use(function* index() {
  yield send(this, '/dist/index.html');
});




if (!module.parent) {
    app.listen(process.env.PORT || 3000);
    console.log('app listen on port 3000')
}