<template>
    <!-- 用户课程视图 -->
    <div class="user-course-info-view">
        <!-- 用户课程视图 -->
        <div class="user-course-info-container">
            <!-- 导航栏容器 -->
            <div class="user-course-info-nav-container">
                <!-- 导航栏 -->
                <div class="user-course-info-nav">
                    <!-- 导航栏元素 -->
                    <div 
                        :key="index"
                        :v-bind="defaultNav"
                        @click="routerNav(item.navId)"
                        class="user-course-info-nav-item" 
                        v-for="(item, index) in userCourseNav" 
                        :class="{ 'check-nav': defaultNav === item.navId }"
                    >
                        <svg-icon :icon-class="item.icon"/>
                        <div class="user-course-info-nav-item-name">{{ item.navName }}</div>
                    </div>
                </div>
            </div>

            <!-- 用户课程主体容器 -->
            <div class="user-course-info-body-container">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref,onMounted } from 'vue';
 
onMounted(() => {
    routerNav(defaultNav.value)
})

// 导航栏
const defaultNav = ref(1)
const userCourseNav = ref([
    {
        navId: 1,
        icon: 'course-collection',
        navName: '课程收藏夹'
    },
    {
        navId: 2,
        icon: 'video-history',
        navName: '视频浏览历史'
    }
])
function routerNav(navId: any) {
    defaultNav.value = navId
    if (defaultNav.value == 1) {
        router.push({
            path: '/userCourseCollection'
        })
    } else if (defaultNav.value == 2) {
        router.push({
            path: '/userVideoHistory'
        })
    } else {
        console.log("不存在该路由")
    }
}
</script>

<style lang="less" scoped>
// 用户课程视图
.user-course-info-view {
    width: 70rem;
    margin-top: 2rem;
    background-color: #fff;

    // 用户课程容器
    .user-course-info-container {

        // 导航栏容器
        .user-course-info-nav-container {
            padding-left: 1rem;
            border-bottom: 1px solid #eee;

            // 导航栏
            .user-course-info-nav {
                display: flex;

                font-size: 14px;
                font-weight: 400;
                font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE软雅黑", Arial;
                
                // 导航栏元素
                .user-course-info-nav-item {
                    display: flex;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    margin-top: 0.8rem;
                    margin-bottom: 0.5rem;

                    // 文本
                    .user-course-info-nav-item-name {
                        margin-left: 0.3rem;
                    }
                }

                // 导航栏元素(悬停)
                .user-course-info-nav-item:hover {
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