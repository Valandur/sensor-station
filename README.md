# Weather Station

## Wayland & GL driver

### Install

```
sudo apt install vim htop sway luakit
```

### Setup

#### /boot/config.txt

```conf
dtoverlay=vc4-kms-v3d
max_framebuffers=2
gpu_mem=64
```

#### ~/.config/sway/config

```conf
output HDMI-A-1 {
        bg ~/wallpaper.jpg fill
}

input 3823:5:WaveShare_WS170120 {
        calibration_matrix -1 0 1 0 -1 1
}
```

#### /usr/share/luakit/lib/window.lua

> Disable "Pack status bar elements" and "Pack Input bar"

### Boot

#### .bashrc

```shell
# Run sway and other apps on main terminal
if [[ -z $SSH_TTY && $XDG_VTNR -eq 1 ]]; then
  ~/start.sh
else
  export SWAYSOCK=/run/user/$(id -u)/sway-ipc.$(id -u).$(pgrep -x sway).sock
fi
```

#### start.sh

```shell
#!/bin/bash
cd ~/sensor-station/backend
node bin/main.js > ~/.sensor.log 2>&1 &

cd ~
sway > ~/.sway.log 2>&1 &

sleep 20
luakit -U http://localhost > ~/.luakit.log 2>&1 &
```

## Node.JS

```shell
sudo setcap cap_net_bind_service=+ep /home/pi/.asdf/installs/nodejs/18.15.0/bin/node
```

## Modem

```shell
sudo apt install minicom
sudo minicom -D /dev/ttyUSB2
```

```shell
# deregister from network
$ AT+COPS=2

# automatic time update enabled
$ AT+CTZU=1

# re-register to network
$ AT+COPS=0

# auto start GPS on modem boot
$ AT+CGPSAUTO=1

# start gps in standalone mode
$ AT+CGPS=1,1
```

## create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Chromium & X-server

### Install

```shell
sudo apt install --no-install-recommends vim htop chromium-browser xserver-xorg x11-xserver-utils xinit unclutter
```

### Boot

#### .bash_profile

```shell
[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor
```

#### .xinitrc

```shell
#!/bin/bash
xset -dpms
xset s off
xset s noblank

unclutter &
chromium-browser http://localhost \
  --window-size=1024,600 \
  --window-position=0,0 \
  --start-fullscreen \
  --kiosk \
  --incognito \
  --noerrdialogs \
  --disable-translate \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-infobars \
  --disable-features=TranslateUI \
  --disk-cache-dir=/dev/null \
  --overscroll-history-navigation=0 \
  --disable-pinch \
  --check-for-update-interval=31536000 \
  --no-user-gesture-required \
  --force-dark-mode
```
