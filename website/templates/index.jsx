import React from 'react';
import {H4, P, Home} from 'gatsby-theme-ocular/components';
import styled from 'styled-components';

if (typeof window !== 'undefined') {
  window.website = true;
}

const VideoFrame = styled.video`
  @media (min-width: 1920px) {
    width: 100%;
    position: absolute;
  }

  @media (max-width: 767px) {
    display: none;
  }
`

const VideoWrap = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 767px) {
    background: url('videos/hero_poster.jpg');
    background-size: cover;
  }
`

const HeroExample = () => {
  const videoRef = React.useCallback(node => {
    if (node !== null) {
      // increase length of video without affecting size
      node.playbackRate = 0.75 
    }
  }, []);
  return (
    <VideoWrap>
      <VideoFrame ref={videoRef} autoPlay muted loop>
        <source src="videos/hero.mp4" type="video/mp4"/>
      </VideoFrame>
    </VideoWrap>
  )
};

export default class IndexPage extends React.Component {
  render() {
    return (
      <Home HeroExample={HeroExample}>
        <H4>High Quality Video</H4>
        <P>Ensured framerates, high resolutions, and a variety of formats. Fine tune animations with keyframe markers and easings.</P>
        <H4>Easy Integration</H4>
        <P>Stand up scenes within deck.gl or kepler.gl, then animate any aspect of it. Empower users to animate without code with UI components powered by this library.</P>
        <H4>Client Side Library</H4>
        <P>Render within the browser without a backend. User data never leaves their machine. Since nothing runs on a server, sites can scale without backend encoders.</P>
      </Home>
    );
  }
}
