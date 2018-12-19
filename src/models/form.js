import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '../services/form';

export default {
  namespace: 'form',

  state: {
      
  },

  effects: {
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    // saveStepFormData(state, { payload }) {
    //   return {
    //     ...state,
    //     step: {
    //       ...state.step,
    //       ...payload,
    //     },
    //   };
    // },
  },
};
