import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DIRECT_API_PORT = 8888;

function expoHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants.manifest as { debuggerHost?: string } | null)?.debuggerHost;
  if (!hostUri) return null;
  const host = hostUri.split(':')[0]?.trim();
  if (!host) return null;
  if (host === 'localhost' || host === '127.0.0.1') {
    return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
  }
  return host;
}

function metroPort(): string {
  const hostUri = Constants.expoConfig?.hostUri;
  const port = hostUri?.split(':')[1]?.split('/')[0];
  return port || '8081';
}

function defaultBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }

  const host = expoHost();
  if (__DEV__ && host) {
    return `http://${host}:${metroPort()}`;
  }
  if (host) return `http://${host}:${DIRECT_API_PORT}`;
  if (Platform.OS === 'android') return `http://10.0.2.2:${DIRECT_API_PORT}`;
  return `http://127.0.0.1:${DIRECT_API_PORT}`;
}

export const env = {
  apiBaseUrl: defaultBaseUrl(),
  websiteUrl: 'https://nowiknow.io',
} as const;

if (__DEV__) {
  console.log(`[nik] API base URL → ${env.apiBaseUrl}`);
}
