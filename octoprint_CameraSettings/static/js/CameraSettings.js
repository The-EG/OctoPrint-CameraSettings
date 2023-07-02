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
        self.cameraFlipV = ko.observable(false);
        self.cameraFlipH = ko.observable(false);
        self.cameraRot90 = ko.observable(false);

        self.selectedDevice = ko.observable(undefined);
        self.cameras = ko.observableArray([]);
        self.showUnkControlsWarning = ko.observable(false);
        self.unknownControls = {};
        self.presetName = ko.observable(undefined);
        self.presetListName = ko.observable(undefined);

        self.webcamHLS = ko.observable(false);

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
            white_balance_component_auto: { use: ko.observable(false), value: ko.observable(undefined) },
            white_balance_temperature: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            video_bitrate_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            video_bitrate: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure_dynamic_framerate: { use: ko.observable(false), value: ko.observable(undefined) },
            image_stabilization: { use: ko.observable(false), value: ko.observable(undefined) },
            wide_dynamic_range: { use: ko.observable(false), value: ko.observable(undefined) },
            blue_balance: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            red_balance: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            white_balance_blue_component: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            white_balance_red_component: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hue_automatic: { use: ko.observable(false), value: ko.observable(undefined) },
            brightness: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            sharpness: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            contrast: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            saturation: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            color_effects: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            color_effects_cbcr: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            compression_quality: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure_time_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            exposure_metering_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            horizontal_flip: { use: ko.observable(false), value: ko.observable(undefined) },
            white_balance_automatic: { use: ko.observable(false), value: ko.observable(undefined) },
            gain_automatic: { use: ko.observable(false), value: ko.observable(undefined) },
            vertical_flip: { use: ko.observable(false), value: ko.observable(undefined) },
            rotate: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_i_frame_period: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_level: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            h264_profile: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            h264_decode_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            h264_start_code: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            h264_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },

            video_b_frames: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            video_gop_size: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            video_peak_bitrate: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            sequence_header_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            maximum_bytes_in_a_slice: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            number_of_mbs_in_a_slice: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            slice_partitioning_method: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            base_layer_priority_id: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            ltr_count: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            frame_ltr_index: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            intra_refresh_period: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_i_frame_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_i_frame_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_i_frame_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_p_frame_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_p_frame_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_p_frame_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_b_frame_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_b_frame_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_b_frame_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_8x8_transform_enable: { use: ko.observable(false), value: ko.observable(undefined) },
            h264_entropy_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            h264_loop_filter_alpha_offset: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_loop_filter_beta_offset: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            h264_loop_filter_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            mpeg4_level: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            mpeg4_profile: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            vpx_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            vpx_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            vp8_profile: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            hevc_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_i_frame_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_i_frame_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_i_frame_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_p_frame_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_p_frame_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_p_frame_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_b_frame_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_b_frame_minimum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_b_frame_maximum_qp_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hevc_profile: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            hevc_level: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            constant_quality: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            frame_skip_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },

            hevc_decode_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            hevc_start_code: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            min_number_of_capture_buffers: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            frame_rate: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            force_key_frame: {use: ko.observable(false), value: ko.observable(undefined)},
            repeat_sequence_header: { use: ko.observable(false), value: ko.observable(undefined) },
            backlight_compensation: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            pan_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            pan_speed: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            tilt_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            tilt_speed: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            focus_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            focus: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            zoom_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hue: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            hue_auto: { use: ko.observable(false), value: ko.observable(undefined) },
            gamma: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            focus_auto: { use: ko.observable(false), value: ko.observable(undefined) },
            focus_automatic_continuous: { use: ko.observable(false), value: ko.observable(undefined) },
            privacy: { use: ko.observable(false), value: ko.observable(undefined) },
            disable_video_processing: { use: ko.observable(false), value: ko.observable(undefined) },
            led1_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            led1_frequency: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            raw_bits_per_pixel: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            zoom_continuous: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            iris_absolute: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            iris_relative: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            band_stop_filter: { use: ko.observable(false), value: ko.observable(undefined) },
            auto_contour: { use: ko.observable(false), value: ko.observable(undefined) },
            contour: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            dynamic_noise_reduction: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            auto_white_balance_speed: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            auto_white_balance_delay: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            red_pixel_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            green_red_pixel_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            blue_pixel_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            green_blue_pixel_value: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            test_pattern: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            digital_gain: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },

            camera_orientation: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },
            camera_sensor_rotation: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            vertical_blanking: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            horizontal_blanking: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            analogue_gain: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            pixel_rate: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },

            pan_relative: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            tilt_relative: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },

            pan_reset: { use: ko.observable(false), value: ko.observable(1) },
            tilt_reset: { use: ko.observable(false), value: ko.observable(1) },

            ipu3_pipe_mode: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },

            link_frequency: { use: ko.observable(false), value: ko.observable(undefined), values: ko.observableArray([]) },

            group_hold: { use: ko.observable(false), value: ko.observable(undefined) },
            sensor_mode: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },
            frame_rate: { use: ko.observable(false), value: ko.observable(undefined), min: ko.observable(0), max: ko.observable(100), step: ko.observable(1) },

            save_user_settings: { use: ko.observable(false), value: ko.observable(1) },
            restore_user_settings: { use: ko.observable(false), value: ko.observable(1) },
            restore_factory_settings: { use: ko.observable(false), value: ko.observable(1) }
        };

        self.shouldUpdateSettings = false;

        for (var control in self.controls) {
            var updateControl = function(ctrlName) {
                return () => self.sendSetControl(ctrlName);
            }

            self.controls[control].value.subscribe(updateControl(control));
        }

        self.sendSetControl = function(control) {
            if (self.shouldUpdateSettings) {
                var ctrls = {};
                var val = self.controls[control].value();
                if (typeof val === 'boolean') val = val ? '1' : '0';
                if (self.controls[control].use()) ctrls[control] = val;
                OctoPrint.simpleApiCommand('camerasettings', 'set_camera_controls', {camera: self.selectedDevice(), controls: ctrls})
            }
        }

        self.restoreDefaults = function() {
            OctoPrint.simpleApiCommand('camerasettings','restore_defaults', {camera: self.selectedDevice()} );
        }


        self.savePreset = function() {
            var controls = {};
            for (var ctrl in self.controls) {
                if (self.controls[ctrl].use()) {
                    controls[ctrl] = ko.observable(self.controls[ctrl].value());
                }
            }
            self.deletePresetByName(self.presetName());
            self.settings.settings.plugins.camerasettings.presets.push({name: ko.observable(self.presetName()), camera: ko.observable(self.selectedDevice()), controls: controls});
        }

        self.deletePresetByName = function(name) {
            var ind = -1;
            for(var i in self.settings.settings.plugins.camerasettings.presets()) {
                if (self.settings.settings.plugins.camerasettings.presets()[i].name()===name) {
                    ind = i;
                    break;
                }
            }
            if (ind >=0) self.settings.settings.plugins.camerasettings.presets.splice(ind, 1);
        }

        self.loadPreset = function() {
            OctoPrint.simpleApiCommand('camerasettings', 'load_preset', {name: self.presetListName() });
        }

        self.deletePreset = function() {
            self.deletePresetByName(self.presetListName());
        }

        self.onEventplugin_camerasettings_cameras_list = function(payload) {
            if (payload.cameras) {
                self.cameras(payload.cameras);
            }
            if (payload.error) {
                new PNotify({title:'Camera Settings', text: payload.error, type: 'error', hide: false});
            }
        }

        self.onEventplugin_camerasettings_camera_control_list = function(payload) {

            if (payload.controls) {
                var controls = payload.controls;

                controls['hevc_sequence_parameter_set'] = {'type': 'unknown'};
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
                        } else if (controls[control].type==='button' || controls[control].type==='unknown' || controls[control].type==='bitmask') {
                            continue; // ignore 'button' and 'unknown' controls for now  
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
                    if (!(control in self.controls || controls[control].type==='unknown')) {
                        self.unknownControls[control] = controls[control];
                        self.showUnkControlsWarning(true);
                    }
                }
            }

            if (payload.error) {
                new PNotify({
                    title:'Camera Settings', 
                    text: `Could not load camera controls:<br><span style="font-style: italic;">${payload.error}</span>`,
                    type: 'error',
                    hide: false});
            }
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

        self.getCameraProfile = function() {
            if (self.settings.settings.plugins.multicam===undefined || !self.settings.settings.plugins.camerasettings.multicam_support()) {
                return undefined;
            }

            var mcProfiles = self.settings.settings.plugins.multicam.multicam_profiles();
            var mapping = self.settings.settings.plugins.camerasettings.multicam_mapping();

            var camName = undefined;            

            for(var c in self.cameras()) {
                if (self.cameras()[c].device===self.selectedDevice()) {
                    camName = self.cameras()[c].camera;
                    break;
                }
            }

            if ( camName===undefined) return undefined;

            var mcName = undefined;

            for(var p in mapping) {
                if(mapping[p].camera()==camName) {
                    mcName = mapping[p].multicam();
                    break;
                }
            }


            if (mcName===undefined) return undefined;

            for (var p in mcProfiles) {
                if (mcProfiles[p].name()===mcName) return mcProfiles[p];
            }

            return undefined;
        }

        self.onSettingsShown = function() {
            OctoPrint.simpleApiCommand('camerasettings', 'get_cameras');
            //self.cameraSrc(self.settings.settings.webcam.streamUrl());
            self.setupStreamPreview();
        }

        self.onSettingsHidden = function() {
            self.cameraSrc(undefined);
        }

        self.setupStreamPreview = function() {
            var profile = self.getCameraProfile();
            if (profile===undefined) {
                self.cameraSrc(self.settings.settings.webcam.streamUrl());
                self.cameraFlipH(self.settings.settings.webcam.flipH());
                self.cameraFlipV(self.settings.settings.webcam.flipV());
                self.cameraRot90(self.settings.settings.webcam.rotate90());
            } else {
                self.cameraSrc(undefined);
                self.cameraFlipH(profile.flipH());
                self.cameraFlipV(profile.flipV());
                self.cameraRot90(profile.rotate90());
                self.cameraSrc(profile.URL());
            }

            if (determineWebcamStreamType(self.cameraSrc())=="hls") {
                var video = document.getElementById("camerasettings_preview_hls");
                self.webcamHLS(true);
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    // do nothing , the video tag already has the URL
                } else if (Hls.isSupported()) {
                    var hls = new Hls();

                    hls.loadSource(self.cameraSrc());
                    hls.attachMedia(video);
                }
            } else {
                self.webcamHLS(false);
            }
        }

        self.selectedDevice.subscribe(function(newValue) {
            OctoPrint.simpleApiCommand('camerasettings', 'get_camera_controls', {camera: self.selectedDevice()});   

            self.setupStreamPreview();
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
        elements: [ '#settings_plugin_camerasettings' ]
    });
});
