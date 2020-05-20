import React, { Component } from "react";
import CameraScreen from "./CameraScreen.js";

import { StackNavigator } from "react-navigation";

export default (DrawNav = StackNavigator({
    camera: { screen: CameraScreen },
}));
