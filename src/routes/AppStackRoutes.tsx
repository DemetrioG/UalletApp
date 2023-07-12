import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Complete from "../screens/App/Complete";
import { ConfiguracoesScreen } from "../screens/App/Configurations";
import { AlertsScreen } from "../screens/App/Configurations/Alerts";
import { VariableEntryScreen } from "../screens/App/Configurations/Alerts/VariableEntry";
import { DadosCadastraisScreen } from "../screens/App/Configurations/DadosCadastrais";
import { AlterarSenhaScreen } from "../screens/App/Configurations/DadosCadastrais/AlterarSenha";
import { InformacoesPessoaisScreen } from "../screens/App/Configurations/DadosCadastrais/InformacoesPessoais";
import { SecurityScreen } from "../screens/App/Configurations/Security";
import { DeleteAccountScreen } from "../screens/App/Configurations/Security/DeleteAccount";
import { Entries } from "../screens/App/Entries";
import FixedEntry from "../screens/App/FixedEntry";
import { Home } from "../screens/App/Home";
import { FormEntries } from "../screens/App/Entries/Form";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { HeaderSummary } from "../components/Header";
import { View } from "native-base";

const {
  Navigator: StackNavigator,
  Screen: StackScreen,
  Group: StackGroup,
} = createNativeStackNavigator();

export const AppStackRoutes = () => {
  return (
    <NavigationContainer>
      <ConfirmDialog />
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
        {/* !Home */}

        <StackGroup
          screenOptions={{
            header(props) {
              return (
                <View mb={3}>
                  <HeaderSummary />
                </View>
              );
            },
          }}
        >
          {/* Lançamentos */}
          <StackScreen name="Lancamentos" component={Entries} />
          <StackScreen name="Lancamentos/Form" component={FormEntries} />
          <StackScreen
            name="Lancamentos/LancamentoFixo"
            component={FixedEntry}
          />
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
        </StackGroup>
      </StackNavigator>
    </NavigationContainer>
  );
};
