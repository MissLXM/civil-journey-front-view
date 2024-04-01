<template>
    <el-dialog 
        @open="openTeacherInfo"
        v-model="teacherInfoDialog"
        :before-close="offTeacherInfo"
    >
        <!-- 讲师顶部布局 -->
        <div class="teacher-info-view-header">
            <el-avatar :src="teacherInfo.headPortrait"/>
            <div class="teacher-base-info">
                <div class="teacher-name">
                    <span class="teacher-name-text">{{ teacherInfo.nickname }}</span>
                    <el-tag type="warning">讲师</el-tag>
                </div>
                <div class="teacher-title">公途学堂优质讲师</div>
            </div>
        </div>

        <!-- 讲师导航栏布局 -->
        <div class="teacher-info-view-nav">
            <div 
                :key="index"
                class="teacher-info-nav"
                v-for="(item, index) in teacherInfoNav"
            >
                <span 
                    tabindex="0"  
                    @click="checkNav(item.navId)"
                    class="teacher-info-nav-item"
                    :v-bind="defaultTeacherHistoryNav"
                    :class="{ 'check-span': defaultTeacherHistoryNav === item.navId}"
                >
                    {{ item.navText }}
                </span>
            </div>
        </div>

        <!-- 讲师主体内容容器 -->
        <div class="teacher-info-container">
            <!-- 讲师介绍容器 -->
            <div 
                v-if="defaultTeacherHistoryNav === 1" 
                class="teacher-instruction-container"
            >
                <el-tag type="info">讲师介绍</el-tag>
                <div class="teacher-instruction-content">
                    {{ teacherInfo.teacherIntroduction }}
                </div>
            </div>

            <!-- 讲师历史课程 -->
            <div 
                class="teacher-history-course"
                v-if="defaultTeacherHistoryNav === 2"
                :infinite-scroll-disabled="disabled"
                v-infinite-scroll="teacherHistoryCourseLoad"
            >
                <div class="course-container">
                    <div 
                        :key="index"
                        class="course-info"
                        v-for="(item, index) in historyCourse"
                    >
                        <div class="course-info-time">
                            发布日期:{{ item.createTime }}
                        </div>
                        <div class="course-info-name">
                            课程名称:{{ item.courseName }}
                        </div>
                        <div class="course-info-view">
                            {{ item.browseNumber }}人已看
                        </div>
                    </div>
                    <!-- 课程加载 -->
                    <div 
                        class="history-course-loading"
                        v-loading="courseLoading" 
                    >
                        <div v-if="isLoadMax" style="text-align: center;">到底啦！！！兄嘚</div>
                    </div>
                </div>
                
            </div>
        </div>

    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineEmits, withDefaults } from 'vue'
import { getTeacherInfoById, getTeacherHistoryCourseInfo } from '@/api/teacher';

// 分页参数
const pageParams = ref({
    currentPage: 1,
    pageSize: 4
})
// 讲师信息
const teacherInfo = ref({
    "nickname": "",
    "teacherId": "",
    "headPortrait": "",
    "teacherIntroduction": ""
})
// 历史课程
const historyCourse = ref()
// 讲师信息导航栏 
const teacherInfoNav = ref([
    {
        navId: 1,
        navText: "简介"
    },
    {
        navId: 2,
        navText: "历史课程"
    }
])
// 是否加载完毕
const isLoadMax = ref(false)
// 获取父组件的值
const props = withDefaults(
    defineProps<{
        teacherId: any;
        isDialogShow: boolean;
        isCourseRouter: boolean;
    }>(),
    {
        isDialogShow: false,
    }
)
// 讲师历史课程载入
const courseLoading = ref(false)
// 监听从父组件传递的值
watch(() => props.isDialogShow,
    () => {
        teacherInfoDialog.value = props.isDialogShow
    }
)  
// 默认导航栏的值
const defaultTeacherHistoryNav = ref(1)
// 是否允许加载数据
const disabled = computed(() => courseLoading.value)
// 弹出框的值
let teacherInfoDialog = ref<boolean>(props.isDialogShow)



// 关闭讲师信息弹出框
function offTeacherInfo() {
    // 设置默认值
    defaultTeacherHistoryNav.value = 1
    // 关闭
    offTeacherInfoEmits('update:isDialogShow', false)
}

// 打开弹出框前的操作
function openTeacherInfo() {
    defaultTeacherHistoryNav.value = 1
    if (props.teacherId != '' || props.teacherId != undefined || props.teacherId != null) {
        // 获取讲师信息
        getTeacherInfoById(props.teacherId).then(response => {
            if (response.data.code === 200) {
                teacherInfo.value = JSON.parse(JSON.stringify(response.data.data))
            } else {
                ElMessage.error('讲师基本信息载入失败')
            }
        })
    } else {
        ElMessage.info('未存在讲师ID')
    }
}

// 切换讲师导航栏
function checkNav(navId: any) {
    defaultTeacherHistoryNav.value = navId
}

// 加载历史课程信息
function teacherHistoryCourseLoad () {
    courseLoading.value = true
    getTeacherHistoryCourseInfo(props.teacherId, pageParams.value).then(response => {
        if (response.data.code === 200) {
            if (pageParams.value.pageSize > response.data.data.length) {
                ElMessage.info('没有更多数据了')
            } else {
                if (pageParams.value.pageSize > 4) {
                    setTimeout(() => {
                        historyCourse.value = response.data.data.records
                        pageParams.value.pageSize += 2
                        courseLoading.value = false
                    }, 1500) 
                } else {
                    historyCourse.value = response.data.data.records
                    pageParams.value.pageSize += 2
                    courseLoading.value = false
                }
            }
        } else {
            // ElMessage.error('历史课程信息载入失败')
            isLoadMax.value = true
        }
    })

    
}
  
// 关闭讲师信息弹出框事件
const offTeacherInfoEmits = defineEmits<{
    (e: 'update:isDialogShow', val: boolean): void;
}>();

</script>

<style lang="less" scoped>
// 顶部布局
.teacher-info-view-header {
    display: flex;
    align-items: center;

    // 头像
    .el-avatar {
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

// 主体容器
.teacher-info-container {

    // 讲师介绍容器
    .teacher-instruction-container {
        font-style: normal;

        .el-tag {
            color: #bbb;
            font-size: 12px;
            font-weight: 600;
            line-height: 18px;
        }

        // 文本
        .teacher-instruction-content {
            font-size: 14px;
            color: #1b2126;
            font-weight: 400;
            line-height: 24px;
            margin-top: 0.5rem;
            text-indent: 1rem;
        }
    }

    // 讲师历史课程布局
    .teacher-history-course {
        overflow-y: scroll;
        height: 25rem;

        // 讲师历史课程容器
        .course-container {

            // 课程信息
            .course-info {
                padding: 1rem;
                height: 4.2rem;
                line-height: 24px;
                font-style: normal;
                margin-bottom: 1rem;
                border-radius: 0.5rem;
                background-color: #eee;

                // 时间
                .course-info-time {
                    color: #aaa;
                    font-size: 13px;
                }

                // 名称
                .course-info-name {
                    color: #000;
                    font-size: 14px;
                    font-weight: 600;
                }

                // 浏览量
                .course-info-view {
                    color: #aaa;
                    font-size: 13px;
                }
            }

            // 课程载入
            .history-course-loading {
                margin: 2rem 0;
            }
        }
    }
}
</style>