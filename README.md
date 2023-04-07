# Weather Station

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

## Wayland & GL driver

### Install

```
sudo apt install vim htop sway luakit
```

### Setup & Commands

```conf
dtoverlay=vc4-kms-v3d
max_framebuffers=2
gpu_mem=64
```

```shell
swaymsg -t get_inputs
swaymsg -t get_outputs
```

> `/usr/share/luakit/lib/window.lua`  
> Disable "Pack status bar elements" and "Pack Input bar"

### Boot

#### start.sh

```shell
#!/bin/bash
cd ~/sensor-station/backend
node bin/main.js > ~/.sensor.log 2>&1 &

cd ~
sway > ~/.sway.log 2>&1 &

sleep 10
export SWAYSOCK=/run/user/$(id -u)/sway-ipc.$(id -u).$(pgrep -x sway).sock
sleep 1
swaymsg output HDMI-A-1 transform 180 >> ~/.sway.log 2>&1
sleep 1
swaymsg input "*" map_to_output HDMI-A-1 >> ~/.sway.log 2>&1
sleep 1
swaymsg output HDMI-A-1 transform 0 >> ~/.sway.log 2>&1

#sleep 20
#luakit -U http://localhost &
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
