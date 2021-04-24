import {UserAction, UserActionType} from '../reducers/user';
import {UserType} from '../../types';
import {Dispatch} from 'react';


export const updateUserInfo = (userInfo: UserType) => (dispatch: Dispatch<UserActionType>) => {
  return dispatch({
    type: UserAction.infoUpdate,
    data: userInfo,
  });
};


