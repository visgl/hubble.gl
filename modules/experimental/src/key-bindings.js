/* eslint-disable no-console */
export function handleKeyup({event, adapter, setPlaying, deck, keplerGl}) {
  if (event.code === 'KeyA') {
    console.log('Start animation!');
    adapter.start();
  } else if (event.code === 'KeyP') {
    console.log('DeckGL timeline play!');
    // this.state.scene.animationLoop.timeline.play();
    setPlaying(true);
  } else if (event.code === 'KeyE') {
    console.log('Kill animation!');
    // this.state.scene.animationLoop.timeline.pause();
    setPlaying(false);
    adapter.stop();
  } else if (event.code === 'KeyC') {
    const {latitude, longitude, zoom, pitch, bearing} = deck.props.viewState;

    const c = {
      latitude,
      longitude,
      zoom,
      pitch,
      bearing
    };

    console.log(JSON.stringify(c));
  } else if (event.code === 'KeyV') {
    const {latitude, longitude, zoom, pitch, bearing} = keplerGl.map.mapState;

    const c = {
      latitude,
      longitude,
      zoom,
      pitch,
      bearing
    };

    console.log(JSON.stringify(c));
  } else if (event.code === 'KeyF') {
    console.log(keplerGl.map.visState.filters);
  }
}
