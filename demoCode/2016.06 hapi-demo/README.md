# Hapi

[Routing](http://hapijs.com/tutorials/routing)

[Request](http://hapijs.com/api#request-properties)

[Reply](http://hapijs.com/api#reply-interface)

# [Boom](https://github.com/hapijs/boom)

hapi uses the boom error library for all its internal error generation. boom provides an expressive interface to return HTTP errors. Any error returned via the reply interface is converted to a boom object and defaults to status code 500 if the error is not a boom object.
