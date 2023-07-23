export interface InitialStateSchema {
  busy: Boolean;
  authentication: Object;
  footer: Object;
}

export const initialState: InitialStateSchema = {
  busy: false,
  authentication: {
    isLoggedIn: false,
    token: null
  },
  footer: {}
}
