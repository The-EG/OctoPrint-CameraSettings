/*
 * View model for OctoPrint-CameraSettings
 *
 * Author: Taylor Talkington
 * License: AGPLv3
 */
$(function() {
    function CamerasettingsViewModel(parameters) {
        var self = this;
        self.settings = parameters[0]
        self.cameraSrc = ko.observable(undefined);

        self.selectedDevice = ko.observable(undefined);
        self.cameras = ko.observableArray([]);
        self.showUnkControlsWarning = ko.observable(false);
        self.unknownControls = {};
        self.presetName = ko.observable(undefined);
        self.presetListName = ko.observable(undefined);

        self.controls = {
            exposure_auto: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            auto_exposure: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            auto_exposure_bias: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            exposure_auto_priority: { use: ko.observable(false), value: ko.observable(undefined) },
            gain: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            power_line_frequency: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            iso_sensitivity: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            iso_sensitivity_auto: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            scene_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            white_balance_auto_preset: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            white_balance_temperature_auto: { use: ko.observable(false), value: ko.observable(undefined) },
            white_balance_temperature: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            video_bitrate_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            video_bitrate: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure_dynamic_framerate: { use: ko.observable(false), value: ko.observable(undefined) },
            image_stabilization: { use: ko.observable(false), value: ko.observable(undefined) },
            blue_balance: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            red_balance: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            brightness: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            sharpness: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            contrast: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            saturation: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            color_effects: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            color_effects_cbcr: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            compression_quality: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure_time_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure_metering_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            horizontal_flip: { use: ko.observable(false), value: ko.observable(undefined) },
            vertical_flip: { use: ko.observable(false), value: ko.observable(undefined) },
            rotate: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_i_frame_period: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_level: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            h264_profile: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            repeat_sequence_header: { use: ko.observable(false), value: ko.observable(undefined) },
            
        };

        self.shouldUpdateSettings = false;

        for (control in self.controls) {
            self.controls[control].value.subscribe( () => {
                if (self.shouldUpdateSettings) {
                    var ctrls = {};
                    for (control in self.controls){
                        var val = self.controls[control].value();
                        if (typeof val === 'boolean') val = val ? '1' : '0';
                        if (self.controls[control].use()) ctrls[control] = val;
                    }
                    OctoPrint.simpleApiCommand('camerasettings', 'set_camera_controls', {camera: self.selectedDevice(), controls: ctrls});   
                }
            })
        }

        self.savePreset = function() {
            OctoPrint.simpleApiCommand('camerasettings', 'save_preset',{name: self.presetName(), camera: self.selectedDevice() });
        }

        self.loadPreset = function() {
            OctoPrint.simpleApiCommand('camerasettings', 'load_preset', {name: self.presetListName() });
        }

        self.deletePreset = function() {
            OctoPrint.simpleApiCommand('camerasettings', 'delete_preset', {name: self.presetListName() });
        }

        self.onEventplugin_camerasettings_cameras_list = function(payload) {
            self.cameras(payload.cameras);
        }

        self.onEventplugin_camerasettings_camera_control_list = function(payload) {
            console.log('Got camera controls:');
            console.log(payload);
            var controls = payload.controls;

            self.shouldUpdateSettings = false;
            for(var control in self.controls) {
                if (control in controls) {
                    self.controls[control].use(true);
                    if (self.controls[control].values) self.controls[control].values(controls[control].values);
                    if (self.controls[control].min) self.controls[control].min(controls[control].min);
                    if (self.controls[control].max) self.controls[control].max(controls[control].max);
                    if (self.controls[control].step) self.controls[control].step(controls[control].step);
                    if (controls[control].type==='bool') {
                        self.controls[control].value(controls[control].value==='1' ? true : false);
                    } else {
                        self.controls[control].value(controls[control].value);
                    }
                } else {
                    self.controls[control].use(false);
                }
            }
            self.shouldUpdateSettings = true;

            self.unknownControls = {};
            self.showUnkControlsWarning(false);
            for (var control in controls) {
                if (!(control in self.controls)) {
                    self.unknownControls[control] = controls[control];
                    self.showUnkControlsWarning(true);
                }
            }
            console.log(`Unknown controls:`);
            console.log(self.unknownControls);
        }

        self.copyUnkToClipboard = function() {
            var tmp = $("<textarea>");
            var txt = JSON.stringify(self.unknownControls, null, 2);
            $("body").append(tmp);
            tmp.val(txt).select();
            document.execCommand("copy");
            tmp.remove();
            new PNotify({title:'Camera Settings', text: 'Unknown Controls Details Copied to Clipboard', type: 'success'});
        }

        self.onAfterTabChange = function(current, previous) {
            if (current==='#tab_plugin_camerasettings') {
                OctoPrint.simpleApiCommand('camerasettings', 'get_cameras');
                console.log(self.settings.settings.webcam.streamUrl());
                self.cameraSrc(self.settings.settings.webcam.streamUrl());
            }
            else {
                self.cameraSrc(undefined);
            }
        }

        self.selectedDevice.subscribe(function(newValue) {
            OctoPrint.simpleApiCommand('camerasettings', 'get_camera_controls', {camera: self.selectedDevice()});            
        });
    }

    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
        construct: CamerasettingsViewModel,
        // ViewModels your plugin depends on, e.g. loginStateViewModel, settingsViewModel, ...
        dependencies: ["settingsViewModel"],
        // Elements to bind to, e.g. #settings_plugin_CameraSettings, #tab_plugin_CameraSettings, ...
        elements: [ '#tab_plugin_camerasettings' ]
    });
});
