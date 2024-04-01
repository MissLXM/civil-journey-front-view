<template>
    <!-- 反馈容器 -->
    <div class="feedback-view-container">
        <!-- 反馈视图 -->
        <div class="feedback-body-view">
            <div class="feedback-menu">
                <div class="feedback-text">反馈服务</div>
                <div class="feedback-menu-item-container">
                    <div 
                        tabindex="0" 
                        :key="index"
                        :v-bind="defaultMenu"
                        class="feedback-menu-item"
                        @click="checkMenuId(item.menuId)"
                        v-for="(item, index) in feedbackMenu"
                        :class="{ 'check-menu': defaultMenu === item.menuId}"
                    >
                        {{ item.menuName }}
                    </div>
                </div>
            </div>
            <div class="feedback-main">
                <RouterView />
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
import router from '@/router';
import { ref, onMounted } from 'vue';

// 界面载入
onMounted(() => {
    // 选中菜单
    checkMenuId(defaultMenu.value)
})

// 菜单
const defaultMenu = ref(1)
const feedbackMenu = ref([
    {
        menuId: 1,
        menuName: "通知中心"
    },
    {
        menuId: 2,
        menuName: "意见反馈"
    },
    {
        menuId: 3,
        menuName: "在线客服"
    }
])
function checkMenuId(menuId: number) {
    defaultMenu.value = menuId

    if (defaultMenu.value == 1) {
        router.push({
            path: "/noticeCenter"
        })
    } else if (defaultMenu.value == 2) {
        router.push({
            path: "/opinionFeedback"
        })
    } else if (defaultMenu.value == 3) {
        router.push({
            path: "/onlineCustomer"
        })
    }
    
}
</script>

<style lang="less" scoped>
// 反馈容器
.feedback-view-container {
    width: 100%;
    height: 980px;
    margin-top: 0.4rem;

    // 反馈视图
    .feedback-body-view {
        width: 74.5%;
        height: 880px;
        display: flex;
        margin-left: 14.5rem;

        // 左侧菜单布局
        .feedback-menu {
            width: 12rem;
            height: 95.45%;
            font-size: 14px;
            margin-top: 1rem;
            font-weight: 400;
            color: #ff5e00;
            line-height: 40px;
            font-style: normal;
            border-radius: 0.3rem;
            background-color: #fff;
            border-right: 1px solid #e5e5e5;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE软雅黑", Arial;


            // 文本
            .feedback-text {
                font-size: 16px;
                margin-top: 1rem;
                line-height: 56px;
                margin-left: 1.5rem;
            }

            // 菜单元素容器
            .feedback-menu-item-container {
                margin-left: 2.5rem;

                // 菜单元素
                .feedback-menu-item {
                    cursor: pointer;
                    padding-left: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 0.2rem;
                    
                }

                // 菜单元素(悬停)
                .feedback-menu-item:hover {
                    background: linear-gradient(90deg,#ffe9c0,#fff);
                }

                // 菜单元素(选中)
                .check-menu {
                    position: relative;
                    background: linear-gradient(90deg,#ffe9c0,#fff);

                    &::before {
                        top: 50%;
                        width: 4px;
                        content: "";
                        height: 18px;
                        left: -12.5px;
                        display: block;
                        position: absolute;
                        border-radius: 4px;
                        transform: translateY(-50%);
                        background-color: #ff8239;
                    }
                }
            }   
            
        }

        .feedback-main {
            width: 75rem;
            margin-left: 1rem;
            border-radius: 0.2rem;
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