/**
 * Created by Thinkpad on 2016/5/27.
 */
let express = require('express');
let process = require('child_process');
let bodyParser = require('body-parser');
let app = express();
let config = require('./gitlab_hook_config')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

function exeScript(autoScript, callback) {
    console.error('chmod autoScript...');
    process.exec('chmod a+x ' + autoScript,
        function (error, stdout, stderr) {
            if (error !== null) {
                console.error(`chmod autoScript failed\n${stderr}`);
                callback(`<pre>chmod fail!!!\n ${stdout}\n${error}</pre>`);
            } else {
                console.log('chmod autoScript success');
                console.log('exec autoScript...');
                process.exec(autoScript,
                    function (error, stdout, stderr) {
                        console.log('exec script stdout ========================\n' + stdout);
                        console.log('exec script stderr ========================\n' + stderr);
                        if (error !== null) {
                            callback(`<pre>fail!!!\n${error}</pre>`);
                        } else {
                            callback(`<pre>done!!!\n${stdout}</pre>`);
                        }
                    });
            }
        });
}

app.post('/webhook', function (req, res) {

    let action = req.headers['x-gitlab-event'];
    let token = req.headers['x-gitlab-token'];

    let projectName = req.body.project.name;

    console.log(`HOOK: project: ${projectName}，action: ${action}, token: ${token}`);

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
            res.send(result)
        })

    } else {
        console.log('忽略: 不是 push 操作 ');
        res.send('<pre>不是 push 操作？</pre>');
    }
});

app.set('port', 7777);

let server = app.listen(7777, function () {
    console.log('Listening on port %d', server.address().port);
});

