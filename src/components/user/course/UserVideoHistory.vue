<template>
    <!-- 视频播放历史视图 -->
    <div class="user-video-history-view">
        <!-- 视频播放历史容器 -->
        <div class="user-video-history-container">
            <el-empty v-if="videoInfo.records.length === 0"/>
            <!-- 视频基本信息 -->
            <div 
                v-else
                class="video-base-info"
                v-loading="videoLoading"
            >        
                <div 
                    class="video-base-info-item" 
                    @click="routerCourseVideoPlay(item)"
                    v-for="(item, index) in videoInfo.records" :key="index"
                >
                    <!-- 视频 -->
                    <el-image
                        :src="item.videoImage"               
                    />
                        
                    <!-- 视频介绍 -->
                    <div class="video-instruction-text">
                        <div class="video-instruction-title">{{ item.videoName }}</div>
                        <div class="video-instruction-content">
                            <el-tag type="warning">讲师</el-tag>
                            <div class="video-creator">{{ item.creator }}</div>
                            <div class="video-create-time">{{ item.createTime }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 分页 -->
            <div class="course-page-container">
                <el-config-provider :locale="zhCn">
                    <el-pagination
                        background
                        :total="videoInfo.total"
                        style="float: right;"
                        @current-change="handleCurrentChange"
                        layout="total, prev, pager, next,jumper"
                    >
                    </el-pagination>
                </el-config-provider>
            </div>
        </div>
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
import { ref, onMounted } from 'vue';
import { isPayCourse } from '@/api/pay';
import { userStore } from '@/stores/user';
import {  showVideoHistory } from '@/api/video'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import PayCourseDialog from '@/components/dialog/PayCourseDialog.vue';


// 购买金额
const payMoney = ref()
// 用户信息
const user = userStore()
// 购买的课程ID
const payCourseId = ref()
// 分页参数
const pageParams = ref({
    currentPage: 1,
    pageSize: 9
})
// 视频信息 
const videoInfo = ref({
    total: 0,
    records: [
        {
            videoId: 0,
            courseId: 0,
            creator: '',
            videoName: '',
            createTime: '',
            videoImage: '',
        }
    ]
})
// 视频加载
const videoLoading = ref(false)
// 购买课程弹出框
const payCourseDialog = ref(false)


// 挂载函数
onMounted(() => {
    // 加载视频浏览历史
    loadVideoHistory()
})

// 加载视频浏览历史
function loadVideoHistory() {
    showVideoHistory(pageParams.value).then(response => {
        if (response.data.code === 200) {
            videoInfo.value = response.data.data
        } else {
            videoInfo.value.records = []
        }
    })
}

// 分页事件
function handleCurrentChange(val: any) {
    videoLoading.value = true

    // 设置当前页
    pageParams.value.currentPage = val

    // 加载视频浏览历史
    loadVideoHistory()
    
    setTimeout(() => {
        videoLoading.value = false
    }, 1000)
}

// 存在金额操作     
function existPayMoneyEvent(item: any) {
    // 赋值
    payMoney.value = item.payMoney
    payCourseId.value = item.courseId 
    // 是否存在有效订单
    isPayCourse(item.courseId).then(response => {
        if (response.data.code === 200) {
            // 存在订单
            router.push({
                name: 'courseVideoPlayVideoId',
                params: {
                    videoId: item.videoId,
                    courseId: item.courseId
                }
            })
        } else {
            // 是否本人发布的课程
            if (response.data.data) {
                // 存在订单
                router.push({
                    name: 'courseVideoPlayVideoId',
                    params: {
                        videoId: item.videoId,
                        courseId: item.courseId
                    }
                })
            } else {
                payCourseDialog.value = true
            }
        }
    })

}
 
// 跳转课程视频播放界面 
function routerCourseVideoPlay(item: any) {
    if (user.isLogin) {
        if (item.payMoney > 0) {
            existPayMoneyEvent(item)
        } else {
            router.push({
                name: 'courseVideoPlayVideoId',
                params: {
                    videoId: item.videoId,
                    courseId: item.courseId
                }
            })
        }
    } else {
        ElMessage.info('请先登录')
    }
}


</script>

<style lang="less" scoped>
// 视频播放历史视图
.user-video-history-view {
    margin-left: 2rem;
    // 视频播放历史容器
    .user-video-history-container {
        // 视频基本信息
        .video-base-info {
            display: flex;
            flex-wrap: wrap;
            margin-top: 0.5rem;
            justify-content: flex-start;

            // 视频基本信息项
            .video-base-info-item {
                padding: 0.5rem;
                margin: 0 0.85rem 0.2rem 0;
                &:nth-child(3n) {
                    margin-right: 0rem;
                }

                .el-image {
                    width: 20rem;
                    height: 10rem;
                    border-radius: 0.3rem;
                }
                
                // 视频文本
                .video-instruction-text {
                    width: 20rem; 
                    height: 3.5rem;
                    margin-top: 0.5rem;
                    
                    // 视频标题
                    .video-instruction-title {
                        font-size: 15px;
                        font-weight: 500;
                        line-height: 19px;
                        font-style: normal;
                        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;;
                    
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
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
                        margin-top: 0.5rem;

                        color: #999;
                        font-size: 13px;
                        font-weight: 400;
                        line-height: 17px;
                        font-style: normal;
                        font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;;
                    
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

        // 分页容器
        .course-page-container {
            width: 100%;
            display: flex;
            margin-top: 1rem;
            padding-bottom: 1.2rem;
            justify-content: center;
        }
    }
}
</style>