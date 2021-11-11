import Types from '../constants/Types';
import { getServiceMeasuresCountsObj } from '../helpers/serviceMeasures';
import { getDateDifference } from '../helpers/dates';

const defaultCounts = {
  redCount: 0,
  amberCount: 0,
  greenCount: 0,
  totalCount: 0,
};

const INITIAL_STATE = {
  serviceMeasuresItems: [],
  serviceMeasuresCounts: defaultCounts,
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

const getTimeToExpiry = (nowDate = null, expiryDate = null) => {
  let timeToExpiry = 0;

  //   console.log(
  //     '***************in getTimeToExpiry reducer nowDate',
  //     nowDate,
  //     'to',
  //     theToDate
  //   );

  if (expiryDate) {
    timeToExpiry = getDateDifference(expiryDate, nowDate);
  }
  //   console.log('expiryDate', expiryDate);
  //   console.log('££££££££ reducertimeToExpiry', timeToExpiry);

  return timeToExpiry;
};

const filterExpiredItems = (serviceMeasures) => {
  const nowDate = Date.now();

  let filteredServiceMeasuresArr = [];

  //   console.log('nowDate', nowDate);
  if (serviceMeasures && serviceMeasures.length > 0) {
    serviceMeasures.map((serviceMeasure) => {
      //   console.log(
      //     'in filterExpiredItems',
      //     serviceMeasure.menuText,
      //     serviceMeasure.expiryDate,
      //     getTimeToExpiry(fromDate, serviceMeasure.expiryDate)
      //   );
      if (
        !serviceMeasure.retailerStatus ||
        (serviceMeasure.retailerStatus &&
          serviceMeasure.retailerStatus !== 'c' &&
          serviceMeasure.retailerStatus !== 'C')
      ) {
        // console.log(
        //   serviceMeasure.menuText,
        //   serviceMeasure.status,
        //   serviceMeasure.retailerStatus
        // );
        if (
          serviceMeasure.expiryDate &&
          getTimeToExpiry(serviceMeasure.expiryDate, nowDate) >= 0
        ) {
          filteredServiceMeasuresArr.push(serviceMeasure);
        }
      }
    });
  }
  //   console.log(
  //     'reducertime;filterExpiredItems',
  //     serviceMeasures.length,
  //     'down to',
  //     filteredServiceMeasuresArr.length
  //   );
  return filteredServiceMeasuresArr;
};

export default function serviceMeasures(state = INITIAL_STATE, action) {
  //   console.log(Types);
  //   console.log('action.type is:', action.type);
  switch (action.type) {
    case Types.GET_SERVICE_MEASURES_START: {
      return {
        ...state,
        isLoading: true,
        error: null,
        dataErrorUrl: null,
        statusCode: null,
      };
    }
    case Types.SET_SERVICE_MEASURES_DISPLAY_TIMESTAMP: {
      //   console.log('date in state is', state.displayTimestamp);
      return {
        ...state,
        displayTimestamp: new Date(),
      };
    }
    case Types.GET_SERVICE_MEASURES_SUCCESS: {
      //   console.log('action.type is:', action.type);
      //   console.log(action.payload.items && action.payload.items);
      //   console.log('STATE', state);
      const filteredServiceMeasuresArr =
        (action.payload.items && filterExpiredItems(action.payload.items)) ||
        [];
      const serviceMeasuresCountsObj = getServiceMeasuresCountsObj(
        filteredServiceMeasuresArr
      );
      //   console.log(
      //     'in reducer serviceMeasuresCountsObj',
      //     serviceMeasuresCountsObj
      //   );

      return {
        ...state,
        // newsItems: [],
        serviceMeasuresItems: filteredServiceMeasuresArr,
        serviceMeasuresCounts: serviceMeasuresCountsObj,
        redCount: serviceMeasuresCountsObj.redCount,
        amberCount: serviceMeasuresCountsObj.amberCount,
        greenCount: serviceMeasuresCountsObj.greenCount,
        totalCount: serviceMeasuresCountsObj.totalCount,
        // serviceMeasuresItems: filterExpiredItems(serviceMeasuresDummyData),
        isLoading: false,
        error: null,
        dataErrorUrl: null,
        statusCode:
          (action.payload.statusCode && action.payload.statusCode) || null,
      };
    }
    case Types.EMPTY_SERVICE_MEASURES_REQUEST: {
      //   console.log(action.payload);
      //   console.log('reducer end data');
      return {
        ...state,
        serviceMeasuresItems: [],
        serviceMeasuresCounts: defaultCounts,
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
    case Types.SERVICE_MEASURES_ERROR: {
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
