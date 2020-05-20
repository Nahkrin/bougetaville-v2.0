import React, {
	Component,
}
from 'react';
import {
	ActionSheetIOS,
	Platform,
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity
}
from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import {chargeImage} from '../../utils/image/';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);


export default class Cameras extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			path:null,
			localisation: {
				latitude: 48.9979523,
				longitude: 2.2343597
			}
		};
	}

	takePicture = async function(camera) {
		const options = { quality: 0.2,width:1024,forceUpOrientation: true,fixOrientation: true};
		const data = await camera.takePictureAsync(options) 
		.then((data) => {
			console.log(data);
			chargeImage(this.props.navigation, data.uri)
		})
		.catch(err => console.error(err));
		//  eslint-disable-next-line
	};






	render() {

		return (

			<RNCamera
				style={styles.preview}
				type={RNCamera.Constants.Type.back}
				flashMode={RNCamera.Constants.FlashMode.on}
				permissionDialogTitle={'Permission to use camera'}
				permissionDialogMessage={'We need your permission to use your camera phone'}
			>
			{({ camera, status, recordAudioPermissionStatus }) => {
					if (status !== 'READY') return <Text></Text>;
					return (
							<Icon style={styles.capture} onPress={() => this.takePicture(camera)}  name="camera"/>
					);
				}}

			</RNCamera>
		);
	}
}


const styles = StyleSheet.create({
container: {
	flex: 1,
	flexDirection: 'column',
	backgroundColor: 'black',
},
preview: {
	flex: 1,
	justifyContent: 'flex-end',
	alignItems: 'center',
},
capture: {
	flex: 0,
	backgroundColor: '#fff',
	borderRadius: 5,
	padding: 15,
	paddingHorizontal: 20,
	alignSelf: 'center',
	margin: 20,
},
});
