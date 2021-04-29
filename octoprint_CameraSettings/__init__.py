# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin
import octoprint.events

import subprocess
import os
import re
import threading

CTRL_PAT = re.compile(r' +(?P<name>\w+) 0x\w+ \((?P<type>\w+)\) *: (min=(?P<min>[\-\d]+))? ?(max=(?P<max>[\-\d]+))? ?(step=(?P<step>[\-\d]+))? ?(default=(?P<default>[\-\d]+))? ?(value=(?P<value>[\-\d]+))? ?(flags=(?P<flags>\w+))?')
MENU_PAT = re.compile(r'[\t ]+(?P<value>\d+): (?P<desc>.*)')

class CameraSettingsPlugin(octoprint.plugin.SettingsPlugin,
                           octoprint.plugin.AssetPlugin,
                           octoprint.plugin.StartupPlugin,
                           octoprint.plugin.SimpleApiPlugin,
                           octoprint.plugin.TemplatePlugin):
    def get_camera_ctrls(self, device):
        ctrls = {}
        v4l2_list_ctrls = subprocess.check_output(['v4l2-ctl','-d',os.path.join('/dev',device),'--list-ctrls-menus']).decode('utf-8').split('\n')
        last_ctrl = None
        last_ctrl_is_menu = False
        for line in v4l2_list_ctrls:
            m = CTRL_PAT.match(line)
            if m is None and not last_ctrl_is_menu: 
                continue
            if m is None and last_ctrl_is_menu:
                m = MENU_PAT.match(line)
                if m is None: 
                    continue
                ctrls[last_ctrl]['values'].append({'value': m.group('value'), 'desc': m.group('desc')})
                continue
            last_ctrl = m.group('name')
            ctrl = {'type': m.group('type')}
            if m.group('type') in ['menu','intmenu']:
                ctrl['values'] = []
                last_ctrl_is_menu = True
            if m.group('min'): ctrl['min'] = m.group('min')
            if m.group('max'): ctrl['max'] = m.group('max')
            if m.group('step'): ctrl['step'] = m.group('step')
            if m.group('default'): ctrl['default'] = m.group('default')
            if m.group('value'): ctrl['value'] = m.group('value')
            if m.group('flags'): ctrl['flags'] = m.group('flags')
            ctrls[m.group('name')] = ctrl

        return ctrls
        

    ##~~ SettingsPlugin mixin

    def get_settings_defaults(self):
        return dict(
            show_preview=True,
            camera_name_filters=[
                r'^bcm2835-codec-\w+$',
                r'^bcm2835-isp-\w+$'
            ],
            presets=[],
            load_preset_on_startup=False,
            startup_preset_name=None,
            startup_preset_apply_count=1
        )

    def exclude_camera(self, name):
        for filter in self._settings.get(['camera_name_filters']):
            pat = re.compile(filter)
            if pat.match(name): 
                self._logger.info("Excluding camera {0} based on {1}".format(name,filter))
                return True
        return False

    def on_after_startup(self):
        if self._settings.get_boolean(['load_preset_on_startup']):
            name = self._settings.get(['startup_preset_name'])
            count = self._settings.get_int(['startup_preset_apply_count'])
            self._logger.info('Loading {0} preset, applying {1} time(s)'.format(name, count))
            t = threading.Thread(target=self.do_load_preset, args=(name, count))
            t.start()

    ##~~ SimpleApi mixin
    def get_api_commands(self):
        return {
            'get_cameras': [],
            'get_camera_controls': ['camera'],
            'set_camera_controls': ['camera', 'controls'],
            'load_preset': ['name']
        }

    def on_api_command(self, command, data):
        if command == 'get_cameras':
            self.do_cameras_list_event()
        elif command == 'get_camera_controls':
            self.do_camera_control_list_event(data['camera'])
        elif command == 'set_camera_controls':
            self.do_set_camera_controls(data['camera'], data['controls'])
        elif command == 'load_preset':
            self.do_load_preset(data['name'])

    def do_load_preset(self, name, count=1):
        presets = self._settings.get(['presets'])
        preset = None
        for p in presets:
            if p['name']==name: preset = p
        
        if preset is None: return
        self.do_set_camera_controls(p['camera'], p['controls'], False, count)


    def do_set_camera_controls(self, device, controls, send_list=True, count=1):
        ctrl_args = []
        for control in controls:
            ctrl_args.append('{0}={1}'.format(control, controls[control]))

        for _ in range(count):
            try:
                subprocess.check_output(['v4l2-ctl','-d','/dev/{0}'.format(device),'--set-ctrl',','.join(ctrl_args)])
            except subprocess.CalledProcessError as er:
                self._logger.warning('Error running v42l-ctl: {0}'.format(er.output))

        if send_list: self.do_camera_control_list_event(device)

    
    def do_cameras_list_event(self):
        # pylint: disable=no-member
        event = octoprint.events.Events.PLUGIN_CAMERASETTINGS_CAMERAS_LIST
        try:
            video_devices = {}
            video_ctrls = {}
            with os.scandir('/sys/class/video4linux') as it:
                for dirent in it:
                    if dirent.is_dir():
                        with open(os.path.join('/sys/class/video4linux',dirent.name,'name'),'r') as dev_name:
                            cam_name = dev_name.read().strip()
                            if not self.exclude_camera(cam_name):
                                video_devices[dirent.name] = cam_name
                                try:
                                    video_ctrls[dirent.name] = self.get_camera_ctrls(dirent.name)
                                except FileNotFoundError: # v4l2-ctl not installed, not handing it here, we'll error out when controls are requested
                                    pass

            for dev in video_ctrls:
                if len(video_ctrls[dev])==0: del video_devices[dev]

            
            self._event_bus.fire(event, payload={'cameras': [{'device': d, 'camera': video_devices[d]} for d in video_devices]})
        except FileNotFoundError:
            self._logger.error("/sys/class/video4linux does not exist. Can't get camera devices. Are you sure this is linux?")
            self._event_bus.fire(event, payload={'error': "/sys/class/video4linux does not exist. Can't get camera devices."})

    def do_camera_control_list_event(self,device):
        # pylint: disable=no-member
        event = octoprint.events.Events.PLUGIN_CAMERASETTINGS_CAMERA_CONTROL_LIST
        try:
            ctrls = self.get_camera_ctrls(device)
            self._event_bus.fire(event, payload={'controls': ctrls})
        except FileNotFoundError: # v4l2-ctl not installed
            self._logger.error("v4l2-ctl not installed. Install the v4l-utils package.")
            self._event_bus.fire(event, payload={'error': 'v4l2-ctl not installed.'})


    def register_custom_events(self, *args, **kwargs):
        return ['cameras_list','camera_control_list', 'camera_control_set']

    ##~~ AssetPlugin mixin

    def get_assets(self):
        # Define your plugin's asset files to automatically include in the
        # core UI here.
        return dict(
            js=["js/CameraSettings.js"],
            css=["css/CameraSettings.css"]
        )

    def get_template_configs(self):
        return [
        ]

    ##~~ Softwareupdate hook

    def get_update_information(self):
        # Define the configuration for your plugin to use with the Software Update
        # Plugin here. See https://docs.octoprint.org/en/master/bundledplugins/softwareupdate.html
        # for details.
        return dict(
            CameraSettings=dict(
                displayName="Camera Settings",
                displayVersion=self._plugin_version,

                # version check: github repository
                type="github_release",
                user="The-EG",
                repo="OctoPrint-CameraSettings",
                current=self._plugin_version,

                # update method: pip
                pip="https://github.com/The-EG/OctoPrint-CameraSettings/archive/{target_version}.zip",

                # release channels
                stable_branch=dict(
                    name="Stable",
                    branch="main",
                    comitish=["main"]
                ),
                prerelease_branches=[
                    dict(
                        name="Release Candidate",
                        branch="rc",
                        comittish=["rc", "main"]
                    )
                ]
            )
        )


# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "Camera Settings"

# Starting with OctoPrint 1.4.0 OctoPrint will also support to run under Python 3 in addition to the deprecated
# Python 2. New plugins should make sure to run under both versions for now. Uncomment one of the following
# compatibility flags according to what Python versions your plugin supports!
#__plugin_pythoncompat__ = ">=2.7,<3" # only python 2
__plugin_pythoncompat__ = ">=3,<4" # only python 3
#__plugin_pythoncompat__ = ">=2.7,<4" # python 2 and 3

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = CameraSettingsPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
        "octoprint.events.register_custom_events": __plugin_implementation__.register_custom_events
    }

