# Common Video Conversion Tasks

Use this guide to learn how to use `ffmpeg` and HandBrake, free open source tools, to convert hubble.gl renderings into different formats and compressions.

For example, you may want a highly compressed MP4 to share quick drafts, you may want a loseless MP4 for video editing, or you want a highly optimized GIF. 

This guide assumes you have no experience with `ffmpeg`, but are comfortable using a command line. If you would prefer to work in a GUI, follow instructions for HandBrake.

## HandBrake

HandBrake is a GUI powered by `ffmpeg` for converting video from nearly any format to a selection of modern, widely supported codecs. For hubble.gl users it is a quick and convenient way to convert a queue of `WEBM` videos to `MP4`. 

> Note: HandBrake does not support `GIF` or Image Sequence formats. Use `ffmpeg` to work with these formats.

### Prerequisites

Install [HandBrake](https://handbrake.fr/).

### WEMB to MP4

Open HandBrake and follow prompts to open your `WEBM` file. 

<img src="/images/handbrake_main.png" alt="HandBrake Main Screen" width="600px"/>


HandBrake comes with a variety of presets for common quality and resolution settings. Simply pick one from the dropdown and click "Start" in the toolbar, or "Add to Queue" if you're setting up multiple conversions.

<img src="/images/handbrake_presets.png" alt="HandBrake Presets Menu" width="600px"/>

## FFMPEG

If you've encoded a lot of media before, you've likely encountered `ffmpeg`. If this tool is new to you, here's how the `ffmpeg` project describes their tool:

> “FFmpeg is the leading multimedia framework, able to **decode**, **encode**, **transcode**, **mux**, **demux**, **stream**, **filter** and **play** pretty much anything that humans and machines have created. It supports the most obscure ancient formats up to the cutting edge.”

Needless to say, this guide only scratches the surface of what you can do with `ffmpeg` and makes no attempt to teach in detail what each command is doing - it serves more as a recipe book. The tool is well documented and there are endless tutorials onine to really grok whats going on. If you want to learn more, we highly recommend the article about GIF optimization on the [GIPHY Engineering Blog](https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/), or reading the [H.264 Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/H.264) published on the project wiki.

### Prerequisites

Install [ffmpeg](https://ffmpeg.org/download.html).

This guide references variables for inputs and outputs. For convenience, here are the `bash` implementations we commonly use to place the output file next to the input file:

```bash
input="$1"
filename="$(basename "$input" | sed 's/\(.*\)\..*/\1/')"
folder="$(dirname -- "$input")"
```

### WEBM to MP4

```bash
# Default settings, high compatibility
ffmpeg -i $input -c:v libx264 -vf format=yuv420p "$folder/$filename.mp4"
```

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

> Note: Change the input extension to `.jpeg` if you're using that format. 

```bash
# PNG
ffmpeg -r 60 -f image2 -i "$input/%07d.png" -vcodec libx264 -pix_fmt yuv420p -filter:v "crop=3840:2160:0:0" -crf 0  "$outfile.mp4"
```

```bash
ffmpeg -r 60 -f image2 -i "$input/%07d.png" -filter:v "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440" -vcodec libx264 -crf 0 -pix_fmt yuv420p "$folder/$filename.mp4"
```

```bash
ffmpeg -r 30 -f image2 -start_number 1858 -i "$input/%07d.png" -filter:v "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -vcodec libx264 -crf 1 -pix_fmt yuv420p -tune animation "$folder/$filename.mp4"
```

### PNG or JPEG sequence to GIF

```bash
ffmpeg -r 60 -f image2 -start_number 1858 -i "$input/%07d.png" -filter_complex "[0:v] fps=24,scale=1920:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" "$folder/$filename.gif"
```

```bash
ffmpeg -r 30 -f image2 -start_number 1858 -i "$input/%07d.png" -filter_complex "[0:v] fps=10,scale=1920:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse" "$folder/$filename.gif"
```

```bash
ffmpeg -r 30 -f image2 -start_number 1858 -i "$input/%07d.png" -filter_complex "[0:v] fps=30,split [a][b];[a] palettegen [p];[b][p] paletteuse" "$folder/$filename.gif"
```