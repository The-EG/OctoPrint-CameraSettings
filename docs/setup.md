# Plugin Setup

Most configurations should not require any additional setups, but there may be a few exceptions.

## Raspberry Pi Cameras ('RaspiCam')

The Raspberry Pi cameras, those that connect directly to the Raspberry Pi by a ribbon cable, need to be used in 'USB' mode.

An OctoPi installation can be configured to do this with the following changes.

First ssh into the pi (user `pi`, password `raspberry`), then:

Tell mjpg-streamer to use usb mode:
1. run `sudo nano /boot/octopi.txt`
2. change `camera="raspi"` to `camera="usb"`
   - this tells mjpg-streamer to the usb mode
   - if `camera=` has '#' before it, remove it
3. change `camera_usb_options="-r 640x480 -f"` to the appropriate resolution and fps, ie. `camera_usb_options="-r 1920x1080 -f 30"`
4. change `camera_http_options="-n"` to `camera_http_options=""`
   - this enables the web controls in mjpg-streamer. while this shouldn't be necessary, a user reported it helped and it certainly shouldn't hurt
5. press control-s to save the file
6. press control-x to exit

Make sure the kernel module is loaded:
1. run `sudo nano /etc/modules`
2. add the following on a new line if it's not already in the file: `bcm2835-v4l2`
3. press control-s to save the file
4. press control-x to exit
5. reboot (sudo reboot)

After rebooting, the Camera Settings controls should function on the RaspiCam.

### High Resolution

If the raspicam won't work in higher resolutions after doing the above, tell the kernel module to allow video mode at higher resolutions:
1. run `sudo nano /etc/modprobe.d/raspicam.conf`
2. add the following line to that file, depending on your raspicam model or maximum resolution:
   - v1.x: `options bcm2835-v4l2 max_video_width=2592 max_video_height=1944`
   - v2.x: `options bcm2835-v4l2 max_video_width=3280 max_video_height=2464`
   - others: use the above, but specify the appropriate `max_video_width` and `max_video_height`
3. press control-s to save the file
4. press control-x to exit
5. reboot (sudo reboot)

### Bitrate

If the feed from the raspicam looks pixelated or corrupted, first try increasing the bitrate through this plugin. If that doesn't improve the quality, increase the GPU memory (`sudo raspi-config`, Performance->GPU Memory), to *at most* 256.

## v4l-utils

This plugin uses `v4l2-ctl` to set the camera settings. This should be already be installed on most Linux distributions, including OctoPi, but it's possible that it isn't. If you get an error stating 'v4l2-ctl not installed' then this is the case. 

v4l2-ctl can be installed by installing the 'v4l-utils' package on most systems. For Debian/Ubuntu based distributions, run:

```terminal
sudo apt-get update
sudo apt-get install v4l-utils
```
