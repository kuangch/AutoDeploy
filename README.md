### 使用场景

- **公司开发测试环境**
 在开发过程中特别是web页面的迭代，经常需要完成一些功能，或者修复一些变化就立马上线测试这个时候需要把代码push到gitlab，在ssh到测试服务器，再在测试服务器上pull代码，让偶在通过脚本copy到部署目录，这个过程很机械繁琐，浪费了大量的时间，降低了开发效率。有了自动化部署就很酸爽了，只需要push代码，其他过程全部自动化
- **测试环境复杂**，由于各种原因（如依赖其他硬件，性能问题等等限制）本地开发环境不能跑我们的服务。必须把代码部署到特定服务器才能运行程序
- 搭建自己的个人主页，没有严格的测试要求，只希望modify以后，然后push ，然后就 **effect right away**的童鞋

### 准备工作

- 一台远程服务器主机（Linux）确保安装了 Git，nodejs
- 在coding上建立一个项目仓库（如：person_mainpage）(由于本人github账号没有建立私有库的权限，使用coding账号完成的功能不过用法都差不多)
- 在远程服务器上clone你要部署的项目（如：person_mainpage）
- 在远程服务器上新建一个项目部署路径（如：/data/techkuang.top）

### 使用方法

- clone AutoDeploy到远程主机（部署服务的主机）的指定目录

```bash
$ cd /var/xxx
$ git clone git@github.com:/kuangch/AutoDeploy.git
```

- 安装依赖包

```bash
$ cd AutoDeploy
$ npm install
```

- 修改自动部署脚本文件（auto_deploy.sh）

```bash
$ vim auto_deploy.sh

#!/bin/bash

# change directory according your physical truth
deployPath="/data/techkuang.top"
gitDir="/var/kuangch/git-data/person_mainpage"
repoDir="/var/kuangch/git-data/person_mainpage/.git"

echo -e "\033[32m [AUTO SYNC] sync demo start \033[0m"
cd $gitDir
echo -e "\033[32m [AUTO SYNC] git pull...  \033[0m"
git pull
echo -e "\033[32m [AUTO SYNC] checkout code to web tree... \033[0m"
git --work-tree=$deployPath --git-dir=$repoDir checkout -f
echo -e "\033[32m [AUTO SYNC] npm install... \033[0m"
cd $deployPath
npm install
echo -e "\033[32m [AUTO SYNC] sync demo finish \033[0m"
```
> 把deployPath换成自己项目目录，gitDir换成远程主机中clone下来的项目的目录，repoDir换成远程主机clone下来的项目的目录下的.git仓库

- 运行自动部署服务

```bash
$ node server_coding.js
# 建议使用forever保持node服务后台永久运行，需要安装forever
# $ npm install forever -g
# $ forever start -a -l /var/log/auto_deploy/forever.log -e /var/log/auto_deploy/err.log -o /var/log/auto_deploy/out.log server_coding.js
```

- 在github（本项目使用的是coding）的项目的setting->webhook下配置push merge 等事件的post请求url（如：`http://techkuang.top:7777`）,tokent任意填写但要和AutoDeploy服务中的token校验对应上（如：kuang）

> 一切ok，这样下次在往coding的person_mainpage.git仓库push代码的时候，coding将会自动发送一个url为`http://techkuang.top:777`的post请求，在服务端器主机上运行着AutoDeploy服务收到并处理请求，获取请求头信息（里面包含事件信息如：push，merge）判断如果是push事件将自动运行auto_deploy.sh脚本实现自动部署

![image](https://github.com/kuangch/AutoDeploy/blob/master/auto_deploy.jpg)
