import * as Realm from "realm-web";

const AuthApi = {
  init: async () => {
    const app = new Realm.App({ id: 'hunt-application-sync-nuthi' })
    const credentials = Realm.Credentials.anonymous();
    await app.logIn(credentials);
    return app;
  },
}

export default AuthApi;