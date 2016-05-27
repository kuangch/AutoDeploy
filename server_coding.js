/**
 * Created by Thinkpad on 2016/5/27.
 */
var express = require('express');
var process = require('child_process');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.post('/webhook', function(req,res){

    console.log('request header:',req.headers);
    var action =  req.headers['x-coding-event'];
    var token =  req.body['token'];

    console.log('request action: %s, token: %s',action,token);

    if(!!action && action.toLowerCase() === 'push' && 'kuang' === token ){

        process.exec('/var/kuangch/auto_deploy.sh',
            function (error, stdout, stderr) {
                console.log('stdout========================\n' + stdout);
                console.log('stderr========================\n' + stderr);
                if (error !== null) {
                    res.send('<pre>fail!!!\n' + stdout + error + '</pre>');
                } else {
                    res.send('<pre>done!!!\n' + stdout + '</pre>');
                }
            });
    } else if(token !== 'kuang'){
        console.log(' failed token ');
        res.send('<pre>token不正确?</pre>');
    }else{
        console.log(' 不是 push 操作 ');
        res.send('<pre>不是 push 操作？</pre>');
    }
});


app.set('port', 7777);

var server = app.listen( 7777, function() {
    console.log('Listening on port %d', server.address().port);
});