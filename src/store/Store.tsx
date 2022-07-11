import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { RootReducer } from "../reducers/RootReducer";

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
  }

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(
    RootReducer,
    composeEnhancers(
        applyMiddleware(thunk)
    )
);

export type RootState = ReturnType<typeof store.getState>