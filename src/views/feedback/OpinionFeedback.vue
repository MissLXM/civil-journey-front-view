<template>
    <!-- 意见反馈容器 -->
    <div class="opinion-feedback-container">
        <!-- 意见反馈主体 -->
        <div class="opinion-feedback-body">
            <div class="opinion-feedback-title">
                <div class="opinion-feedback-title-text">
                    意见反馈
                </div>
            </div>
            <div class="opinion-feedback-content">
                <el-input 
                    :rows="12"
                    type="textarea"
                    maxlength="500"
                    show-word-limit
                    v-model="opinionContent"
                />
            </div>
            <div class="opinion-feedback-button">
                <el-button @click="submitOpinionEvent()">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { userStore } from '@/stores/user';
import { submitOpinion } from '@/api/feedback';

// 用户存储
const user = userStore()
// 意见反馈内容
const opinionContent = ref()

// 提交意见反馈事件 
function submitOpinionEvent() {
    console.log(opinionContent.value)
    if (opinionContent.value != '' && opinionContent.value != undefined) {
        submitOpinion(user.username, opinionContent.value).then(response => {
            if (response.data.code === 200) {
                ElMessage.success( '提交意见成功')
                opinionContent.value = null
            } else {
                ElMessage.error('提交意见失败')
            }
        })
    } else {
        ElMessage.info('请输入意见内容')
    }
}
</script>

<style lang="less" scoped>
// 意见反馈容器
.opinion-feedback-container {
    width: 90%;
    height: 92%;
    display: flex;
    margin-top: 1rem;
    padding: 1rem 2rem;
    align-items: center;
    border-radius: 0.3rem;
    justify-content: center;
    background-color: #fff;
    
    // 意见反馈主体
    .opinion-feedback-body {
        width: 50rem;
        height: 30rem;
        border-radius: 0.5rem;
        background-color: antiquewhite;

        // 标题
        .opinion-feedback-title {
            width: 100%;
            height: 7rem;
            display: flex;
            align-items: center;
            justify-content: center;

            .opinion-feedback-title-text {
                font-size: 32px;
                font-weight: 700;
            }
        }

        // 内容
        .opinion-feedback-content {
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
            justify-content: center;

            .el-textarea {
                width: 40rem;
            }

            :deep(.el-textarea__inner) {
                resize: none;
            }
        }

        // 按钮
        .opinion-feedback-button {
            display: flex;
            align-items: center;
            justify-content: center;

            .el-button {
                width: 12rem;
                border-radius: 1rem;
                --el-button-active-bg-color: #fff;
            }

            .el-button:hover {
                color: #aaa;
                background: #ff853f;
            }

            .el-button:active {
                background: #ff853f;
            }

            .el-button:focus {
                background: #fff;
                border-color: #dcdfe6;
            }
        }
    }
}
</style>