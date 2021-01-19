// import { Types } from '../actions/user';
import Types from '../constants/Types';
import moment from 'moment';

const INITIAL_STATE = {
  userData: [],
  userBrand: null,
  userApiFetchParamsObj: null,
  userIsSignedIn: false,
  userIsValidated: false,
  //   userEmail: null,
  userId: null,
  userPin: null,
  userName: null,
  userIsValidated: false,
  lastUpdate: null,
  isLoading: false,
  error: null,
  dataErrorUrl: null,
  statusCode: null,
};

export default function user(state = INITIAL_STATE, action) {
  //   console.log(Types);
  console.log('in user reducer, action.type is:', action.type);
  switch (action.type) {
    case Types.GET_USER_START: {
      return {
        ...state,
        //  userData: [],
        isLoading: true,
        error: null,
        dataErrorUrl: null,
        statusCode: null,
        //  userApiFetchParamsObj: null,
      };
    }
    case Types.GET_USER_SUCCESS: {
      console.log(
        ' GET_USER_SUCCESS reducer action.payload is:',
        action.payload.items
      );
      console.log('reducer got here: a');
      let userBrand = null;
      let userDataBrand =
        (action.payload &&
          action.payload.items &&
          action.payload.items[0].brand &&
          action.payload.items[0].brand) ||
        null;
      console.log('reducer got here: a2');
      let userName =
        (action.payload &&
          action.payload.items &&
          action.payload.items[0].userName &&
          action.payload.items[0].userName) ||
        null;
      console.log('reducer got here: b');
      let dealerName =
        (action.payload &&
          action.payload.items &&
          action.payload.items[0].dealerName &&
          action.payload.items[0].dealerName) ||
        null;

      console.log('reducer got here: c');
      let userPin =
        (action.payload && action.payload.userPin && action.payload.userPin) ||
        null;
      //   let userEmail =
      //     (action.payload &&
      //       action.payload.userEmail &&
      //       action.payload.userEmail) ||
      //     null;
      let userId =
        (action.payload &&
          action.payload.items &&
          action.payload.items[0].userId &&
          action.payload.items[0].userId) ||
        null;

      console.log('reducer got here: d');

      userDataBrand = (userDataBrand && userDataBrand.toLowerCase()) || null;

      let userIntId =
        action.payload &&
        action.payload.items &&
        action.payload.items[0] &&
        action.payload.items[0].intId &&
        action.payload.items[0].intId.toString();

      let userApiFetchParamsObj =
        action.payload &&
        action.payload.items &&
        action.payload.items[0] &&
        action.payload.items[0].dealerId &&
        action.payload.items[0].intId
          ? {
              dealerId: action.payload.items[0].dealerId.toString(),
              intId: action.payload.items[0].intId.toString(),
            }
          : null;

      //   console.log(action.payload && action.payload);
      //   console.log('action.payload.items ', action.payload.items);
      //   console.log('action.payload.items[0] ', action.payload.items[0]);
      userDataBrand = (userDataBrand && userDataBrand.toLowerCase()) || null;

      console.log('userDataBrand is ', userDataBrand);

      switch (userDataBrand) {
        case 'audi': {
          console.log('userDataBrand is audi ');
          userBrand = 'au';
          break;
        }
        case 'seat': {
          console.log('userDataBrand is seat ');
          userBrand = 'se';
          break;
        }
        case 'skoda': {
          console.log('userDataBrand is skoda');
          userBrand = 'sk';
          break;
        }
        case 'volkswagen': {
          console.log('userDataBrand is vw');
          userBrand = 'vw';
          break;
        }
        case 'volkswagen commercial vehicles': {
          console.log('userDataBrand is cv ');
          userBrand = 'cv';
          break;
        }
      }
      //   userBrand = 'se';
      console.log('userBrand in reducer is ', userBrand);
      return {
        ...state,
        userIsSignedIn: true,
        userIsValidated: true,
        userData: action.payload.items,
        userName: userName,
        userPin: userPin,
        // userEmail: userEmail,
        userId: userId,
        userIntId: userIntId,
        dealerName: dealerName,
        userBrand: userBrand,
        userApiFetchParamsObj: userApiFetchParamsObj,
        lastUpdate: moment(),
        isLoading: false,
        error: null,
        dataErrorUrl: null,
        statusCode:
          (action.payload.statusCode && action.payload.statusCode) || null,
      };
    }
    // case Types.GET_USER_INVALID_CREDENTIALS: {
    //   //   console.log('action.payload is:', action.payload.error);
    //   return {
    //     ...state,
    //     userIsValidated: false,
    //     userIsValidated: false,
    //     isLoading: false,
    //     error: (action.payload.error && action.payload.error) || null,
    //     dataErrorUrl: null,
    //     statusCode:
    //       (action.payload.statusCode && action.payload.statusCode) || null
    //   };
    // }
    case Types.SET_USER_OUTDATED_CREDENTIALS: {
      //   console.log('action.payload is:', action.payload.error);
      return {
        ...state,
        userIsValidated: false,
      };
    }
    case Types.SET_USER_VALIDATED: {
      console.log('action.payload is:', action.payload.error);
      return {
        ...state,
        userIsSignedIn: true,
        userIsValidated: true,
      };
    }

    case Types.REVALIDATE_USER_CREDENTIALS: {
      const ageOfCredentialsLimit = 90;
      let now = moment();
      let revalidatedUser = false;
      console.log(
        'in revalidateUserCredentials reducer',
        action.payload && action.payload.calledBy && action.payload.calledBy
      );
      if (state.userIsSignedIn && state.userIsSignedIn === true) {
        if (state.lastUpdate) {
          console.log('now:', now);
          let ageOfCredentials = now.diff(state.lastUpdate, 'days');
          console.log('ageOfCredentials:', ageOfCredentials);
          if (ageOfCredentials <= ageOfCredentialsLimit) {
            revalidatedUser = true;
            console.log('ageOfCredentials good', ageOfCredentials);
          }
        }
      }
      console.log(
        'in revalidateUserCredentials, userIsValidated',
        revalidatedUser
      );
      return {
        ...state,
        // userIsValidated: revalidatedUser,
        userIsValidated: true,
      };
    }

    case Types.SIGN_OUT_USER_REQUEST: {
      console.log('action.is:', action.type);
      return {
        ...state,
        userIsSignedIn: false,
        userIsValidated: false,
        userData: [],
        isLoading: false,
        error: null,
        dataErrorUrl: null,
        statusCode: null,
      };
    }
    case Types.USER_ERROR: {
      console.log('action.payload starts');
      console.log(action.payload);
      console.log('action.payload ends');
      return {
        ...state,
        userIsSignedIn: false,
        userIsValidated: false,
        isLoading: false,
        error: (action.payload.error && action.payload.error) || null,
        statusCode:
          (action.payload.statusCode && action.payload.statusCode) || null,
        dataErrorUrl:
          (action.payload.dataErrorUrl && action.payload.dataErrorUrl) || null,
      };
    }
    default: {
      //   console.log(state);
      return state;
    }
  }
}
