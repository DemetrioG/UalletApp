import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Complete from "../screens/App/Complete";
import ConfiguracoesScreen from "../screens/App/Configurations";
import AlertsScreen from "../screens/App/Configurations/Alerts";
import VariableEntryScreen from "../screens/App/Configurations/Alerts/VariableEntry";
import DadosCadastraisScreen from "../screens/App/Configurations/DadosCadastrais";
import { AlterarSenhaScreen } from "../screens/App/Configurations/DadosCadastrais/AlterarSenha";
import InformacoesPessoaisScreen from "../screens/App/Configurations/DadosCadastrais/InformacoesPessoais";
import { SecurityScreen } from "../screens/App/Configurations/Security";
import { DeleteAccountScreen } from "../screens/App/Configurations/Security/DeleteAccount";
import Entry from "../screens/App/Entry";
import Filter from "../screens/App/Entry/Filter";
import FixedEntry from "../screens/App/FixedEntry";
import { Home } from "../screens/App/Home";
import Investments from "../screens/App/Investments";
import AssetInfoScreen from "../screens/App/Investments/AssetInfo";
import AssetMovement from "../screens/App/Investments/AssetMovement";
import NewAsset from "../screens/App/NewAsset";
import NewFixAsset from "../screens/App/NewAsset/NewFixAsset";
import NewVariableAsset from "../screens/App/NewAsset/NewVariableAsset";
import NewEntry from "../screens/App/NewEntry";

const { Navigator: StackNavigator, Screen: StackScreen } =
  createNativeStackNavigator();

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
        {/* !Home */}

        {/* Lançamentos */}
        <StackScreen
          name="Lancamentos"
          component={Entry}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Lancamentos/NovoLancamento"
          component={NewEntry}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Lancamentos/LancamentoFixo"
          component={FixedEntry}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Lancamentos/Filtros"
          component={Filter}
          options={{
            headerShown: false,
            presentation: "containedTransparentModal",
          }}
        />
        {/* !Lançamentos */}

        {/* Investimentos */}
        <StackScreen
          name="Investimentos"
          component={Investments}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Investimentos/NovoAtivo"
          component={NewAsset}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Investimentos/NovoAtivoFixo"
          component={NewFixAsset}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Investimentos/NovoAtivoVariavel"
          component={NewVariableAsset}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Investimentos/AtivoInfo"
          component={AssetInfoScreen}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Investimentos/AtivoInfo/Movimentacoes"
          component={AssetMovement}
          options={{ headerShown: false }}
        />
        {/* !Investimentos */}

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
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Configuracoes/DadosCadastrais/InformacoesCadastrais"
          component={InformacoesPessoaisScreen}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Configuracoes/DadosCadastrais/AlterarSenha"
          component={AlterarSenhaScreen}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Configuracoes/Seguranca"
          component={SecurityScreen}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Configuracoes/Seguranca/ExcluirConta"
          component={DeleteAccountScreen}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Configuracoes/Alertas"
          component={AlertsScreen}
          options={{ headerShown: false }}
        />
        <StackScreen
          name="Configuracoes/Alertas/DespesasVariaveis"
          component={VariableEntryScreen}
          options={{ headerShown: false }}
        />
        {/* !Configuracoes */}
      </StackNavigator>
    </NavigationContainer>
  );
};
