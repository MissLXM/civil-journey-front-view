<template>
    <!-- 讲师发布文章视图 -->
    <div class="user-release-course-view">
        <div class="user-release-course-text-container">
            <div>发布课程</div>
            <el-tag type="info" @click="loadTeacherIntroduction">修改讲师简介</el-tag>
            <el-tag type="info" @click="loadReleaseCourseDialog">课程信息发布</el-tag>
        </div>
        
        <!-- 讲师发布文章元素容器 -->
        <div 
            v-infinite-scroll="courseLoad"
            :infinite-scroll-disabled="courseDisabled"
            class="user-release-course-item-container"
        >
            <el-empty v-if="courseInfo == undefined"/>
            <!-- 用户课程元素 -->
            <div 
                v-else
                :key="index"
                v-for="(item, index) in courseInfo"
                class="user-release-course-item"
            >
                <div @click="routerCourseInfo(item)" class="left-container">
                    <el-image :src="item.courseImage"/>
                </div>
                <div @click="routerCourseInfo(item)" class="middle-container">
                    <div class="middle-title">{{ item.courseName }}</div>
                    <div class="middle-introduction">{{ item.courseDescription }}</div>
                    <div class="middle-tag">
                        <el-tag v-if="item.payMoney == 0" type="warning">免费</el-tag>
                        <el-tag v-else type="error">付费: {{ item.payMoney }}</el-tag>
                        <el-tag type="warning">{{ item.categoryName }}</el-tag>
                    </div>
                </div>
                <div class="right-container">
                    <el-button v-if="item.status == 0" type="info" disabled>审核中</el-button>
                    <el-popconfirm 
                        cancel-button-text="取消"
                        confirm-button-text="确认"
                        title="是否删除文章,此操作不可逆,是否执行?"
                        @confirm="deleteCourseEventSuccess(item.articleId)"
                    >
                        <template #reference>
                            <el-button v-if="item.status == 1" type="success">审核通过--可删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-tooltip 
                        effect="light"
                        placement="bottom" 
                    >
                        <template #content>
                            <span>点击删除</span>
                        </template>
                        <el-button v-if="item.status == 2" type="danger" @click="applyFailureEvent(item)">审核失败</el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>

        <!-- 课程加载 -->
        <div 
            class="course-loading"
            v-loading="courseLoading"
        >
        </div>
    </div>

    <!-- 修改简介弹出框 -->
    <div class="update-instruction-dialog-container">
        <el-dialog 
            v-model="updateInstructionDialog" 
            @close="closeTeacherIntroductionDialog"
        >
            <div class="dialog-title">修改讲师简介</div>
            <el-input 
                :rows="4"
                type="textarea"
                v-model="upTeacherIntroduction"
            />
            <div class="teacher-introduction">讲师简介: {{ teacherIntroduction }}</div>
            <el-button type="primary" @click="updateTeacherIntroduction">修改</el-button>
        </el-dialog>
    </div>

    <!-- 发布课程弹出框 -->
    <div class="release-course-dialog-container">
        <el-dialog v-model="releaseCourseDialog" @close="closeReleaseCourseInfoDialog">
            <div class="dialog-title">发布课程</div>
            <!-- 发布课程容器 -->
            <div class="release-course-container">
                <!-- 发布课程左容器 -->
                <div class="release-course-left-container">
                    <div class="release-course-title">课程信息区</div>
                    <div class="course-info-container">
                        <div class="course-info-title">课程名称</div>
                        <el-input v-model="releaseCourse.courseName"/>
                    </div>
                    <div class="course-info-container left-margin-five">
                        <div class="course-info-title">课程封面</div>
                        <el-upload 
                            :data="use"
                            class="cover-upload"
                            :show-file-list="false"
                            :on-success="handlerImageSuccess"
                            :before-upload="beforeImageUpload"
                            :action="actionUrl.courseCoverAction"
                        >
                            <!-- img -->
                            <el-image
                                class="cover-image"
                                v-if="courseCoverUrl.newPath" 
                                :src="courseCoverUrl.newPath" 
                            />
                            <div v-else>
                                <el-icon class="cover-icon"><Plus /></el-icon>
                                <div class="cover-text">添加课程封面</div>
                            </div>
                        </el-upload>
                    </div>
                    <div class="course-info-container">
                        <div class="course-info-title">课程描述</div>
                        <el-input 
                            :rows="4"
                            type="textarea"
                            v-model="releaseCourse.courseDescription"
                        />
                    </div>
                    <div class="course-info-container left-margin-five">
                        <div class="course-info-title">课程类别</div>
                        <el-select v-model="releaseCourse.categoryId" placeholder="请选择课程类别">
                            <el-option 
                                :key="index"
                                :value="item.categoryId"
                                :label="item.categoryName"
                                v-for="(item, index) in categoryInfo"
                            />
                        </el-select>
                    </div>
                    <div class="course-info-container">
                        <div class="course-info-title">购买金额</div>
                        <el-input v-model="releaseCourse.payMoney"/>
                    </div>
                </div>

                <!-- 发布课程右容器 -->
                <div class="release-course-right-container">
                    <div class="release-course-title">视频信息区</div>
                    <div class="video-container">
                        <div 
                            :key="index"
                            class="video-info-item-container"
                            v-for="(item, index) in releaseCourse.videoList"
                        >
                            <div class="video-title">第{{ index + 1 }}个视频</div>
                            <div class="video-info-container">
                                <div class="video-info-title">视频名称</div>
                                <el-input v-model="item.videoName"/>
                            </div>
                            <div class="video-info-container left-margin-five">
                                <div class="video-info-title">上传视频</div>
                                <el-upload 
                                    :data="user"
                                    class="cover-upload"
                                    :show-file-list="false"
                                    :action="actionUrl.videoAction"
                                    :on-success="handlerVideoSuccess.bind(null, { 'index': index })"
                                    :before-upload="beforeVideoUpload"
                                >
                                    <!-- video -->
                                    <video
                                        class="cover-image"
                                        v-if="item.showVideoLink" 
                                        :src="item.showVideoLink" 
                                    />

                                    <div v-else>
                                        <el-icon class="cover-icon"><Plus /></el-icon>
                                        <div class="cover-text">添加视频</div>
                                    </div>
                                </el-upload>
                            </div>
                            <div class="video-info-container left-margin-five">
                                <div class="video-info-title">视频封面</div>
                                <el-upload 
                                    :data="user"
                                    class="cover-upload"
                                    :show-file-list="false"
                                    :before-upload="beforeImageUpload"
                                    :action="actionUrl.videoImageAction"
                                    :on-success="handlerVideoImageSuccess.bind(null, { 'index': index })"
                                >
                                    <!-- img -->
                                    <el-image
                                        v-if="item.showVideoImage" 
                                        :src="item.showVideoImage" 
                                        class="cover-image"
                                    />
                                    <div v-else>
                                        <el-icon class="cover-icon"><Plus /></el-icon>
                                        <div class="cover-text">添加视频封面</div> 
                                    </div>
                                </el-upload>
                            </div>
                            <div class="video-info-container left-margin-five">
                                <div class="video-info-title">视频预览</div>
                                <el-upload 
                                    :data="user"
                                    class="cover-upload"
                                    :show-file-list="false"
                                    :before-upload="beforeVideoUpload"
                                    :action="actionUrl.videoPreviewAction"
                                    :on-success="handlerPreviewVideoSuccess.bind(null, { 'index': index })"
                                >
                                    <!-- video -->
                                    <video
                                        v-if="item.showVideoPreview" 
                                        :src="item.showVideoPreview" 
                                        class="cover-image"
                                    />

                                    <div v-else>
                                        <el-icon class="cover-icon"><Plus /></el-icon>
                                        <div class="cover-text">添加预览视频</div>
                                    </div>
                                </el-upload>
                            </div>
                            <div class="video-info-container">
                                <div class="video-info-title">视频描述</div>
                                <el-input 
                                    :rows="4"
                                    type="textarea"
                                    v-model="item.videoDescription"
                                />
                            </div>
                        </div>
                        <div class="video-footer">
                            <el-button type="primary" @click="addVideoNumber">增加视频</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <el-button type="primary" @click="releaseCourseEvent">发布课程</el-button>
            </div>
        </el-dialog>
    </div>

    <!-- 审核失败弹出框 -->
    <div class="apply-failure-dialog-container">
        <el-dialog v-model="applyFailureDialog">
            <div class="dialog-title">审核失败原因</div>
            <el-input 
                :rows="4"
                disabled
                type="textarea"
                v-model="applyFailureReason"
            />
            <el-button type="primary" @click="deleteCourseEvent">删除该课程</el-button>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { userStore } from '@/stores/user';
import { Plus } from '@element-plus/icons-vue'
import { showCategory } from '@/api/category';
import { ref, computed, onMounted } from 'vue';
import { getTeacherInfoById, updateIntroduction } from '@/api/teacher';
import { deleteCourseInfo, releaseCourseInfo, showReleaseCourseInfo } from '@/api/course';

// 用户
const use = ref({
    username: ''
})
// 选择ID
const courseId = ref()
// 视频地址
const videoLink = ref({
    newPath: '',
    oldPath: '',
    videoDuration: ''
})
// 地址集 
const actionUrl = ref({
    videoAction: 'http://localhost:8000/course-center-service/front/video/uploadVideo',
    videoImageAction: 'http://localhost:8000/course-center-service/front/video/uploadVideoCover',
    courseCoverAction: 'http://localhost:8000/course-center-service/front/course/uploadCourseImage',
    videoPreviewAction: 'http://localhost:8000/course-center-service/front/video/uploadPreviewVideo',
})
// 用户信息
const user = userStore()
// 分页参数
const pageParams = ref({
    currentPage: 1,
    pageSize: 10
})
// 课程信息
const courseInfo = ref()
// 类别信息
const categoryInfo = ref([
    {
        categoryId: 0,
        categoryName: ''
    }
])
// 发布课程信息
const releaseCourse = ref({
    courseName: '',
    courseImage: '',
    courseDescription: '',
    categoryId: '',
    categoryName: '',
    payMoney: '',
    videoList: [{
        videoName: '',
        videoLink: '',
        videoImage: '',
        videoPreview: '',
        videoDuration: '',
        showVideoLink: '',
        showVideoImage: '',
        showVideoPreview: '',
        videoDescription: '',
    }]
})
// 视频封面
const videoCoverUrl = ref({
    newPath: '',
    oldPath: ''
}) 
// 是否最大数
const isLoadMax = ref(false)
// 课程图片
const courseCoverUrl = ref({
    newPath: '',
    oldPath: ''
})
// 预览视频
const videoPreviewUrl = ref({
    newPath: '',
    oldPath: ''
})
// 失败原因
const applyFailureReason = ref()
// 加载状态
const courseLoading = ref(false)
// 讲师简介
const teacherIntroduction = ref()
// 修改讲师简介
const upTeacherIntroduction = ref()
// 审核失败弹出框
const applyFailureDialog = ref(false)
// 发布课程弹出框
const releaseCourseDialog = ref(false)
// 修改讲师简介弹出框
const updateInstructionDialog = ref(false)
// 是否允许加载数据
const courseDisabled = computed(() => courseLoading.value)



 
// 挂载函数
onMounted(() => {
    // 加载讲师已发布课程
    loadReleaseCourse(false)
})

// 滚动加载课程 
const courseLoad = () => {
    // 累加
    pageParams.value.currentPage++
    pageParams.value.pageSize = 4
    
    // 加载状态
    if (isLoadMax.value) {
        courseLoading.value = false 
    } else {
        courseLoading.value = true

        setTimeout(() => {
            // 重新加载
            loadReleaseCourse(true)
            courseLoading.value = false
        }, 1500)
    }
    
}

// 添加视频个数
function addVideoNumber() {
    releaseCourse.value.videoList.push({
        videoName: '',
        videoLink: '',
        videoImage: '',
        videoPreview: '',
        videoDuration: '',
        showVideoLink: '',
        showVideoImage: '',
        showVideoPreview: '',
        videoDescription: '',
    })
}

// 删除课程事件
function deleteCourseEvent() {
    deleteCourseInfo(courseId.value).then(response => {
        if (response.data.code === 200) {
            applyFailureDialog.value = false
            loadReleaseCourse(false)
            ElMessage.success('删除成功')
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 发布课程判空
function CourseInfoIsNull() {
    if (
        releaseCourse.value.courseName == '' ||
        releaseCourse.value.courseImage == '' ||
        releaseCourse.value.courseDescription == '' ||
        releaseCourse.value.categoryId == '' ||
        releaseCourse.value.categoryName == '' ||
        releaseCourse.value.payMoney == '' 
    ) {
        ElMessage.info('所有信息均需要填写')
        return
    }

    for (var i = 0; i < releaseCourse.value.videoList.length; i++) {
        if (
            releaseCourse.value.videoList[i].videoName == '' ||
            releaseCourse.value.videoList[i].videoLink == '' ||
            releaseCourse.value.videoList[i].videoImage == '' ||
            releaseCourse.value.videoList[i].videoPreview == '' ||
            releaseCourse.value.videoList[i].videoDescription == ''
        ) {
            ElMessage.info('所有信息均需要填写')
            return
        }
    }
}

// 发布课程事件
function releaseCourseEvent() {
    
    for (var i = 0; i < categoryInfo.value.length; i++) {
        if (releaseCourse.value.categoryId == JSON.stringify(categoryInfo.value[i].categoryId)) {
            // 设置课程类别
            releaseCourse.value.categoryName = categoryInfo.value[i].categoryName
        } 
    }
    // 设置课程封面
    releaseCourse.value.courseImage = courseCoverUrl.value.oldPath
    

    // 发布课程判空
    CourseInfoIsNull()

    // 发送添加课程请求
    releaseCourseInfo(releaseCourse.value).then(response => {
        if (response.data.code === 200) {
            releaseCourseDialog.value = false
            loadReleaseCourse(false)
        }
    })
}
 
// 加载课程发布弹出框
function loadReleaseCourseDialog() {
    // 加载类别
    showCategory().then(response => {
        if (response.data.code === 200) {
            categoryInfo.value = response.data.data
            categoryInfo.value = categoryInfo.value.filter( category => category.categoryId !== 0 )
        }
    })
    
    // 弹出框
    releaseCourseDialog.value = true
}

// 加载讲师简介
function loadTeacherIntroduction() {
    // 获取讲师简介
    getTeacherInfoById(user.userId).then(response => {
        if (response.data.code === 200) {
            teacherIntroduction.value = response.data.data.teacherIntroduction
        }
    })

    // 弹出对话框
    updateInstructionDialog.value = true
} 

// 跳转课程详细 
function routerCourseInfo(item: any) {
    if (item.status == 1) {
        router.push({
            name: 'courseVideoPlay',
            params: {
                courseId: item.courseId
            }
        })
    }
}

// 修改讲师简介
function updateTeacherIntroduction() {
    updateIntroduction(upTeacherIntroduction.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('修改成功')

            upTeacherIntroduction.value = undefined

            // 加载讲师简介
            loadTeacherIntroduction()
        } else {
            ElMessage.error('修改失败')
        }
    })
}

// 审核失败事件
function applyFailureEvent(item: any) {
    // 设置ID
    courseId.value = item.courseId
    // 失败原因
    applyFailureReason.value = item.auditFailureReason
    applyFailureDialog.value = true
}

// 上传图片前的回调 
function beforeImageUpload(file: any) {
    // 判断文件大小
    if ((file.size / 1024 / 1024 ) > 5) {
        ElMessage.info('图片大小不能超过5MB')
        return false;
    }

    // 判断文件类型
    if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        ElMessage.info('图片格式仅支持jpg、jpeg、png')
        return false;
    }

    return true;
}
 
// 上传视频前的回调
function beforeVideoUpload(file: any) {
    // 判断文件大小
    if ((file.size / 1024 / 1024 ) > 300) {
        ElMessage.info('图片大小不能超过300MB')
        return false;
    }

    // 判断文件类型
    if (['video/mp4'].indexOf(file.type) === -1) {
        ElMessage.info('图片格式仅支持mp4')
        return false;
    }

    return true;
}
 
// 加载讲师已发布课程
function loadReleaseCourse(isLoad: any) {
    use.value.username = user.username
    if(!isLoad) {
        pageParams.value.currentPage = 1
        pageParams.value.pageSize = 10
    }

    showReleaseCourseInfo(pageParams.value).then(response => {
        if (response.data.code === 200) {
            if (!isLoad) {
                courseInfo.value = response.data.data.records
            } else {
                courseInfo.value = courseInfo.value.concat(response.data.data.records)
            }
        } else {
            courseInfo.value = undefined
            isLoadMax.value = true
            courseLoading.value = false
        }
    })
}

// 发布课程弹出框关闭
function closeReleaseCourseInfoDialog() {
    // 清空数据
    releaseCourse.value = {
        courseName: '',
        courseImage: '',
        courseDescription: '',
        categoryId: '',
        categoryName: '',
        payMoney: '',
        videoList: [{
            videoName: '',
            videoLink: '',
            videoImage: '',
            videoPreview: '',
            showVideoLink: '',
            videoDuration: '',
            showVideoImage: '',
            showVideoPreview: '',
            videoDescription: '',
        }]
    }
}

// 讲师简介弹出框关闭
function closeTeacherIntroductionDialog() {
    upTeacherIntroduction.value = undefined
}
  
// 上传图片成功后的回调
function handlerImageSuccess(result: any) {
    // 图片回显
    courseCoverUrl.value = result.data
}

// 删除课程事件(发布成功后)
function deleteCourseEventSuccess(courseId: any) {
    deleteCourseInfo(courseId).then(response => {
        if (response.data.code === 200) {
            applyFailureDialog.value = false
            loadReleaseCourse(false)
            ElMessage.success('删除成功')
        } else {
            ElMessage.error('删除失败')
        }
    })
}
 
// 上传视频成功后的回调
function handlerVideoSuccess(result: any,response: any) {
    videoLink.value = response.data
    releaseCourse.value.videoList[result.index].videoLink = videoLink.value.oldPath
    releaseCourse.value.videoList[result.index].showVideoLink = videoLink.value.newPath
    releaseCourse.value.videoList[result.index].videoDuration = videoLink.value.videoDuration
}

// 上传视频封面成功后的回调
function handlerVideoImageSuccess(result: any,response: any) {
    videoCoverUrl.value = response.data
    releaseCourse.value.videoList[result.index].videoImage = videoCoverUrl.value.oldPath
    releaseCourse.value.videoList[result.index].showVideoImage = videoCoverUrl.value.newPath
}

// 上传预览视频成功后的回调
function handlerPreviewVideoSuccess(result: any,response: any) {
    videoPreviewUrl.value = response.data
    releaseCourse.value.videoList[result.index].videoPreview = videoPreviewUrl.value.oldPath
    releaseCourse.value.videoList[result.index].showVideoPreview = videoPreviewUrl.value.newPath
}
</script>

<style lang="less" scoped>
// 讲师发布文章视图
.user-release-course-view {
    width: 70rem;
    margin-top: 2rem;
    background-color: #fff;

    // 文本
    .user-release-course-text-container {
        display: flex;
        font-size: 18px;
        color: #9a9a9a;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #eee;

        .el-tag {
            zoom: 0.9;
            cursor: pointer;
            margin-left: 1rem;
        }
    }

    // 用户课程元素容器
    .user-release-course-item-container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1rem;
        margin-left: 1rem;
        overflow-y: scroll;
        padding-bottom: 1rem;
        height: 53rem;
        justify-content: flex-start;
        
        // 用户课程元素
        .user-release-course-item {
            width: 46%;
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
                    height: 7.5rem;
                    width: 12rem;
                    border-radius: 0.5rem;
                }
            }

            // 居中容器
            .middle-container {
                width: 55%;
                font-size: 14px;
                margin-top: 0.8rem;
                margin-left: 1rem;
                margin-right: 1rem;

                // 标题
                .middle-title {
                    margin-bottom: 0.8rem;

                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                }

                // 简介
                .middle-introduction {
                    margin-bottom: 1.3rem;

                    overflow: hidden;
                    display: -webkit-box;
                    text-indent: 1em;
                    -webkit-line-clamp: 2;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                }

                // 图标容器
                .middle-tag {
                    
                    .el-tag {
                        margin-right: 0.5rem;
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
}

// 对话框
:deep(.el-dialog) {
    width: 40%; 
    border-radius: 0.8rem;
}
// 对话框(顶部)
:deep(.el-dialog__header) {
    padding: 0;
}
// 文本输入框
:deep(.el-textarea__inner) {
    resize: none;
}

// 弹出框标题
.dialog-title {
    text-align: center;
    margin-bottom: 1.5rem;
}

// 修改简介弹出框、审核失败弹出框
.update-instruction-dialog-container,
.apply-failure-dialog-container {

    .teacher-introduction {
        margin-top: 1rem;
    }

    .el-button {
        width: 8rem;
        margin-top: 1rem;
        margin-left: 18rem;
        border-radius: 1rem;
    }
}

// 发布课程弹出框
.release-course-dialog-container {

    // 对话框
    :deep(.el-dialog) {
        width: 60%; 
    }

    // 上传
    :deep(.el-upload) {
        display: unset;
    }

    // 上传容器
    .cover-upload {
        width: 120px;
        height: 120px;
        cursor: pointer;
        border-radius: 6px;
        margin-left: -0.3rem;
        border: 1px dashed var(--el-border-color);

        .cover-image {
            width: 120px;
            height: 120px;
            display: block;
        }

        .cover-icon {
            width: 120px;
            height: 95px;
            font-size: 28px;
            color: #8c939d;
            text-align: center;
            margin-bottom: 0.5rem;
        }

        .cover-text {
            height: 5.5vh;
            font-size: 10px;
            color: #8c939d;
            margin-top: -3vh;
            text-align: center;
        }
    }

    .cover-upload:hover {
        border-color: var(--el-color-primary);
    }

    // 发布课程容器
    .release-course-container {
        display: flex;

        // 标题
        .release-course-title {
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 1rem;
        }

        // 发布课程左容器
        .release-course-left-container {
            width: 50%;
            padding: 1rem;
            

            // 左边距
            .left-margin-five {
                margin-left: -0.4rem;
            }

            // 课程信息容器
            .course-info-container {
                display: flex;
                margin-bottom: 1rem;

                // 标题
                .course-info-title {
                    width: 5rem;
                    display: flex;
                    margin-right: 0.5rem;
                    align-items: center;
                    justify-content: center;
                }

                // 下拉菜单
                .el-select {
                    margin-left: -0.3rem;
                }

            }
        }

        // 发布课程右容器
        .release-course-right-container {
            width: 50%;
            padding: 1rem;
            
            // 左边距
            .left-margin-five {
                margin-left: -0.4rem;
            }

            .video-container {
                height: 24rem;
                padding-left: 1rem;
                padding-right: 1rem;
                overflow-y: scroll;

                //定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸
                &::-webkit-scrollbar {
                    width: 0.75rem;
                    height: 0.75rem;
                    border-radius: 0.625rem;
                    background-color: #F5F5F5;
                }

                // 定义滚动条轨道 内阴影+圆角
                &::-webkit-scrollbar-track {
                    border-radius: 0.625rem;
                    background-color: #F5F5F5;
                    box-shadow: inset 0 0 0.375rem #ddd;
                }

                // 定义滑块 内阴影+圆角
                &::-webkit-scrollbar-thumb {
                    border-radius: 0.625rem;
                    background-color: #F5F5F5;
                    box-shadow: inset 0 0 0.375rem #999;
                }


                .video-info-item-container {

                    .video-title {
                        font-size: 16px;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    }

                    .video-info-container {
                        display: flex;
                        margin-bottom: 1rem;

                        .video-info-title {
                            width: 5rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                }
            }

            // 底部
            .video-footer {
                text-align: center;

                .el-button {
                    width: 10rem;
                    margin-top: 2rem;
                    border-radius: 1rem;
                }
            }
        }
    }

    // 底部
    .dialog-footer {
        width: 100%;
        text-align: center;
        .el-button {
            width: 10rem;
            margin-top: 2rem;
            border-radius: 1rem;
        }
    }
}
</style>