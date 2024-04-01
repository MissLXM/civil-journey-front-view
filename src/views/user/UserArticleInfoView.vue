<template>
    <!-- 用户文章视图 -->
    <div class="user-article-info-view">
        <!-- 用户文章视图 -->
        <div class="user-article-info-container">
            <!-- 导航栏容器 -->
            <div class="user-article-info-nav-container">
                <!-- 导航栏 -->
                <div class="user-article-info-nav">
                    <!-- 导航栏元素 -->
                    <div 
                    :key="index"
                        :v-bind="defaultNav"
                        @click="routerNav(item.navId)"
                        class="user-article-info-nav-item" 
                        v-for="(item, index) in userArticleNav" 
                        :class="{ 'check-nav': defaultNav === item.navId }"
                    >
                        <svg-icon :icon-class="item.icon"/>
                        <div class="user-article-info-nav-item-name">{{ item.navName }}</div>
                    </div>
                </div>
            </div>

            <!-- 用户文章主体容器 -->
            <div class="user-article-info-body-container">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref,onMounted } from 'vue';
import { useRoute } from 'vue-router';

// 路由信息
const route = useRoute()
// 导航栏
const defaultNav = ref(1)
const userArticleNav = ref([
    {
        navId: 1,
        icon: 'course-collection',
        navName: '收藏夹'
    },
    {
        navId: 2,
        icon: 'article-history',
        navName: '浏览历史'
    },
    {
        navId: 3,
        icon: 'article-release',
        navName: '已发布文章'
    },
])

 

// 挂载函数
onMounted(() => {
    if (route.params.childrenNavId != undefined) {
        defaultNav.value = Number(route.params.childrenNavId)
        routerNav(defaultNav.value)
    } else {
        routerNav(defaultNav.value)
    }
}) 

// 导航路由
function routerNav(navId: any) {
    defaultNav.value = navId
    if (defaultNav.value == 1) {
        router.push({
            path: '/userArticleCollection'
        })
    } else if (defaultNav.value == 2) {
        router.push({
            path: '/userArticleHistory'
        })
    } else if (defaultNav.value == 3) {
        router.push({
            path: '/userArticleRelease'
        })
    } else {
        console.log("不存在该路由")
    }
}
</script>

<style lang="less" scoped>
// 用户文章视图
.user-article-info-view {
    width: 71rem;
    margin-top: 2rem;
    background-color: #fff;

    // 用户文章容器
    .user-article-info-container {

        // 导航栏容器
        .user-article-info-nav-container {
            padding-left: 1rem;
            border-bottom: 1px solid #eee;

            // 导航栏
            .user-article-info-nav {
                display: flex;

                font-size: 14px;
                font-weight: 400;
                font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE软雅黑", Arial;
                
                // 导航栏元素
                .user-article-info-nav-item {
                    display: flex;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    margin-top: 0.8rem;
                    margin-bottom: 0.5rem;

                    // 文本
                    .user-article-info-nav-item-name {
                        margin-left: 0.3rem;
                    }
                }

                // 导航栏元素(悬停)
                .user-article-info-nav-item:hover {
                    color: #ff7420;
                }

                // 导航栏元素(选中)
                .check-nav {
                    color: #fff;
                    background-color: #ffb300e8;
                }
            }
        }
    }
}
</style>