## 1 git 的一些基本概念
* remote：远程的服务器仓库
* clone：从远程服务器克隆项目代码到本地计算机
* master：代码主分支，除了master主分支还可创建多个旁分支，便于多人协作开发/版本管理
* origin：自己项目在远程服务器上的代码仓库
* push：提交代码，把本地仓库代码提交到远程的服务器仓库上，push前要先使用 commit 命令把代码变动同步到本地仓库
* pull：拉取代码，把远程仓库代码拉取到本地仓库同步，一般pull前要先从服务器仓库执行 fetch 命令
* fork：派生项目，把其他账号的远程仓库的项目拉取到自己的账号（远程仓库）下

## 2 常用命令
### 2.1 初始化项目
* git clone [url] 克隆url地址的远程仓库代码到本地计算机
* git init 初始化一个空的项目
* git remote

### 2.2 代码提交
* git add [filename] 提交代码到本地仓库，filename是要提交修改的文件，`git add .`可以提交所有修改过的文件
* git commit -m 'description' 填写提交说明
* git push 把本地仓库代码变动提交到远程仓库

### 2.3 分支管理
* git status 查看本地仓库状态
* git branch 查看分支信息
* git branch <branchname> 新建分支
* git checkout <branchname> 切换分支
* git merge <branchname> 合并分支到当前分支

### 2.4 fork项目
* git init 初始化一个本地仓库
* git remote add upstream <forkurl> fork项目到自己账号的远程仓库下，forkurl是要fork的项目地址
* git pull upstream master 拉取项目到本地

### 2.5 日志查看
* git log 历史提交版本
* git log <ilename> 查某个文件的版本记录
* git show 查看修改记录
* git diff file 查看文件修改的详细内容

### 2.6 其他操作
* git mv <source> <destination> 移动/重命名文件(目录)
* git reset commit 撤销提交信息
* git reset <paths> 撤销本地文件修改同步到缓冲区的操作，即是 `git add <paths>`的相反操作
* git help 帮助信息

更详细的命令使用查看[官网](https://git-scm.com/docs)