# RFC: @hubble.gl/convert cli for common post-processing tasks

* Authors: Chris Gervang
* Date: October, 2022
* Status: **Draft**

## Context

A challenge most users face after rendering with hubble.gl is converting their exported animation into multi formats to meet the needs of different use cases and applications. For example, a user may want a highly compressed MP4s to share quick iterations at the cost of image quality, or they may want loseless MP4s for video editing, or they want a highly optimized GIF, etc.

These tasks can be performed using free open source native tools, such as ffmpeg or graphicmagik, but these tools have a high learning curve. There is an opportunity to significantly reduce complexity for end users since hubble.gl exports in so few formats. 

## Proposal

We can make common conversion tasks easier to access with a CLI, and lay a foundation to enable future development of more accessible conversion GUIs delivered as native desktop applications or in-browser via web assembly.

## API

The CLI would be implemented as an `npx` command. Upon first use it will cache a static build of `ffmpeg`. Some example usages:

```bash
# Convert WEBM to a MP4 with compression suitable for presentation software.
npx @hubble.gl/convert -i video.webm -q presentation -o video.mp4
```

Framerate and resolution are unchanged. The format is converted to a highly compressed video compatible with nearly all video players. 

Users can down-sample **f**ramerate to 15fps with `-f 15`, or **s**cale resolution by half with `-s '1/2'`, or relative to a fixed pixel height with `-s 'w:1080'` (or width as `'1920:h'`).

[Editor Note: resolution needs to remain even for technical compatibility, which is motivating this factor syntax. A decimal scalar (e.g. `0.5`) might be a more intuitive input, but we'd need to reject odd resolutions or round to nearest even.]

```bash
# Convert WEBM to a draft-quality (compressed) MP4 at half resolution
npx @hubble.gl/convert -i video.webm -q draft -s '1/2' -o video.mp4
```

Loseless encoding is compatible with fewer video players, but will work with video editors and VLC player.

```bash
# Convert a 30fps image sequence archive to a loseless MP4 
npx @hubble.gl/convert -i video.zip -i:f 30 -q loseless -o video.mp4
```

Trimming video is very commonly necesarry with GIFs due to their lack of compression and can be performmed by supply a range of timecodes to trim with `-t '01-10'` for the 9 seconds between 1 and 10. Note: Timecode framerate matches the input. 

```bash
# Convert a WEBM to a highly optimized GIF at half the resolution, 10 frames per second, and trimmed to 8 seconds.
npx @hubble.gl/convert -i video.webm -s '1/2' -r 10 -t '00:00:02.15-00:00:10.15' -o video.gif
```

### Flags

`-i [file]` - input file. 

Formats supported: `.webm`, `.gif`, `.zip`, or `.tar`. The archive formats must contain number sequenced `.png` or `.jpeg` files.

`-i:f [framerate]` - input framerate.

Specify the actual input framerate when it cannot be deduced from metadata. This flag is required for image sequence archive files.

`-o [output]` - output file. Default: `[input].mp4` in same directory.

Optionally specify an output destination and name.

`-o:e [encoding]` - output enconding. Defaults: `mp4`.

Supported: `gif`, `mp4`. This optional flag is supplied when `-o` is not used so the user can specify the output format. 

`-q [quality]` - output compression. Default: `draft`.

Presets supported: `draft`, `presentation`, and `loseless`.  For mp4 output an integer between 0 and 24 may also be supplied, equivalent to `ffmpeg`'s `-crf` flag, but understand the filesize won't necesarily be optimal when this is used.

  - `draft` is equivalent to `-preset fast -crf 20` for moderate compression and quality.

  - `presentation` is equivalanet to `-preset ultraslow -crf 17` for best compression and "artifact-free" quality.

  - `loseless` is `-preset ultrafast -crf 1` for no compression and best quality.

Note: `draft` and `presentation` quality `mp4`s are exported for maximum player compatibility, but loseless is not (e.g. will not play in Quicktime).

`-f [framerate]` - down-sample output framerate.

This optional flag will reduce the framerate of the output file. This reduces the output size at the cost of a choppier video.

`-s [scale]` - scale output resolution.

In the simple case, resolution can be scaled by supplying even fractions, such as `'1/4'` to reduce the resolution to a quarter of the input size. The output resolution must be even and at least `2x2`. It can also be scaled relative to a fixed axis with `'w:1080'` to fix height and scale width, or `'1920:h'` to fix width and scale height.

`-t [timecode range]` - trim output.

Trimming video is controlled by supplying timecode ranges of the video to keep. Timecode syntax is `HH:MM:SS.FF`, where all digits use a leading `0`. `HH` is hour, `MM` is minute, `SS` is second, and `FF` is frame. Deliniate start and end timecodes with a dash, `-`. To trim from a point until the start or end use a wildcard value, `*`.

Zeroed out values can be dropped, so `00:00:01.00` can be shortened to `01`. Timecode framerate is expected to match the input framerate.

Examples:

  - `-t '01-05.04'` trim out `00:00:01.00` to `00:00:05.04`
  - `-t '04.10-*'` trim out `00:00:04.10` to the end.
  - `-t '*-10'` trim out the start to `00:00:10.00`.