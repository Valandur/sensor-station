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

# This hides the cursor, but doesn't seem to hide the pointer
seat * hide_cursor 2000
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
cd ~
sway > ~/.sway.log 2>&1 &

sleep 20
luakit -U http://localhost > ~/.luakit.log 2>&1 &
```

#### PM2

```shell
pm2 start --name sensor --node-args="-r dotenv/config" build/index.js
```

## Node.JS

```shell
sudo setcap cap_net_bind_service=+ep /home/pi/.asdf/installs/nodejs/22.2.0/bin/node
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
