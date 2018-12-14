import { stringify } from 'qs';
import { request } from 'utils'

export async function queryRule(params) {
    return request(`/api/list`, {
        method: 'GET',
        data: params
    })
    //return request(`/api/list?${stringify(params)}`);
}

export async function removeRule(params) {
    return request('/api/list', {
        method: 'POST',
        data: {
        ...params,
        method: 'delete',
        },
    });
}

export async function removeLotRule(params) {
    return request('/api/list', {
        method: 'POST',
        data: {
        ...params,
        method: 'lotDelete',
        },
    });
}


export async function addRule(params) {
    return request('/api/list', {
        method: 'POST',
        data: {
        ...params,
        method: 'post',
        },
    });
}

export async function updateRule(params) {
    return request('/api/list', {
        method: 'POST',
        data: {
        ...params,
        method: 'update',
        },
    });
}