import React from 'react';
import {Home} from '@vis.gl/docusaurus-website/components';
import styled from 'styled-components';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';

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

const TextContainer = styled.div`
  max-width: 800px;
  padding: 64px 112px;
  width: 70%;
  font-size: 14px;

  h2 {
    font: bold 32px/48px;
    margin: 24px 0 16px;
    position: relative;
  }
  h3 {
    font: bold 16px/24px;
    margin: 16px 0 0;
    position: relative;
  }
  h3 > img {
    position: absolute;
    top: -4px;
    width: 36px;
    left: -48px;
  }
  hr {
    border: none;
    background: #e1e8f0;
    height: 1px;
    margin: 24px 0 0;
    width: 32px;
    height: 2px;
  }
  @media screen and (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    padding: 48px 48px 48px 80px;
  }
`;

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

export default function IndexPage() {
  const baseUrl = useBaseUrl('/');
  return (
    <Layout title="Home" description="hubble.gl">
      <Home theme="dark" HeroExample={HeroExample}>
        <div style={{padding: "2rem", paddingLeft: "4rem"}}>
          <TextContainer>
            <h3>High Quality Video</h3>
            <p>Ensured framerates, high resolutions, and a variety of formats. Fine tune animations with keyframe markers and easings.</p>
            <h3>Easy Integration</h3>
            <p>Stand up scenes within deck.gl or kepler.gl, then animate any aspect of it. Empower users to animate without code with UI components powered by this library.</p>
            <h3>Client Side Library</h3>
            <p>Render within the browser without a backend. User data never leaves their machine. Since nothing runs on a server, sites can scale without backend encoders.</p>
          </TextContainer>
        </div>
      </Home>
    </Layout>
  );
}
