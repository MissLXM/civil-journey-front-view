<template>
    <!-- 用户中心视图 -->
    <div class="user-center-view">
        <!-- 用户中心容器 -->
        <div class="user-center-container">
            <!-- 左侧导航栏容器 -->
            <div class="user-center-left-container">
                <div class="user-center-text">个人中心</div>
                <div   
                    :key="index"
                    class="user-center-nav-container"
                    v-for="(item, index) in userCenterNav"
                >
                    <div 
                        tabindex="0"
                        class="nav-item"
                        v-if="item.isShow"
                        :v-bind="defaultNav"
                        @click="checkNavItem(item.navId, 0)"
                        :class="{ 'check-nav': defaultNav === item.navId }"
                    >
                        {{ item.navName }}
                    </div>
                </div>
            </div>
            <!-- 有侧导航栏容器 -->
            <div class="user-center-right-container">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { userStore } from '@/stores/user';

// 用户信息
const user = userStore()
// 路由信息
const route = useRoute()
// 选中导航栏
const defaultNav = ref(1)
// 导航栏信息
const userCenterNav = ref([
    {
        navId: 1,
        navName: '个人信息',
        isShow: true
    },
    {
        navId: 2,
        navName: '文章信息',
        isShow: true
    },
    {
        navId: 3,
        navName: '课程信息',
        isShow: true
    },
    {
        navId: 4,
        navName: '我的订单',
        isShow: true
    },
    {
        navId: 5,
        navName: '成为讲师',
        isShow: true
    },
    {
        navId: 6,
        navName: '发布课程',
        isShow: true
    },
])
// 是否为教师(是--发布课程、否--成为讲师)
const isTeacher = user.isTeacher

 

// 页面加载 
onMounted(() => {
    if (route.params.navId != undefined) {
        if (route.params.navId == '2-1') {
            defaultNav.value = 2
        } else {
            defaultNav.value = Number(route.params.navId) 
        }
        // 加载导航栏
        loadNav()
        // 加载跳转界面
        if (route.params.navId == '2-1') {
            checkNavItem(defaultNav.value, 1)
        } else {
            checkNavItem(defaultNav.value, 3)
        }
    } else {
        // 加载导航栏
        loadNav()
        // 加载跳转界面
        checkNavItem(defaultNav.value, 0)
    }
    
})

// 加载导航栏
function loadNav() {
    if (isTeacher) {
        for (var i = 0; i < userCenterNav.value.length; i++) {
            if (userCenterNav.value[i].navId == 5) {
                userCenterNav.value[i].isShow = false
            }
        }
    } else {
        for (var j = 0; j < userCenterNav.value.length; j++) {
            if (userCenterNav.value[j].navId == 6) {
                userCenterNav.value[j].isShow = false
            }
        }
    }
}
 
// 根据导航栏ID跳转界面
function checkNavItem(navItem: any,childrenNavId: any) {
    defaultNav.value = navItem
    if (defaultNav.value == 1) {
        router.push({
            path: '/userInfo'
        })
    } else if (defaultNav.value == 2) {
        if (childrenNavId == 0) {
            router.push({
                path: '/userArticleInfo'
            })
        } else {
            router.push({
                name: 'userArticleInfoParams',
                params: {
                    childrenNavId: childrenNavId
                }
            })
        }
        
    } else if (defaultNav.value == 3) {
        router.push({
            path: '/userCourseInfo'
        })
    } else if (defaultNav.value == 4) {
        router.push({
            path: '/userOrderInfo'
        })
    } else if (defaultNav.value == 5) {
        router.push({
            path: '/userApplyTeacher'
        })
    } else if (defaultNav.value == 6) {
        router.push({
            path: '/userReleaseCourse'
        })
    } else {
        console.log('没有该路由')
    }
}
</script>

<style lang="less" scoped>
// 用户中心视图
.user-center-view {
    width: 100%;
    height: 980px;
    margin-top: 0.4rem;

    // 用户中心容器
    .user-center-container {
        display: flex;
        margin-left: 14.5rem;

        // 左侧导航栏容器
       .user-center-left-container {
            width: 12rem;
            height: 980px;
            font-size: 14px;
            font-weight: 400;
            color: #ff5e00;
            line-height: 40px;
            font-style: normal;
            background-color: #fff;
            border-right: 1px solid #e5e5e5;
            font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE软雅黑", Arial;

            // 文本
            .user-center-text {
                font-size: 16px;
                margin-top: 0.6rem;
                line-height: 56px;
                margin-left: 1.5rem;
            }

            // 导航栏
            .user-center-nav-container {
                margin-left: 2.5rem;
                
                // 导航栏元素
                .nav-item {
                    cursor: pointer;
                    padding-left: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 0.2rem;

                }
                
                // 导航栏元素(悬停)
                .nav-item:hover {
                    background: linear-gradient(90deg,#ffe9c0,#fff);
                }

                // 导航栏元素(选中)
                .check-nav {
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

        // 右侧容器
        .user-center-right-container {
            margin-left: 1rem;                
        }
    }
}
</style>