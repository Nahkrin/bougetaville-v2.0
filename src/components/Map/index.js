import React, { Component } from 'react';
import { AppRegistry, StyleSheet,TouchableOpacity, View, Dimensions,Modal,TouchableHighlight, Text, ScrollView,Image, AsyncStorage } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Contenu from "../../components/Contenu/";
import ItemBackgroundColor from '../../components/ItemBackgroundColor/';
import ModalMap from '../../components/ModalMap/';
import Icon from 'react-native-vector-icons/FontAwesome';
import Call from 'react-native-phone-call';
import PropTypes from 'prop-types';
import Geolocation from 'react-native-geolocation-service';
import Loading from '../../components/Loading/';



let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 48.9574;
const LONGITUDE = 2.3303;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: props.screenProps.state.general.meteo.lat,
        longitude: props.screenProps.state.general.meteo.long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
        visibility:false,
        title:'',
        html:'',
        image:'',
        adresse:'',
        city:'',
        cp:'',
        tel:'',
        markers:[],
        geoloc:false,
        isLoading:false,
    };
  }

    static propTypes ={
		markers: PropTypes.array,
	}

    static defaultProps = {
		markers: [],
		height: height
	}

/*** Fonction de géolocalisation qui recupere les lat/long du gps et qui les transmets au state , a desactiver si pas de géolocalisation , dans le cas ou on veuille que la map arrive directement sur la ville ***/

	 async componentDidMount() {

    /* SI GEOLOCALISATION  REGION = GEOLOC + MARKERS */


    var testGeo = await AsyncStorage.getItem('geolocation');
    console.log('PREFERENCE Geolocation :: ',testGeo);

    if(testGeo === 'true' || testGeo === null){
      console.log('PREFERENCE Geolocation :: ',testGeo);

    Geolocation.getCurrentPosition(
          (position) => {
            var geoloc = position.coords;
            this._setInitMap(geoloc);
          },
          (error) => {
              this._setInitMap();
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );



     }else if(testGeo === 'false'){
       console.log('PREFERENCE Geolocation :: ',testGeo);

     Geolocation.getCurrentPosition(
           (position) => {
             var geoloc = position.coords;
             this._setInitMap();
           },
           (error) => {
               this._setInitMap();
               console.log(error.code, error.message);
           },
           { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
       );
    }

    }

    _setInitMap = (geoloc = null) => {
      var tempTab = this.rMarker(this.props.markers);
      console.log(geoloc,tempTab);

      if(geoloc){
        this.setState({
          geoloc: true,
          loading:false
        });
        tempTab.push({
          latitude: parseFloat(geoloc.latitude),
          longitude: parseFloat(geoloc.longitude)
        });
      }else {
        this.setState({
          geoloc: false,
          loading:false
        });
      }

      this.fitSmoothOnTab(tempTab,100);
    }


    /*** Centre sur la position ***/
            fitPosition() {
              tabTemp = [];
              Geolocation.getCurrentPosition(
                  (position) => {
                    tabTemp.push({
                      latitude: parseFloat(position.coords.latitude),
                      longitude: parseFloat(position.coords.longitude)
                      });
                      console.log('fitPosition');
                    this.fitSmoothOnTab(tabTemp,1000000);

                  },
                  (error) => {
                      console.log(error.code, error.message);
                  },
                  { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
              );

               // navigator.geolocation.getCurrentPosition(
               //    position => {
               //      this.setState({
               //        region: {
               //          latitude: position.coords.latitude,
               //          longitude: position.coords.longitude,
               //          latitudeDelta: LATITUDE_DELTA,
               //          longitudeDelta: LONGITUDE_DELTA,
               //        }
               //      });
               //    },
               //      (error) => console.log(error),
               //    );
            }

//    componentWillUnmount() {
//       navigator.geolocation.clearWatch(this.watchID);
//    }

/*** Ouvre la modal , transmet les données du marquer dans le state qui est transmis dans les props de la modal ***/
    _Press = (marker) => {
        this.setState({visibility:true,title:marker.title,html:marker.html,image:marker.image,adresse:marker.adresse,city:marker.city,cp:marker.cp,tel:marker.tel}, () => {this.setState({visibility: true})});
    }

/*** Permet de fermer la modal sans bug ***/
    _CloseModal = () => {this.setState({visibility:false})}

/*** dezoom sur la carte bouton - ***/

      increment = () => {
            region = this.state.region;
            region.latitudeDelta = region.latitudeDelta * 2;
            region.longitudeDelta = region.longitudeDelta * 2;
            this.map.animateToRegion(region,50);
      }

/*** zoom sur la carte bouton + ***/

        decrement = () => {
          region = this.state.region;
          region.latitudeDelta = region.latitudeDelta / 2;
          region.longitudeDelta = region.longitudeDelta /2;
          this.map.animateToRegion(region,50);
        }

/*** retourne un tableau d'objet contenant les lat/long pour chaque point ***/
        rMarker = (obj) => {
            tab = [];
            obj.forEach((point) =>{
                          tab.push({
                            latitude: parseFloat(point.latitude),
                            longitude: parseFloat(point.longitude)
                    });
            })
            return tab;
         }


/*** Centre sur les marquers ***/
        fitAllMarkers() {
          console.log('fitAllMarkers');
           const MARKERS = this.rMarker(this.props.markers);
            this.fitSmoothOnTab(MARKERS,100);
        }



        fitSmoothOnTab(tab,padding) {
          console.log(tab);
          const DEFAULT_PADDING = { top: padding, right: padding, bottom: padding, left: padding };

          if(this.map){
            this.map.fitToCoordinates(tab, {
              edgePadding: DEFAULT_PADDING,
              animated: true,
              });
          }


        }

        // /*** Centre sur la position ***/
        //         fitPosition() {
        //             tabTemp = [];
        //            navigator.geolocation.getCurrentPosition(
        //               position => {
        //                 console.log(this.state.region)
        //                 tabTemp.push({
        //                   latitude: parseFloat(position.coords.latitude),
        //                   longitude: parseFloat(position.coords.longitude)
        //                   });
        //                 this.fitSmoothOnTab(tabTemp);
        //               },
        //                 (error) => console.log(error.message),
        //             );
        //         }





  measureView(event) {
  console.log(event.nativeEvent.layout)
}

  render() {
     // console.log(height);
     // console.log(this.state);
     // console.log(this.props);
     // let testvar = this.fitPosition();
     // console.log(this.fitPosition());
     // console.log(testvar);

     if (this.state.isLoading) {
         return (
               <Loading />
         );
     }

    return (
    <View style={[styles.container, {height: this.props.height-56}]}>
      <MapView
       ref={ref => { this.map = ref; }}
        // provider={ PROVIDER_GOOGLE }
        style={ styles.map }
		    showsUserLocation={(this.state.geoloc ? true : false)}
        showsCompass={true}
        // region={ this.state.region }
        onRegionChangeComplete={ region => this.setState({region}) }
        // onMapReady={(this.state.geoloc ? true : console.log('map ready so go'))}
      >
       	    { this.props.markers.map(
              marker=>(
      				<MapView.Marker
                  key={marker.id}
      				    coordinate = {{ latitude: parseFloat(marker.latitude),
                                  longitude: parseFloat(marker.longitude) }}
                  title = {marker.title}
      				    onPress = {()=> this._Press(marker)}/>)
              )
            }
      </MapView>


      <View style={[styles.buttonContainer, {bottom: 10}]}>

      {this.state.region.longitudeDelta < 0.0004 && this.state.region.latitudeDelta < 0.0004 ? (
        <TouchableOpacity
               disabled={true}
                onPress={() => this.decrement()}
                style={[styles.bubbledesactive, styles.button]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold',color:'#000000' }}>+</Text>
        </TouchableOpacity>


      ) : (
        <TouchableOpacity
                  onPress={() => this.decrement()}
                  style={[styles.bubble, styles.button]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold',color:'#000000' }}>+</Text>
        </TouchableOpacity>

      )}

      {this.state.region.longitudeDelta > 8 && this.state.region.latitudeDelta > 12 ? (
        <TouchableOpacity disabled={true}
                          onPress={() => this.increment()}
                          style={[styles.bubbledesactive, styles.button]}>
            <Text style={{ fontSize: 20, fontWeight: 'bold',color:'#000000' }}>-</Text>
        </TouchableOpacity>


      ) : (
        <TouchableOpacity onPress={() => this.increment()}
                          style={[styles.bubble, styles.button]}>
              <Text style={{ fontSize: 20, fontWeight: 'bold',color:'#000000' }}>-</Text>
        </TouchableOpacity>
      )}


          <TouchableOpacity
            onPress={() => this.fitAllMarkers()}
            style={[styles.bubble, styles.button]}
          >
            <Image style={{width:30,height:30}} source={require("../../assets/fit.png")} />
          </TouchableOpacity>



          {this.state.geoloc ? (
            <TouchableOpacity
              onPress={() => this.fitPosition()}
              style={[styles.bubble, styles.button]}
            >
              <Icon style={{fontSize:30,color:'#000000'}} name='map-marker' />
            </TouchableOpacity>
          ) : (
            <Text></Text>
          )}



        </View>





             <ModalMap visibility={this.state.visibility} title={this.state.title} image={this.state.image}  html={this.state.html} adresse={this.state.adresse} city={this.state.city} cp={this.state.cp} tel={this.state.tel} close={()=>this._CloseModal()} headerBGColor={this.props.screenProps.state.typeProps.couleur}/>


    </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
      ...StyleSheet.absoluteFillObject,
  },
    container: {
//    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
        width: width,
        height: '100%',
  },
  bubble: {    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
    bubbledesactive: {    backgroundColor: 'rgba(116, 116, 116, 0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 60,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
	buttonContainer: {
		flexDirection: 'row',
		backgroundColor: 'transparent',
		alignSelf: 'center',
		margin:0,
    marginBottom: 20,
		padding: 0,
	},
});
