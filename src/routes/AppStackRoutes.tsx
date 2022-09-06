import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Complete from "../screens/Complete";
import ConfiguracoesScreen from "../screens/Configurations";
import { DadosCadastraisScreen } from "../screens/Configurations/DadosCadastrais";
import { AlterarSenhaScreen } from "../screens/Configurations/DadosCadastrais/AlterarSenha";
import { InformacoesPessoaisScreen } from "../screens/Configurations/DadosCadastrais/InformacoesPessoais";
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

const { Navigator: StackNavigator, Screen: StackScreen } =
  createNativeStackNavigator();

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
      {/* !Configuracoes */}
    </StackNavigator>
  );
};
