import '@walletconnect/react-native-compat';

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {
  AppKit,
  AppKitButton,
  createAppKit,
  defaultWagmiConfig,
} from '@reown/appkit-wagmi-react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WagmiProvider} from 'wagmi';
import {mainnet} from 'wagmi/chains';

// Get Project ID from https://cloud.reown.com/
const projectId = '';

const queryClient = new QueryClient();

const metadata = {
  name: 'appkittest',
  description: 'appkittest',
  url: 'https://reown.com/appkit',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
  redirect: {
    native: 'appkittest://',
  },
};

const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet],
  projectId,
  metadata,
});

createAppKit({
  projectId,
  wagmiConfig,
});

const App = () => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <View style={styles.container}>
            <AppKitButton balance="show" />
            <AppKit />
          </View>
        </SafeAreaProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
