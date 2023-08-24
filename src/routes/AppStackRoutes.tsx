// @ts-nocheck
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { Complete } from "../screens/App/Complete";
import { ConfiguracoesScreen } from "../screens/App/Configurations";
import { AlertsScreen } from "../screens/App/Configurations/Alerts";
import { VariableEntryScreen } from "../screens/App/Configurations/Alerts/VariableEntry";
import { DadosCadastraisScreen } from "../screens/App/Configurations/DadosCadastrais";
import { AlterarSenhaScreen } from "../screens/App/Configurations/DadosCadastrais/AlterarSenha";
import { InformacoesPessoaisScreen } from "../screens/App/Configurations/DadosCadastrais/InformacoesPessoais";
import { SecurityScreen } from "../screens/App/Configurations/Security";
import { DeleteAccountScreen } from "../screens/App/Configurations/Security/DeleteAccount";
import { Entries } from "../screens/App/Entries";
import { Home } from "../screens/App/Home";
import { FormEntries } from "../screens/App/Entries/Form";
import { HeaderSummary } from "../components/Header";
import { View } from "native-base";
import { IThemeProvider } from "../styles/baseTheme";
import { useTheme } from "styled-components";
import { CompleteForm } from "../screens/App/Complete/CompleteForm";
import { Records } from "../screens/App/Configurations/Records";
import { Segment } from "../screens/App/Configurations/Records/Segment";
import { SegmentForm } from "../screens/App/Configurations/Records/Segment/Form";
import { Tickets } from "../screens/App/Configurations/Tickets";
import { TicketsForm } from "../screens/App/Configurations/Tickets/Form";

const {
  Navigator: StackNavigator,
  Screen: StackScreen,
  Group: StackGroup,
} = createNativeStackNavigator();

export const AppStackRoutes = () => {
  return (
    <NavigationContainer>
      <StackNavigator initialRouteName="Home">
        {/* Home */}
        <StackScreen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Home/Complete"
          component={Complete}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Home/Complete/Form"
          component={CompleteForm}
          options={{ headerShown: false }}
        />
        {/* !Home */}

        <StackGroup
          screenOptions={{
            header(props) {
              const { theme }: IThemeProvider = useTheme();
              return (
                <View pb={3} backgroundColor={theme?.primary}>
                  <HeaderSummary />
                </View>
              );
            },
          }}
        >
          {/* Lançamentos */}
          <StackScreen name="Lancamentos" component={Entries} />
          <StackScreen name="Lancamentos/Form" component={FormEntries} />
          {/* !Lançamentos */}

          {/* Configuracoes */}
          <StackScreen name="Configuracoes" component={ConfiguracoesScreen} />
          <StackScreen
            name="Configuracoes/DadosCadastrais"
            component={DadosCadastraisScreen}
          />
          <StackScreen
            name="Configuracoes/DadosCadastrais/InformacoesCadastrais"
            component={InformacoesPessoaisScreen}
          />
          <StackScreen
            name="Configuracoes/DadosCadastrais/AlterarSenha"
            component={AlterarSenhaScreen}
          />
          <StackScreen name="Configuracoes/Records" component={Records} />
          <StackScreen
            name="Configuracoes/Records/Segment"
            component={Segment}
          />
          <StackScreen
            name="Configuracoes/Records/Segment/Form"
            component={SegmentForm}
          />
          <StackScreen
            name="Configuracoes/Seguranca"
            component={SecurityScreen}
          />
          <StackScreen
            name="Configuracoes/Seguranca/ExcluirConta"
            component={DeleteAccountScreen}
          />
          <StackScreen name="Configuracoes/Alertas" component={AlertsScreen} />
          <StackScreen
            name="Configuracoes/Alertas/DespesasVariaveis"
            component={VariableEntryScreen}
          />
          {/* !Configuracoes */}

          {/* Menu */}
          <StackScreen name="Tickets" component={Tickets} />
          <StackScreen name="Tickets/Form" component={TicketsForm} />
          {/* !Menu */}
        </StackGroup>
      </StackNavigator>
    </NavigationContainer>
  );
};
