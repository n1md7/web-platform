import {UserRole, UserType} from '../../types';

export enum UserAction {
  reset = 'user-reset',
  infoUpdate = 'user-info-update',
}

export type UserActionType = {
  type: UserAction;
  data: UserType;
};

const defaultState: UserType = {
  id: -1,
  email: '',
  username: '',
  role: UserRole.basic,
};

const userInfo = (state: UserType = defaultState, action: UserActionType) => {
  const {type, data} = action;
  switch (type) {
    case UserAction.infoUpdate:
      return {
        ...state,
        ...data,
      };
    case UserAction.reset:
      return defaultState;
    default:
      return state;
  }
};

export default userInfo;
