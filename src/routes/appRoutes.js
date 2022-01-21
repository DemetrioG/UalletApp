import React, { useRef } from 'react';
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SafeAreaView from 'react-native-safe-area-view';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';

import Home from '../pages/Home';
import { general, colors, metrics } from '../styles';
import { color } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

export function AppRoutes(props) {

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
                            borderTopLeftRadius: metrics.baseRadius,
                            borderTopRightRadius: metrics.baseRadius,
                        },
                    }}
                >
                    <Tab.Screen 
                        name="Investimentos" 
                        component={Home}
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
                        name="Lançamentos" 
                        component={Home}
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
                        name="Home" 
                        component={Home}
                        options={{
                            tabBarIcon: () => (
                                <TouchableOpacity>
                                    <View style={{
                                        width: 50,
                                        height: 50,
                                        backgroundColor: colors.strongBlue,
                                        borderRadius: 50,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 60
                                    }}>
                                        <Feather name="home" color={colors.white} size={metrics.iconSize}/>

                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <Tab.Screen 
                        name="Integrações" 
                        component={Home}
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
                        name="Relatórios" 
                        component={Home}
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
                <Animated.View style={{
                    width: getWidth() - 30,
                    height: 3,
                    backgroundColor: colors.strongBlue,
                    position: 'absolute',
                    bottom: 60,
                    left: metrics.basePadding + 15,
                    borderRadius: 50,
                    transform: [
                        { translateX: tabOffsetValue }
                    ]
                }}>

                </Animated.View>
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