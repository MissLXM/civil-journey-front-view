<template>
    <!-- 文章视图 -->
    <div 
        class="article-info-view"
    >
        <!-- 文章容器 -->
        <div class="article-info-container">
            <!-- 左侧布局 -->
            <div class="article-info-left-container">
                <el-affix :offset="80">
                    <!-- 用户信息容器 -->
                    <div class="user-info-container">
                        <!-- 用户基本信息容器 -->
                        <div class="user-info-content-container">
                            <el-avatar 
                                :size="60"
                                :src="articleInfo.creatorAvatar"
                            />
                            <div class="user-base-info-container">
                                <div class="user-name">{{ articleInfo.creatorName }}</div>
                                <div class="user-tag">
                                    <el-image src="/src/assets/img/auth-icon.png"/>
                                    <div class="user-tag-text">发布者</div>
                                </div>
                            </div>
                        </div>
                        <!-- 用户勋章容器 -->
                        <div class="user-medal-container" v-if="medalInfo != undefined">
                            <div 
                                :key="index"
                                class="medal-container"
                                v-for="(item, index) in medalInfo"
                            >
                                <el-image
                                    :src="item.medalIcon"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- 热门文章容器 -->
                    <div class="hot-article-container">
                        <!-- 热门文章 -->
                        <div class="hot-article-sort-container">
                            <div class="hot-article-container-header">
                                <div class="hot-article-title">热门文章</div>
                            </div>
                            <div class="hot-article-body">
                                <div 
                                    :key="index"
                                    class="hot-article-content"
                                    @click="reLoad(item.articleId)"
                                    v-for="(item, index) in hotArticle"
                                >
                                    <div class="hot-article-content-title">{{ item.articleTitle }}</div>
                                    <div class="hot-article-content-view">
                                        <svg-icon icon-class="view" class="view-icon"/> 
                                        <div class="view-number">{{ item.browseNumber }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-affix>
            </div>

            <!-- 右侧布局 -->
            <div class="article-info-right-container">

                <!-- 文章内容容器 -->
                <div class="article-content-container">
                    
                    <!-- 文章内容顶部 -->
                    <div class="article-content-header-container">
                        <div class="article-title">{{ articleInfo.articleTitle }}</div>
                        <div class="article-base-info-container">
                            <el-tag type="warning"  class="tag-mr">{{ articleInfo.articleType }}</el-tag>
                            <el-tag type="warning"  class="tag-mr">{{ articleInfo.categoryName }}</el-tag>
                            <el-tag type="info" class="tag-mr">{{ articleInfo.createTime }}</el-tag>
                            <div class="article-view-number-container">
                                <svg-icon icon-class="view" class="view-icon"/>
                                <div class="article-view-number">{{ articleInfo.browseNumber }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 文章内容 -->
                    <div class="article-content-body-container">
                        <div
                            class="article-content-body"
                            v-html="articleInfo.articleContent"
                        />
                        <div class="article-sundry-container">
                            <div class="sundry-number-container">
                                <svg-icon 
                                    
                                    @click="likeEvent"
                                    icon-class="course-praise"
                                    v-if="articleInfo.isLike == 1" 
                                />
                                <svg-icon 
                                    v-else
                                    style="color: #999;"
                                    @click="likeEvent"
                                    icon-class="course-not-praise" 
                                />
                                <span>{{ articleInfo.likeNumber }}</span>
                                <svg-icon 
                                    @click="CollectionEvent"
                                    icon-class="course-collection"
                                    v-if="articleInfo.isCollection == 1" 
                                />
                                <svg-icon 
                                    v-else
                                    style="color: #999;"
                                    @click="CollectionEvent"
                                    icon-class="course-not-collection" 
                                    
                                />
                                <span>{{ articleInfo.collectionNumber }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 文章评论容器 -->
                <div class="comment-container">
                    <div class="comment-title">
                        评论区
                    </div>
                    <div class="comment-info-container">
                        <div 
                            :key="index"
                            class="comment-info-item"
                            v-for="(item, index) in commentInfo"
                        >
                            <!-- 左侧布局 -->
                            <div class="comment-info-left-container">
                                <el-avatar 
                                    :size="50"
                                    :src="item.commenterAvatar"
                                />
                                <div class="informer-name">{{ item.commenterName }}</div>
                            </div>

                            <!-- 右侧布局 -->
                            <div class="comment-info-right-container">
                                <div class="comment-time">{{ item.commentTime }}</div>
                                <div class="comment-content">
                                    {{ item.commentContent }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="comment-write-container">
                        <div class="comment-write-title">
                            <div style="margin-top: 0.4rem;">写评论</div>
                            <el-button @click="sendCommentEvent">发送评论</el-button>
                        </div>
                        <!-- 菜单栏布局 -->
                        <div class="comment-write">
                            <V3Emoji 
                                :recent="true"
                                v-model="comment"
                                :textArea="true"
                                :options-name="optionsName"
                                :disable-group="disableGroup"
                            />
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部信息 -->
        <div class="bottom-view">
            <div class="platform-explain">
                <div class="platform-explain-title">公途学堂</div>
                <div class="platform-explain-text">Copyright ©2023-2024 闽江学院 王建华 版权所有</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import  V3Emoji  from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
    showArticleInfo, 
    showChoiceArticle, 
    likeOrNoLikeArticle, 
    showMedalInfoByUserId, 
    commentInfoByArticleId,
    sendCommentByArticleId,
    CollectionOrNoCollectionArticle 
} 
from '@/api/article';



// 写评论
const comment = ref()
// 勋章信息
const medalInfo = ref()
// 路由信息
const route = useRoute()
// 热门文章
const hotArticle = ref([
    {
        articleId: 0,
        browseNumber: 0,
        articleTitle: '',
    }
])
// 评论信息
const commentInfo = ref()
// 文章信息
const articleInfo = ref({
    userId: 0,
    isLike: 0,
    articleId: 0,
    isCuration: 0,
    likeNumber: 0,
    createTime: '',
    browseNumber: 0,
    isCollection: 0,
    creatorName: '',
    articleType: '',
    articleTitle: '',
    articleImage: '',
    categoryName: '',
    creatorAvatar: '',
    articleContent: '',
    collectionNumber: 0,
})
// 中文的表情组
const optionsName = ref({
    'Smileys & Emotion': '笑脸&表情',
    'Food & Drink': '食物&饮料',
    'Animals & Nature': '动物&自然',
    'Travel & Places': '旅行&地点',
    'People & Body': '人物&身体',
    Objects: '物品',
    Symbols: '符号',
    Flags: '旗帜',
    Activities: '活动'
})
// 禁用的表情组
const disableGroup = ref([
    '食物&饮料',
    '动物&自然',
    '旅行&地点',
    '人物&身体',
    '物品',
    '符号',
    '旗帜',
    '活动'
])
 


// 挂载函数
onMounted(() => {
    // 加载热门文章
    loadHotArticle()
    // 加载评论信息
    loadCommentInfo()
    // 加载文章信息
    loadArticleInfo(route.params.articleId)
})

// 点赞事件
function likeEvent() {
    likeOrNoLikeArticle(articleInfo.value.articleId).then(response => {
        if (response.data.code === 200) {
            showArticleInfo(route.params.articleId).then(response => {
                if (response.data.code === 200) {
                    articleInfo.value = response.data.data

                }
            })
        }
    })
}

// 收藏事件
function CollectionEvent() {
    CollectionOrNoCollectionArticle(articleInfo.value.articleId).then(response => {
        if (response.data.code === 200) {
            showArticleInfo(route.params.articleId).then(response => {
                if (response.data.code === 200) {
                    articleInfo.value = response.data.data

                }
            })
        }
    })
}

// 加载热门文章
function loadHotArticle() {
    showChoiceArticle({ currentPage: 1, pageSize: 10 }).then(response => {
        if (response.data.code === 200) {
            hotArticle.value = response.data.data.records
        }
    })
}

// 加载评论信息
function loadCommentInfo() {
    commentInfoByArticleId(route.params.articleId).then(response => {
        if (response.data.code === 200) {
            commentInfo.value = response.data.data
        }
    })
}

// 发送评论事件 
function sendCommentEvent() {
    if (comment.value != null || comment.value != '') {
        const articleCommentsParams = ref({
            articleId: route.params.articleId,
            commentContent: comment.value
        })
        sendCommentByArticleId(articleCommentsParams.value).then(response => {
            if (response.data.code === 200) {
                // 重新加载评论信息
                loadCommentInfo()
                // 清空
                comment.value = null
            }
        })
    }  
}

// 重新加载界面
function reLoad(articleId: any) {
    // 加载热门文章
    loadHotArticle()
    // 加载评论信息
    loadCommentInfo()
    // 加载文章信息
    loadArticleInfo(articleId)
}

// 加载文章信息
function loadArticleInfo(articleId: any) {
    showArticleInfo(articleId).then(response => {
        if (response.data.code === 200) {
            articleInfo.value = response.data.data

            // 获取勋章信息
            showMedalInfoByUserId(articleInfo.value.userId).then(response => {
                if (response.data.code === 200) {
                    console.log(response.data.data)
                    medalInfo.value = response.data.data
                }
            })
        }
    })
}


</script>

<style lang="less" scoped>
// 文章视图
.article-info-view {
    width: 100%; 
    height: 980px;
    margin-top: 0.4rem; 

    // 文章容器
    .article-info-container {
        width: 74%;
        display: flex;
        margin-top: 2rem;
        margin-left: 14.5rem;

        // 左侧布局
        .article-info-left-container {
            width: 21%;
            margin-right: 1rem;

            // 用户信息容器
            .user-info-container {
                border-radius: 0.3rem;
                background-color: #fff;
                // 用户基本信息容器
                .user-info-content-container {
                    padding: 1rem;
                    display: flex;

                    // 基本信息容器
                    .user-base-info-container {
                        margin-left: 0.5rem;
                        
                        // 发布者名称
                        .user-name {
                            font-size: 14px;
                            margin-top: 0.7rem;
                            margin-bottom: 0.5rem;
                        }

                        // 标签
                        .user-tag {
                            display: flex;

                            .el-image {
                                height: 1rem;
                                width: 0.8rem;
                            }

                            .user-tag-text {
                                color: #999;
                                font-size: 12px;
                                margin-top: 0.15rem;
                                margin-left: 0.3rem;
                            }
                        }
                        
                    }
                }

                // 用户勋章容器
                .user-medal-container {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    padding-top: 1rem;
                    padding-left: 0.2rem;
                    justify-content: flex-start;
                    border-top: 1px solid #eee;
                    
                    .el-image {
                        width: 2.5rem;
                        height: 2.5rem;
                        margin-bottom: 0.5rem;
                    }
                }

            }

            // 热门文章
            .hot-article-container {
                margin-top: 1rem;
                // 热门排行
                .hot-article-sort-container {
                    width: 100%; 
                    height: 25rem; 
                    border-radius: 5px;
                    margin-bottom: 1rem;
                    background-color: #fff;
                    box-shadow: var(--el-box-shadow-light);

                    // 热门文章顶部布局
                    .hot-article-container-header {
                        color: #fff;
                        margin-bottom: 2vh;
                        font-weight: bolder;
                        padding: 0.6vw 0.8vw;
                        border-radius: 3px 3px 0 0;
                        background-color: #f6bb51;

                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;


                    }

                    // 热门文章内容布局
                    .hot-article-body {
                        width: 13vw;
                        padding-left: 1vw;
                        border-radius: 3px 3px 0 0;
                        
                        // 热门文章内容
                        .hot-article-content {
                            margin-bottom: 1rem;

                            display: flex;
                            flex-wrap: wrap;
                            justify-content: space-between;

                            // 热门文章文本
                            .hot-article-content-title {
                                width: 12rem;
                                cursor: pointer;
                                font-size: 14px;
                                overflow: hidden;
                                display: -webkit-box;
                                -webkit-line-clamp: 1;
                                text-overflow: ellipsis;
                                -webkit-box-orient: vertical;
                            }

                            // 热门文章文本(悬停)
                            .hot-article-content-title:hover {
                                text-decoration: underline;
                            }

                            // 热门文章浏览量
                            .hot-article-content-view {
                                display: flex;
                                font-size: 12px;

                                // 图标
                                .view-icon {
                                    zoom: 0.8;
                                    margin-right: 0.5rem;
                                }

                                // 数量
                                .view-number {
                                    margin-top: 0.05rem;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 右侧布局
        .article-info-right-container {
            width: 78%;
            font-style: normal;
            font-family: -apple-system, system-ui, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial;
        
            // 文章内容容器
            .article-content-container {
                border-radius: 0.3rem;
                background-color: #fff;

                // 文章内容顶部容器
                .article-content-header-container {
                    padding-left: 2rem;
                    padding-bottom: 0.9rem;
                    border-bottom: 1px solid #ddd;
                    
                    // 文章标题
                    .article-title {
                        font-size: 32px;
                        font-weight: 600;
                        color: #252933;
                        line-height: 32px;
                        padding-top: 2rem;
                    }

                    // 文章基础信息
                    .article-base-info-container {
                        display: flex;
                        font-size: 14px;
                        font-weight: 400;
                        color: #8a919f;
                        line-height: 22px;
                        margin-top: 1.2rem;
                        letter-spacing: 0.05rem;
                        
                        // 标签间距
                        .tag-mr {
                            margin-right: 1rem;
                        }

                        // 观看数量
                        .article-view-number-container {
                            display: flex;
                            margin-top: 0.05rem;
                            .article-view-number {
                                margin-left: 0.5rem;
                            }
                        }
                    }
                }

                // 文章内容容器
                .article-content-body-container {
                    
                    // 文章内容
                    .article-content-body {
                        padding: 2rem;
                        padding-top: 1rem;
                        min-height: 40rem;
                        font-size: 14px;
                        color: #2b2b2b;
                        font-weight: 400;
                        line-height: 25px;
                        font-style: normal;
                        font-family: -apple-system, system-ui, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial;
                    }

                    // 视频综合按钮
                    .article-sundry-container {
                        width: 98.5%;
                        height: 2.3rem;
                        margin-top: 0.6rem;
                        padding-left: 1rem;
                        padding-bottom: 0.6rem;
                        border-top: 1px solid #ddd;

                        .sundry-number-container {
                            display: flex;
                            margin-top: 0.8rem;
                            align-items: center;
                            .svg-icon {
                                width: 22px;
                                height: 22px;
                                margin-right: 0.5rem;

                                &:first-child {
                                    margin-left: 1rem;
                                }
                            }

                            span {
                                font-size: 14px;
                                margin-top: 0.15rem;
                                margin-right: 3rem;
                            }
                        }
                    }
                }
            }

            // 评论内容容器
            .comment-container {
                margin-top: 1rem;
                margin-bottom: 5rem;
                border-radius: 0.3rem;
                background-color: #fff;

                .comment-title {
                    height: 2.5rem;
                    font-size: 20px;
                    font-weight: 400;
                    line-height: 34px;
                    padding-left: 1rem;
                    padding-top: 0.5rem;
                    margin-bottom: 1rem;
                    border-bottom: 1px solid #ddd;
                }

                // 评论信息容器
                .comment-info-container {
                    margin-left: 1rem;
                    // 评论信息元素
                    .comment-info-item {
                        width: 98%;
                        height: 6rem;
                        display: flex;
                        margin-bottom: 1rem;
                        border-radius: 0.5rem;
                        background-color: #eee;

                        // 左侧布局
                        .comment-info-left-container {
                            width: 7.5rem;
                            height: 6rem;

                            // 头像
                            .el-avatar {
                                text-align: center;
                                margin-top: 0.7rem;
                                margin-left: 1.3rem;
                                margin-bottom: 0.4rem;
                            }

                            // 文本
                            .informer-name {
                                font-size: 12px;
                                text-align: center;
                            }
                        }

                        // 右侧布局
                        .comment-info-right-container {
                            width: 75rem;
                            font-size: 14px;
                            margin-top: 0.8rem;
                            margin-right: 1.5rem;
                            font-style: normal;
                            font-family: "Microsoft YaHei", "Microsoft Sans Serif", "Microsoft SanSerf", "微软雅黑";

                            // 时间
                            .comment-time {
                                color: #999;
                                font-size: 12px;
                                font-weight: 400;
                                line-height: 22px;
                                margin-top: 0.01rem;
                                margin-left: 0.5rem;
                            }


                            // 内容
                            .comment-content {
                                color: #666;
                                cursor: pointer;
                                text-indent: 1em;
                                font-weight: 400;
                                line-height: 19px;
                                margin-top: 0.3rem;

                                overflow: hidden;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                text-overflow: ellipsis;
                                -webkit-box-orient: vertical;
                            }
                        }
                    }

                }

                // 写评论容器
                .comment-write-container {
                    padding: 1rem;
                    .comment-write-title {
                        display: flex;
                        margin-top: 2rem;
                        margin-left: 0.1rem;
                        margin-bottom: 0.8rem;
                        padding-bottom: 0.5rem;
                        justify-content: space-between;
                        border-bottom: 1px solid #ddd;


                        .el-button {
                            width: 5rem;
                            height: 1.7rem;
                            font-size: 10px;
                            margin-top: 0.2rem;
                        }
                    }

                    // 评论布局
                    .comment-write {

                        :deep(.emoji-textarea textarea) {
                            border: 1px solid #ddd;
                        }
                        :deep(.emoji-textarea textarea:focus) {
                            border: 1px solid #ee9741;
                        }
                    }
                }

                // 评论载入
                .comment-loading {
                    margin: 2rem 0;
                }
            }
        }
    }

    // 底部信息布局
    .bottom-view {
        height: 6rem;
        display: flex;
        justify-content: center;
        background-color: #333;

        // 平台介绍
        .platform-explain {
            
            // 平台标题
            .platform-explain-title {
                color: #fff;
                font-size: 14px;
                font-weight: 400;
                line-height: 18px;
                font-style: normal;
                font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif;;

                height: 3rem; 
                display: flex; 
                align-items: center;
                justify-content: center;
            }

            // 版权说明
            .platform-explain-text {
                color: rgba(255, 255, 255, 0.6);
                font-size: 12px;
                font-weight: 400;
                line-height: 15px;
                font-style: normal;
                font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif;;

                display: flex; 
                height: 1.4rem; 
                align-items: center;
            }
        }
    }
}
</style>