import window from 'global/window';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {throttleResize} from './utils';
import {ArrowLeft, ArrowRight} from './keyframes-icons';

const DEFAULT_COLOR = '#f00';
const DEFAULT_SIZE = 8;

const ICON = {
  width: 16,
  height: 26
};

const INIT_BUTTONS = {
  leftButton: 'none',
  rightButton: 'none'
};

// Constant acceleration; 1000 ms for scrolling whole view width.
// s = 0.5 * a * t^2
// s = 0.5 * viewWidth
// t = 0.5 * wholeDuration
// a = 4 * viewWidth / wholeDuration^2
// s < 0.5 * viewWidth
// t = sqrt(2 * s / a)
// t = sqrt(2 * s / (4 * viewWidth / wholeDuration^2))
// t = 0.5 * wholeDuration * sqrt(2 * s / viewWidth)
// scrollState.duration = 2 * t
const ANIMATION_DURATION = 750;
const ANIMATION_FACTOR = 4;
const ANIMATION_REDUCE = 0.5;

export default class KeyframesTray extends Component {
  // childHeight = full height (includes padding/margin/shadow on each child)
  // childWidth = full width (includes padding/margin/shadow on each child)
  // default popupGap assumes 8px around the child of either margin/padding
  // boolean popupPointer set to true if CssTriangle should be added to
  // bottom center of infoBox.
  // popupPointerColor is a string for color name or hexadecimal value.
  // popupPointerSize is size of CssTriangle
  static propTypes = {
    childWidth: PropTypes.number.isRequired,
    childHeight: PropTypes.number.isRequired,
    popupGap: PropTypes.number,
    popupPointer: PropTypes.bool,
    popupPointerColor: PropTypes.string,
    popupPointerSize: PropTypes.number
  };

  static defaultProps = {
    popupGap: 8,
    popupPointer: false,
    popupPointerColor: DEFAULT_COLOR,
    popupPointerSize: DEFAULT_SIZE
  };

  state = {
    buttons: INIT_BUTTONS,
    hover: {item: -1},
    viewStripDiv: {scrollLeft: 0}
  };

  componentWillMount() {
    this.setState({...this.collectChildrenTypes()});
  }

  componentDidMount() {
    throttleResize();
    window.addEventListener('optimizedResize', this.onResize);

    const buttons = this.updateButtonsVisibility();
    if (
      buttons &&
      (buttons.leftButton !== this.state.buttons.leftButton ||
        buttons.rightButton !== this.state.buttons.rightButton ||
        buttons.viewHeight !== this.state.buttons.viewHeight)
    ) {
      /* eslint-disable react/no-did-mount-set-state */
      // updateButtonVisibility needs to get dom dimensions (e.g., offsetWidth)
      this.setState({
        buttons
      });
      /* eslint-enable react/no-did-mount-set-state */
    }
  }

  componentWillReceiveProps(nextProps) {
    const {curProps} = this.props;
    if (React.Children.count(curProps) !== React.Children.count(nextProps.children)) {
      this.setState({...this.collectChildrenTypes()});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.viewStripDiv.scrollLeft !== this.state.viewStripDiv.scrollLeft &&
      this.viewStrip
    ) {
      // Deal with animation if that is where the state change is
      this.viewStrip.scrollLeft = this.state.viewStripDiv.scrollLeft;
    }

    // recentScroll is negative until scroll animation completes
    const recentScroll =
      this.state.scrollState &&
      this.state.scrollState.duration &&
      Number(new Date()) - this.state.scrollState.startTime - this.state.scrollState.duration < 100;

    if (recentScroll || prevState.hover.item !== this.state.hover.item) {
      // Deal with hover if that is where the state change is
    }
  }

  componentDidUnMount() {
    window.removeEventListener('optimizedResize', this.onResize);
  }

  cancelScroll = () => {
    // remove the timer that does the animation - updating each frame
    const scrollState = this.state.scrollState;
    if (scrollState && scrollState.timer) {
      window.clearInterval(scrollState.timer);
      delete scrollState.timer;
      this.setState({
        scrollState
      });
    }
  };

  /**
   * Separate the provided props.children into scrollChildren arrays.
   *   With the scrollChildren, add mouseEnter and mouseLeave event handlers to
   *     enable its corresponding infoChild to appear/disappear.
   * @param {Array} children React
   */
  collectChildrenTypes = () => {
    const scrollChildren = [];

    React.Children.forEach(this.props.children, (child, c) => {
      scrollChildren.push(
        React.cloneElement(child, {
          onMouseEnter: this.handleMouseEnter(scrollChildren.length),
          onMouseLeave: this.handleMouseLeave(scrollChildren.length)
        })
      );
    });
    return {scrollChildren};
  };

  doScroll = delta => {
    const viewStrip = this.viewStrip;
    if (!viewStrip) {
      return;
    }

    const capsuleWidth = this.props.childWidth;
    const viewWidth = viewStrip.offsetWidth;
    const slots = Math.floor(viewWidth / capsuleWidth);
    const startLeft = viewStrip.scrollLeft;
    let pos = startLeft / capsuleWidth;
    pos = delta < 0 ? Math.ceil(pos) : Math.floor(pos);
    pos += delta * slots;
    const endLeft = Math.max(
      0,
      Math.min(this.scrollStrip.offsetWidth - viewWidth, pos * capsuleWidth)
    );

    // terminate running scroll animation and determine new info for animate
    this.cancelScroll();
    if (endLeft === startLeft) {
      // nothing to scroll
      return;
    }

    // Setup state object to animate scroll if scrollStrip > viewStrip width
    this.setState({
      scrollState: {
        duration:
          ANIMATION_DURATION * Math.sqrt(Math.abs(endLeft - startLeft) / viewStrip.offsetWidth),
        startTime: Number(new Date()),
        startLeft,
        endLeft,
        timer: window.setInterval(this.updateScrollState, 40)
      },
      viewStripDiv: {scrollLeft: startLeft}
    });
  };

  handleMouseDown = delta => {
    // Use "mousedown" instead of "click" to prevent "dblclick"
    // bubbling up and selecting text.
    return e => {
      e.preventDefault();
      e.stopPropagation();
      this.doScroll(delta);
    };
  };

  handleMouseEnter = item => e => {
    this.showInfoPopup(item);
  };

  handleMouseLeave = item => e => {
    this.hideInfoPopup(item);
  };

  hideInfoPopup = scrollChildIndex => {
    this.setState({
      hover: {
        item: -1
      }
    });
  };

  showInfoPopup = scrollChildIndex => {
    this.setState({
      hover: {
        item: scrollChildIndex
      }
    });
  };

  updateButtonsVisibility = () => {
    const viewStrip = this.viewStrip;
    if (!viewStrip) {
      return INIT_BUTTONS;
    }
    const viewWidth = viewStrip.offsetWidth;
    const viewHeight = viewStrip.offsetHeight;
    const scrollStripWidth = this.scrollStrip.offsetWidth;
    const left = viewStrip.scrollLeft;
    return {
      viewHeight,
      leftButton: viewWidth >= scrollStripWidth || left === 0 ? 'none' : 'block',
      rightButton:
        viewWidth >= scrollStripWidth || left === scrollStripWidth - viewWidth ? 'none' : 'block'
    };
  };

  updateScrollState = () => {
    const scrollState = this.state.scrollState;
    if (scrollState && scrollState.startTime) {
      const viewStripDiv = {};
      const elapsed = Number(new Date()) - scrollState.startTime;
      if (elapsed >= scrollState.duration) {
        this.cancelScroll();
        viewStripDiv.scrollLeft = scrollState.endLeft;
      } else {
        const a =
          (ANIMATION_FACTOR * (scrollState.endLeft - scrollState.startLeft)) /
          (scrollState.duration * scrollState.duration);
        let t = elapsed;
        if (t >= ANIMATION_REDUCE * scrollState.duration) {
          t = scrollState.duration - t;
        }
        const s = ANIMATION_REDUCE * a * t * t;
        viewStripDiv.scrollLeft =
          elapsed >= ANIMATION_REDUCE * scrollState.duration
            ? scrollState.endLeft - s
            : scrollState.startLeft + s;
      }

      this.setState({
        buttons: this.updateButtonsVisibility(),
        scrollState,
        viewStripDiv
      });
    }
  };

  onResize = e => {
    // cancel current scrolls that might exist
    this.cancelScroll();

    const viewStrip = this.viewStrip;
    if (!viewStrip) {
      return;
    }
    const viewWidth = viewStrip.offsetWidth;
    const left = Math.max(
      0,
      Math.min(this.scrollStrip.offsetWidth - viewWidth, viewStrip.scrollLeft)
    );

    this.setState({
      buttons: this.updateButtonsVisibility(),
      viewStripDiv: {scrollLeft: left}
    });
  };

  onScroll = e => {
    this.setState({
      buttons: this.updateButtonsVisibility()
    });
  };

  render() {
    const {className = ''} = this.props;

    return (
      <div className={`keyframes-tray ${className}`}>
        <div
          className={'keyframes-wrapper'}
          ref={scrollWrapper => {
            this.scrollWrapper = scrollWrapper;
          }}
        >
          <div
            className={'view-strip'}
            style={{height: this.props.childHeight}}
            onScroll={this.onScroll}
            ref={viewStrip => {
              this.viewStrip = viewStrip;
            }}
          >
            <div
              className={'scroll-strip'}
              ref={scrollStrip => {
                this.scrollStrip = scrollStrip;
              }}
            >
              {this.state.scrollChildren}
            </div>
          </div>
          <div className={'scroll-tab-container'} style={{height: this.props.childHeight}}>
            <div
              className={'scroll-end'}
              style={{display: this.state.buttons.leftButton}}
              onMouseDown={this.handleMouseDown(-1)}
            >
              <ArrowLeft className={'scrollButton'} width={ICON.width} height={ICON.height} />
            </div>
          </div>
          <div className={'scroll-tab-container'} style={{height: this.props.childHeight}}>
            <div
              className={'scroll-end'}
              style={{display: this.state.buttons.rightButton}}
              onMouseDown={this.handleMouseDown(1)}
            >
              <ArrowRight className={'scrollButton'} width={ICON.width} height={ICON.height} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
