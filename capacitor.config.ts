import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cyclesync.app',
  appName: 'CycleSync',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
