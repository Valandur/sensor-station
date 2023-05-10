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
# Use windows key as modifier
set $mod Mod4

# Terminal emulator
# set $term alacritty

output HDMI-A-1 {
  bg ~/wallpaper.jpg fill
}

input 3823:5:WaveShare_WS170120 {
  calibration_matrix -1 0 1 0 -1 1
}

# Kill focused window
bindsym $mod+q kill

# Reload the configuration file
bindsym $mod+c reload

# Exit sway (logs you out of your Wayland session)
bindsym $mod+e exec swaymsg exit

# Make the current focus fullscreen
bindsym $mod+f fullscreen

bar {
    position top
    mode invisible
}

default_border none
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
# set echo
$ ATE1

# set response format
$ ATV1

# deregister from network
$ AT+COPS=2

# automatic time update enabled
$ AT+CTZU=1

# re-register to network
$ AT+COPS=0

# auto start GPS on modem boot
$ AT+CGPSAUTO=1

# set supported gps types / satellites
$ AT+CGNSSMODE=15,1

# set NMEA reporting sentence structure
$ AT+CGPSNMEA=262143

# set NMEA to report every 10 seconds, and also set the reporting sentence structure
$ AT+CGPSINFOCFG=10,262143

# start gps in ue based mode (auto fallback to standalone)
$ AT+CGPS=1,2
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
