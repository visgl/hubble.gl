# Video Conversion Guide

Use this guide to learn how to use `ffmpeg` and HandBrake, free open source tools, to convert hubble.gl renderings into different formats or different levels of compression depending on your use case.

For example, you may want a highly compressed MP4 to share quick drafts, you may want a loseless MP4 for video editing, or you want a highly optimized animated GIF. 

This guide assumes you have no experience with `ffmpeg`, but are comfortable using a command line. If you would prefer to work in a GUI, follow the instructions for HandBrake.

## HandBrake

HandBrake is a GUI powered by `ffmpeg` for converting video from nearly any format to a selection of modern, widely supported codecs. For hubble.gl users it is a quick and convenient way to convert a queue of `WEBM` videos to `MP4`. 

> Note: HandBrake does not support `GIF` or `PNG`/`JPEG` formats. Use `ffmpeg` to work with these formats.

### Prerequisites

Install [HandBrake](https://handbrake.fr/).

### WEMB to MP4

Open HandBrake and follow prompts to open your `WEBM` file. 

<img src="/images/handbrake_main.png" alt="HandBrake Main Screen" width="600px"/>


HandBrake comes with a variety of presets for common quality and resolution settings. Simply pick one from the dropdown and click "Start" in the toolbar, or "Add to Queue" if you're setting up multiple conversions.

<img src="/images/handbrake_presets.png" alt="HandBrake Presets Menu" width="600px"/>

*Screenshots courtesy of [HandBrake](https://handbrake.fr/)*

## FFMPEG

If you've encoded a lot of media before, you've likely encountered `ffmpeg`. If this tool is new to you, here's how the `ffmpeg` project describes their tool:

> “FFmpeg is the leading multimedia framework, able to **decode**, **encode**, **transcode**, **mux**, **demux**, **stream**, **filter** and **play** pretty much anything that humans and machines have created. It supports the most obscure ancient formats up to the cutting edge.”

Needless to say, this guide only scratches the surface of what you can do with `ffmpeg` and makes no attempt to teach in detail what each command is doing - it serves more as a recipe book. The tool is well documented and there are endless tutorials onine to really grok whats going on. If you want to learn more, we highly recommend the article about GIF optimization on the [GIPHY Engineering Blog](https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/), or reading the [H.264 Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/H.264) published on the project wiki.

### Prerequisites

Install [ffmpeg](https://ffmpeg.org/download.html).

This guide references variables for inputs and outputs. For convenience, here are a `bash` helper we commonly use to place the output file next to the input file:

```bash
input="$1"
filename="$(basename "$input" | sed 's/\(.*\)\..*/\1/')"
folder="$(dirname -- "$input")"
```

### WEBM to MP4

```bash
# Default settings, high compatibility.
ffmpeg -i $input -c:v libx264 -vf format=yuv420p "$folder/$filename.mp4"
```

> Note: Change compression and qualtiy settings using `-preset` and `-crf`.

```bash
# High compression, high quality, slow encoding speed.
ffmpeg -i $input -c:v libx264 -vf format=yuv420p -preset veryslow -crf 17  "$folder/$filename.mp4"
```

```bash
# Near loseless, fast.
ffmpeg -i $input -c:v libx264 -vf format=yuv420p -preset ultrafast -crf 1  "$folder/$filename.mp4"
```

### WEBM to GIF

```bash
# Outputs at 10fps, optimizes color palette.
ffmpeg -i $input -filter_complex "[0:v] fps=10,split [a][b];[a] palettegen [p];[b][p] paletteuse" "$folder/$filename.gif"
```

```bash
# Increase fps to 20 for less-choppy but larger file.
ffmpeg -i $input -filter_complex "[0:v] fps=20,split [a][b];[a] palettegen [p];[b][p] paletteuse" "$folder/$filename.gif"
```

### PNG or JPEG sequence to MP4

To convert the images to an MP4, unzip the archive into a folder. You'll need to specify the framerate using the `-r` flag, since `ffmpeg` does not infer this.

> Note: Change the input extension to `.jpeg` if you're using that format. 

```bash
# Near loseless, fast with 60fps input.
ffmpeg -r 60 -f image2 -i "$input/%07d.png" -c:v libx264 -vf format=yuv420p -preset ultrafast -crf 1  "$folder/$filename.mp4"
```

> Note: Change compression and qualtiy settings using `-preset` and `-crf`, same as [WEBM to MP4](#webm-to-mp4).

### PNG or JPEG sequence to GIF

```bash
# Outputs a 30fps input to 10fps to reduce size, optimizes color palette.
ffmpeg -r 30 -f image2 -i "$input/%07d.png" -filter_complex "[0:v] fps=10,split [a][b];[a] palettegen [p];[b][p] paletteuse" "$folder/$filename.gif"
```

```bash
# Outputs a 30fps input to 10fps to reduce size, optimizes color palette.
ffmpeg -r 30 -f image2 -i "$input/%07d.png" -filter_complex "[0:v] fps=30,split [a][b];[a] palettegen [p];[b][p] paletteuse" "$folder/$filename.gif"
```

> Note: You can trim the beginning with `-start_number`. i.e. Start at `0001234.png` with `-start_number 1234`.

```bash
# Scale the output to 300px wide while maintaining aspect ratio.
ffmpeg -r 30 -f image2 -i "$input/%07d.png" -filter_complex "[0:v] fps=10,scale=300:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" "$folder/$filename.gif"
```

### Common Problems

#### Error: "height not divisible by 2"

.h264 needs an even resolution, but there's nothing that prevents hubble.gl from exporting an asset with an odd dimension. You can fix this within a filter (`-filter:v` or `-filter_complex`) that converts it to an even resolution you specify. 

```bash
# Example
-filter:v "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440"
# Input: 2559 x 1440
# Scale up while maintaining aspect ratio
# Crop to 2560 x 1440
```

> Tip: Pick a resolution close to the original to preserve quality.
