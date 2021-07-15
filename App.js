import AppLoading from 'expo-app-loading';
// import * as Notifications from 'expo-notifications';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import React, { useState } from 'react';
import reducers from './reducers';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/integration/react';
import axios from 'axios';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import { Platform, StatusBar, useWindowDimensions, View } from 'react-native';
import { Text, TextInput } from 'react-native'; // not react-native-elements, for setting properties
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from './constants/Colors';
import Tasks from './constants/Tasks';

import AsyncStorage from '@react-native-async-storage/async-storage'; //breaks
// import { AsyncStorage } from 'react-native'; // deprecated
import * as Sentry from 'sentry-expo';
import '@expo/match-media';
// import { useMediaQuery } from 'react-responsive';
import Constants from 'expo-constants';
// import { Ionicons } from '@expo/vector-icons';
// import { Button, colors, ThemeProvider } from 'react-native-elements';
import AppNavigator from './navigation/AppNavigator';
import Loading from './components/Loading';

enableScreens();

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://rem-rest-api.herokuapp.com/api';
axios.defaults.baseURL = 'https://toolsinfoweb.co.uk';

// const theme = {
//   colors: {
//     ...Platform.select({
//       default: colors.platform.android,
//       ios: colors.platform.ios
//     })
//   }
// };

Sentry.init({
  dsn: 'https://179ccb307bf249eeafa60884b960924a@o359939.ingest.sentry.io/5806088',
  enableInExpoDevelopment: true,
  debug: true,
  release: Constants.manifest.revisionId,
});

// deprecated so moved above
// Sentry.setRelease(Constants.manifest.revisionId);

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// if (Platform.OS !== 'android') {
//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: false,
//       shouldPlaySound: false,
//       shouldSetBadge: true,
//     }),
//   });
// }

// await Notifications.scheduleLocalNotificationAsync({
//   title: '...',
//   body: '...',
//   ios: {count: 1},
// }, {
//   time: ...
// })

const persistedReducer = persistReducer(persistConfig, reducers);

// const store = compose(persistedReducer, {}, applyMiddleware(sagaMiddleware));
const store = createStore(
  persistedReducer,
  {},
  compose(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

const fetchDate = async () => {
  const now = Date.now();
  const result = true;
  console.log(`Got background fetch call`);
  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );
  // Be sure to return the successful result type!
  return result
    ? BackgroundFetch.Result.NewData
    : BackgroundFetch.Result.NoData;
};

// const BACKGROUND_FETCH_TASK = 'background-fetcher';
// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
async function initBackgroundFetch(taskName, taskFn, interval = 60 * 15) {
  console.log('in initBackgroundFetch', taskName, taskFn, interval);
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      TaskManager.defineTask(taskName, taskFn);
    }
    const options = {
      minimumInterval: interval, // in seconds
    };
    await BackgroundFetch.registerTaskAsync(taskName, options);
    console.log('registerTaskAsync() worked');
  } catch (err) {
    console.log('registerTaskAsync() failed:', err);
  }
}

initBackgroundFetch(Tasks.BACKGROUND_FETCH_TASK, fetchDate, 5);
// TaskManager.defineTask(Tasks.BACKGROUND_FETCH_TASK, async () => {
//   const now = Date.now();
//   const result = true;
//   console.log(`Got background fetch call`);
//   console.log(
//     `Got background fetch call at date: ${new Date(now).toISOString()}`
//   );
//   // Be sure to return the successful result type!
//   return result
//     ? BackgroundFetch.Result.NewData
//     : BackgroundFetch.Result.NoData;
// });

export default function App(props) {
  const windowDim = useWindowDimensions();
  const baseStyles = windowDim && getBaseStyles(windowDim);
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  //   persistStore(store).purge();
  //   const userIsValidated = true;

  // This prevents any fontscaling by the user - a bit mean
  //   Text.defaultProps = Text.defaultProps || {};
  //   Text.defaultProps.allowFontScaling = false;
  //   TextInput.defaultProps = TextInput.defaultProps || {};
  //   TextInput.defaultProps.allowFontScaling = false;
  //   const userIsValidated = true;

  // This limits fontscaling by the user - a bit kinder
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.maxFontSizeMultiplier = Platform.OS === 'ios' ? 1.6 : 1.4;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.maxFontSizeMultiplier =
    Platform.OS === 'ios' ? 1.5 : 1.4;
  //   console.log('7777 Text.defaultProps', Text && Text, TextInput && TextInput);

  const persistor = persistStore(store);
  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    // console.log('in App');
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<Loading />} persistor={persistor}>
            <View style={baseStyles.containerFlex}>
              {Platform.OS === 'ios' ? (
                <StatusBar barStyle='dark-content' />
              ) : (
                <StatusBar backgroundColor='#3689b1' barStyle='light-content' />
              )}
              <AppNavigator />
            </View>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    );
  }
}

// async function loadResourcesAsync() {
//     const Asset.cacheImages([
//     require('./assets/images/icon.png'),
//     require('./assets/images/splash.png'),
//     require('./assets/images/tiw-app-logo-less-whitespace.png'),
//     require('./assets/images/tiw-app-logo-trans.png'),
//     require('./assets/images/tiw-app-logo.png'),
//     require('./assets/images/audi-logo.png'),
//     require('./assets/images/cv-logo.png'),
//     require('./assets/images/seat-logo.png'),
//     require('./assets/images/skoda-logo.png'),
//     require('./assets/images/vw-logo.png'),
//     require('./assets/images/odis.jpg')
//   ]);

//   const fontAssets = cacheFonts([
//     require('./assets/fonts/VWAGTheSans-Regular.ttf'),
//     require('./assets/fonts/VWAGTheSans-Bold.ttf'),
//     require('./assets/fonts/VWAGTheSans-Light.ttf')
//   ]);
//   //             'the-sans-bold': require('./assets/fonts/VWAGTheSans/VWAGTheSans-Bold.ttf')]);
//   await Promise.all([...imageAssets, ...fontAssets]);
// }

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/icon.png'),
      require('./assets/images/splash.png'),
      require('./assets/images/tiw-app-logo-less-whitespace.png'),
      require('./assets/images/tiw-app-logo-trans.png'),
      require('./assets/images/tiw-app-logo-trans-white.png'),
      require('./assets/images/tiw-app-logo.png'),
      require('./assets/images/audi-logo.png'),
      require('./assets/images/cv-logo.png'),
      require('./assets/images/seat-logo.png'),
      require('./assets/images/skoda-logo.png'),
      require('./assets/images/vw-logo.png'),
      require('./assets/images/odis.jpg'),
      require('./assets/images/no-image-placeholder.png'),
    ]),
    Font.loadAsync({
      'the-sans': require('./assets/fonts/VWAGTheSans-Regular.ttf'),
      'the-sans-bold': require('./assets/fonts/VWAGTheSans-Bold.ttf'),
      'the-sans-light': require('./assets/fonts/VWAGTheSans-Light.ttf'),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}
