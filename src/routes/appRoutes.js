import React, { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions, View, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SafeAreaView from 'react-native-safe-area-view';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';

import StackHome from '../pages/StackHome';
import StackEntry from '../pages/StackEntry';
import { general, colors, metrics } from '../styles';

const Tab = createBottomTabNavigator();

export function AppRoutes(props) {
    
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const opacity = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {

        Animated.timing(opacity, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true
        }).start();

        // Verificação de teclado ativo para renderizar com transição o componente que fica acima do ícone na Tab
        Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);

            Animated.timing(opacity, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true
            }).start();
        });

        Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);

            Animated.timing(opacity, {
                toValue: 1,
                duration: 1800,
                useNativeDriver: true
            }).start();
        });

    });
    
    const tabOffsetValue = useRef(new Animated.Value(0)).current;

    function getWidth() {
        let width = Dimensions.get("window").width;

        // Padding Horizontal = 15...
        width = width - 30;

        // Total de Tabs
        return width / 5
    }

    return (
        <NavigationContainer>
            <SafeAreaView style={general().flex}>
                <Tab.Navigator
                    screenOptions={{
                        headerShown: false,
                        tabBarHideOnKeyboard: true,
                        tabBarShowLabel: false,
                        tabBarStyle: {
                            height: 60,
                            backgroundColor: props.theme == 'light' ? colors.lightSecondary : colors.darkSecondary,
                            position: 'absolute',
                            marginHorizontal: metrics.basePadding,
                            borderTopWidth: 0,
                            borderTopLeftRadius: metrics.baseRadius,
                            borderTopRightRadius: metrics.baseRadius,
                        },
                    }}
                >
                    <Tab.Screen 
                        name="InvestimentosTab" 
                        component={StackHome}
                        options={{
                            tabBarIcon: ({ focused }) => {
                                return <Feather name="pie-chart" color={props.theme == 'light' ? colors.darkPrimary : colors.white} size={metrics.iconSize}/>
                            }
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                Animated.spring(tabOffsetValue,{
                                    toValue: 0,
                                    useNativeDriver: true
                                }).start();
                            }
                        })}
                    />
                    <Tab.Screen 
                        name="LançamentosTab" 
                        component={StackEntry}
                        options={{
                            tabBarIcon: () => {
                                return <Feather name="edit-3" color={props.theme == 'light' ? colors.darkPrimary : colors.white} size={metrics.iconSize}/>
                            }
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                Animated.spring(tabOffsetValue,{
                                    toValue: getWidth(),
                                    useNativeDriver: true
                                }).start();
                            }
                        })}
                    />
                    <Tab.Screen 
                        name="HomeTab" 
                        component={StackHome}
                        options={{
                            tabBarIcon: () => (
                                <View style={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: colors.strongBlue,
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 37
                                }}>
                                    <Feather name="home" color={colors.white} size={metrics.iconSize}/>
                                </View>
                            )
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                Animated.spring(tabOffsetValue,{
                                    toValue: getWidth() * 2,
                                    useNativeDriver: true
                                }).start();
                            }
                        })}
                    />
                    <Tab.Screen
                        name="IntegraçõesTab" 
                        component={StackHome}
                        options={{
                            tabBarIcon: () => {
                                return <Feather name="refresh-cw" color={props.theme == 'light' ? colors.darkPrimary : colors.white} size={metrics.iconSize}/>
                            },
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                Animated.spring(tabOffsetValue,{
                                    toValue: getWidth() * 3,
                                    useNativeDriver: true
                                }).start();
                            }
                        })}
                    />
                    <Tab.Screen 
                        name="RelatóriosTab" 
                        component={StackHome}
                        options={{
                            tabBarIcon: () => {
                                return <Feather name="list" color={props.theme == 'light' ? colors.darkPrimary : colors.white} size={metrics.iconSize}/>
                            }
                        }}
                        listeners={({ navigation, route }) => ({
                            tabPress: e => {
                                Animated.spring(tabOffsetValue,{
                                    toValue: getWidth() * 4,
                                    useNativeDriver: true
                                }).start();
                            }
                        })}
                    />
                </Tab.Navigator>
                {
                    !keyboardVisible &&
                    <Animated.View style={{
                        width: getWidth() - 30,
                        height: 3,
                        backgroundColor: colors.strongBlue,
                        position: 'absolute',
                        bottom: 60,
                        left: metrics.basePadding + 15,
                        borderRadius: 50,
                        opacity,
                        transform: [
                            { translateX: tabOffsetValue }
                        ]
                    }}/>
                }
            </SafeAreaView>
        </NavigationContainer>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
    }
  }
  
const appRoutesConnect = connect(mapStateToProps)(AppRoutes);

export default appRoutesConnect;