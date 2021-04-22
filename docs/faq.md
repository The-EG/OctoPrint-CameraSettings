# Frequently Asked Questions

## I have a RaspiCam v1, v2, HQ, etc and the controls do not work! Why?

See [Raspberry Pi Cameras ('RaspiCam')](setup.md#raspberry-pi-cameras-raspicam) in setup

## Why do some controls have no effect?

Some controls can only be set when certain conditions are met. For example, 'Exposure Time Absolute' can only be set when 'Exposure Auto' is set to manual. In some cases, these conditions are not intuitive. On the RaspiCam, setting the scene mode will override the Exposure Auto = manual setting, making Exposure Time Absolute unavailable.

Additionally, some controls have been observed to have no affect even when they should. This is still being investigated, and may be an issue with the video4linux driver(s). If you come across this behavior, please open an issue and specify the camera you are using and the control that does not function.

## Why are settings missing? Why can't I control zoom, tile, etc?

The only settings shown are those that the camera reported as supported. If you get a warning that your camera has unimplemented controls then please click the link to submit an issue. Otherwise, any 'missing' controls are not shown because they are not supported by your camera.

## No settings are shown for my camera

Check the 'cameras' drop down, if your camera is listed multiple times, try one of the other options. Some cameras are represented by multiple devices, and while the plugin tries to filter out those that aren't actually the camera, it may not be able to do so in all cases.

If you've recieved an error stating 'v4l2-ctl not installed' see [v4l-utils in setup](setup.md#v4l-utils).

## I get an error: 'v4l2-ctl not installed'

See [v4l-utils in setup](setup.md#v4l-utils).

## Not all settings are applied on on startup

Some settings can only be set after other settings meet certain conditions. For example, on some cameras exposure time can only be set if exposure auto is off. Unfortunately, the plugin has no way of knowing these dependecies, but it is possible to load a preset multiple times on startup to work around this.

This can be done by changing the 'Startup Preset Apply Count' number in the plugin settings to 2 or more.