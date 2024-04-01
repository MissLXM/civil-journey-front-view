<template>
    <!-- 资讯视图 -->
    <div class="message-info-view">
        <!-- 资讯容器 -->
        <div class="message-info-container">
            <!-- 顶部布局 -->
            <div class="message-info-header-container">
                <div class="message-info-title">{{ messageInfo.technicalTitle }}</div>
                <div class="message-base-info">
                    <div class="message-info-creator">{{ messageInfo.creatorName }}</div>
                    <div class="message-info-categoryName">{{ messageInfo.categoryName }}</div>
                    <div class="message-info-time">{{ messageInfo.createTime }}</div>
                </div>
            </div> 
            <!-- 主体布局 -->
            <div class="message-info-body-container">
                <div 
                    v-html="messageInfo.technicalContent"
                    class="message-info-content"
                />
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
import { ref, onMounted } from 'vue';
// 路由参数对象
import { useRoute }  from "vue-router";
import { showMessageInfo } from '@/api/message';

// 路由参数
const route = useRoute()
// 资讯信息
const messageInfo = ref({
    createTime: '',
    creatorName: '',
    categoryName: '',
    technicalTitle: '',
    technicalContent: ''
})



// 挂载函数
onMounted(() => {
    // 加载资讯详情
    loadMessageInfo(route.params.technicalId)
})

// 加载资讯详情
function loadMessageInfo(technicalId: any) {
    showMessageInfo(technicalId).then(response => {
        if (response.data.code === 200) {
            console.log(response.data)
            messageInfo.value = response.data.data
        }
    })
}

</script>

<style lang="less" scoped>
// 资讯视图
.message-info-view {
    width: 100%;
    height: 980px;
    margin-top: 0.4rem; 

    // 资讯容器
    .message-info-container {
        width: 74%;
        margin-top: 2rem;
        font-weight: 400;
        font-style: normal;
        margin-bottom: 2rem;
        margin-left: 14.5rem;
        border-radius: 0.3rem;
        background-color: #fff;
        font-family: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", STHeiTi, "Microsoft Sans Serif", sans-serif;

        // 顶部布局
        .message-info-header-container {
            text-align: center;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;

            // 标题
            .message-info-title {
                font-size: 30px;
                padding: 2rem 0 1rem 0;
                color: #3c464f;
                line-height: 45px;
            }

            // 基础信息
            .message-base-info {
                width: 100%;
                display: flex;
                font-size: 14px;
                font-weight: 600;
                line-height: 22px;
                align-items: center;
                justify-content: center;

                // 发布者
                .message-info-creator {
                    margin-right: 2rem;
                }

                // 资讯类型
                .message-info-categoryName {
                    margin-right: 2rem;
                }
            }
        }

        // 主体布局
        .message-info-body-container {
            padding: 2rem;
            text-indent: 2em;

            // 内容
            .message-info-content {
                min-height: 45rem;
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