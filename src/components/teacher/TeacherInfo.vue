<template>
    <!-- 讲师信息对话框 -->
    <div class="teacher-info-view-container">
        <el-dialog v-model="teacherInfoDialog">
            <div class="teacher-info-view-header">
                <el-image :src="combineImageUrl('avatar/default.png')"/>
                <div class="teacher-base-info">
                    <div class="teacher-name">
                        <span class="teacher-name-text">吴伟杰</span>
                        <el-tag type="warning">讲师</el-tag>
                    </div>
                    <div class="teacher-title">公途学堂优质讲师</div>
                </div>
            </div>

            <div class="teacher-info-view-nav">
                <div class="teacher-info-nav">
                    <span tabindex="1" class="teacher-info-nav-item">简介</span>
                    <span tabindex="1" class="teacher-info-nav-item">历史课程</span>
                </div>
            </div>

            <div class="teacher-info-container">
                <RouterView />
            </div>

        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { combineImageUrl } from '@/global';
import { ref } from 'vue';

const teacherInfoDialog = ref(false)
</script>

<style lang="less" scoped>
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
            
            // 导航栏聚集
            .teacher-info-nav-item:focus {
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

            // 第一个导航栏
            .teacher-info-nav-item:first-child {
                margin-right: 2.5rem;
            }
        }
    }
}
</style>