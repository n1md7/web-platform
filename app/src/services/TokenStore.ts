import {configureStore} from '@reduxjs/toolkit'

type State = {
  token: string | null;
  baseUrl: string | null;
}

type Payload = {
  token?: string;
  baseUrl?: string;
};

type Action = {
  type: string;
  payload: Payload
}

const initialState = {
  token: null,
  baseUrl: null,
};

enum Type {
  update = 'update'
}

const tokenReducer = (state: State = initialState, action: Action) => {
  if (action.type === Type.update) {
    return {
      ...state,
      ...action.payload
    };
  }

  // otherwise return the existing state unchanged
  return state;
};

export const actionUpdate = (payload: Payload) => ({
  type: Type.update,
  payload
});

const store = configureStore({reducer: tokenReducer});

export default store;
