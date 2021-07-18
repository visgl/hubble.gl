# Demo App

This is a lite version of the kepler.gl demo app that includes hubble.gl features. In particular, presets to modify zoom, bearing, pitch, as well as latitude/longitude are demonstrated within a self-contained modal that can be accessed by clicking the "Share" option at the top left of the side panel and then selecting "Export Video". Afterwards, animations can be exported in various formats such as GIF, WEBM, JPEG sequence, etc.

<img src="https://user-images.githubusercontent.com/33266041/126054524-607641cf-b362-4728-98b7-e8ce8a97cd1a.png">


That will take you to a modal where you can create your animation
<img src="https://user-images.githubusercontent.com/33266041/126054581-a5f38817-5775-4fca-8901-6c25d8194458.png">

A live demo can be viewed here:
https://hubble.gl/examples/kepler-integration/

#### 1. Install

```sh
yarn
```


#### 2. Mapbox Token
add mapbox access token to node env

```sh
export MapboxAccessToken=<your_mapbox_token>
```

#### 3. Start the app

```sh
yarn start-local
```

## Other Features
### hubble.gl also supports the ability to animate time ranges. First select the desired range before opening the modal.