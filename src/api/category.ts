import request from './request'

export function showCategory() {
    return request({
        url: '/chart-center-service/front/category/getCategoryInfo',
        method: 'GET'
    })
}