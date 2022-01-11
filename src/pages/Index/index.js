import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import { general, metrics } from '../../styles/index';
import styles from './styles';

const slides = [
    {
        key: 1,
        title: 'Titulo1',
        image: require('../../../assets/images/iphoneMockup.png')
    },
    {
        key: 2,
        title: 'Titulo2',
        image: require('../../../assets/images/iphoneMockup.png')
    },
    {
        key: 3,
        title: 'Titulo3',
        image: require('../../../assets/images/iphoneMockup.png')
    },
];

export function Index(props) {

    const navigation = useNavigation();

    function renderSlide({item, index}) {
        return (
            <View style={general().flex}>
                <Image
                    source={item.image}
                    style={styles().imageCarousel}
                />
                <Text style={styles(props.theme).titleCarousel}>{item.title}</Text>
            </View>
        )
    }

    return (
        <View style={[general().containerCenter, general().padding, general(props.theme).backgroundColor]}>
            <Carousel
                data={slides}
                renderItem={renderSlide}
                sliderWidth={metrics.screenWidth}
                itemWidth={metrics.screenWidth}
                loop={true}
                autoplay={true}
                enableMomentum={false}
                lockScrollWhileSnapping={true}
                slideStyle={styles().carousel}
            />
            <TouchableOpacity style={general().button} onPress={() => navigation.navigate('Register')}>
                <Text style={general().buttonText}>CRIAR CONTA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[general(props.theme).buttonOutline, styles().buttonLogin]}>
                <Text style={general(props.theme).buttonOutlineText}>ENTRAR</Text>
            </TouchableOpacity>
        </View>
    );
};

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
    }
  }
  
const indexConnect = connect(mapStateToProps)(Index);

export default indexConnect;