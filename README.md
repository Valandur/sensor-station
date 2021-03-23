# Sensor station

## Setup

Install dependencies

```shell
sudo apt install xorg xorg-dev
```

Edit `rc.local` to start the x server

```shell
[...]

X &

[...]
```

Install this repo

```shell
npm install
```

Install pm2 and add this process to the start list

```shell
$ npm i -g pm2
$ pm2 startup
$ pm2 start --name sensor main.js
$ pm2 save
```
