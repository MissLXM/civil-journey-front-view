import request from './request'

// 首页展示视频
export function showVideo() {
    return request({
        url: '/course-center-service/front/video/homeShowVideo',
        method: 'GET'
    })
}

// 展示视频历史记录
export function showVideoHistory(pageParams: any) {
    return request({
        url: '/course-center-service/front/video/queryVideoHistory',
        method: 'POST',
        data: pageParams
    })
}

// 展示视频合集信息
export function showVideoCollectionInfo(courseParams: any) {
    return request({
        url: '/course-center-service/front/video/queryVideoCollection',
        method: 'POST',
        data: courseParams
    })
}

// 展示视频详细信息
export function showVideoInfo(videoId: any) {
    return request({
        url: `/course-center-service/front/video/queryVideoInfo/${videoId}`,
        method: 'GET'
    })
}

// 展示视频评论信息
export function showVideoComments(videoId: any) {
    return request({
        url: `/course-center-service/front/video/queryCommentInfo/${videoId}`,
        method: 'GET'
    })
}

// 点赞/取消点赞视频
export function likeOrNoLikeVideo(videoId: any) {
    return request({
        url: `/course-center-service/front/video/videoLikeOrNoLike/${videoId}`,
        method: 'GET'
    })
}

// 发表视频评论
export function sendVideoComments(videoCommentsParams: any) {
    return request({
        url: 'course-center-service/front/video/videoComments',
        method: 'POST',
        data: videoCommentsParams
    })
}

// 记录视频播放时长
export function insertVideoSchedule(scheduleParams: any) {
    return request({
        url: 'course-center-service/front/video/insertVideoSchedule',
        method: 'POST',
        data: scheduleParams
    })  
}


// 删除评论信息
export function deleteVideoComment(commentId: any) {
    return request({
        url: `/course-center-service/front/video/deleteVideoComment/${commentId}`,
        method: 'DELETE'
    })
}