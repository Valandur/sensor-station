# Weather Station

## Dependencies

`sudo apt install --no-install-recommends vim htop chromium-browser xserver-xorg x11-xserver-utils xinit unclutter fonts-noto-color-emoji`

## Autostart Web UI

### .bash_profile

```
[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor

. .bashrc
```

### .xinitrc

```
#!/usr/bin/env sh
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
  --force-dark-mode
```

## Modem config

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
