import {combineReducers} from 'redux';
import user from './user';
import {UserType} from '../../types';

export interface RootReducer {
  user: UserType,
}

export default combineReducers({
  user,
});
