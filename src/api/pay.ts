import request from './request'

// 获取当前用户所有订单信息
export function showOrderInfo() {
    return request({
        url: '/payment-center-service/pay/queryPayOrderInfo',
        method: 'GET'
    })
}

// 判断是否已经购买该课程
export function isPayCourse(courseId: any) {
    return request({
        url: `/payment-center-service/pay/isPayCourse/${courseId}`,
        method: 'GET'
    })
}

// 删除指定的订单
export function deleteOrder(orderId: any) {
    return request({
        url: `/payment-center-service/pay/deleteOrder/${orderId}`,
        method: 'DELETE'
    })
}