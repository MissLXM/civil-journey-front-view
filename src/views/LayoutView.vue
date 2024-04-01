<template>
    <!-- 布局 -->
    <div class="layout">
        <!-- 布局容器 -->
        <el-container>
            <!-- 顶部菜单栏 -->
            <el-header :offset="0">
                <!-- 固钉 -->
                <el-affix>
                    <!-- 导航栏卡片 -->
                    <el-card>
                        <!-- 导航栏 -->
                        <el-menu
                            router
                            mode="horizontal"
                            @select="handleMenuSelect"
                            :default-active="menuIndex"
                        >
                            <img src='@/assets/img/logo-all.png'/>
                            <el-menu-item
                                :key="index"
                                :index="item.routerUrl"
                                v-for="(item, index) in menuNav"
                            >
                                {{ item.navName }}
                            </el-menu-item>
                            <div 
                                v-if="!user.isLogin" 
                                class="login-or-register-text" 
                                @click="showLoginOrRegisterDialog"
                            >
                                登录/注册
                            </div>
                            <!-- 登录后的下拉容器 -->
                            <div 
                                v-else 
                                class="dropdown-container" 
                            >
                                <el-dropdown>
                                    <div class="user-base-info-container">
                                        <el-avatar 
                                            :size="35"
                                            :src="user.userAvatar"
                                        />
                                        <div class="user-name-container">
                                            <div class="user-name">{{ user.nickname }}</div>
                                            <el-icon class="icon-arrow-down"><ArrowDown /></el-icon>
                                        </div>
                                    </div>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item @click="routerUserCenter">个人中心</el-dropdown-item>
                                            <el-dropdown-item @click="routerArticleRelease">发布文章</el-dropdown-item>
                                            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>
                            </div>
                        </el-menu>
                    </el-card>
                </el-affix>
            </el-header>
            <!-- 主题区域 -->
            <el-main>
                <RouterView/>
            </el-main>
        </el-container>
    </div>

    <!-- 登录或注册对话框 -->
    <div class="login-or-register-view-container">
        <LoginOrRegisterDialog 
            :isDialogShow="loginOrRegisterDialog"
            @update:isDialogShow="(val) => loginOrRegisterDialog = val"
        />
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, onMounted } from 'vue'
import { userLogout } from '@/api/user'
import { userStore } from '@/stores/user';
import { ArrowDown } from '@element-plus/icons-vue'
import LoginOrRegisterDialog from '@/components/dialog/LoginOrRegisterDialog.vue'

// 菜单路由
const menuNav = ref([
    {
        navName: '首页',
        routerUrl: '/home'
    },
    {
        navName: '课程学习',
        routerUrl: '/course'
    },
    {
        navName: '文章分享',
        routerUrl: '/article'
    },
    {
        navName: '资讯信息',
        routerUrl: '/message'
    },
    {
        navName: '反馈服务',
        routerUrl: '/feedback'
    }
])
// 用户存储
const user = userStore()
// 选中菜单
const menuIndex = ref('/home')
// 登录/注册弹出框
let loginOrRegisterDialog = ref(false)

// 挂载
onMounted(() => {
    // 获取当前路由
    menuIndex.value = router.currentRoute.value.fullPath
})

// 点击登出按钮
function logout() {
    if (user.isLogin) {
        userLogout().then(response => {
            if (response.data.code === 200) {
                ElMessage.success('登出成功')
                // 跳转到首页
                router.push({
                    path: '/home',
                })
                menuIndex.value = '/home'
                // 清空用户信息
                user.resetParams()
            }    
        })
    } else {
        ElMessage.info('请先登录')
    }
}

// 跳转用户中心
function routerUserCenter() {
    router.push({
        path: '/userCenter',
    })
}


function routerArticleRelease() {
    router.push({
        path: '/articleRelease',
    })
}

// 登录/注册弹出框展示
function showLoginOrRegisterDialog() {
    loginOrRegisterDialog.value = true
}

// 菜单选中(是否登录)
function handleMenuSelect(index: any) {
    if (user.isLogin) {
        menuIndex.value = index
    }
}

</script>

<style lang="less" scoped>
// 全局颜色变量
@menuDefaultColor: #fff;
@defaultColor: #8d8d8d;
@menuSelectColor: #f6bb51;
// 布局
.layout {
    // 布局容器
    .el-container {

        // 顶部(深度)
        :deep(.el-header) {
            --el-header-padding: 0px;
        }
        
        // 顶部区域
        .el-header {
            z-index: 99;
            // 导航栏卡片
            .el-card {

                // 导航栏卡片(深度)
                :deep(.el-card__body) {
                    padding:  0.5rem;
                    background-color: @menuDefaultColor;
                }

                // 导航栏菜单
                .el-menu {
                    height: 3rem;
                    border-bottom: none;
                    background-color:  @menuDefaultColor;
                
                    // 平台图标
                    img {
                        width: 6rem;
                        height: 3rem;
                        margin-left: 13.5rem;
                        margin-right: 1rem;
                    }

                    // 导航栏元素
                    .el-menu-item {
                        transition: none;
                        color: @defaultColor !important;
                    }

                    // 导航栏元素(悬停)
                    .el-menu-item:hover {
                        color: @menuSelectColor !important;
                        background-color:  @menuDefaultColor;
                    }

                    // 导航栏元素(聚焦)
                    .el-menu-item:focus {
                        background-color:  @menuDefaultColor; 
                    }

                    // 导航栏元素(激活)
                    .el-menu-item.is-active {
                        color: @menuSelectColor !important;
                        border-bottom: 3px solid @menuSelectColor !important;
                    }

                    // 登录/注册
                    .login-or-register-text {
                        width: 44.5%;
                        font-size: 14px;
                        cursor: pointer;
                        text-align: right;
                        margin-top: 1.1rem;
                        color: @defaultColor;
                    }

                    // 登录/注册(悬停)
                    .login-or-register:hover {
                        color: @menuSelectColor;
                    }

                    // 下拉容器
                    .dropdown-container {
                        width: 44%;
                        font-size: 14px;
                        cursor: pointer;
                        text-align: right;
                        margin-top: 0.4rem;
                        color: @defaultColor;

                        // 通知图标
                        .icon-bell {
                            margin-top: 0.3rem;
                        }

                        // 用户信息容器
                        .user-base-info-container {
                            display: flex;
                            margin-left: 1.5rem;

                            // 用户名称容器
                            .user-name-container {
                                display: flex;
                                font-size: 12px;
                                margin-top: 0.75rem;
                                margin-left: 0.6rem;
                                
                                // 下拉图标容器
                                .icon-arrow-down {
                                    margin-left: 0.2rem;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 主题区域(深度)
        :deep(.el-main) {
            --el-main-padding: 0px;
        }

        // 主题区域
        .el-main {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f2f3f5;
        }
    }
}

// 登录或注册对话框
.login-or-register-view-container {
    // 对话框
    :deep(.el-dialog) {
        width: 30%; 
        border-radius: 0.8rem;
    }

    :deep(.el-dialog__header) {
        padding: 0;
    }
}
</style>