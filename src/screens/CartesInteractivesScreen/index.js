import React, { Component } from "react";
import CartesInteractivesScreen from "./CartesInteractivesScreen.js";

import { StackNavigator } from "react-navigation";

export default (DrawNav = StackNavigator({
  cartesInteractives: { screen: CartesInteractivesScreen },
}));
