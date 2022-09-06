import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Complete from "../screens/Complete";
import ConfiguracoesScreen from "../screens/Configurations";
import DadosCadastraisScreen from "../screens/Configurations/DadosCadastrais";
import AlterarSenhaScreen from "../screens/Configurations/DadosCadastrais/AlterarSenha";
import InformacoesPessoaisScreen from "../screens/Configurations/DadosCadastrais/InformacoesPessoais";
import SecurityScreen from "../screens/Configurations/Security";
import DeleteAccountScreen from "../screens/Configurations/Security/DeleteAccount";
import Entry from "../screens/Entry";
import Filter from "../screens/Entry/Filter";
import FixedEntry from "../screens/FixedEntry";
import Home from "../screens/Home";
import Investments from "../screens/Investments";
import AssetInfoScreen from "../screens/Investments/AssetInfo";
import NewAsset from "../screens/NewAsset";
import NewFixAsset from "../screens/NewAsset/NewFixAsset";
import NewVariableAsset from "../screens/NewAsset/NewVariableAsset";
import NewEntry from "../screens/NewEntry";

const {
  Navigator: StackNavigator,
  Screen: StackScreen,
  Group,
} = createNativeStackNavigator();

export const AppStackRoutes = () => {
  return (
    <StackNavigator initialRouteName="Home">
      {/* Home */}
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
      {/* !Home */}

      {/* Lançamentos */}
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
      {/* !Lançamentos */}

      {/* Investimentos */}
      <StackScreen
        name="Investimentos"
        component={Investments}
        options={{ headerShown: false }}
      />
      <StackScreen
        name="NovoAtivo"
        component={NewAsset}
        options={{ headerShown: false }}
      />
      <StackScreen
        name="NovoAtivoFixo"
        component={NewFixAsset}
        options={{ headerShown: false }}
      />
      <StackScreen
        name="NovoAtivoVariavel"
        component={NewVariableAsset}
        options={{ headerShown: false }}
      />
      <StackScreen
        name="Investimentos/AtivoInfo"
        component={AssetInfoScreen}
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
        name="Configuracoes/DadosCadastrais/InformacoesCadastrais"
        component={InformacoesPessoaisScreen}
        options={{ headerShown: false }}
      />
      <StackScreen
        name="Configuracoes/DadosCadastrais/AlterarSenha"
        component={AlterarSenhaScreen}
        options={{ headerShown: false }}
      />
      {/* !Configuracoes */}
    </StackNavigator>
  );
};
