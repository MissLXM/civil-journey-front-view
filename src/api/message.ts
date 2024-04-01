import request from './request'

// 展示考试时间
export function showExamTime() {
    return request({
        url: '/message-center-service/front/message/getExamTimeMessage',
        method: 'GET'
    })
}

// 展示招考信息
export function showExamMessage() {
    return request({
        url: '/message-center-service/front/message/getExamMessage',
        method: 'GET'
    })
}

// 获取资讯详细信息
export function showMessageInfo(technicalId: any) {
    return request({
        url: `/message-center-service/front/message/getMessageInfoById/${technicalId}`,
        method: 'GET'
    })
}