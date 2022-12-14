import Types from '../constants/Types';
import { getLtpLoansCountsObj } from '../helpers/ltpLoans';
const defaultCounts = {
  redCount: 0,
  amberCount: 0,
  greenCount: 0,
  totalCount: 0,
};

const INITIAL_STATE = {
  ltpLoansItems: [],
  ltpLoansCounts: defaultCounts,
  redCount: 0,
  amberCount: 0,
  greenCount: 0,
  totalCount: 0,
  isLoading: false,
  error: null,
  statusCode: null,
  dataErrorUrl: null,
  displayTimestamp: null,
};

const filterReturnedItems = (items) => {
  let filteredLtpLoansArr = [];
  //   console.log('nowDate', nowDate);

  if (items && items.length > 0) {
    items.map((item) => {
      //   console.log(
      //     'in filterExpiredItems',
      //     item.menuText,
      //     item.expiryDate,
      //     getTimeToExpiry(fromDate, item.expiryDate)
      //   );
      if (
        !(item.collectedDate && item.collectedDate.length > 0) &&
        !(item.collectionNumber && item.collectionNumber.length > 0)
      ) {
        filteredLtpLoansArr.push(item);
      }
    });
  }

  //   console.log(
  //     'reducertime;filterExpiredItems',
  //     items.length,
  //     'down to',
  //     filteredLtpLoansArr.length
  //   );
  return filteredLtpLoansArr;
};

export default function ltpLoans(state = INITIAL_STATE, action) {
  //   console.log(Types);
  //   console.log('action.type is:', action.type);
  switch (action.type) {
    case Types.GET_LTP_LOANS_START: {
      return {
        ...state,
        isLoading: true,
        error: null,
        dataErrorUrl: null,
        statusCode: null,
      };
    }
    case Types.SET_LTP_LOANS_DISPLAY_TIMESTAMP: {
      //   console.log('date in state is', state.displayTimestamp);
      const displayTime =
        action.payload && action.payload.displayTime
          ? action.payload.displayTime
          : null;

      //   console.log(
      //     'in ltp loans reducer set display',
      //     action.payload && action.payload
      //   );
      return {
        ...state,
        displayTimestamp: displayTime,
      };
    }
    case Types.GET_LTP_LOANS_SUCCESS: {
      //   console.log('action.type is:', action.type);
      //   console.log(action.payload.items && action.payload.items);
      const fetchTime =
        action.payload && action.payload.fetchTime
          ? action.payload.fetchTime
          : null;
      const filteredLtpLoansArr =
        (action.payload.items && filterReturnedItems(action.payload.items)) ||
        [];
      const ltpLoansCountsObj = getLtpLoansCountsObj(filteredLtpLoansArr);
      //   console.log('in reducer ltpLoansCountsObj', ltpLoansCountsObj);
      return {
        ...state,
        // newsItems: [],
        ltpLoansItems: filteredLtpLoansArr,
        ltpLoansCounts: ltpLoansCountsObj,
        redCount: ltpLoansCountsObj.redCount,
        amberCount: ltpLoansCountsObj.amberCount,
        greenCount: ltpLoansCountsObj.greenCount,
        totalCount: ltpLoansCountsObj.totalCount,
        fetchTime,
        isLoading: false,
        error: null,
        dataErrorUrl: null,
        statusCode:
          (action.payload.statusCode && action.payload.statusCode) || null,
      };
    }
    case Types.EMPTY_LTP_LOANS_REQUEST: {
      //   console.log(action.payload);
      //   console.log('reducer end data');
      return {
        ...state,
        ltpLoansItems: [],
        ltpLoansCounts: defaultCounts,
        redCount: 0,
        amberCount: 0,
        greenCount: 0,
        totalCount: 0,
        isLoading: false,
        error: null,
        dataErrorUrl: null,
        statusCode: null,
      };
    }
    case Types.LTP_LOANS_ERROR: {
      console.log('action.type is:', action.type);
      console.log('action.payload starts');
      console.log(action.payload);
      console.log('action.payload ends');
      return {
        ...state,
        isLoading: false,
        isSending: false,
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
