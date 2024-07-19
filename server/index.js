
const express = require('express');
const session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');
const path = require('path');
const passport = require('passport');
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;

const CALLBACK_URL = "/ibm/cloud/appid/callback";
const LOGOUT_URL = "/logout";
const LOGIN_URL = "/login";
const LANDING_PAGE_URL = "/";
const CHANGE_PASSWORD_URL = "/change_password";
const FORGOT_PASSWORD_URL = "/forgot_password";

const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost:3000'
const PORT = process.env.PORT || '8080'
const HOST = process.env.HOST || 'http://localhost:8080'

const applyAppId = (passport) => {
  try {
    const config = buildAppIdConfig()

    if (config) {
      passport.use(new WebAppStrategy(config))
      return true
    }
  } catch (err) {
    console.log('Error: ' + err.message)

    return false
  }
}

const buildAppIdConfig = () => {
  const result = {
    clientId: process.env.APPID_CLIENT_ID,
    tenantId: process.env.APPID_TENANT_ID,
    secret: process.env.APPID_SECRET,
    oAuthServerUrl: process.env.OAUTH_SERVER_URL,
    redirectUri: `${HOST}${CALLBACK_URL}`
  }

  if (!result.clientId || !result.tenantId || !result.secret || !result.oAuthServerUrl) {
    throw new Error('APPID_CLIENT_ID, APPID_TENANT_ID, APPID_SECRET, or OAUTH_SERVER_URL environment variable missing')
  }

  return result;
}

const createServer = () => {
  const app = express();
  app.use(session({
    secret: "654321",
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  if (applyAppId(passport)) {
    passport.serializeUser((user, cb) => {
      cb(null, user);
    });
    passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

    app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME));
    app.get(LOGIN_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
      successRedirect: LANDING_PAGE_URL,
      forceLogin: true
    }));

    app.get('/protected', passport.authenticate(WebAppStrategy.STRATEGY_NAME), (req, res) => {res.json(req.user); });
  }

  const apiProxy = createProxyMiddleware({
    target: BACKEND_HOST,
    pathRewrite: {'^/api': ''},
    changeOrigin: true,
    logger: console,
  })
  app.use('/api', apiProxy);

  const graphqlProxy = createProxyMiddleware({
    target: BACKEND_HOST + '/graphql',
    changeOrigin: true,
  })
  app.use('/graphql', graphqlProxy);

  const subscriptionProxy = createProxyMiddleware({
    target: BACKEND_HOST + '/subscription',
    changeOrigin: true,
    logger: console,
    ws: true,
  })
  app.use('/subscription/*', subscriptionProxy);
  app.use('/subscription', subscriptionProxy);

  app.use(express.static(path.join(__dirname, '..', 'dist')))

  return app;
}

createServer().listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})