# Frequently Asked Questions

## I have a RaspiCam v1, v2, HQ, etc and the controls do not work! Why?

See [Raspberry Pi Cameras ('RaspiCam')](docs/setup.md#) in setup

## Why do some controls have no effect?

Some controls can only be set when certain conditions are met. For example, 'Exposure Time Abolute' can only be set when 'Exposure Auto' is set to manual. In some cases, these conditions are not intuitive. On the RaspiCam, setting the scene mode will override the Exposure Auto = manual setting, making Exposure Time Absolute unavailable.

Additionally, some controls have been observed to have no affect even when they should. This is still being investigated, and may be an issue with the video4linux driver(s). If you come across this behavior, please open an issue and specify the camera you are using and the control that does not function.
