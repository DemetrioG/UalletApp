import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { connect } from 'react-redux';

import Entry from '../Entry';
import NewEntry from '../NewEntry';
import { general } from '../../styles';
import { Alert } from '../../components/Alert';
import Header from '../../components/Header';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';

const Stack = createNativeStackNavigator();

export function StackEntry(props) {

    return (
        <View style={[general().flex, general().padding, general(props.theme).backgroundColor]}>
        {
            props.visibility &&
            <Alert props={props} text={props.title} type={props.type}/>
        }
            <Header/>
            <View style={general(props.theme).viewTab}>
                <Stack.Navigator>
                    <Stack.Screen name="Lançamentos" component={Entry} options={{headerShown: false}}/>
                    <Stack.Screen name="NovoLançamento" component={NewEntry} options={{headerShown: false}}/>
                </Stack.Navigator>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        visibility: state.modal.visibility,
        title: state.modal.title,
        type: state.modal.type,
    }
  }
  
const stackEntry = connect(mapStateToProps, { editVisibilityAlert })(StackEntry);

export default stackEntry;