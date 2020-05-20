import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from "../../components/Header/";
import Cameras from "../../components/Camera/";

export default class CameraScreen extends Component {

    constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
      const { navigate } = this.props.navigation;

      return (
          <View style={styles.container}>
            <Cameras navigation={this.props}/>
          </View>

      );
  }
}


  const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	titre: {
		fontSize: 24,
	}
});

CameraScreen.navigationOptions = ({ navigation, screenProps }) => ({
  header: (

    <Header id={screenProps.state.typeProps.id} title={screenProps.state.typeProps.titre} bgColor={screenProps.state.typeProps.couleur} txColor={screenProps.state.typeProps.titrecouleur} navigation={navigation} type={screenProps.state.typeProps.type} page='camera' put={screenProps.put} home={(screenProps.state.datas!=undefined)?screenProps.state.datas.back: false}/>
  )
});
