![CircleCI Status](https://circleci.com/gh/donerdu/bellefaire.png?circle-token=8bbfa132057d7b6b1a0ef67354da28d1056d3840)

# Bellefaire JCB

## Important Links
Dev Site: http://162.242.253.63/

## Development info

Uses NodeJS 4.0

Suggest you use NVM to manage NodeJS versions.

## SETUP Install NodeJs using NVM

###How to install NVM

Run the following line in a terminal 

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash`

Reference Site (https://github.com/creationix/nvm#install-script)

###How to install NodeJS 4.0

Run the following line in a terminal 
`nvm install 4.0`

Use NodeJS specific version

`nvm use 4.0`

### Install PM2 to run the app

Run the following line in a terminal 
`npm install pm2 -g`

### Setup up data base (MongoDB)

#### How to install MongoDB using Brew (MAC only)

1) Install or update Brew 

Install Brew

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)`

or Update Brew

`brew update`

Reference site: http://brew.sh/

#####Install MongoDB

#####For MAC:

`brew install mongodb`

#####For Linux:

For Linux distributions please visit the following website: https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

#####Run MongoDB as a service 

Open a separate/new terminal and run the following line

`sudo mongod`

#### Import the database

1) Go to the root folder of the project where you can see the `dump` folder

2) Run `mongorestore --db bellefaire-jcb dump/bellefaire-jcb/` to load a database dump


#### Install dependencies
In the same root localtion you should see the `package.json` file

1. Run `npm install` to install dependencies (if npm is not recognized then just do `nvm use 4.0` and run the `npm install` command again)

### To Run the app

#### Watch Mode
PM2 can automatically restart your app when a file changes in the current directory or its subdirectories: (ref: http://pm2.keymetrics.io/docs/usage/watch-and-restart/)

`pm2 start app.js --watch`

#### Regular Mode (to see your changes reflected you should manually stop and start the server again)
1. Run `pm2 start keystone.js`

### To Stop the server 
1. Run `pm2 stoll all`

