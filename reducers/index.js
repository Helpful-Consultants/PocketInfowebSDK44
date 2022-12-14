import { combineReducers } from 'redux';
import UserReducer from './user';
import UsersReducer from './users';
import NewsReducer from './news';
import LtpReducer from './ltp';
import LtpLoansReducer from './ltpLoans';
import OdisReducer from './odis';
import StatsReducer from './stats';
import DealerWipsReducer from './dealerWips';
import DealerToolsReducer from './dealerTools';
import ServiceMeasuresReducer from './serviceMeasures';
import CalibrationExpiryReducer from './calibrationExpiry';
import BackgroundDataReducer from './backgroundData';

export default combineReducers({
  users: UsersReducer,
  user: UserReducer,
  news: NewsReducer,
  ltp: LtpReducer,
  ltpLoans: LtpLoansReducer,
  odis: OdisReducer,
  stats: StatsReducer,
  dealerTools: DealerToolsReducer,
  dealerWips: DealerWipsReducer,
  serviceMeasures: ServiceMeasuresReducer,
  calibrationExpiry: CalibrationExpiryReducer,
  backgroundData: BackgroundDataReducer,
});
