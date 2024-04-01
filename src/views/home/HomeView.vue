<template>
    <!-- 首页容器 -->
    <div 
        class="home-view-container" 
        v-infinite-scroll="courseLoadEvent"
        :infinite-scroll-disabled="courseDisabled"
    >
        <!-- 首页内容 -->
        <div class="home-body-view">

            <!-- 顶部布局 -->
            <div class="home-header-container">
                <!-- 轮播图容器 -->
                <div class="home-header-banner">
                    <el-carousel 
                        autoplay 
                        height="auto" 
                        v-if = "banner != null"
                        indicator-position="none"
                        v-loading="bannerLoading" 
                    >
                        <el-carousel-item  
                            v-for="(item, index) in banner" :key="index"
                        >
                            <el-image :src="item.bannerUrl"/>
                        </el-carousel-item>
                    </el-carousel>
                </div>

                <!-- 用户信息 -->
                <el-card class="home-header-user">
                    <div class="user-avatar">
                        <el-avatar v-if="user.isLogin" :src="user.userAvatar"/>
                        <img v-else src='@/assets/img/defaultAvatar.png'/>
                    </div>
                    <div class="user-info">
                        <div v-if="user.isLogin" class="user-info-text">
                            <div class="user-nickname-text">{{ user.nickname }}</div>
                            <el-tag v-if="user.isTeacher" type="warning">讲师</el-tag>
                            <el-tag v-else type="info">用户</el-tag>
                        </div>
                        <el-button v-else @click="showLoginOrRegisterDialog">登录/注册</el-button>
                    </div>
                    <!-- 跳转图标 -->
                    <div class="base-info">
                        <div v-if="user.isLogin" class="user-center-router">
                            <el-tooltip placement="bottom" effect="light">
                                <template #content>
                                    <span class="tooltip-text">用户中心</span>
                                </template>
                                <svg-icon 
                                    class="base-info-icon"
                                    icon-class="user-center" 
                                    @click="routerUserCenter"
                                />
                            </el-tooltip>   

                            <el-tooltip placement="bottom" effect="light">
                                <template #content>
                                    <span class="tooltip-text">课程中心</span>
                                </template>
                                <svg-icon 
                                    class="base-info-icon"
                                    icon-class="video-history" 
                                    @click="routerCourseCenter"
                                />
                            </el-tooltip>
                            
                            <el-tooltip placement="bottom" effect="light">
                                <template #content>
                                    <span class="tooltip-text">文章中心</span>
                                </template>
                                <svg-icon 
                                    class="base-info-icon"
                                    icon-class="article-history" 
                                    @click="routerArticleCenter"
                                />
                            </el-tooltip>
                            
                            <el-tooltip placement="bottom" effect="light">
                                <template #content>
                                    <span class="tooltip-text">文章发布</span>
                                </template>
                                <svg-icon 
                                    class="base-info-icon"
                                    icon-class="article-release" 
                                    @click="routerArticleRelease"
                                />
                            </el-tooltip>
                            
                        </div>
                        <div v-else class="base-info-text">华盟公途高等出版社出版</div>
                    </div>
                </el-card>
            </div>

            <!-- 讲师推荐 -->
            <div class="home-teacher-recommend">
                <!-- 标题文本 -->
                <div class="teacher-recommend-text">业界大咖</div>
                <!-- 讲师基本信息 -->
                <div class="teacher-base-info">
                    <el-card 
                        v-loading="teacherLoading"
                        class="teacher-base-info-item" 
                        @click="showTeacherDialog(item.teacherId)"
                        v-for="(item, index) in teacherInfo" :key="index"
                    >
                        <el-avatar v-if="item.headPortrait" :src="item.headPortrait"/>
                        <img v-else src='@/assets/img/defaultAvatar.png'/>
                        <div class="teacher-base-text">
                            <el-tag type="warning">讲师</el-tag>
                            <div>{{ item.nickname }}</div>
                        </div>
                    </el-card>
                </div>
            </div>

            <!-- 视频推荐 -->
            <div class="home-video-recommend">
                <!-- 标题文本 -->
                <div class="video-recommend-text">热门视频</div>
                <!-- 视频基本信息 -->
                <div class="video-base-info">
                    <div 
                        v-loading="videoLoading"
                        class="video-base-info-item" 
                        @click="routerCourseVideoPlay(item, 'videoId')"
                        @mouseover="getMouseOverVideoId(item.videoId)" 
                        v-for="(item, index) in videoInfo" :key="index"
                    >
                        <!-- 视频 -->
                        <video-player
                            :loop="true"
                            :width="100"
                            :id= "item.videoId"
                            :src="item.videoPreview"
                            :options="playerOptions"
                            @mounted="handleMounted"
                            @play="videoPlayEvent(item)"
                            @pause="videoPauseEvent(item)"   
                        >
                            <img v-if="item.isShowCover" :src="item.videoImage"/>
                        </video-player>
                            
                        <!-- 视频介绍 -->
                        <div class="video-instruction-text">
                            <div class="video-instruction-title">{{ item.videoDescription }}</div>
                            <div class="video-instruction-content">
                                <el-tag type="warning">讲师</el-tag>
                                <div class="video-creator">{{ item.creatorName }}</div>
                                <div class="video-create-time">{{ item.createTime }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 课程推荐 -->
            <div class="home-course-recommend">
                <!-- 顶部布局 -->
                <div class="course-recommend-title">
                    <!-- 标题文本 -->
                    <div class="course-recommend-text">
                        课程推荐
                    </div>
                    <!-- 搜索栏 -->
                    <div class="course-search">
                        <el-input 
                            type="text" 
                            v-model="courseSearch"
                            placeholder="请输入" 
                            class="course-input" 
                        />
                        <el-icon @click="searchCourse()"><Search /></el-icon>
                    </div>
                </div>

                <!-- 课程基本信息 -->
                <div class="course-base-info">
                    <div
                        v-loading="courseLoading"
                        class="course-base-info-item" 
                        @click="routerCourseVideoPlay(item, 'courseId')"
                        v-for="(item, index) in courseInfo" :key="index"
                    >
                        <el-image :src="item.courseImage"/>
                        <div class="course-instruction-text">
                            <div class="course-title">
                                {{ item.courseDescription }}
                            </div>
                            <div class="course-base">
                                <div class="course-money">
                                    <div v-if="item.payMoney" class="course-how-money">￥{{ item.payMoney }}</div>
                                    <div v-else class="course-no-money">免费</div>
                                </div>
                                <div class="course-creator">{{ item.creatorName }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 课程加载 -->
                <div 
                    class="course-loading"
                    v-loading="courseRollLoading" 
                >
                    <div v-if="isLoadMax" style="text-align: center;">到底啦！！！兄嘚</div>
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
            :teacherId="teacherId"
            :isCourseRouter="false"
            :isDialogShow="teacherInfoDialog"
            @update:isDialogShow="(val) => teacherInfoDialog = val"
        />
    </div>

    <!-- 登录或注册对话框 -->
    <div class="login-or-register-view-container">
        <LoginOrRegisterDialog 
            :isDialogShow="loginOrRegisterDialog"
            @update:isDialogShow="(val) => loginOrRegisterDialog = val"
        />
    </div>

    <!-- 购买课程弹出框 -->
    <div class="pay-course-dialog-container">
        <PayCourseDialog
            :payMoney="payMoney"
            :payCourseId="payCourseId"
            :isDialogShow="payCourseDialog"
            @update:isDialogShow="(val) => payCourseDialog = val"
        />
    </div>

</template>

<script setup lang="ts">
import router from '@/router';
import { showVideo } from '@/api/video';
import { isPayCourse } from '@/api/pay';
import { userStore } from '@/stores/user';
import { showBanner } from '@/api/banner';
import { showCourse } from '@/api/course';
import { getTeacher } from '@/api/teacher';
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, watch, computed } from 'vue';
import PayCourseDialog from '@/components/dialog/PayCourseDialog.vue';
import TeacherInfoDialog from '@/components/dialog/TeacherInfoDialog.vue'
import LoginOrRegisterDialog from '@/components/dialog/LoginOrRegisterDialog.vue'

// 轮播图
const banner = ref()
// 购买金额
const payMoney = ref()
// 视频元素
let videoItemId = ref()
// 讲师Id
const teacherId = ref()
// 视频信息
const videoInfo = ref()
// 用户存储
const user = userStore()
// 课程信息
const courseInfo = ref()
// 讲师信息
const teacherInfo = ref()
// 购买的课程ID
const payCourseId = ref()
// 视频配置
let playerOptions = ref({
    // 允许缩放
    fluid: true,
    // 点击播放按钮
    controls: false,
    // 视频无法播放时显示的提示
    suppressNotSupportedError: "此视频无法播放,请稍后重试",
    // 控制栏
    controlBar: {
        // 显示时长
        remainingTimeDisplay: {
            // 不显示负号
            displayNegative: false
        },
    }
})
// 是否加载完毕
const isLoadMax = ref(false)
// 课程搜索框
const courseSearch = ref("")
// 课程分页参数
const coursePageParams = ref({
    currentPage: 1,
    pageSize: 8
})
// 各种加载参数
const videoLoading = ref(false)
const bannerLoading = ref(false)
const courseLoading = ref(false)
const teacherLoading = ref(false)
// 购买课程弹出框
const payCourseDialog = ref(false)
// 课程滚动加载
const courseRollLoading = ref(false)
// 讲师信息弹出框
const teacherInfoDialog = ref(false)
// 登录/注册弹出框
let loginOrRegisterDialog = ref(false)
// 是否首次加载课程信息
const isFirstCourseLoading = ref(false)
// 是否允许加载数据
const courseDisabled = computed(() => courseLoading.value)


// 挂载函数
onMounted(()=>{
    // 加载视频信息
    loadVideo()
    // 加载轮播信息
    loadBanner()
    // 加载课程信息
    loadCourse()
    // 挂载搜索框事件
    showSearchInput()
    // 加载讲师信息
    loadTeacherInfo()
})

// 载入视频信息
function loadVideo() {
    videoLoading.value = true
    showVideo().then(response => {
        if (response.data.code === 200) {
            videoInfo.value = response.data.data
            setTimeout(() => {
                videoLoading.value = false
            }, 3500)
        } else {
            ElMessage.error('视频信息载入失败')
        }
    })
}

// 加载轮播图信息
function loadBanner() {
    // 开启加载轮播图
    bannerLoading.value = true
    showBanner().then(response => {
        if (response.data.code === 200) {
            banner.value = response.data.data
        } else {
            ElMessage.error('轮播图载入失败')
        }
    })
    // 关闭加载轮播图
    setTimeout(() => {
        bannerLoading.value = false
    }, 1500)
}

// 加载课程信息
function loadCourse() {
    courseLoading.value = true
    showCourse(null, coursePageParams.value).then(response => {
        if (response.data.code === 200) {
            courseInfo.value = response.data.data.records
            setTimeout(() => {
                courseLoading.value = false
                isFirstCourseLoading.value = true
            }, 3500)
        } else {
            ElMessage.error('课程信息载入失败')
        }
    })
}

// 展开搜索框事件 
let showSearchInput=()=>{
    let item = document.querySelector(".course-search") as any
    item.addEventListener("mouseenter",() => {
        setTimeout(() => {
            if (courseSearch.value == "") {
                item.style.width = "2.5rem"
            }
        }, 3000)
        item.style.width = "12rem"
    })

}

// 搜索课程信息
function searchCourse() {
    if (courseSearch.value == '' || courseSearch.value == null || courseSearch.value == undefined) {
        ElMessage.info('请输入课程名称进行查询')
    } else {
        // 进行查询
        courseLoading.value = true
        showCourse(courseSearch.value, coursePageParams.value).then(response => {
            if (response.data.code === 200) {
                courseInfo.value = response.data.data.records
                setTimeout(() => {
                    courseLoading.value = false
                    isFirstCourseLoading.value = true
                }, 3500)
            } else {
                ElMessage.error('未查询到该课程')
            }
        })
    }
}

// 加载讲师信息
function loadTeacherInfo() {
    teacherLoading.value = true 
    getTeacher().then(response => {
        if (response.data.code === 200) {
            teacherInfo.value = response.data.data
            setTimeout(() => {
                teacherLoading.value = false
            }, 1500)
        } else {
            ElMessage.error('讲师信息载入失败')
        }
    })
}

// 滚动加载课程信息
function courseLoadEvent() {
    courseRollLoading.value = true
    if (isFirstCourseLoading.value) {
        coursePageParams.value.currentPage++
        isFirstCourseLoading.value = false
    }
    if (courseSearch.value == '' || courseSearch.value == null || courseSearch.value == undefined) {
        courseLoadEventOperation(null, coursePageParams.value)
    } else {
        courseLoadEventOperation(courseSearch.value, coursePageParams.value)
    }
    
}

// 跳转用户中心界面
function routerUserCenter() {
    router.push({
        name: 'userCenterParams',
        params: {
            navId: 1
        }
    })
}

// 监听输入框内容
watch(courseSearch,(newVal)=>{
    let item = document.querySelector(".course-search") as any
    if(newVal == "") {
        item.style.width = "2.5rem"
    }
})

// 跳转课程中心界面
function routerCourseCenter() {
    router.push({
        name: 'userCenterParams',
        params: {
            navId: 3
        }
    })
}

// 跳转文章中心界面
function routerArticleCenter() {
    router.push({
        name: 'userCenterParams',
        params: {
            navId: '2-1'
        }
    })
}

// 跳转文章发布界面
function routerArticleRelease() {
    router.push({
        path: '/articleRelease'
    })
}

// 视频播放事件回调函数
function videoPlayEvent(item: any) {
    item.isShowCover = false
}

// 视频暂停事件回调函数
function videoPauseEvent(item: any) {
    item.isShowCover = true
}

// 讲师信息弹出框默认展示
function showTeacherDialog(id: any) {
    teacherId.value = id
    teacherInfoDialog.value = true
} 

// 视频悬停事件  
function handleMounted(payload: any) {
    // 悬停的元素
    let items = document.querySelectorAll(".video-js") as any
    
    for (var i = 0; i < items.length; i++) {
        // 悬停1秒才播放
        let timer: NodeJS.Timeout | undefined;
        // 监听鼠标移入
        items[i].addEventListener('mouseenter', () => {
            timer = setTimeout(() => { 
                if (videoItemId.value == payload.player.id_) {
                    // 播放
                    payload.player.play()
                    // 开启声音
                    payload.player.muted(false)
                }
            }, 1500)
        })

        // 监听鼠标移出
        items[i].addEventListener('mouseout', () => {
            clearTimeout(timer)
            // console.log(payload.player.poster_)
            // 暂停
            payload.player.pause()
            // 关闭声音
            payload.player.muted(true)
            // 开启控制栏
            payload.player.controls(false)
            // 重置时间
            payload.player.currentTime(0)
        })
    }
} 

// 登录/注册弹出框默认展示
function showLoginOrRegisterDialog() {
    loginOrRegisterDialog.value = true
}

// 悬停元素的ID切换
function getMouseOverVideoId(index: any) {
    videoItemId.value = index
}

// 存在金额操作      
function existPayMoneyEvent(item: any, id: any) {
    // 赋值
    payMoney.value = item.payMoney
    payCourseId.value = item.courseId
    // 是否存在有效订单
    isPayCourse(item.courseId).then(response => {
        if (response.data.code === 200) {
            // 存在订单
            if (id == 'videoId') {
                router.push({
                    name: 'courseVideoPlayVideoId',
                    params: {
                        videoId: item.videoId,
                        courseId: item.courseId
                    }
                })
            } else if(id == 'courseId') {
                router.push({
                    name: 'courseVideoPlay',
                    params: {
                        courseId: item.courseId
                    }
                })
            }
        } else {
            // 是否本人发布的课程
            if (response.data.data) {
                // 存在订单
                if (id == 'videoId') {
                    router.push({
                        name: 'courseVideoPlayVideoId',
                        params: {
                            videoId: item.videoId,
                            courseId: item.courseId
                        }
                    })
                } else if(id == 'courseId') {
                    router.push({
                        name: 'courseVideoPlay',
                        params: {
                            courseId: item.courseId
                        }
                    })
                }
            } else {
                payCourseDialog.value = true
            }
        }
    })

}
 
// 跳转课程视频播放界面 
function routerCourseVideoPlay(item: any, id: any) {
    if (user.isLogin) {
        if (id == 'videoId') {
            if (item.payMoney > 0) {
                existPayMoneyEvent(item, id)
            } else {
                router.push({
                    name: 'courseVideoPlayVideoId',
                    params: {
                        videoId: item.videoId,
                        courseId: item.courseId
                    }
                })
            }
        } else if (id == 'courseId') {
            if (item.payMoney > 0) {
                existPayMoneyEvent(item, id)
            } else {
                router.push({
                    name: 'courseVideoPlay',
                    params: {
                        courseId: item.courseId
                    }
                })
            }
        }
    } else {
        ElMessage.info('请先登录')
    }
}

// 滚动加载课程信息操作
function courseLoadEventOperation(search: any, pageParams: any) {
    showCourse(search, pageParams).then(response => {
        if (coursePageParams.value.pageSize > response.data.data.length) {
            isLoadMax.value = true
            ElMessage.info('没有更多数据了')
        } else {
            isLoadMax.value = false
            courseInfo.value = courseInfo.value.concat(response.data.data.records)
            coursePageParams.value.currentPage++
            courseRollLoading.value = false
        }
    })
}

</script>

<style lang="less" scoped>
@borderRadius: 1rem;
@bannerHeight: 26rem;

@textColor: #999;
@searchColor: #fff;
@searchTextColor: #ddd;
@buttonColor: #ff853f;
@buttonFontColor: #fff;
@buttonSelectColor: #ff5e00;
@buttonBorderColor: #ffb300e8;

// 文本提示插槽
.tooltip-text {
    font-family: '楷书';
    letter-spacing: 0.06rem;
    color: @buttonSelectColor;
}

// 首页容器
.home-view-container {
    width: 100%;
    height: 980px;
    overflow: auto;
    list-style: none;
    margin-top: 0.4rem;

    // 首页内容
    .home-body-view {
        width: 83%;
        margin-top: 2rem;
        margin-left: 11.5rem;

        // 顶部布局
        .home-header-container {
            display: flex;
            margin-left: 3rem;
            
            // 轮播图容器
            .home-header-banner {
                width: 76%;

                // 轮播图
                .el-carousel {
                    width: 100%; 
                    height: @bannerHeight;
                    border-radius: @borderRadius;

                    // 轮播图元素
                    .el-carousel__item {
                        height: @bannerHeight;

                        // 轮播图图片
                        .el-image {
                            width: 100%;
                            height: @bannerHeight;
                        }
                    }
                }

            }

            // 用户信息容器
            .home-header-user {
                width: 16%;
                margin-left: 1rem;
                height: @bannerHeight;
                border-radius: @borderRadius;
                background-color: antiquewhite;

                // 用户头像
                .user-avatar {
                    height: 12rem;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    // 用户头像图片
                    .el-avatar, img {
                        width: 6.5rem;
                        height: 6.5rem;
                    }
                }

                // 用户信息
                .user-info {
                    margin-top: -1.5rem;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    // 用户信息文本
                    .user-info-text {
                        margin-bottom: 1.5rem;
                        .user-nickname-text {
                            font-size: 28px;
                            font-weight: 400;
                            color: @textColor;
                            font-family: '楷体';
                        }

                        .el-tag {
                            margin-top: 1rem;
                            margin-left: 1.2rem;
                        }
                    }

                    // 登录按钮
                    .el-button {
                        width: 8rem;
                        height: 2rem;
                        margin-top: 1rem;
                        font-size: 10px;
                        border-radius: 10rem;
                        color: @buttonFontColor;
                        background-color: @buttonColor;
                        border: 1px solid @buttonBorderColor;
                    }

                    // 登录按钮(悬停)
                    .el-button:hover {
                        border: 1px solid @buttonColor;
                        background-color: @buttonSelectColor;
                    }
                }

                // 用户中心
                .base-info {
                    height: 11rem;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    // 用户中心文本
                    .base-info-text {
                        font-size: 16px;
                        margin-top: 2rem;
                        color: @textColor;
                        font-family: '楷体';
                    }
                    // 用户中心图标
                    .user-center-router {
                        width: 95%;
                        display: flex;
                        justify-content: space-between;

                        .base-info-icon {
                            width: 2rem;
                            height: 2rem;
                            
                        }
                    }
                }
            }
            
        }

        // 讲师推荐
        .home-teacher-recommend {   
            width: 90.2%;
            margin-left: 3rem;
            margin-top: 2rem;
            
            // 文本
            .teacher-recommend-text {
                color: #333;
                font-size: 24px;
                font-weight: 500;
                line-height: 34px;
                font-style: normal;
            }
            // 讲师信息
            .teacher-base-info {
                display: flex;
                margin-top: 0.5rem;
                text-align: center;
                justify-content: space-between;

                // 讲师信息元素
                .teacher-base-info-item {
                    width: 20rem;
                    height: 15rem;
                    border: 1px solid #999;

                    // 讲师头像
                    .el-avatar, img {
                        width: 6.5rem;
                        height: 6.5rem;
                        margin: 0.5rem 0 1rem 0; 
                    }

                    // 讲师基本信息
                    .teacher-base-text {

                        .el-tag {
                            margin-bottom: 1rem;
                        }
                    }
                }

                // 讲师信息元素(悬停)
                .teacher-base-info-item:hover {
                    box-shadow: 18px 17px 15px -3px rgba(0,0,0,0.1);
                }

                // 不含最后一个元素
                .teacher-base-info-item:not(:last-child) {
                    margin-right: 1.5rem;
                } 
            }
        }

        // 视频推荐
        .home-video-recommend {
            width: 90.5%;
            margin-top: 2rem;
            margin-left: 3rem;
            margin-bottom: 2rem;

            // 文本
            .video-recommend-text {
                color: #333;
                font-size: 24px;
                font-weight: 500;
                line-height: 34px;
                font-style: normal;
            }

            // 视频基本信息
            .video-base-info {
                display: flex;
                flex-wrap: wrap;
                position: relative;
                margin-top: 0.5rem;
                justify-content: flex-start;

                // 视频基本信息项
                .video-base-info-item {
                    padding: 0.5rem;
                    margin: 0 0.85rem 1rem 0;
                    &:nth-child(4n) {
                        margin-right: 0rem;
                    }

                    // 视频播放器
                    :deep(.video-js .vjs-tech) {
                        width: 20rem;
                        height: 10rem;
                        border-radius: 0.3rem;
                    }

                    img {
                        top: 0;
                        width: 20rem;
                        height: 10rem;
                        position: absolute;
                        border-radius: 0.3rem;
                    }

                    // 视频播放器背景色
                    .video-js {
                        background-color: transparent;
                    }
                    
                    // 视频文本
                    .video-instruction-text {
                        // 320px = 20rem
                        width: 20rem; 
                        height: 4rem;
                        margin-top: -0.5rem;
                        
                        // 视频标题
                        .video-instruction-title {
                            font-size: 15px;
                            font-weight: 500;
                            line-height: 19px;
                            font-style: normal;
                            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;;
                        
                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            text-overflow: ellipsis;
                            -webkit-box-orient: vertical;
                        }

                        // 视频文本
                        .video-instruction-title:hover {
                            cursor: pointer;
                            text-decoration: underline;
                        }

                        // 视频内容
                        .video-instruction-content {
                            display: flex;
                            margin-top: 0.3rem;

                            color: #999;
                            font-size: 13px;
                            font-weight: 400;
                            line-height: 17px;
                            font-style: normal;
                            font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
                        
                            .el-tag {
                                zoom: 0.7;
                                margin-right: 0.5rem;
                            }

                            .video-creator {
                                margin-right: 0.3rem;
                            }
                        }
                    }
                }

                // 视频基本信息项(悬停)
                .video-base-info-item:hover {
                    border-radius: 0.5rem;
                    box-shadow: 0 0 30px 2px #999;                 
                }
            }
        }

        // 课程推荐
        .home-course-recommend {
            width: 90.5%; 
            margin-left: 3rem;
            margin-bottom: 3rem;

            // 课程顶部容器
            .course-recommend-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                
                // 课程标题文本
                .course-recommend-text {
                    color: #333;
                    font-size: 24px;
                    font-weight: 500;
                    line-height: 34px;
                    font-style: normal; 
                }

                // 课程搜索栏
                .course-search {
                    width: 2.5rem;
                    height: 2.5rem;
                    padding: 0.7rem;
                    margin-bottom: 1rem;
                    margin-right: 0.5rem;
                    border-radius: 10rem;
                    background-color: @searchColor;
                    
                    display: flex;
                    overflow: hidden;
                    align-items: center;
                    box-sizing: border-box;
                    justify-content: flex-end;
                    
                    z-index: 1;
                    transition: .8s;

                    :deep(.el-icon) {
                        color: @searchTextColor;
                    }
                }

                // 输入框样式
                :deep(.el-input__wrapper) {
                    box-shadow: none;
                    background-color: @searchColor;
                }

                // 输入框文本
                :deep(.el-input__inner) {
                    color: @searchTextColor !important;
                }
                :deep(.el-input__inner::placeholder) {
                    color: @searchTextColor !important;
                }
                
            }

            // 课程基本信息
            .course-base-info {
                display: flex;
                flex-wrap: wrap;
                margin-top: 0.5rem;
                justify-content: flex-start;

                // 课程基本信息项
                .course-base-info-item {
                    width: 20rem;
                    position: relative;
                    margin: 0 2.2rem 1.8rem 0;
                    &:nth-child(4n) {
                        margin-right: 0rem;
                    }

                    .el-image, img {
                        width: 20rem;
                        height: 9rem;
                        display: block;
                        border-radius: 0.3rem 0.3rem 0 0;
                    }

                    :deep(.el-image__inner) {
                        border-radius: 0.3rem 0.3rem 0 0;
                    }

                    // 课程文本
                    .course-instruction-text {
                        height: 5rem;
                        padding: 1rem;
                        border-top: none;
                        border: 1px solid #dedede;
                        border-radius: 0 0 0.2rem 0.2rem;

                        // 课程标题
                        .course-title {
                            color: #222;
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 24px;
                            font-style: normal;
                            font-family: "Microsoft YaHei UI";

                            overflow: hidden;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            text-overflow: ellipsis;
                            -webkit-box-orient: vertical;
                        }

                        // 课程标题(悬停)
                        .course-title:hover {
                            cursor: pointer;
                            text-decoration: underline;
                        }

                        // 课程基本信息
                        .course-base {
                            width: 90%;
                            display: flex;
                            bottom: 0.2rem;
                            position: absolute;
                            padding-bottom: 0.7rem;
                            justify-content: space-between;

                            // 课程价格
                            .course-money {
                                color: #df404a;
                                font-size: 16px;
                                font-weight: 700;
                                font-style: normal;
                                font-family: "Microsoft YaHei UI";

                                // 免费
                                .course-no-money {
                                    font-size: 18px;
                                    color: #f58d23;
                                    margin-top: -0.25rem;
                                }
                            }

                            // 课程发布者
                            .course-creator {
                                color: #999;
                                font-size: 14px;
                                font-weight: 400;
                                font-style: normal;
                                
                                font-family: "Microsoft YaHei UI";
                            }
                        }
                        
                    }
                }

                .course-base-info-item:hover {
                    box-shadow: 0px 28px 17px 0px rgba(0,0,0,0.1);
                }
            }

            // 课程载入样式
            .course-loading {
                margin-top: 1rem;
                text-align: center;
            }
        }
    }

    // 底部信息
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
   
}

// 登录或注册对话框
.login-or-register-view-container {

    // 对话框
    :deep(.el-dialog) {
        width: 30%; 
        border-radius: 0.8rem;
    }

    :deep(.el-dialog__header) {
        padding: 0;
    }

    // 顶部容器
    .login-or-register-view-header-container {
        width: 100%;
        display: flex;
        align-items: center;
        padding-bottom: 0.5rem;
        justify-content: center;
        border-bottom: 1px solid #eee;
        
        font-size: 20px;
        font-weight: 500;

        .login-text {
            width: 3.5rem;
            cursor: pointer;
            text-align: center;
        }

        .line {
            margin-left: 2.5rem;
            margin-right: 2.5rem;
        }

        .register-text {
            width: 3.5rem;
            cursor: pointer;
            text-align: center;
        }

        .login-or-register {
            color: #f58d23;
            border-bottom: 2.5px solid #f58d23;
        }
    }

    // 登录导航栏
    .login-nav-container {
        display: flex;
        font-size: 13px;
        margin-top: 1rem;
        align-items: center;
        margin-bottom: 1.5rem;
        justify-content: center;

        .login-username {
            cursor: pointer;
            margin-right: 1rem;
            border-radius: 0.3rem;
            padding: 0.3rem 0.6rem;
        }

        .login-email {
            cursor: pointer;
            border-radius: 0.3rem;
            padding: 0.3rem 0.6rem;
        }

        .username-or-email {
            color: #fff;
            background-color: #999;
        }
    }

    // 主体容器
    .login-or-register-view-body-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        // 输入框
        .el-input {
            font-size: 12px;
        }

        // 所有输入容器
        .login-username-container, .login-email-container, .register-container{
            width: 50%;

            // 输入框
            .el-input {
                margin-bottom: 1.5rem;
            }
        }
        
        // 登录邮箱容器
        .login-email-container {
            
            // 验证码容器
            .code-container {
                display: flex;
                
                .el-button {
                    width: 5rem;
                    font-size: 12px;
                    margin-left: 0.5rem;
                }
            }
        }

        // 注册容器
        .register-container {
            margin-top: 2rem;

            // 验证码容器
            .code-container {
                display: flex;
                
                .el-button {
                    width: 5rem;
                    font-size: 12px;
                    margin-left: 0.5rem;
                }
            }
        }
    }

    // 按钮
    .login-button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-button {
            width: 7rem;
            border-radius: 1rem;
        }
    }
}

// 购买课程对话框
.pay-course-dialog-container {
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
}

</style>