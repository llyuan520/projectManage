import { message } from 'antd';
import { queryRule, removeRule, removeLotRule, addRule, updateRule } from '../services/project';

export default {
  namespace: 'project',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  reducers: {
        // pageNum:2, //当前页数
        // pageSize:2, //每页的数量
        // pages:4, //总页数
        // total:data.length, //总的记录数

    save(state, action) {
      // console.log('保存了 state 的变更，接下来将会进入 与 mapStateToProps 绑定了的组件',state, action.payload);
      // debugger
      return { 
        ...state, 
        data: action.payload,
       };
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryRule, payload);
      // console.log(data)
      // debugger
      if(code === 200){
        yield put({
          type: 'save',
          payload: data,
        });
      }else{
        message.error(msg)
      }
    },
    *add({ payload, callback }, { call, put }) {
      const { code, data, msg }= yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: data,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const { code, data, msg } = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: data,
      });
      if (callback) callback();
    },
    *removeLot({ payload, callback }, { call, put }) {
      const { code, data, msg } = yield call(removeLotRule, payload);
      yield put({
        type: 'save',
        payload: data,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { code, data, msg } = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: data,
      });
      if (callback) callback();
    },
  },
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     return history.listen(({ pathname, query }) => {
  //       if (pathname === '/project') {
  //         //console.log('history 变化，派发 dispatch');
  //         dispatch({ type: 'fetch' , payload: query});
  //       }
  //     });
  //   },
  // },
};