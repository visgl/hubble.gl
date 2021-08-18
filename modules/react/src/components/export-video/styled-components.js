import styled from 'styled-components';
import {DEFAULT_ROW_GAP, DEFAULT_PADDING, DEFAULT_SETTINGS_WIDTH} from './constants';

export const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;
  margin-right: 24px;
  margin-left: 24px;
`;

export const StyledLabelCell = styled.div`
  align-self: center;
  color: ${props => props.theme.labelColor};
  font-weight: 400;
  font-size: 11px;
`;

export const StyledValueCell = styled.div`
  align-self: center;
  color: ${props => props.theme.textColor};
  font-weight: 500;
  font-size: 11px;
  padding: 0 12px;
`;

export const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 88px auto;
  grid-template-rows: repeat(
    ${props => props.rows},
    ${props => (props.rowHeight ? props.rowHeight : '34px')}
  );
  grid-row-gap: ${DEFAULT_ROW_GAP}px;
`;

export const ButtonGroup = styled.div`
  display: flex;
`;

export const ModalContainer = styled.div`
  position: relative;
`;

export const PanelCloseInner = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledTitle = styled.div`
  color: ${props => props.theme.titleTextColor};
  font-size: 20px;
  font-weight: 400;
  line-height: ${props => props.theme.lineHeight};
  padding-bottom: 16px;
`;

export const PanelBodyInner = styled.div`
  display: grid;
  grid-template-columns: ${props => props.exportVideoWidth}px ${DEFAULT_SETTINGS_WIDTH}px;
  grid-template-rows: auto;
  grid-column-gap: ${DEFAULT_ROW_GAP}px;
`;

export const Panel = styled.div`
  width: ${props =>
    props.exportVideoWidth + 2 * DEFAULT_PADDING + DEFAULT_ROW_GAP + DEFAULT_SETTINGS_WIDTH}px;
  padding: ${DEFAULT_PADDING}px;
`;

export const deckStyle = {
  width: '100%',
  height: '100%',
  position: 'relative'
};

export const TimelineControls = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 16px;
`;

export const timelinePlayButtonStyle = {
  cursor: 'pointer',
  height: '32px',
  width: '32px',
  fill: '#FFF'
};

export const LoaderWrapper = styled.div`
  display: ${props => (props.rendering === false ? 'none' : 'flex')};
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  align-items: center;
  justify-content: center;
`;

export const RenderingFeedbackContainer = styled.div`
  color: white;
  position: absolute;
  top: ${props => props.height - 180}px;
`;

export const VideoLengthDisplay = styled.div`
  align-self: center;
  padding-left: 8px;
`;

export const ExportVideoPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const DeckCanvas = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  position: relative;
`;
