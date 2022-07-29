import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Complete from "../screens/Complete";
import ConfiguracoesScreen from "../screens/Configurations";
import { DadosCadastraisScreen } from "../screens/Configurations/DadosCadastrais";
import { InformacoesCadastraisScreen } from "../screens/Configurations/DadosCadastrais/InformacoesCadastrais";
import Entry from "../screens/Entry";
import Filter from "../screens/Entry/Filter";
import FixedEntry from "../screens/FixedEntry";
import Home from "../screens/Home";
import NewEntry from "../screens/NewEntry";

const {
    Navigator: StackNavigator,
    Screen: StackScreen,
    Group,
} = createNativeStackNavigator();

export const AppStackRoutes = () => {
    return (
        <StackNavigator initialRouteName="Home">
            <StackScreen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <StackScreen
                name="Complete"
                component={Complete}
                options={{ headerShown: false }}
            />

            <StackScreen
                name="Lançamentos"
                component={Entry}
                options={{ headerShown: false }}
            />
            <StackScreen
                name="NovoLançamento"
                component={NewEntry}
                options={{ headerShown: false }}
            />
            <StackScreen
                name="LançamentoFixo"
                component={FixedEntry}
                options={{ headerShown: false }}
            />
            <StackScreen
                name="Filtros"
                component={Filter}
                options={{
                    headerShown: false,
                    presentation: "containedTransparentModal",
                }}
            />
            {/* Configuracoes */}
            <StackScreen 
                name="Configuracoes"
                component={ConfiguracoesScreen}
                options={{
                    headerShown: false,
                }}
            />
            <StackScreen 
                name="Configuracoes/DadosCadastrais"
                component={DadosCadastraisScreen}
                options={{headerShown: false}}
            />
            <StackScreen 
                name="Configuracoes/DadosCadastrais/InformacoesCadastrais"
                component={InformacoesCadastraisScreen}
                options={{headerShown: false}}
            />
            {/* !Configuracoes */}
        </StackNavigator>
    );
};
