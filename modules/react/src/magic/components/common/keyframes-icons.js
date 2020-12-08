import React from 'react';

/**
 * Prevent svg from reporting pointer-events, which is problematic
 * for hierarchical event click containment checks
 * since svg elements do not have a parentElement/parentNode
 * To handle clicks, wrap in a div
 */
const svgStyle = {pointerEvents: 'none'};

export const ArrowLeft = ({width = 16, height = 26, ...props}) => (
  <svg {...{...props, width, height, ...svgStyle}} viewBox="0 0 16 26">
    <polyline
      fill="none"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      points="13,3 3,13 13,23"
    />
  </svg>
);

export const ArrowRight = ({width = 16, height = 26, ...props}) => (
  <svg {...{...props, width, height, ...svgStyle}} viewBox="0 0 16 26">
    <polyline
      fill="none"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      points="3,23 13,13 3,3"
    />
  </svg>
);

// From Chun Jiang - viz hackathon 2
export const AddClipPlus = ({width = 24, height = 24, style = {}, ...props}) => {
  /* eslint-disable max-len */
  return (
    <svg
      className={'add-clip-plus-icon'}
      {...{...props, width, height, ...svgStyle}}
      fill="none"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 24 24"
    >
      <path
        fill="black"
        d="M1 12C1 5.9 5.9 1 12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12ZM4 12C4 16.4 7.6 20 12 20C16.4 20 20 16.4 20 12C20 7.6 16.4 4 12 4C7.6 4 4 7.6 4 12ZM13.5 6V10.5H18V13.5H13.5V18H10.5V13.5H6V10.5H10.5V6H13.5Z"
      />
      <path
        fill="#CBCBCB"
        d="M12 1C5.9 1 1 5.9 1 12C1 18.1 5.9 23 12 23C18.1 23 23 18.1 23 12C23 5.9 18.1 1 12 1ZM18 13.5H13.5V18H10.5V13.5H6V10.5H10.5V6H13.5V10.5H18V13.5Z"
      />
    </svg>
  );
  /* eslint-enable max-len */
};

export const ButtonExport = ({width = 93, height = 28, style = {}, ...props}) => {
  /* eslint-disable max-len */
  return (
    <svg fill="none" {...{...props, width, height, ...svgStyle}} viewBox="0 0 93 28">
      <path
        d="M0 1C0 0.447715 0.447715 0 1 0H92C92.5523 0 93 0.447715 93 1V27C93 27.5523 92.5523 28 92 28H0.999999C0.447714 28 0 27.5523 0 27V1Z"
        fill="#276EF1"
      />
      <path
        d="M29.4165 9.6H34.9485V10.752H30.7365V13.224H34.8285V14.364H30.7365V16.848H34.9485V18H29.4165V9.6ZM37.9195 14.772L35.6515 11.652H37.0915L38.6155 13.812L40.1395 11.652H41.5555L39.2875 14.748L41.6515 18H40.1995L38.5795 15.708L36.9715 18H35.5675L37.9195 14.772ZM43.8352 11.652V12.6C44.0432 12.256 44.3112 11.988 44.6392 11.796C44.9672 11.604 45.3472 11.508 45.7792 11.508C46.1472 11.508 46.4872 11.576 46.7992 11.712C47.1192 11.848 47.3952 12.044 47.6272 12.3C47.8592 12.548 48.0392 12.852 48.1672 13.212C48.2952 13.564 48.3592 13.956 48.3592 14.388V15.264C48.3592 15.696 48.2952 16.092 48.1672 16.452C48.0392 16.804 47.8592 17.104 47.6272 17.352C47.3952 17.6 47.1192 17.792 46.7992 17.928C46.4872 18.064 46.1472 18.132 45.7792 18.132C45.3632 18.132 44.9872 18.044 44.6512 17.868C44.3232 17.684 44.0512 17.424 43.8352 17.088V20.616H42.5632V11.652H43.8352ZM43.8352 15.168C43.8352 15.728 43.9792 16.176 44.2672 16.512C44.5552 16.848 44.9552 17.016 45.4672 17.016C45.9792 17.016 46.3792 16.848 46.6672 16.512C46.9552 16.176 47.0992 15.728 47.0992 15.168V14.484C47.0992 13.916 46.9552 13.464 46.6672 13.128C46.3792 12.792 45.9792 12.624 45.4672 12.624C44.9552 12.624 44.5552 12.792 44.2672 13.128C43.9792 13.464 43.8352 13.916 43.8352 14.484V15.168ZM55.3578 15.216C55.3578 15.664 55.2858 16.068 55.1418 16.428C55.0058 16.78 54.8098 17.084 54.5538 17.34C54.3058 17.596 54.0058 17.792 53.6538 17.928C53.3018 18.064 52.9178 18.132 52.5018 18.132C52.0938 18.132 51.7138 18.064 51.3618 17.928C51.0178 17.792 50.7178 17.596 50.4618 17.34C50.2138 17.084 50.0178 16.78 49.8738 16.428C49.7298 16.068 49.6578 15.664 49.6578 15.216V14.424C49.6578 13.984 49.7258 13.584 49.8618 13.224C50.0058 12.864 50.2018 12.56 50.4498 12.312C50.7058 12.056 51.0058 11.86 51.3498 11.724C51.7018 11.58 52.0858 11.508 52.5018 11.508C52.9178 11.508 53.3018 11.576 53.6538 11.712C54.0058 11.848 54.3058 12.044 54.5538 12.3C54.8098 12.556 55.0058 12.864 55.1418 13.224C55.2858 13.584 55.3578 13.984 55.3578 14.424V15.216ZM54.0978 14.484C54.0978 13.916 53.9578 13.464 53.6778 13.128C53.3978 12.792 53.0058 12.624 52.5018 12.624C52.0058 12.624 51.6178 12.792 51.3378 13.128C51.0578 13.464 50.9178 13.916 50.9178 14.484V15.168C50.9178 15.736 51.0578 16.188 51.3378 16.524C51.6178 16.852 52.0058 17.016 52.5018 17.016C53.0058 17.016 53.3978 16.852 53.6778 16.524C53.9578 16.188 54.0978 15.736 54.0978 15.168V14.484ZM59.7379 12.84C59.5299 12.84 59.3339 12.88 59.1499 12.96C58.9739 13.032 58.8139 13.14 58.6699 13.284C58.5339 13.428 58.4259 13.604 58.3459 13.812C58.2659 14.012 58.2259 14.236 58.2259 14.484V18H56.9539V11.652H58.2259V12.888C58.3619 12.504 58.5699 12.192 58.8499 11.952C59.1299 11.712 59.4739 11.592 59.8819 11.592H60.3979V12.84H59.7379ZM63.8728 18C63.3688 18 62.9808 17.868 62.7088 17.604C62.4368 17.332 62.3008 16.984 62.3008 16.56V12.756H61.0168V11.652H62.3008V9.78H63.5728V11.652H65.2648V12.756H63.5728V16.38C63.5728 16.548 63.6288 16.676 63.7408 16.764C63.8528 16.852 64.0048 16.896 64.1968 16.896H65.2648V18H63.8728Z"
        fill="white"
      />
    </svg>
  );
  /* eslint-enable max-len */
};

export const Clear = ({width = 14, height = 14, style = {}, ...props}) => {
  /* eslint-disable max-len */
  return (
    <svg fill="none" {...{...props, width, height, ...svgStyle}} viewBox="0 0 14 14">
      <path
        d="M10.4417 7.58333C10.4417 9.50833 8.86667 11.0833 6.94167 11.0833C5.01667 11.0833 3.44167 9.50833 3.44167 7.58333C3.44167 5.65833 5.01667 4.08333 6.94167 4.08333C7.175 4.08333 7.46667 4.14167 7.7 4.2L5.65834 7H7.81667L10.3833 3.5L7.81667 0H5.65834L7.40834 2.33333C7.29167 2.33333 7.11667 2.33333 7 2.33333C4.08334 2.33333 1.75 4.66667 1.75 7.58333C1.75 10.5 4.08334 12.8333 7 12.8333C9.91667 12.8333 12.25 10.5 12.25 7.58333H10.4417Z"
        fill="#CCCCCC"
      />
    </svg>
  );
  /* eslint-enable max-len */
};

export const GrabBarLeftClicked = ({width = 20, height = 32, ...props}) => (
  <svg
    fill="none"
    className={'grab-bar-left-clicked-icon'}
    {...{...props, width, height, ...svgStyle}}
    viewBox="0 0 20 32"
  >
    <defs>
      <filter
        id="filterLC_d"
        x="0"
        y="0"
        width="20"
        height="32"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
    <g filter="url(#filterLC_d)">
      <path d="M4 5C4 3.89543 4.89543 3 6 3H16V27H6C4.89543 27 4 26.1046 4 25V5Z" fill="#276EF1" />
      <path
        d="M4 5C4 3.89543 4.89543 3 6 3H16V27H6C4.89543 27 4 26.1046 4 25V5Z"
        fill="white"
        fillOpacity="0.92"
      />
    </g>
    <rect x="9" y="11" width="2" height="8" rx="1" fill="#276EF1" />
  </svg>
);

export const GrabBarLeft = ({width = 20, height = 32, ...props}) => (
  <svg
    className={'grab-bar-left-icon'}
    {...{...props, width, height, ...svgStyle}}
    fill="none"
    viewBox="0 0 20 32"
  >
    <defs>
      <filter
        id="filterL_d"
        x="0"
        y="0"
        width="20"
        height="32"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
    <g filter="url(#filterL_d)">
      <path d="M4 5C4 3.89543 4.89543 3 6 3H16V27H6C4.89543 27 4 26.1046 4 25V5Z" fill="#276EF1" />
    </g>
    <rect x="9" y="11" width="2" height="8" rx="1" fill="white" />
  </svg>
);

export const GrabBarRightClicked = ({width = 20, height = 32, ...props}) => (
  <svg
    className={'grab-bar-right-icon'}
    {...{...props, width, height, ...svgStyle}}
    fill="none"
    viewBox="0 0 20 32"
  >
    <defs>
      <filter
        id="filterRC_d"
        x="0"
        y="0"
        width="20"
        height="32"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
    <g filter="url(#filterRC_d)">
      <path
        d="M16 25C16 26.1046 15.1046 27 14 27L4 27L4 3L14 3C15.1046 3 16 3.89543 16 5L16 25Z"
        fill="#276EF1"
      />
      <path
        d="M16 25C16 26.1046 15.1046 27 14 27L4 27L4 3L14 3C15.1046 3 16 3.89543 16 5L16 25Z"
        fill="white"
        fillOpacity="0.92"
      />
    </g>
    <rect x="11" y="19" width="2" height="8" rx="1" transform="rotate(-180 11 19)" fill="#276EF1" />
  </svg>
);

export const GrabBarRight = ({width = 20, height = 32, ...props}) => (
  <svg
    className={'grab-bar-right-icon'}
    fill="none"
    {...{...props, width, height, ...svgStyle}}
    viewBox="0 0 20 32"
  >
    <defs>
      <filter
        id="filterR_d"
        x="0"
        y="0"
        width="20"
        height="32"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
    <g filter="url(#filterR_d)">
      <path
        d="M16 25C16 26.1046 15.1046 27 14 27L4 27L4 3L14 3C15.1046 3 16 3.89543 16 5L16 25Z"
        fill="#1B6DE0"
      />
    </g>
    <rect x="11" y="19" width="2" height="8" rx="1" transform="rotate(-180 11 19)" fill="white" />
  </svg>
);

export const Play = ({width = 14, height = 14, ...props}) => (
  <svg
    className={'play-nudge-icon'}
    fill="none"
    {...{...props, width, height, ...svgStyle}}
    viewBox="0 0 14 14"
  >
    <path d="M2.91602 0.992188L13.2993 7.00051L2.91602 13.0088V0.992188Z" fill="white" />
  </svg>
);
export const PlayNudge = ({width = 2, height = 140, ...props}) => (
  <svg
    className={'play-nudge-icon'}
    fill="none"
    {...{...props, width, height, ...svgStyle}}
    viewBox="0 0 2 140"
  >
    <rect y="140" width="140" height="2" transform="rotate(-90 0 140)" fill="#1FBAD6" />
  </svg>
);

export const VideoClips = ({width = 20, height = 20, ...props}) => (
  /* eslint-disable max-len */
  <svg
    className={'video-clips-icon'}
    fill="none"
    {...{...props, width, height, ...svgStyle}}
    viewBox="0 0 20 20"
  >
    <path
      fill="#CCCCCC"
      d="M8.41143 8.62516V12.9452L11.8057 10.7852L8.41143 8.62516ZM2.91429 16.7852H17.0857C17.7029 16.7852 18 16.5015 18 15.9124V5.65788C18 5.06879 17.7029 4.78516 17.0857 4.78516H2.91429C2.29714 4.78516 2 5.06879 2 5.65788V15.9124C2 16.5015 2.29714 16.7852 2.91429 16.7852ZM3.14286 15.6942V14.6033H4.28571V15.6942H3.14286ZM3.14286 13.5124V12.4215H4.28571V13.5124H3.14286ZM3.14286 11.3306V10.2397H4.28571V11.3306H3.14286ZM3.14286 9.14879V8.05788H4.28571V9.14879H3.14286ZM3.14286 6.96697V5.87607H4.28571V6.96697H3.14286ZM5.42857 15.6942V5.87607H14.5714V15.6942H5.42857ZM15.7143 15.6942V14.6033H16.8571V15.6942H15.7143ZM15.7143 13.5124V12.4215H16.8571V13.5124H15.7143ZM15.7143 11.3306V10.2397H16.8571V11.3306H15.7143ZM15.7143 9.14879V8.05788H16.8571V9.14879H15.7143ZM15.7143 6.96697V5.87607H16.8571V6.96697H15.7143Z"
    />
  </svg>
  /* eslint-enable max-len */
);
