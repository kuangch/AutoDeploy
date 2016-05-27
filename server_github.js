var http = require('http');
var exec = require('child_process').exec;
var createHandler = require('github-webhook-handler');
var handler = createHandler({ path: '/webhook', secret: 'kuang' });

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404;
        res.end('no such location');
    });
}).listen(7777);

handler.on('error', function (err) {
    console.error('Error:', err.message);
});

handler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);
    exec('/var/kuangch/auto_deploy.sh', function(err, stdout, stderr){
        if(err) {
            console.log('sync server err: ' + stderr);
        } else {
            console.log(stdout);
        }
    });
});