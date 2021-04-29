# OctoPrint-CameraSettings
[![GitHub release](https://img.shields.io/github/v/release/The-EG/OctoPrint-CameraSettings)](https://github.com/The-EG/OctoPrint-CameraSettings/releases/latest) [![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/The-EG/OctoPrint-CameraSettings?include_prereleases&label=pre-release)](https://github.com/The-EG/OctoPrint-CameraSettings/releases)

![camerasettings](camerasettings.png)

Camera Settings allows a user to interactively change camera settings by running `v4l2-ctl` on the backend. This method should work for any Linux environment, including OctoPi, as long as the camera is attached to the same device running OctoPrint.

This plugin should work with little or no configuration changes, although RaspiCam users may need to change to 'usb' mode. See [setup](docs/setup.md).

[Frequently Asked Questions](docs/faq.md)

## Setup

Install ~~via the bundled [Plugin Manager](https://docs.octoprint.org/en/master/bundledplugins/pluginmanager.html)
or~~ manually using this URL:

    https://github.com/The-EG/OctoPrint-CameraSettings/archive/main.zip

