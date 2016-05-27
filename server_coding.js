/**
 * Created by Thinkpad on 2016/5/27.
 */
var express = require('express');
var multer = require('multer');
var process = require('child_process');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.post('/webhook', function(req,res){
    console.log('print', req.body);
    console.info(req.body["token"]);
    if('kuang' === req.body['token'] ){

        console.info(process);
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
    } else {
        console.log(' failed token ')
        res.send('<pre>token不正确?</pre>');
    }
});


app.set('port', 7777);

var server = app.listen( 7777, function() {
    console.log('Listening on port %d', server.address().port);
});