import React, {Component} from 'react'
import {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    Text
} from 'react-native';

import Map from '../../components/Map/';
import Loading from '../../components/Loading/';
//import _loadInitialState from '../../utils/Fetcher';
import _loadInitialState from '../../utils/fetch/fetch';
import Header from '../../components/Header/';

export default class CartesInteractivesScreen extends Component {

    constructor(props) {
    super(props);
    this.state = {
        isLoading: true,
        dataSource: null,
        datas: null,
        json: 'null'
      }
  }

/*** Recupere les données du JSON ***/

  async componentWillMount() {
    let asKey = 'module' + this.props.screenProps.state.typeProps.id;
    let url = 'https://mymairie.fr/demo/mymairie/apis/';
    let $path= 'cartes1/' + this.props.screenProps.state.typeProps.id + '/' + this.props.screenProps.state.mairieId;
    let test = await _loadInitialState(url, $path, asKey, this.state, this.props.screenProps.state.mairieId)
    this.setState(test);
	console.log(this.state.datas)
  }


/*** Fonction qui affiche la map en lui transmettant un tableau de marquer dans lequel les props sont récupérer par le composant Map ***/
      _map = (obj) => {

        let returnValue = [];
        let markers = [];
            for (const [key, value] of Object.entries(obj[0].data.list))
            {
              if(this.state.datas[0].data.list[key].type != 'categorie' && this.state.datas[0].data.list[key].type != 'categories' )
                  {
					console.log(obj[0].data.list[key])
					markers.push({
                                        title:obj[0].data.list[key].title,
                                        html:obj[0].data.list[key].details,
                                        image:obj[0].data.list[key].file,
                                        adresse:obj[0].data.list[key].location.address,
                                         city:obj[0].data.list[key].location.city,
                                         cp:obj[0].data.list[key].location.postcode,
                                         latitude:obj[0].data.list[key].location.latitude,
                                         longitude:obj[0].data.list[key].location.longitude,
                                         id:obj[0].data.list[key].id,
                                    })
                  }
            }
          returnValue.push(<Map key={1} markers={markers} screenProps={this.props.screenProps}/>)

      return returnValue;
    }

    render()
    {
            if(this.state.isLoading)
            {
                return(<Loading />)
            }
                return(<View>{this._map(this.state.datas)}</View>);
    }
}

CartesInteractivesScreen.navigationOptions = ({ navigation, screenProps }) => ({
  header: (
    <Header id={screenProps.state.typeProps.id} title={screenProps.state.typeProps.titre} bgColor={screenProps.state.typeProps.couleur} txColor={screenProps.state.typeProps.titrecouleur} navigation={navigation} type={screenProps.state.typeProps.type} page='cartesInteractives' put={screenProps.put} home={(screenProps.state.datas!=undefined)?screenProps.state.datas.back: false}/>
  )
});
