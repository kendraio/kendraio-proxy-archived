const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({
    secure: false,
    changeOrigin: true,
    followRedirects: true,
});
const validUrl = require('valid-url');
const url = require('url');
const fetch = require('node-fetch');
const get = require('lodash.get');

// Optionally add a Max Age header to OPTIONS requests
// 0 = false = disabled
const CORS_MAX_AGE = 0;

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;
const STATUS_UNAUTHORIZED = 401;

const allowCors = fn => async (req, res) => {
    if (!req.headers.origin) {
        res.status(STATUS_UNAUTHORIZED).end();
        return;
    }
    res.setHeader('access-control-allow-credentials', true);
    res.setHeader('access-control-allow-origin', '*');
    if (req.headers['access-control-request-method']) {
        res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
    }
    if (req.headers['access-control-request-headers']) {
        res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
    }
    res.setHeader('access-control-expose-headers', Object.keys(req.headers).join(','));
    if (req.method === 'OPTIONS') {
        if (CORS_MAX_AGE) {
            res.setHeader('access-control-max-age', CORS_MAX_AGE);
        }
        res.status(STATUS_OK).end();
        return;
    }
    fn(req, res);
}

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    // Here would be a good place to modify the outgoing request
});

proxy.on('proxyRes', function (proxyRes, req, res) {
    proxyRes.headers['cache-control'] = 'no-cache';
    delete proxyRes.headers['set-cookie'];
});

module.exports = allowCors(async (req, res) => {

    // Check the provided target URL
    if (!req.headers['target-url']) {
        res.status(STATUS_BAD_REQUEST).end();
        return;
    }
    const target = validUrl.isWebUri(req.headers['target-url']);
    if (!target) {
        res.status(STATUS_BAD_REQUEST).end();
        return;
    }
    delete req.headers['target-url'];

    // Remove origin if 'remove-origin' header exists
    if (req.headers['remove-origin']) {
        delete req.headers['origin'];
    }
    
    // Check the hostname is allowed
    const { hostname } = new url.URL(target);
    const query = `
        query CheckHost($hostname: String!) {
          hosts(where: {hostname: {_eq: $hostname}}) {
            id
          }
        }`;
    const response = await fetch('https://kendraio-proxy.hasura.app/v1/graphql', {
        method: 'POST',
        body: JSON.stringify({ query, variables: { hostname }}),
        headers: { 'Content-Type': 'application/json' },
    });
    const { data } = await response.json();
    const validHostId = get(data, 'hosts[0].id');
    if (!validHostId) {
        res.status(STATUS_BAD_REQUEST).end();
        return;
    }

    // Do the proxying
    proxy.web(req, res, { target });
});

