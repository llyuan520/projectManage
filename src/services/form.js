import { request } from 'utils'

export async function fakeSubmitForm(params) {
    return request('/api/forms', {
      method: 'POST',
      body: params,
    });
}