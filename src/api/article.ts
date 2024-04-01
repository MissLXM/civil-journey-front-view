import request from './request'

// 获取精选文章
export function showChoiceArticle(pageParams: any) {
    return request({
        url: '/article-center-service/front/article/queryCurationArticle',
        method: 'POST',
        data: pageParams
    })
}

// 获取热门学习笔记
export function showHotNoteArticle() {
    return request({
        url: '/article-center-service/front/article/queryHotNoteArticle',
        method: 'GET'
    })
}

// 获取热门解题技巧
export function showHotSkillArticle() {
    return request({
        url: '/article-center-service/front/article/queryHotSkillArticle',
        method: 'GET'
    })
}

// 获取所有文章
export function showAllArticle(articleParams: any) {
    return request({
        url: '/article-center-service/front/article/queryAllArticle',
        method: 'POST',
        data: articleParams
    })
}

// 文章浏览历史
export function showHistoryArticle(pageParams: any) {
    console.log(pageParams)
    return request({
        url: '/article-center-service/front/article/queryArticleHistory',
        method: 'POST',
        data: pageParams
    })
}

// 收藏文章展示
export function showCollectionArticle(pageParams: any) {
    return request({
        url: '/article-center-service/front/article/queryCollectionArticle',
        method: 'POST',
        data: pageParams
    })
}

// 收藏文章操作
export function collectionArticleEvent(articleId: any) {
    return request({
        url: `/article-center-service/front/article/articleCollection/${articleId}`,
        method: 'GET'
    })
}

// 该用户已发布文章展示
export function showUserReleaseArticle(pageParams: any) {
    return request({
        url: '/article-center-service/front/article/queryArticleRelease',
        method: 'POST',
        data: pageParams
    })
}

// 根据文章ID查看文章详细信息
export function showArticleInfo(articleId: any) {
    return request({
        url: `/article-center-service/front/article/queryArticleDetail/${articleId}`,
        method: 'GET'
    })
}

// 根据发布者ID查询拥有勋章信息
export function showMedalInfoByUserId(userId: any) {
    return request({
        url: `/article-center-service/front/article/queryUserMedal/${userId}`,
        method: 'GET'
    })
}

// 点赞/取消点赞文章
export function likeOrNoLikeArticle(articleId: any) {
    return request({
        url: `/article-center-service/front/article/articleLike/${articleId}`,
        method: 'GET'
    })
}

// 根据文章ID查询评论信息
export function commentInfoByArticleId(articleId: any) {
    return request({
        url: `/article-center-service/front/article/queryArticleAllComments/${articleId}`,
        method: 'GET'
    })
}

// 收藏/取消收藏文章
export function CollectionOrNoCollectionArticle(articleId: any) {
    return request({
        url: `/article-center-service/front/article/articleCollection/${articleId}`,
        method: 'GET'
    })
}

// 根据文章ID发送文章评论
export function sendCommentByArticleId(articleCommentsParams: any) {
    return request({
        url: `/article-center-service/front/article/articleComments`,
        method: 'POST',
        data: articleCommentsParams
    })
}

// 发布文章操作
export function releaseArticle(articleParams: any) {
    return request({
        url: '/article-center-service/front/article/articleRelease',
        method: 'POST',
        data: articleParams
    })
}

// 删除文章操作
export function deleteArticle(articleId: any) {
    return request({
        url: `/article-center-service/front/article/deleteArticle/${articleId}`,
        method: 'DELETE'
    })
}