<template>
    <!-- 课程视频视图 -->
    <div 
        class="course-video-play-view"
    >
        <!-- 课程视频容器 -->
        <div class="course-video-play-container">
            <!-- 课程视频顶部容器 --> 
            <div class="course-video-play-header-container">
                <!-- 左侧容器 -->
                <div class="course-video-play-header-left-container">
                    <div class="video-title">
                        {{ videoInfo.videoName }}
                    </div>
                    <!-- 综合信息容器 -->
                    <div class="video-sundry-number-container">
                        <div class="number-container">
                            <svg-icon icon-class="view" class="sundry-svg-item"/>
                            <div class="view-number-text">{{ videoInfo.browseNumber }}</div>
                        </div>
                        <div class="number-container">
                            <svg-icon icon-class="course-praise" class="sundry-svg-item"/>
                            <div class="view-number-text">{{ videoInfo.likeNumber }}</div>
                        </div>
                        <div class="time-container">
                            {{ videoInfo.createTime }}
                        </div>
                        <div class="copyright-container">
                            未经作者授权,禁止转载
                        </div>
                    </div>
                    <div class="video-play-container">
                        <!-- 视频跳转到历史播放进度、持续获取视频进度 -->
                        <video-player
                            @play="onPlayerPlay"
                            @ready="onPlayerReadied"
                            :options="playerOptions"
                            :src="videoInfo.videoLink"
                            :poster="videoInfo.videoImage"
                            class="vjs-big-play-centered"
                            @timeupdate="onPlayerTimeupdate"
                            :readiedTime="videoInfo.videoDuration"
                        />
                    </div>
                    <!-- 视频综合按钮 -->
                    <div class="video-sundry-container">
                        <div class="sundry-number-container">
                            <svg-icon 
                                @click="videoLikeEvent"
                                icon-class="course-praise"
                                v-if="videoInfo.isLike == 1" 
                            />
                            <svg-icon 
                                v-else 
                                style="color: #999;"
                                @click="videoLikeEvent"
                                icon-class="course-not-praise" 
                            />
                            <span>{{ videoInfo.likeNumber }}</span>
                            <div @click="reLoad" v-if="isReLoad" style="cursor: pointer;">视频存在记录,是否重新播放?</div>
                        </div>
                    </div>
                </div>

                <!-- 右侧容器 -->
                <div class="course-video-play-header-right-container">
                    <!-- 讲师信息 -->
                    <div 
                        @click="showTeacherDialog"
                        class="teacher-base-info-container"
                    >
                        <div class="teacher-avatar">
                            <el-avatar 
                                :size="55"
                                :src="courseInfo.creatorAvatar"
                            />
                        </div>
                        <div class="teacher-info">
                            <div class="teacher-name">
                                <div class="teacher-name-text">{{ courseInfo.creatorName }}</div>
                                <el-tag type="warning">发布者</el-tag>
                            </div>
                            <div class="teacher-introduction">
                                {{ courseInfo.teacherIntroduction }}
                            </div>
                        </div>
                    </div>

                    <!-- 课程信息 -->
                    <div class="course-info-container">
                        <div class="course-info-header-container">
                            <div class="course-info-title">{{ courseInfo.courseName }}</div>
                            <div class="sundry-number-container">
                                <svg-icon 
                                    @click="courseLikeEvent"
                                    icon-class="course-praise"
                                    v-if="courseInfo.isLike == 1" 
                                />
                                <svg-icon 
                                    v-else 
                                    @click="courseLikeEvent"
                                    style="color: #999;"
                                    icon-class="course-not-praise" 
                                />
                                <svg-icon 
                                    @click="courseCollectionEvent"
                                    icon-class="course-collection"
                                    v-if="courseInfo.isCollection == 1" 
                                />
                                <svg-icon 
                                    v-else 
                                    @click="courseCollectionEvent"
                                    style="color: #999;"
                                    icon-class="course-not-collection" 
                                />
                            </div>
                        </div>
                        <div class="course-info-content-container">{{ courseInfo.courseDescription }}</div>
                    </div>
                </div>
            </div>

            <!-- 课程视频内容容器 -->
            <div class="course-video-play-body-container">
                <!-- 视频合集容器 -->
                <div class="video-collection-container">
                    <div class="video-collection-title">视频合集</div>
                    <div class="video-info">
                        <div @click="videoUpLoad" class="change-text">上</div>
                        <div class="video-list">
                            <div 
                                :key="index"
                                @click="reLoadVideoInfo(item.videoId)"
                                v-for="(item, index) in videoCollectionInfo.records"
                                :class="item.videoId == videoInfo.videoId ? 'check-video-container' : 'video-container'"
                            >
                                <el-image 
                                    :src="item.videoImage"
                                />
                                <div class="video-title">{{ item.videoName }}</div>
                            </div>
                        </div>
                        <div @click="videoDownLoad" class="change-text">下</div>
                    </div>
                </div>
            </div>

            <!-- 评论区容器 -->
            <div class="comment-container">
                <div class="comment-title">
                    评论区
                </div>
                <div class="comment-info-container">
                    <div 
                        :key="index"
                        v-for="(item, index) in commentInfo"
                        class="comment-info-item"
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
                            <div class="comment-time">
                                <span>{{ item.commentTime }}</span>
                                <el-button 
                                    circle
                                    size="small" 
                                    type="danger"
                                    :icon="Delete" 
                                    v-if="item.userId == user.userId" 
                                    @click="deleteCommentEvent(item.videoCommentId)"
                                    style="margin-left: 0.5rem; margin-top: -0.15rem;"
                                />
                            </div>
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
        <!-- 底部信息 -->
        <div class="bottom-view">
            <div class="platform-explain">
                <div class="platform-explain-title">公途学堂</div>
                <div class="platform-explain-text">Copyright ©2023-2024 闽江学院 王建华 版权所有</div>
            </div>
        </div>
    </div>

    <!-- 讲师信息对话框 -->
    <div class="teacher-info-view-container">
        <TeacherInfoDialog 
            :isCourseRouter="true"
            :teacherId="courseInfo.userId"
            :isDialogShow="teacherInfoDialog"
            @update:isDialogShow="(val) => teacherInfoDialog = val"
        />
    </div>
    
</template>

<script setup lang="ts">
import  V3Emoji  from 'vue3-emoji'
import 'vue3-emoji/dist/style.css'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { userStore } from '@/stores/user';
import { Delete } from '@element-plus/icons-vue'
import TeacherInfoDialog from '@/components/dialog/TeacherInfoDialog.vue'
import { showCourseInfo, likeOrNoLikeCourse, collectionOrNoCollectionCourse } from '@/api/course'
import { 
    showVideoInfo, 
    sendVideoComments, 
    likeOrNoLikeVideo, 
    showVideoComments, 
    deleteVideoComment,
    insertVideoSchedule, 
    showVideoCollectionInfo 
} 
from '@/api/video';


 
// 写评论
const comment = ref()
// 路由信息
const route = useRoute()
// 视频信息
const videoInfo = ref({
    isLike: 0,
    videoId: 0,
    courseId: 0,
    videoName: '',
    videoLink: '',
    likeNumber: 0,
    videoImage: '',
    createTime: '',
    browseNumber: 0,
    videoPreview: '',
    videoDuration: ''
})
// 课程信息
const courseInfo = ref({
    userId: 0,
    isLike: 0,
    courseId: 0,
    courseName: '',
    courseImage: '',
    creatorName: '',
    isCollection: 0,
    creatorAvatar: '',
    courseDescription: '',
    teacherIntroduction: ''
})
// 用户信息
const user = userStore()
// 评论信息
const commentInfo = ref()
// 视频配置
let playerOptions = ref({
    // 允许缩放
    fluid: true,
    // 点击播放按钮
    controls: true,
    // 视频无法播放时显示的提示
    suppressNotSupportedError: "此视频无法播放,请稍后重试",
    // 控制栏
    controlBar: {
        // 显示时长
        remainingTimeDisplay: {
            // 不显示负号
            displayNegative: false
        },
    },
    //视频观看起点
    playTimes: 0
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
// 视频合集分页参数
const courseParams = ref({
    currentPage: 1,
    pageSize: 5,
    courseId: 0
})
// 是否续播
const isReLoad = ref(true)
// 视频合集信息
const videoCollectionInfo = ref({
    pages: 0,
    records: [{
        videoId: 0,
        videoName: '',
        videoImage: '',
    }]
})
// 讲师信息弹出框
const teacherInfoDialog = ref(false)
 


// 挂载函数
onMounted(() => {
    if (route.params.videoId) {
        // 加载视频详细信息
        loadVideoInfo(route.params.videoId)

        // 加载视频评论信息
        loadVideoComments(route.params.videoId)

        // 加载课程信息
        loadCourseInfo(route.params.courseId)
        
        // 加载视频合集信息
        courseParams.value.courseId = Number(route.params.courseId)
        reLoadVideoCollectionInfo()
    } else {
        // 加载课程信息
        loadCourseInfo(route.params.courseId)
        // 加载视频合集信息
        loadVideoCollectionInfo(route.params.courseId, false)
    }
    
})



// 重新播放
function reLoad() {
    if (isReLoad.value) {
        // 重新加载视频
        let items = document.querySelectorAll(".video-js") as any
        console.log(items[0].player.currentTime(0))
        isReLoad.value = false
    }
}

// 切换视频级数(上一页)
function videoUpLoad() {
    // 不等于1，就加载上一页
    if (courseParams.value.currentPage != 1) {
        courseParams.value.currentPage--
        // 发送请求
        loadVideoCollectionInfo(route.params.courseId, true)
    } else {
        ElMessage.info('已经是第一页了')
    }
}

// 视频播放回调
function onPlayerPlay() {
    if (Number(videoInfo.value.videoDuration) > 0) {
        isReLoad.value = true
    }
}

// 切换视频级数(下一页)
function videoDownLoad() {
    // 不等于最后一页, 就加载下一页
    if (courseParams.value.currentPage < videoCollectionInfo.value.pages) {
        courseParams.value.currentPage++
        // 发送请求
        loadVideoCollectionInfo(route.params.courseId, true)
    } else {
        ElMessage.info('已经是最后一页了')
    }
}

// 视频点赞事件
function videoLikeEvent() {
    likeOrNoLikeVideo(videoInfo.value.videoId).then(response => {
        if (response.data.code === 200) {
            // 重新加载
            loadVideoInfo(videoInfo.value.videoId)
        }
    })
}

// 课程点赞事件
function courseLikeEvent() {
    likeOrNoLikeCourse(courseInfo.value.courseId).then(response => {
        if (response.data.code === 200) {
            // 重新加载
            loadCourseInfo(courseInfo.value.courseId)
        }
    })
}

// 发送评论事件
function sendCommentEvent() {
    if (comment.value != null || comment.value != '') {
        const videoCommentsParams = ref({
            videoId: videoInfo.value.videoId,
            commentContent: comment.value
        })
        sendVideoComments(videoCommentsParams.value).then(response => {
            if (response.data.code === 200) {
                // 重新加载评论信息
                loadVideoComments(videoInfo.value.videoId)
                // 清空
                comment.value = null
            }
        })
    }
}

// 讲师信息弹出
function showTeacherDialog() {
    teacherInfoDialog.value = true
}

// 课程收藏事件
function courseCollectionEvent() {
    collectionOrNoCollectionCourse(courseInfo.value.courseId).then(response => {
        if (response.data.code === 200) {
            // 重新加载
            loadCourseInfo(courseInfo.value.courseId)
        }
    })
}
 
// 加载视频合集信息
function reLoadVideoCollectionInfo() {
    showVideoCollectionInfo(courseParams.value).then(response => {
        if (response.data.code === 200) {
            for(var i = 0; i < response.data.data.records.length; i++) {
                if (route.params.videoId == response.data.data.records[i].videoId) {
                    videoCollectionInfo.value = response.data.data
                    return 
                } else {
                    courseParams.value.currentPage++
                    reLoadVideoCollectionInfo()
                }
            } 
        }  
    })
}

// 加载视频详细信息
function loadVideoInfo(videoId: any) {
    if (videoId == null) {
        // 设置默认选中的视频ID
        videoId = videoCollectionInfo.value.records[0].videoId
    }
    showVideoInfo(videoId).then(response => {
        if (response.data.code === 200) {
            videoInfo.value = response.data.data
        }
    })
}

// 重新加载视频信息
function reLoadVideoInfo(videoId: any) {

    // 加载视频详细信息
    loadVideoInfo(videoId)

    // 加载视频评论信息
    loadVideoComments(videoId)
}

// 加载课程信息
function loadCourseInfo(courseId: any) {
    showCourseInfo(courseId).then(response => {
        if (response.data.code === 200) {
            courseInfo.value = response.data.data
        }
    })
}

// 跳转到已观看的位置 
function onPlayerReadied(payload: any) {
    setTimeout(() => {
        if (videoInfo.value.videoDuration != '' || videoInfo.value.videoDuration != undefined || videoInfo.value.videoDuration != null) {
            // 当前视频一已观看进度
            payload.target.player.currentTime(videoInfo.value.videoDuration)
        }
    }, 1000)

    setTimeout(() => {
        isReLoad.value = false
    }, 5000)
}

// 当播放位置发生变化时触发
function onPlayerTimeupdate(player: any) {
    // 封装请求参数
    const videoDurationParams = ref({
        videoId: videoInfo.value.videoId,
        // 当前进度
        videoDuration: player.target.player.player_.cache_.currentTime
    })

    // 发送请求
    insertVideoSchedule(videoDurationParams.value)
}

// 加载视频评论信息
function loadVideoComments(videoId: any) {
    if (videoId == null) {
        // 设置默认选中的视频ID
        videoId = videoCollectionInfo.value.records[0].videoId
    }
    
    showVideoComments(videoId).then(response => {
        if (response.data.code === 200) {
            commentInfo.value = response.data.data
        }
    })
}

// 删除评论事件
function deleteCommentEvent(commentId: any) {
    deleteVideoComment(commentId).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('操作成功')
            // 加载视频评论信息
            loadVideoComments(route.params.videoId)
        } else {
            ElMessage.error('操作失败')
        }
    })
}

// 加载视频合集信息
function loadVideoCollectionInfo(courseId: any, isUpOrDown: boolean) {
    // 设置课程ID
    courseParams.value.courseId = courseId

    // 发送请求
    showVideoCollectionInfo(courseParams.value).then(response => {
        if (response.data.code === 200) {
            videoCollectionInfo.value = response.data.data
            
            if (!isUpOrDown) {
                // 加载视频详细信息
                loadVideoInfo(null)

                // 加载视频评论信息
                loadVideoComments(null)
            } 
            
        }
    })
}



</script>

<style lang="less" scoped>
// 课程视频视图
.course-video-play-view {
    width: 100%;
    height: 980px;
    margin-top: 0.4rem; 

    // 课程视频容器
    .course-video-play-container {
        width: 74%;
        margin-top: 2rem;
        margin-left: 14.5rem;
        
        // 课程视频顶部容器
        .course-video-play-header-container {
            height: 45rem;
            display: flex;

            // 左侧容器
            .course-video-play-header-left-container{
                font-style: normal;
                font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
                // 视频标题文本
                .video-title {
                    font-size: 22px;
                    font-weight: 500;
                    color: #18191c;
                    line-height: 34px;
                }

                // 视频综合信息容器
                .video-sundry-number-container {
                    display: flex;
                    font-size: 13px;
                    color: #9499a0;
                    font-weight: 400;
                    line-height: 18px;
                    margin: 0.5rem 0 1.2rem 0;

                    // 综合图标元素
                    .sundry-svg-item {
                        zoom: 0.8;
                        margin-right: 0.5rem;
                    }

                    // 次数容器
                    .number-container {
                        display: flex;
                        margin-right: 1rem;
                    }

                    // 视频评论数
                    .comment-number-container {
                        display: flex;
                        margin-right: 1rem;
                    }

                    // 视频发布时间
                    .time-container {
                        margin-right: 1rem;
                    }
                }

                // 视频播放容器
                .video-play-container {
                    width: 65rem;
                }

                // 视频综合按钮
                .video-sundry-container {
                    width: 64.9rem;
                    height: 2.1rem;
                    padding-top: 0.6rem;
                    border-radius: 0 0 0.5rem 0.5rem;
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    border-bottom: 1px solid #ddd;

                    .sundry-number-container {
                        display: flex;
                        align-items: center;
                        .svg-icon {
                            width: 24px;
                            height: 24px;
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

            // 右侧容器
            .course-video-play-header-right-container {
                width: 20rem;
                margin-left: 1rem;
                
                // 教师基础信息容器
                .teacher-base-info-container {
                    height: 5rem;
                    display: flex;
                    font-style: normal;
                    align-items: center;
                    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;

                    // 头像容器
                    .teacher-avatar {
                        width: 7.5rem;
                        margin-top: 0.3rem;
                        margin-right: 0.5rem;
                    }

                    // 讲师信息
                    .teacher-info {
                        // 讲师名称
                        .teacher-name {
                            color: #333;
                            display: flex;
                            font-size: 16px;
                            font-weight: 500;
                            line-height: 24px;
                            
                            // 标签
                            .el-tag {
                                zoom: 0.8;
                                margin-top: 0.1rem;
                                margin-left: 0.5rem;
                            }
                        }

                        // 讲师简介
                        .teacher-introduction {
                            color: #9499a0;
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 16px;
                            margin-top: 0.2rem;

                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-line-clamp: 1;
                            text-overflow: ellipsis;
                            -webkit-box-orient: vertical;
                        }
                    }
                }

                // 课程基础信息容器
                .course-info-container {
                    width: 100%;
                    border-radius: 0.3rem;
                    border: 1px solid #bbb;

                    // 顶部容器
                    .course-info-header-container {
                        display: flex;
                        padding: 0.5rem;
                        border-bottom: 1px solid #bbb;

                        // 课程标题
                        .course-info-title {
                            width: 15rem;
                            font-size: 20px;

                        }

                        // 综合容器
                        .sundry-number-container {

                            // 图标
                            .svg-icon {
                                margin-top: 0.1rem;
                                margin-right: 1rem;

                                &:last-child {
                                    margin-right: 0;
                                }
                            }
                        }
                    }

                    // 简介容器
                    .course-info-content-container {
                        padding: 0.5rem;
                        font-size: 15px;
                        font-weight: 400;
                        line-height: 24px;
                        font-style: normal;
                        text-indent: 0.8rem;
                        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;

                    }
                }
            }
        }

        // 课程视频内容容器
        .course-video-play-body-container {
            margin-top: 1rem;
            margin-bottom: 2rem;
            // 视频合集容器
            .video-collection-container {
                font-style: normal;
                
                // 标题
                .video-collection-title {
                    height: 2.5rem;
                    font-size: 22px;
                    font-weight: 400;
                    line-height: 34px;
                    margin-bottom: 1rem;
                    border-bottom: 1px solid #ddd;
                }

                .video-info {
                    display: flex;

                    .change-text {
                        width: 5rem;
                        display: flex;
                        align-items: center;
                        border-radius: 0.5rem;
                        justify-content: center;
                        background-color: #ddd;
                    }

                    .video-list {
                        display: flex;
                        padding: 0.8rem 0;
                        margin-left: 1.5rem;
                        .check-video-container {
                            padding: 0.5rem;
                            margin-right: 2rem;
                            border-radius: 0.5rem;
                            background-color: #ddd;
                        }
                        .video-container {
                            margin-right: 2rem;

                            .el-image {
                                border-radius: 0.3rem;
                            }
                            
                            // 视频标题
                            .video-title {
                                font-size: 14px;
                                overflow: hidden;
                                margin-top: 0.5rem;
                                display: -webkit-box;
                                -webkit-line-clamp: 1;
                                text-overflow: ellipsis;
                                -webkit-box-orient: vertical;
                            }
                        }
                    }
                }
            }
        }

        // 评论内容容器
        .comment-container {
            margin-bottom: 5rem;

            .comment-title {
                height: 2.5rem;
                font-size: 22px;
                font-weight: 400;
                line-height: 34px;
                margin-bottom: 1rem;
                border-bottom: 1px solid #ddd;
            }

            // 评论信息容器
            .comment-info-container {
                
                // 评论信息元素
                .comment-info-item {
                    width: 100%;
                    display: flex;
                    margin-bottom: 1rem;
                    border-radius: 0.5rem;
                    background-color: #eee;

                    // 左侧布局
                    .comment-info-left-container {
                        width: 6rem;
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
                        width: 78rem;
                        font-size: 14px;
                        margin-top: 0.8rem;
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
                            line-height: 20px;
                            margin: 0.5rem 0 1rem 0;

                        }
                    }
                }   
            }

            // 评论载入
            .comment-loading {
                margin: 2rem 0;
            }

            // 写评论容器
            .comment-write-container {
                
                .comment-write-title {
                    display: flex;
                    margin-top: 1rem;
                    margin-left: 0.1rem;
                    padding-bottom: 0.5rem;
                    justify-content: space-between;

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

// 讲师对话框
.teacher-info-view-container {

    // 对话框
    :deep(.el-dialog) {
        width: 42%; 
        border-radius: 0.8rem;
    }

    // 对话框顶部
    :deep(.el-dialog__header) {
        padding: 0.5rem;
    }

    // 对话框内容
    :deep(.el-dialog__body) {
        padding: 2rem;
    }

    // 顶部布局
    .teacher-info-view-header {
        display: flex;
        align-items: center;

        // 头像
        .el-image {
            width: 5rem;
            height: 5rem;
        }

        // 基本信息
        .teacher-base-info {
            height: 4.5rem;
            align-items: center;
            margin-left: 1.5rem;
            display: inline-grid;

            // 姓名
            .teacher-name {

                // 姓名文本
                .teacher-name-text {
                    font-size: 20px;
                    font-weight: 700;
                    color: #141414;
                    line-height: 20px;
                    font-style: normal;
                }

                // 标签
                .el-tag {
                    zoom: 0.8;
                    margin-top: -0.6rem;
                    margin-left: 0.5rem;
                }
            }
        }
    }

    // 导航栏布局
    .teacher-info-view-nav {
        display: flex;
        margin: 1rem 0;
        border-bottom: 1px solid #eee;

        //导航栏
        .teacher-info-nav {
            
            font-size: 14px;
            cursor: pointer;
            font-weight: 400;
            line-height: 40px;
            margin-left: 1.55rem;
            font-style: normal;

            // 第一个导航栏
            .teacher-info-nav-item:first-child {
                margin-right: 2.5rem;
            }

            // 选中导航栏
            .check-span {
                font-size: 16px;
                font-weight: 700;
                color: #141414;
                position: relative;

                // 下划线
                &::after {
                    content: "";
                    left: 0;
                    right: 0;
                    width: 20px;
                    height: 3px;
                    margin: auto;
                    bottom: -0.8rem;
                    position: absolute;
                    border-radius: 3px;
                    background: #f58d23;
                }
            }
        }
    }
}
</style>