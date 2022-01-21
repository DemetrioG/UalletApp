import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';

import { general, metrics } from '../../styles/index';
import styles from './styles';
import { editTheme } from '../../components/Actions/themeAction';

const slides = [
    {
        key: 1,
        title: 'Suas finanças',
        image: require('../../../assets/images/iphoneHome.png')
    },
    {
        key: 2,
        title: 'Seus investimentos',
        image: require('../../../assets/images/iphoneInvest.png')
    },
    {
        key: 3,
        title: 'Integrações bancárias',
        image: require('../../../assets/images/iphoneIntegracoes.png')
    },
    {
        key: 4,
        title: 'Tudo em um só lugar',
        image: require('../../../assets/images/iphoneUallet.png')
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
            <TouchableOpacity style={general(null, metrics.smallMargin).button} onPress={() => navigation.navigate('Register')}>
                <Text style={general().buttonText}>CRIAR CONTA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[general(props.theme, metrics.smallMargin).buttonOutline, styles().buttonLogin]} onPress={() => navigation.navigate('Login')}>
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
  
const indexConnect = connect(mapStateToProps, { editTheme })(Index);

export default indexConnect;