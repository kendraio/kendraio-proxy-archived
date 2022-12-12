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

The list of allowed destinations is maintained in https://kendraio-proxy.hasura.app'


Passthrough
+++++++++++

If the value of the PASSTHROUGH environment in Vercel is set to 'all', then all hosts are allowed and the database is not checked. 


Headers
=======
The proxy will add any information about errors in the response headers. 

Headers are prefixed with "x-kendraio-proxy"



