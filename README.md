# Weather Station

## Dependencies

`sudo apt install --no-install-recommends vim htop chromium-browser xserver-xorg x11-xserver-utils xinit unclutter fonts-noto-color-emoji`

## Wayland & GL driver

```conf
dtoverlay=vc4-kms-v3d
max_framebuffers=2
gpu_mem=64
```

`sudo apt install vim htop sway luakit`

`export SWAYSOCK=/run/user/1000/sway-ipc.1000.*`

`swaymsg input 3823:5:WaveShare_WS170120 map_to_output HDMI-A-1`

`swaymsg output HDMI-A-1 transform 180`

`swaymsg -t get_inputs`

`swaymsg -t get_outputs`

## asdf NodeJS permissions for port 80

`sudo setcap cap_net_bind_service=+ep /home/pi/.asdf/installs/nodejs/18.15.0/bin/node`

## Autostart Web UI

### .bash_profile

```bash
[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor
```

### .xinitrc

```bash
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

## Modem config

`sudo apt install minicom`

`sudo minicom -D /dev/ttyUSB2`

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
