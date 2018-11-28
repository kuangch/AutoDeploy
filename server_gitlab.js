/**
 * Created by Thinkpad on 2016/5/27.
 */
let express = require('express');
let process = require('child_process');
let bodyParser = require('body-parser');
let colors = require('colors');
let app = express();
let config = require('./gitlab_hook_config')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

function exeScript(autoScript, callback) {
    console.error('chmod autoScript...'.grey);
    process.exec('chmod a+x ' + autoScript,
        function (error, stdout, stderr) {
            if (error !== null) {
                console.error(`chmod autoScript failed\n${stderr}`);
                callback(`<pre>chmod fail!!!\n ${stdout}\n${error}</pre>`);
            } else {
                console.log('chmod autoScript success'.green);
                console.log(`exec script.. `.grey);
                let script = process.spawn(autoScript);
                script.stdout.on('data',(data)=>{
                    console.log(`${data}`);
                })
                script.stderr.on('data',(data)=>{
                    console.log(`${data}`.red);
                })
                script.on('close',(code)=>{
                    console.log(`${new Date().toLocaleString()} script exited with code ${code}`.green);

                })
                callback(`<pre>success</pre>`);
            }
        });
}

app.post('/webhook', function (req, res) {

    let action = req.headers['x-gitlab-event'];
    let token = req.headers['x-gitlab-token'];

    let projectName = req.body.project.name;

    console.log(`${new Date().toLocaleString()} > hook start..  `.inverse);
    console.log(`project: ${projectName.blue}, action: ${action.green}, token: ${token.yellow}`);

    if (!!action && action.toLowerCase() === 'push hook') {

        let script = '';
        try{
            for (const obj in config.configs) {
                if(config.configs[obj]['token'] === token){
                    script = config.configs[obj]['script']
                    break;
                }
            }
        }catch(e) {
            console.error(e)
        }

        exeScript(script,function (result) {
            console.log(`hook end  `.grey);
            res.send(result)
        })

    } else {
        console.log('忽略: 不是 push 操作 '.grey);
        res.send('<pre>不是 push 操作？</pre>');
    }
});

app.set('port', 7777);

let server = app.listen(7777, function () {
    console.log('Listening on port %d', server.address().port);
});

