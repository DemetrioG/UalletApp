import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';

import { general } from '../../styles/index'
import styles from './styles';
import { editVisibilityAlert } from '../Actions/visibilityAlertAction';

export function Alert({props, text, type, redirect}) {

    const typeIcon = type == 'error' ? require('../../../assets/icons/error.json') : require('../../../assets/icons/check.json');
    const navigation = useNavigation();

    function handleAccept() {
        props.editVisibilityAlert(false);

        if (redirect) {
            navigation.navigate(redirect);
        }
        return;
    }

    return (
        <Modal visible={true} transparent={true}>
            <View style={[general().containerCenter, styles(props.theme).backgroundModal]}>
                <View style={styles(props.theme).modalView}>
                    <LottieView
                        source={typeIcon}
                        autoPlay={true}
                        loop={false}
                        style={styles().iconModal}
                    />
                    <Text style={styles(props.theme).textModal}>{text}</Text>
                    <TouchableOpacity style={general().button} onPress={handleAccept}>
                        <Text style={general().buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
    }
  }
  
const alertConnect = connect(mapStateToProps, { editVisibilityAlert })(Alert);

export default alertConnect;