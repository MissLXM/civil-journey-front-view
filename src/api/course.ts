import request from './request'

// 删除课程
export function deleteCourseInfo(courseId: any) {
    return request({
        url: `/course-center-service/front/course/deleteCourseInfo/${courseId}`,
        method: 'DELETE'
    })
}

// 发布课程
export function releaseCourseInfo(courseParams: any) {
    return request({
        url: '/course-center-service/front/course/insertCourseInfo',
        method: 'POST',
        data: courseParams
    })
}

// 展示已发布课程信息
export function showReleaseCourseInfo(pageParams: any) {
    return request({
        url: '/course-center-service/front/course/queryTeacherReleaseCourse',
        method: 'POST',
        data: pageParams
    })
}

// 展示收藏课程信息
export function showCollectionCourseInfo(pageParams: any) {
    return request({
        url: '/course-center-service/front/course/queryCollectionCourse',
        method: 'POST',
        data: pageParams
    })
}
 
// 展示课程信息
export function showCourseInCourseView(courseParams: any) {
    return request({
        url: '/course-center-service/front/course/showCourseInCourseView',
        method: 'POST',
        data: courseParams
    })
}

// 首页展示课程
export function showCourse(courseSearch: any, pageParams: any) {
    return request({
        url: '/course-center-service/front/course/homeShowCourse',
        method: 'POST',
        params: {
            courseName: courseSearch
        },
        data: pageParams
    })
}

// 课程详细信息
export function showCourseInfo(courseId: any) {
    return request({
        url: `/course-center-service/front/course/queryCourseInfo/${courseId}`,
        method: 'GET'
    })
}

// 点赞/取消点赞课程
export function likeOrNoLikeCourse(courseId: any) {
    return request({
        url: `/course-center-service/front/course/courseLikeOrNoLike/${courseId}`,
        method: 'GET'
    })
}

// 收藏/取消收藏课程
export function collectionOrNoCollectionCourse(courseId: any) {
    return request({
        url: `/course-center-service/front/course/courseCollectionOrNoCollection/${courseId}`,
        method: 'GET'
    })
}