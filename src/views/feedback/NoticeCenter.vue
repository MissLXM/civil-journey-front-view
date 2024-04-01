<template>
    <!-- 通知中心容器 -->
    <div 
        @scroll="userNoticeLoad"
        class="message-center-container"
    >
        <!-- 通知信息容器 -->
        <div class="message-info-container">
            <div class="message-info-text">消息中心</div>
            <div class="message-info-item-container">
                <el-empty v-if="noticeAllInfo == undefined"/>
                <div 
                    v-else
                    :key="index"
                    @click="showNoticeInfo(item)"
                    class="message-info-item"
                    v-for="(item, index) in noticeAllInfo"
                >
                    <!-- 左侧布局 -->
                    <div class="message-info-left-container">
                        <el-avatar 
                            :size="50"
                            :src="item.senderAvatar"
                        />
                        <div class="informer-name">{{ item.senderName }}</div>
                    </div>

                    <!-- 右侧布局 -->
                    <div class="message-info-right-container">
                        <div class="message-info-right-container-header">
                            <div class="message-title">{{ item.noticeTitle }}</div>
                            <div class="message-time">{{ item.createTime }}</div>
                            <el-tag type="warning">{{ item.noticeType }}</el-tag>
                            <div class="message-state">
                                <div v-if="item.state == 0" class="state-zero">[未读]</div>
                                <div v-if="item.state == 1" class="state-one">[已读]</div>
                            </div>
                        </div>
                        <div class="message-content">
                            {{ item.noticeContent }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 通知加载 -->
            <div 
                class="message-loading"
                v-loading="messageLoading"
            >
                <div v-if="isLoadMax" style="text-align: center;">到底啦！！！兄嘚</div>
            </div>
        </div>
    </div>

    <!-- 通知详细弹出框 -->
    <div class="notice-info-dialog">
        <el-dialog v-model="noticeInfoDialog">
            <!-- 通知顶部布局 -->
            <div 
                v-if="noticeInfo"
                class="notice-info-view-header" 
            >
                <el-avatar :src="noticeInfo.senderAvatar"/>
                <div class="notice-base-info">
                    <div class="sender-name">
                        <span class="sender-name-text">{{ noticeInfo.senderName }}</span>
                        <el-tag type="warning">{{ noticeInfo.noticeType }}</el-tag>
                    </div>
                </div>
            </div>
            <!-- 通知介绍容器 -->
            <div 
                v-if="noticeInfo"
                class="notice-instruction-container"
            >
                <h3 class="notice-instruction-title">
                    {{ noticeInfo.noticeTitle }}
                </h3>
                <div class="notice-instruction-content">
                    {{ noticeInfo.noticeContent }}
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { showUserNotice, updateNoticeStatus } from '@/api/feedback';

// 分页参数
const pageParams = ref({
    currentPage: 1,
    pageSize: 7
})
// 用户通知详细信息
const noticeInfo = ref()
// 用户所有通知信息
const noticeAllInfo = ref()
// 是否加载完毕
const isLoadMax = ref(false)
// 用户通知加载状态
const messageLoading = ref(false)
// 用户通知详情弹窗
const noticeInfoDialog = ref(false)


// 挂载函数
onMounted(() => {
    // 加载用户通知信息
    loadUserNotice(false)
})

// 滚动加载用户通知信息
const userNoticeLoad = () => {
    messageLoading.value = true
    setTimeout(() => {
        pageParams.value.currentPage++
        loadUserNotice(true)
    }, 2500)

}

// 展示用户通知详情
function showNoticeInfo(notice: any) {
    // 更新已读状态
    updateNoticeStatus(notice.noticeUserId).then(response => {
        if (response.data.code === 200) {
            noticeInfoDialog.value = true
            noticeInfo.value = notice
        } else {
            ElMessage.error('读取用户通知详情失败')
        }
    })

    // 重新加载
    loadUserNotice(false)
    
}

// 加载用户通知信息
function loadUserNotice(isLoad: boolean) {
    showUserNotice(pageParams.value).then(response => {
        if (response.data.code === 200) {
            if (isLoad) {
                noticeAllInfo.value = noticeAllInfo.value.concat(response.data.data.records)
            } else {
                noticeAllInfo.value = response.data.data.records
            }
        } else {
            if (isLoad) {
                isLoadMax.value = true
            } else {
                if (!isLoadMax.value) {
                    noticeAllInfo.value = undefined
                }
            }
        }
    })
    messageLoading.value = false
}
 
</script>

<style lang="less" scoped>
// 消息中心容器
.message-center-container {
    width: 90%;
    height: 89%;
    margin-top: 1rem;
    padding: 1rem 2rem;
    overflow-y: scroll;
    border-radius: 0.5rem;
    padding-bottom: 2.5rem;
    background-color: #fff;

    // 消息信息容器
    .message-info-container {
        // 消息文本
        .message-info-text {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 1rem;
        }

        // 消息信息元素(容器)
        .message-info-item-container {
            // 消息信息元素
            .message-info-item {
                width: 100%;
                height: 6rem;
                display: flex;

                margin-bottom: 1rem;
                border-radius: 0.5rem;
                background-color: #eee;

                // 左侧布局
                .message-info-left-container {
                    width: 6rem;
                    height: 6rem;

                    // 头像
                    .el-avatar {
                        margin-top: 0.7rem;
                        margin-left: 1.3rem;
                        margin-bottom: 0.4rem;
                    }

                    // 文本
                    .informer-name {
                        width: 6rem;
                        font-size: 12px;
                        text-align: center;
                    }
                }

                // 右侧布局
                .message-info-right-container {
                    font-size: 14px;
                    margin-top: 0.8rem;
                    font-style: normal;
                    font-family: "Microsoft YaHei", "Microsoft Sans Serif", "Microsoft SanSerf", "微软雅黑";

                    // 顶部
                    .message-info-right-container-header {
                        display: flex;

                        // 标题
                        .message-title {
                            color: #333;
                            font-weight: 700;
                            line-height: 24px;
                        }

                        // 时间
                        .message-time {
                            color: #999;
                            font-size: 12px;
                            font-weight: 400;
                            line-height: 22px;
                            margin-top: 0.01rem;
                            margin-left: 0.5rem;
                        }

                        // 标签
                        .el-tag {
                            zoom: 0.75;
                            margin-top: 0.15rem;
                            margin-left: 0.5rem;
                        }

                        // 状态
                        .message-state {
                            zoom: 0.9;
                            color: #666;
                            font-size: 10px;
                            margin: 0.2rem 0 0 0.3rem;
                            
                            // 未读
                            .state-zero {
                                color: rgb(255, 121, 121);
                            }
                        }
                    }

                    // 内容
                    .message-content {
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
        

        // 消息载入
        .message-loading {
            margin: 2rem 0;
        }
    }
}

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
.notice-info-view-header {
    display: flex;
    align-items: center;

    // 头像
    .el-avatar {
        width: 5rem;
        height: 5rem;
    }

    // 基本信息
    .notice-base-info {
        height: 4.5rem;
        align-items: center;
        margin-left: 1.5rem;
        display: inline-grid;

        // 姓名
        .sender-name {

            // 姓名文本
            .sender-name-text {
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
</style>