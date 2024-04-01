import request from './request'

// 获取用户通知信息
export function showUserNotice(pageParams: any) {
    return request({
        url: '/feedback-center-service/front/notice/getUserNotice',
        method: 'POST',
        data: pageParams
    })
}

// 用户通知已读
export function updateNoticeStatus(noticeUserId: any) {
    return request({
        url: `/feedback-center-service/front/notice/updateUserNoticeStatus/${noticeUserId}`,
        method: 'GET'
    })
}

// 提交意见信息
export function submitOpinion(username: any, message: any) {
    return request({
        url: `/feedback-center-service/front/opinion/submitOpinion/${username}/${message}`,
        method: 'POST'
    })
}