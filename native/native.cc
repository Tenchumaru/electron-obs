#pragma warning(push)
#pragma warning(disable : 4996)
#include <nan.h>
#pragma warning(pop)
#include <Windows.h>
#include <iostream>
#include <string>
#pragma warning(push)
#pragma warning(disable : 4201)
#include <obs.hpp>
#pragma warning(pop)
#pragma warning(push, 4)
#pragma comment(lib, "../../../../obs-studio/build_x64/libobs/Debug/obs.lib")

namespace {
	obs_output_t* output;
}

NAN_METHOD(StartObs) {
	v8::Local<v8::Boolean> retval = Nan::New(false);
	if (info.Length() >= 1 && info[0]->IsString()) {
		// Get the stream key from the first parameter.
		v8::String::Utf8Value val(info.GetIsolate(), info[0]);
		std::string streamKey(*val, val.length());

		// Change the working directory to OBS.
		// https://obsproject.com/forum/threads/libobs-relative-imports-config.124878/
		SetCurrentDirectoryA("..\\obs-studio\\build_x64\\rundir\\Debug\\bin\\64bit");

		// Start OBS.
		if (obs_startup("en-US", nullptr, nullptr)) {
			// Initialize the video context.
			obs_video_info ovi{};
			ovi.adapter = 0;
			ovi.base_width = 1280;
			ovi.base_height = 720;
			ovi.output_width = 1280;
			ovi.output_height = 720;
			ovi.fps_num = 30;
			ovi.fps_den = 1;
			//ovi.gpu_conversion = true;
			ovi.graphics_module = "libobs-d3d11.dll";
			ovi.output_format = VIDEO_FORMAT_NV12;
			if (obs_reset_video(&ovi) == OBS_VIDEO_SUCCESS) {
				// Initialize the audio context.
				obs_audio_info oai{};
				oai.samples_per_sec = 44100;
				oai.speakers = SPEAKERS_STEREO;
				if (obs_reset_audio(&oai)) {
					// Load all OBS modules.
					obs_load_all_modules();

					// Create the audio and video encoders.
					obs_data_t* vsettings = obs_data_create();
					obs_encoder_t* video_encoder = obs_video_encoder_create("simple_h264_stream", "simple_h264_stream", vsettings, nullptr);
					obs_data_t* asettings = obs_data_create();
					obs_encoder_t* audio_encoder = obs_audio_encoder_create("simple_aac", "simple_aac", asettings, 0, nullptr);

					// Create the Twitch service with the server URL and stream key.
					obs_data_t* service_settings = obs_data_create();
					obs_data_set_string(service_settings, "server", "rtmp://live.twitch.tv/app");
					obs_data_set_string(service_settings, "key", streamKey.c_str());
					obs_service_t* service = obs_service_create("rtmp_common", "Twitch", service_settings, nullptr);

					// Create an RTMP output.
					output = obs_output_create("simple_stream", "rtmp_output", nullptr, nullptr);

					// Set the encoders and the service in the output.
					obs_output_set_video_encoder(output, video_encoder);
					obs_output_set_audio_encoder(output, audio_encoder, 0);
					obs_output_set_service(output, service);

					// Start the output.
					if (obs_output_start(output)) {
						retval = Nan::New(true);
					}
				}
			}
		}
	}
	info.GetReturnValue().Set(retval);
}

NAN_METHOD(StopObs) {
	if (output) {
		// Stop the output.
		obs_output_stop(output);
		output = nullptr;

		// Shut down OBS.
		obs_shutdown();
	}
}

NAN_MODULE_INIT(Init) {
	Nan::Set(target, Nan::New<v8::String>("startObs").ToLocalChecked(),
		Nan::GetFunction(Nan::New<v8::FunctionTemplate>(StartObs)).ToLocalChecked());
	Nan::Set(target, Nan::New<v8::String>("stopObs").ToLocalChecked(),
		Nan::GetFunction(Nan::New<v8::FunctionTemplate>(StopObs)).ToLocalChecked());
}

NODE_MODULE(native, Init)
