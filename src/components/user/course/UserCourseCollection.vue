<template>
    <!-- 用户课程收藏夹视图 -->
    <div class="user-course-collection-view">
        <!-- 用户课程收藏夹容器 -->
        <div class="user-course-collection-container">
            <!-- 用户课程元素容器 -->
            <div class="user-course-collection-item-container" v-loading="courseLoading">
                <el-empty v-if="courseInfo.records.length === 0"/>
                <!-- 用户课程元素 -->
                <div 
                    v-else
                    :key="index"
                    class="user-course-collection-item"
                    v-for="(item, index) in courseInfo.records"
                >
                    <div class="left-container" @click="routerCourseVideoPlay(item)">
                        <el-image :src="item.courseImage"/>
                    </div>
                    <div class="middle-container" @click="routerCourseVideoPlay(item)">
                        <div class="middle-title">{{ item.courseName }}</div>
                        <div class="middle-creator">作者:  {{ item.creatorName }}</div>
                        <div class="middle-info-container">
                            <div class="praise-container">
                                <svg-icon icon-class="praise"/>
                                <span class="span-one">{{ item.likeNumber }}</span>
                            </div>
                            <div class="collection-container"> 
                                <svg-icon icon-class="article-collection"/>
                                <span>{{ item.collectionNumber }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="right-container">
                        <el-button type="primary" @click="cancelCollection(item.courseId)">取消收藏</el-button>
                    </div>
                </div>

            </div>

            <!-- 分页 -->
            <div class="course-page-container">
                <el-config-provider :locale="zhCn">
                    <el-pagination
                        background
                        :total="courseInfo.total"
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
            :courseId="payCourseId"
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
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import PayCourseDialog from '@/components/dialog/PayCourseDialog.vue';
import { showCollectionCourseInfo, collectionOrNoCollectionCourse } from '@/api/course';

// 购买金额
const payMoney = ref()
// 用户信息
const user = userStore()
// 购买的课程ID
const payCourseId = ref()
// 分页参数
const pageParams = ref({
    currentPage: 1,
    pageSize: 12
})
// 课程信息 
const courseInfo = ref({
    total: 0,
    records: [
        {
            courseId: 0,
            likeNumber: 1,
            courseName: '',
            courseImage: '',
            creatorName: '',
            collectionNumber: 1
        }
    ]
})
// 课程加载
const courseLoading = ref(false)
// 购买课程弹出框
const payCourseDialog = ref(false)



// 挂载函数
onMounted(() => {
    // 加载用户收藏课程
    loadUserCollectionCourse()
}) 

// 加载用户收藏课程
function loadUserCollectionCourse() {
    showCollectionCourseInfo(pageParams.value).then(response => {
        if (response.data.code === 200) {
            courseInfo.value = response.data.data
        } else {
            courseInfo.value.records = []
        }
    })
} 

// 分页事件
function handleCurrentChange(val: any) {

    courseLoading.value = true
    
    // 设置当前页
    pageParams.value.currentPage = val

    // 加载事件
    loadUserCollectionCourse()

    setTimeout(() => {
        courseLoading.value = false
    }, 1500)
}

// 存在金额操作  
function existPayMoneyEvent(item: any) {
    // 赋值
    payMoney.value = item.payMoney
    payCourseId.value = item.courseId
    // 是否存在有效订单
    isPayCourse(item.courseId).then(response => {
        if (response.data.code === 200) {
                router.push({
                    name: 'courseVideoPlay',
                    params: {
                        courseId: item.courseId
                    }
                })
        } else {
            // 是否本人发布的课程
            if (response.data.data) {
                router.push({
                    name: 'courseVideoPlay',
                    params: {
                        courseId: item.courseId
                    }
                })
            } else {
                payCourseDialog.value = true
            }
        }
    })

}

// 取消收藏
function cancelCollection(courseId: any) {
    ElMessageBox.confirm('确定取消收藏吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        // 发送取消收藏请求
        collectionOrNoCollectionCourse(courseId).then(response => {
            if (response.data.code === 200) {
                ElMessage.success('取消收藏成功')
                pageParams.value.currentPage = 1
                loadUserCollectionCourse()
            } else {
                ElMessage.error('取消收藏失败')
            }
        })
    })
    
}

// 跳转课程视频播放界面  
function routerCourseVideoPlay(item: any) {
    if (user.isLogin) {
            if (item.payMoney > 0) {
                existPayMoneyEvent(item)
            } else {
                router.push({
                    name: 'courseVideoPlay',
                    params: {
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
// 用户课程收藏夹视图
.user-course-collection-view {
    margin-top: 2rem;
    margin-left: 2rem;
    // 用户课程收藏夹容器   
    .user-course-collection-container {
        
        // 用户课程元素容器
        .user-course-collection-item-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            
            // 用户课程元素
            .user-course-collection-item {
                width: 20rem;
                height: 7rem;
                display: flex;
                cursor: pointer;
                padding: 0.8rem;
                margin-right: 1rem;
                margin-bottom: 1.5rem;
                border-radius: 0.3rem;
                background-color: #eee;

                // 左侧容器
                .left-container {

                    .el-image {
                        height: 7rem;
                        width: 8.5rem;
                        border-radius: 0.5rem;
                    }
                }

                // 居中容器
                .middle-container {
                    font-size: 14px;
                    margin-top: 0.8rem;
                    margin-left: 1rem;
                    margin-right: 1rem;

                    // 标题
                    .middle-title {
                        margin-bottom: 2.5rem;

                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                    }

                    // 作者
                    .middle-creator {
                        margin-bottom: 0.4rem;
                    }

                    // 图标容器
                    .middle-info-container {
                        display: flex;
                        color: #666;
                        font-size: 12px;

                        .svg-icon {
                            zoom: 0.8;
                            margin-right: 0.2rem;
                        }

                        span {
                            vertical-align: 0.2rem;
                        }

                        .span-one {
                            margin-right: 1.3rem;
                        }
                    }
                }

                // 右侧容器
                .right-container {
                    .el-button {
                        width: 1rem;
                        height: 100%;
                    }
                    :deep(.el-button>span) {
                        writing-mode: vertical-rl;
                    }
                }
            }            
        }

        // 分页容器
        .course-page-container {
            width: 100%;
            display: flex;
            margin-top: 1rem;
            padding-bottom: 2.5rem;
            justify-content: center;
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