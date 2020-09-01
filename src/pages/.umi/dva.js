import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'alert', ...(require('E:/毕业设计/qing/src/models/alert.js').default) });
app.model({ namespace: 'friends', ...(require('E:/毕业设计/qing/src/models/friends.js').default) });
app.model({ namespace: 'login', ...(require('E:/毕业设计/qing/src/models/login.js').default) });
app.model({ namespace: 'user', ...(require('E:/毕业设计/qing/src/models/user.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
