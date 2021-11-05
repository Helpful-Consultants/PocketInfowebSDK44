import React, { useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';
import HeaderButton from '../components/HeaderButton';
import TitleWithAppLogo from '../components/TitleWithAppLogo';
import TabBarIcon from '../components/TabBarIcon';
// import BadgedTabBarText from '../components/BadgedTabBarText';
import NotificationsScreen from '../screens/NotificationsScreen';
import ServiceMeasuresScreen from '../screens/ServiceMeasuresScreen';
import LtpLoansScreen from '../screens/LtpLoansScreen';
import OdisScreen from '../screens/OdisScreen';
import Colors from '../constants/Colors';

const screenWidth = Math.round(Dimensions.get('window').width);
// const screenHeight = Math.round(Dimensions.get('window').height);
const baseFontSize = 12;
let navBarFontSize =
  screenWidth > 1023
    ? baseFontSize * 1.3
    : screenWidth > 767
    ? baseFontSize * 1.2
    : screenWidth > 413
    ? baseFontSize * 1.1
    : screenWidth > 374
    ? baseFontSize * 1
    : baseFontSize * 1;

let headerHeight =
  screenWidth > 1023
    ? 90
    : screenWidth > 767
    ? 80
    : screenWidth > 413
    ? 70
    : screenWidth > 374
    ? 60
    : 60;
// console.log('screenHeight', screenHeight);
// console.log('screenWidth', screenWidth, 'navBarFontSize', navBarFontSize);

// Start tab navigator

const RemindersTabs =
  Platform.OS === 'androidzzz'
    ? createMaterialBottomTabNavigator()
    : createBottomTabNavigator();

// console.log(
//   'in navigator, showBadgeLtpLoans ',
//   showBadgeLtpLoans && showBadgeLtpLoans,

//   ', showBadgeNotifications',
//   showBadgeNotifications && showBadgeNotifications,
//   'showBadgeOdis ',
//   showBadgeOdis && showBadgeOdis,
//   'showBadgeServiceMeasures ',
//   showBadgeServiceMeasures && showBadgeServiceMeasures
// );

export default RemindersTabNavigator = ({ navigation, route }) => {
  const showingDemoApp = useSelector((state) => state.user.showingDemoApp);
  const showingDemoData = useSelector(
    (state) => state.user.userRequestedDemoData
  );
  const calibrationExpiryOverdueCount = useSelector(
    (state) => state.calibrationExpiry.overdueCount
  );
  const calibrationExpiryRedCount = useSelector(
    (state) => state.calibrationExpiry.redCount
  );
  const calibrationExpiryAmberCount = useSelector(
    (state) => state.calibrationExpiry.amberCount
  );
  const ltpLoansRedCount = useSelector((state) => state.ltpLoans.redCount);
  const ltpLoansAmberCount = useSelector((state) => state.ltpLoans.amberCount);
  const odisChangesToHighlight = useSelector(
    (state) => state.odis.changesToHighlight
  );
  const serviceMeasuresRedCount = useSelector(
    (state) => state.serviceMeasures.redCount
  );
  const serviceMeasuresAmberCount = useSelector(
    (state) => state.serviceMeasures.amberCount
  );
  const [notifiableAlertsAmberCount, setNotifiableAlertsAmberCount] =
    useState(0);
  const [notifiableAlertsRedCount, setNotifiableAlertsRedCount] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: Platform.OS === 'ios' ? 'white' : '#3689b1',
      },
      headerTitle: () => (
        <TitleWithAppLogo title={getFocusedRouteNameFromRoute(route)} />
      ),
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title='home'
            iconName={Platform.OS === 'ios' ? 'home' : 'home'}
            onPress={() => {
              {
                /* console.log('pressed homescreen icon'); */
              }
              navigation.navigate('Home');
            }}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title='menu'
            iconName={Platform.OS === 'ios' ? 'menu' : 'menu'}
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, route]);

  //   console.log(
  //     '$$$$$$$$$$$$$$ in reminders navigator, showingDemoApp',
  //     showingDemoApp
  //   );

  useEffect(() => {
    if (showingDemoApp) {
      //   console.log(
      //     'in reminders nav useEffect LtpLoansCounts',
      //     ltpLoansRedCount,
      //     ltpLoansAmberCount
      //   );
      let tempNotifiableAlertsRedCount = 0;

      if (
        typeof calibrationExpiryOverdueCount !== 'undefined' ||
        calibrationExpiryOverdueCount !== null
      ) {
        tempNotifiableAlertsRedCount =
          tempNotifiableAlertsRedCount + calibrationExpiryOverdueCount;
      }
      if (
        typeof calibrationExpiryRedCount !== 'undefined' ||
        calibrationExpiryRedCount !== null
      ) {
        tempNotifiableAlertsRedCount =
          tempNotifiableAlertsRedCount + calibrationExpiryRedCount;
      }
      if (
        typeof serviceMeasuresRedCount !== 'undefined' ||
        serviceMeasuresRedCount !== null
      ) {
        tempNotifiableAlertsRedCount =
          tempNotifiableAlertsRedCount + serviceMeasuresRedCount;
      }
      if (
        typeof ltpLoansRedCount !== 'undefined' ||
        ltpLoansRedCount !== null
      ) {
        tempNotifiableAlertsRedCount =
          tempNotifiableAlertsRedCount + ltpLoansRedCount;
      }

      //   console.log(
      //     'in reminders nav useEffect - Red alerts ',
      //     'tempNotifiableAlertsRedCount',
      //     tempNotifiableAlertsRedCount,
      //     'calibrationExpiryRedCount',
      //     calibrationExpiryRedCount,
      //     'serviceMeasuresRedCount',
      //     serviceMeasuresRedCount,
      //     'ltpLoansRedCount',
      //     ltpLoansRedCount
      //   );

      setNotifiableAlertsRedCount(tempNotifiableAlertsRedCount);
    }
  }, [
    calibrationExpiryOverdueCount,
    calibrationExpiryRedCount,
    ltpLoansRedCount,
    serviceMeasuresRedCount,
    showingDemoApp,
    showingDemoData,
  ]);

  useEffect(() => {
    if (showingDemoApp) {
      let tempNotifiableAlertsAmberCount = 0;

      if (
        typeof calibrationExpiryAmberCount !== 'undefined' ||
        calibrationExpiryAmberCount !== null
      ) {
        tempNotifiableAlertsAmberCount =
          tempNotifiableAlertsAmberCount + calibrationExpiryAmberCount;
      }
      if (
        typeof serviceMeasuresAmberCount !== 'undefined' ||
        serviceMeasuresAmberCount !== null
      ) {
        tempNotifiableAlertsAmberCount =
          tempNotifiableAlertsAmberCount + serviceMeasuresAmberCount;
      }
      if (
        typeof ltpLoansAmberCount !== 'undefined' ||
        ltpLoansAmberCount !== null
      ) {
        tempNotifiableAlertsAmberCount =
          tempNotifiableAlertsAmberCount + ltpLoansAmberCount;
      }
      if (
        typeof odisChangesToHighlight !== 'undefined' ||
        odisChangesToHighlight !== null
      ) {
        tempNotifiableAlertsAmberCount =
          tempNotifiableAlertsAmberCount + odisChangesToHighlight;
      }

      //   console.log(
      //     'in reminders nav useEffect - Amber Alerts ',
      //     'calibrationExpiryAmberCount',
      //     calibrationExpiryAmberCount,
      //     'ltpLoansAmberCount',
      //     ltpLoansAmberCount,
      //     'serviceMeasuresAmberCount',
      //     serviceMeasuresAmberCount,
      //   odisChangesToHighlight',
      //   odisChangesToHighlight,
      //     'tempNotifiableAlertsAmberCount',
      //     tempNotifiableAlertsAmberCount',

      //   );

      setNotifiableAlertsAmberCount(tempNotifiableAlertsAmberCount);
    }
  }, [
    calibrationExpiryAmberCount,
    ltpLoansAmberCount,
    serviceMeasuresAmberCount,
    odisChangesToHighlight,
    showingDemoApp,
    showingDemoData,
  ]);

  //   console.log(
  //     '$$$$$$$$$$$$$$ in reminders  navigator,',
  //     'notificationsAlertCount:',
  //     notificationsAlertCount,
  //     'serviceMeasuresAlertCount:',
  //     serviceMeasuresAlertCount,
  //     serviceMeasuresAmberCount,
  //     serviceMeasuresAmberCount,
  //     'ltpLoansAlertCount: ',
  //     ltpLoansAlertCount,
  //     ltpLoansRedCount,
  //     ltpLoansAmberCount,
  //   );

  return (
    <RemindersTabs.Navigator //iOS
      initialRouteName='Notifications' // ios and android
      backBehavior='history' // ios and android
      // for android - start
      activeColor={Colors.vwgActiveLink} // android
      inactiveColor={Colors.vwgInactiveLink} // android
      shifting={false} //android
      barStyle={{
        // android
        labelPosition: 'below-icon',
        backgroundColor: Colors.vwgVeryLightGray,
      }}
      // for android - end
      // for ios - start
      sceneContainerStyle={{ backgroundColor: 'white' }} // ios
      screenOptions={{
        // android and ios
        headerShown: false, //ios
        tabBarActiveTintColor: Colors.vwgActiveLink, //ios
        tabBarInactiveTintColor: Colors.vwgInactiveLink, //ios
        tabBarActiveBackgroundColor: Colors.vwgWhite, //ios
        tabBarInactiveBackgroundColor: Colors.vwgWhite, //ios
        tabBarLabelStyle: {
          //ios
          fontSize: navBarFontSize,
        },
        tabBarLabelPosition: 'below-icon', //io
        sceneContainerStyle: { backgroundColor: 'white' }, // ios
      }}
      // for ios - end
    >
      <RemindersTabs.Screen
        name='Notifications'
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} name='alert-circle' size={size} />
          ),
          tabBarBadge:
            (notifiableAlertsRedCount && notifiableAlertsRedCount > 0) ||
            (notifiableAlertsAmberCount && notifiableAlertsAmberCount > 0)
              ? ''
              : null,
          tabBarBadgeStyle: {
            color:
              notifiableAlertsRedCount > 0
                ? Colors.vwgBadgeSevereAlertColor
                : Colors.vwgWarmOrange,
            backgroundColor:
              notifiableAlertsRedCount > 0
                ? Colors.vwgBadgeSevereAlertColor
                : Colors.vwgWarmOrange,
          },
        }}
      />
      <RemindersTabs.Screen
        name='Service Measures'
        component={ServiceMeasuresScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} name='checkbox' size={size} />
          ),
          tabBarBadge: showingDemoApp
            ? (serviceMeasuresRedCount && serviceMeasuresRedCount > 0) ||
              (serviceMeasuresAmberCount && serviceMeasuresAmberCount > 0)
              ? ''
              : null
            : null,
          tabBarBadgeStyle: {
            color:
              serviceMeasuresRedCount > 0
                ? Colors.vwgBadgeSevereAlertColor
                : Colors.vwgWarmOrange,
            backgroundColor:
              serviceMeasuresRedCount > 0
                ? Colors.vwgBadgeSevereAlertColor
                : Colors.vwgWarmOrange,
          },
        }}
      />
      <RemindersTabs.Screen
        name='LTP Loans'
        component={LtpLoansScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon focused={focused} name='calendar' size={size} />
          ),
          tabBarBadge: showingDemoApp
            ? (ltpLoansRedCount && ltpLoansRedCount > 0) ||
              (ltpLoansAmberCount && ltpLoansAmberCount > 0)
              ? ''
              : null
            : null,
          tabBarBadgeStyle: {
            color:
              ltpLoansRedCount > 0
                ? Colors.vwgBadgeSevereAlertColor
                : Colors.vwgWarmOrange,
            backgroundColor:
              ltpLoansRedCount > 0
                ? Colors.vwgBadgeSevereAlertColor
                : Colors.vwgWarmOrange,
          },
        }}
      />
      <RemindersTabs.Screen
        name='ODIS'
        component={OdisScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              focused={focused}
              name='tv'
              size={size}
              // alert={odisChangesToHighlight? false : true}
              alert={false}
            />
          ),
          tabBarBadge: odisChangesToHighlight ? '' : null,
          tabBarBadgeStyle: {
            color:
              odisChangesToHighlight > 0
                ? Colors.vwgBadgeAlertColor
                : Colors.vwgBadgeColor,
            backgroundColor:
              odisChangesToHighlight > 0
                ? Colors.vwgBadgeAlertColor
                : Colors.vwgBadgeColor,
          },
        }}
      />
    </RemindersTabs.Navigator>
  );
};
// End Tab navigator
