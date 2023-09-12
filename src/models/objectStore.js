import { listObjectStores, getObjectStore, createObjectStore, deleteObjectStore } from '../services/objectStore'
import { wsChanges, updateState } from '../utils/websocket'
import queryString from 'query-string'
import { enableQueryData } from '../utils/dataDependency'

export default {
  namespace: 'objectstorage',
  state: {
    ws: null,
    data: [],
    selected: {},
    resourceType: 'objectstore',
    socketStatus: 'closed',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (enableQueryData(location.pathname, 'objectstore')) {
          dispatch({
            type: 'query',
            payload: location.pathname.startsWith('/objectstore') ? queryString.parse(location.search) : {},
          })
        }
      })
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const data = yield call(listObjectStores, payload)
      yield put({ type: 'listObjectStores', payload: { ...data } })
    },
    *get({ payload }, { call, get }) {
      const data = yield call(getObjectStore, payload)
      yield get({ type: 'getObjectStore', payload: { ...data } })
    },
    *create({ payload, callback }, { call, put }) {
      yield call(createObjectStore, payload)
      if (callback) callback()
      yield put({ type: 'quey' })
    },
    *delete({ payload, callback }, { call, put }) {
      yield call(deleteObjectStore, payload)
      if (callback) callback()
      yield put({ type: 'query' })
    },
    *bulkDelete({ payload, callback }, { call, put }) {
      if (payload && payload.length > 0) {
        yield payload.map(item => call(deleteObjectStore, item))
      }
      if (callback) callback()
      yield put({ type: 'query' })
    },
    *startWS({ payload }, { select }) {
      let ws = yield select(state => state.objectstorage.ws)
      if (ws) {
        ws.open()
      } else {
        wsChanges(payload.dispatch, payload.type, '1s', payload.ns)
      }
    },
    // eslint-disable-next-line no-unused-vars
    *stopWS({ payload }, { select }) {
      let ws = yield select(state => state.objectstorage.ws)
      if (ws) {
        ws.close(1000)
      }
    },
  },
  reducers: {
    listObjectStores(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    updateBackground(state, action) {
      return updateState(state, action)
    },
    updateSocketStatus(state, action) {
      return { ...state, socketStatus: action.payload }
    },
    updateWs(state, action) {
      return { ...state, ws: action.payload }
    },
  },
}
