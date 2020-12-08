import React from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';

import {MapControlFactory, Tooltip} from 'kepler.gl/components';
import AnimationIcon from './icons/animation-icon';
import {toggleAnimationPanel} from '../actions/animation';

const StyledMapControlButton = styled.div`
  align-items: center;
  background-color: ${props =>
    props.active ? props.theme.secondaryBtnActBgd : props.theme.secondaryBtnBgd};
  border-radius: 18px;
  border: 0;
  box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.16);
  color: ${props =>
    props.active ? props.theme.secondaryBtnActColor : props.theme.secondaryBtnColor};
  cursor: pointer;
  display: flex;
  height: 36px;
  justify-content: center;
  margin: 0;
  outline: none;
  padding: 0;
  transition: ${props => props.theme.transition};
  width: 36px;

  :focus {
    outline: none;
  }

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.secondaryBtnActBgd};
    color: ${props => props.theme.secondaryBtnActColor};
  }
`;

const MapLegendTooltip = ({id, message}) => (
  <Tooltip id={id} place="left" effect="solid">
    <span>{message}</span>
  </Tooltip>
);

const StyledMapControl = styled.div`
  width: ${props => props.theme.mapControl.width}px;
  padding: ${props => props.theme.mapControl.padding}px;
  padding-top: 0px;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
`;

export function AnimationMapControlFactory() {
  const DefaultMapControl = MapControlFactory();

  const AnimationMapControl = props => {
    const {isAnimationPanel, onToggleAnimationPanel, mapControls} = props;
    return (
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          right: '0',
          flexDirection: 'column'
        }}
      >
        <div style={{position: 'relative', height: '112px'}}>
          <DefaultMapControl {...props} />
        </div>
        {mapControls.animation.show ? (
          <StyledMapControl>
            <StyledMapControlButton
              onClick={e => {
                e.preventDefault();
                onToggleAnimationPanel();
              }}
              active={isAnimationPanel}
              data-tip
              data-for="action-animation"
            >
              <AnimationIcon height="22px" />
              {/* No icon since we are injecting through css .threeD-map class*/}
              <MapLegendTooltip
                id="action-animation"
                message={isAnimationPanel ? 'Disable Animation' : 'Animation'}
              />
            </StyledMapControlButton>
          </StyledMapControl>
        ) : null}
      </div>
    );
  };

  const mapStateToProps = state => ({
    isAnimationPanel: state.demo.keplerGl.map.uiState.mapControls.animation.active
  });
  const dispatchToProps = dispatch => ({
    onToggleAnimationPanel: () => dispatch(toggleAnimationPanel())
  });

  return connect(mapStateToProps, dispatchToProps)(AnimationMapControl);
}
