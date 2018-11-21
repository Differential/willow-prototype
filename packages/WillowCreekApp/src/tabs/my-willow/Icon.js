import React from 'react';
import Svg, { Path, Polyline } from 'react-native-svg';
import PropTypes from 'prop-types';

const WillowIcon = ({ tintColor }) => (
  <Svg width={26} height={26} viewBox="0 0 171 170">
    <Path
      d="M170.388,84.99 C170.388,131.86 132.389,169.86 85.514,169.86 C38.639,169.86 0.64,131.86 0.64,84.99 C0.64,38.11 38.639,0.11 85.514,0.11 C132.389,0.11 170.388,38.11 170.388,84.99"
      fill={tintColor}
    />
    <Path
      d="M55.108,49.46 L35.605,49.46 C35.162,50.01 34.722,50.57 34.302,51.13 L54.217,131.89 C54.743,132.18 55.272,132.46 55.809,132.73 L75.917,132.73 L55.108,49.46"
      fill="#FFFFFE"
    />
    <Path
      d="M105.83,88.6 L96.178,49.46 L74.548,49.46 L94.946,132.73 L115.733,132.73 C116.025,132.58 116.311,132.43 116.6,132.27 L105.83,88.6"
      fill="#FFFFFE"
    />
    <Path
      d="M135.937,49.46 L115.48,49.46 L105.83,88.6 L116.6,132.27 C116.686,132.23 116.771,132.18 116.856,132.14 L136.727,50.47 C136.466,50.13 136.205,49.79 135.937,49.46"
      fill="#91918F"
    />
    <Polyline
      id="Fill-82"
      fill="#91918F"
      points="75.917 132.73 85.442 93.93 74.548 49.46 65.078 89.36 75.917 132.73"
    />
  </Svg>
);

WillowIcon.propTypes = {
  tintColor: PropTypes.string,
};

export default WillowIcon;