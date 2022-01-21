import React from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import { general } from '../../styles';

export function Home(props) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[general().flex, general().padding, general(props.theme).backgroundColor]}>
            {
                props.visibility &&
                <Alert props={props} text={props.title} type={props.type}/>
            }

            </View>
        </TouchableWithoutFeedback>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        visibility: state.modal.visibility,
        title: state.modal.title,
        type: state.modal.type,
        uid : state.user.uid,
    }
  }
  
const homeConnect = connect(mapStateToProps)(Home);

export default homeConnect;