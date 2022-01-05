import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, general, metrics } from '../../styles/index';
import styles from './styles';
import Carousel from 'react-native-snap-carousel';

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

export default function Index() {

    function renderSlide({item, index} : any) {
        return (
            <View style={general.flex}>
                <Image
                    source={item.image}
                    style={styles.imageCarousel}
                />
                <Text style={styles.titleCarousel}>{item.title}</Text>
            </View>
        )
    }

    return (
        <View style={[general.containerCenter, general.backgroundColor]}>
            <Carousel
                data={slides}
                renderItem={renderSlide}
                sliderWidth={metrics.screenWidth}
                itemWidth={metrics.screenWidth}
                loop={true}
                autoplay={true}
                enableMomentum={false}
                lockScrollWhileSnapping={true}
            />
            <TouchableOpacity style={general.button}>
                <Text style={general.buttonText}>CRIAR CONTA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={general.buttonOutline}>
                <Text style={general.buttonOutlineText}>ENTRAR</Text>
            </TouchableOpacity>
        </View>
    );
}