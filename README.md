# OctoPrint-CameraSettings

Camera Settings allows a user to interactively change camera settings by running `v4l2-ctl` on the backend. This method should work for any Linux environment, including OctoPi, as long as the camera is attached to the same device running OctoPrint.

Additionally, this should work with any streaming method and plugin (mjpg-streamer, uStreamer, etc.) without additional configuration.

Verified Cameras:
 - 'RaspiCam' v1.3
 - NexiGO N660

## Setup

Install ~~via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html)
or~~ manually using this URL:

    https://github.com/The-EG/OctoPrint-CameraSettings/archive/main.zip

