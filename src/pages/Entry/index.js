import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import { general } from '../../styles';
import { Alert } from '../../components/Alert';
import Header from '../../components/Header';

export function Entry(props) {
    return (
        <View style={[general().flex, general().padding, general(props.theme).backgroundColor]}>
        {
            props.visibility &&
            <Alert props={props} text={props.title} type={props.type}/>
        }
            <Header/>
        </View>
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
  
const entryConnect = connect(mapStateToProps)(Entry);

export default entryConnect;