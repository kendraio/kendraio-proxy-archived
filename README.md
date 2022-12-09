Kendraio Proxy
--------------

The Kendraio proxy is the default CORS proxy for app.kendra.io.

Hosting and access
==================

url: proxy.kendra.io

The proxy is hosted on Vercel. 


Code structure 
==============

The Kendraio Proxy runs using Vercel cloud functions. Any requests will invoke /api/proxy.js. There is no server.

Allowed destinations
====================

The list of allowed destinations is maintained in https://kendraio-proxy.hasura.app/v1/graphql'


Running a local version of the proxy
====================================

The repository has a devcontainer defined which will allow for the instant running of the proxy. Open in the devcontainer, and run `vercel dev`. Once you've authenticated, the proxy will be running on localhost:3000. 

Every proxy request will load the current version of the file, so you can see updates immediately. 

Configure Kendra.oi to use your local proxy via https://app.kendra.io/core/settings. 


