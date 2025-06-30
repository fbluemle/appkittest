/* eslint-env jest */
/* global BigInt */

import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

const wagmiState = {
  isConnected: false,
  address: '0x1234567890123456789012345678901234567890',
};

jest.mock('@reown/appkit-wagmi-react-native', () => {
  const mockOpen = jest.fn(() => {
    wagmiState.isConnected = true;
  });
  return {
    useAppKit: () => ({open: mockOpen, close: jest.fn()}),
    useAppKitState: () => ({selectedNetworkId: 42161}),
    AppKit: () => null,
    AppKitButton: 'AppKitButton',
    createAppKit: jest.fn(),
    defaultWagmiConfig: jest.fn(() => ({})),
  };
});

jest.mock('wagmi', () => {
  const mockWriteContractAsync = jest.fn(() => Promise.resolve('0xmocktxhash'));
  return {
    useAccount: () => ({
      address: wagmiState.isConnected ? wagmiState.address : undefined,
      isConnected: wagmiState.isConnected,
    }),
    useDisconnect: () => ({
      disconnect: jest.fn(() => {
        wagmiState.isConnected = false;
      }),
    }),
    useBalance: () => ({data: {formatted: '1.0'}, refetch: jest.fn()}),
    useReadContract: () => ({
      data: BigInt(1000000000000000000n),
      refetch: jest.fn(),
    }),
    useWriteContract: () => ({writeContractAsync: mockWriteContractAsync}),
    WagmiProvider: ({children}) => children,
  };
});

jest.mock('@walletconnect/react-native-compat', () => ({}));

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  const anim = () => ({start: jest.fn(cb => cb?.({finished: true}))});
  rn.Animated.timing = jest.fn(anim);
  rn.Animated.spring = jest.fn(anim);
  rn.Animated.decay = jest.fn(anim);
  rn.Animated.sequence = jest.fn(anim);
  rn.Animated.parallel = jest.fn(anim);
  rn.Animated.stagger = jest.fn(anim);
  rn.Animated.loop = jest.fn(anim);
  const OriginalValue = rn.Animated.Value;
  rn.Animated.Value = function (value) {
    const instance = new OriginalValue(value);
    instance.interpolate = jest.fn(() => ({
      __getValue: () => value,
      interpolate: jest.fn(),
    }));
    return instance;
  };
  return rn;
});
