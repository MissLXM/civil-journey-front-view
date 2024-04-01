import request from './request'

// 展示轮播图
export function showBanner() {
    return request({
        url: '/chart-center-service/front/banner/showBanner',
        method: 'GET'
    })
}

