/**
 * @providesModule AuthTokenReducer
 */
'use strict';

import AuthTokenActions from 'AuthTokenActions';
import Flux from 'Flux';
import immutable from 'immutable';

const AuthTokenActionTypes = Flux.getActionTypes(AuthTokenActions);

const AuthTokenState = immutable.Record({
  idToken: null,
  refreshToken: null,
  accessToken: null,
});

export default Flux.createReducer(new AuthTokenState(), {
  [AuthTokenActionTypes.setAuthTokens](state, action) {
    return new AuthTokenState(action.payload);
  },

  [AuthTokenActionTypes.updateIdToken](state, action) {
    return state.set('idToken', action.payload.idToken);
  },

  [AuthTokenActionTypes.signOut](state, action) {
    return new AuthTokenState();
  },
}, 'authTokensReducer');
