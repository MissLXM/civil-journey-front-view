<!-- eslint-disable no-irregular-whitespace -->
<template>
    <!-- 用户基本信息 -->
    <div class="user-base-info">
        <div class="user-base-info-text">个人信息</div>
        <!-- 用户基本信息视图 -->
        <div class="user-base-info-view">
            <!-- 用户基本信息容器 -->
            <div class="user-base-info-container">
                <!-- 顶部布局 -->
                <div class="user-header-container">
                    <!-- 头像容器 -->
                    <div class="user-avatar-container">
                        <div class="user-avatar-text">头　　像:</div>
                        <el-upload
                            :action="actionUrl"
                            :data="userInfoStore"
                            class="avatar-uploader"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img 
                                v-if="user.headPortrait" 
                                :src="user.headPortrait" 
                            />
                            <img 
                                v-else
                                src= "@/assets/img/defaultAvatar.png"
                            />
                        </el-upload>
                        <!-- 介绍文本 -->
                        <div class="instruction-text">
                            <div class="header-title">上传说明:</div>
                            <div class="footer-title">建议尺寸为100*100px, 支持JPG, JPEG, PNG格式, 限制2M以内</div>
                        </div>
                    </div>
                    <div class="free-number-container">
                        <div class="free-number-text">视频免费观看次数剩余:{{ user.viewVideoNumber }}</div>
                        <el-tag type="info" @click="viewMedal()">查看勋章</el-tag>
                    </div>
                </div>
                <!-- 基本信息容器 -->
                <div class="user-info-container">
                    <div class="user-info-item">
                        <div class="user-info-item-text">用户邮箱:</div>
                        <el-input 
                            disabled
                            v-model="user.userEmail"
                        />
                    </div>
                    <!-- 用户信息 -->
                    <div class="user-info-item">
                        <div class="user-info-item-text">性　　别:</div>
                        <el-radio-group 
                            disabled
                            v-model="user.gender" 
                        >
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                            <el-radio label="3">未知</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="user-info-item">
                        <div class="user-info-item-text">登录名称:</div>
                        <el-input 
                            disabled
                            v-model="user.username"
                        />
                    </div>
                    <div class="user-info-item">
                        <div class="user-info-item-text">用户昵称:</div>
                        <el-input 
                            disabled
                            v-model="user.nickname"
                        />
                    </div>
                    <div class="user-info-signature">         
                        <div class="user-info-item-text">个性签名:</div>
                        <el-input 
                            :rows="4"
                            disabled
                            type="textarea"
                            v-model="user.signature"
                        />
                    </div>
                </div>
                <!-- 底部布局 -->
                <div class="user-footer-container">
                    <div class="button-container">
                        <el-button @click="updatePasswordDialog = true">修改密码</el-button>
                        <el-button @click="updateUserInfoEvent()">修改信息</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 用户勋章弹出框 -->
    <div class="user-medal-dialog-container">
        <el-dialog
            v-model="userMedalDialog"
        >
            <!-- 勋章视图 -->
            <div class="medal-info-view">
                <!-- 勋章容器 -->
                <div class="medal-info-container">
                    <div class="medal-info-title">已拥有勋章</div>
                    <div class="medal-item-container">
                        <el-tooltip 
                            :key="index"
                            effect="light"
                            placement="bottom" 
                            v-for="(item, index) in possessMedalInfo" 
                        >
                            <template #content>
                                <span class="tooltip-text">{{ item.medalName }}-{{ item.medalLevel }}</span>
                            </template>
                            <el-image :src="item.medalIcon"/>
                        </el-tooltip>
                    </div>
                </div>
                <!-- 勋章容器 -->
                <div class="medal-info-container">
                    <div class="medal-info-title">所有勋章</div>
                    <div class="medal-item-container">
                        <el-tooltip 
                            :key="index"
                            effect="light"
                            placement="bottom"  
                            v-for="(item, index) in allMedalInfo" 
                        >
                            <template #content>
                                <span class="tooltip-text">{{ item.medalName }}-{{ item.medalLevel }}</span>
                                <br/>
                                <span class="tooltip-text">{{ item.medalExplain }}</span>
                            </template>
                            <el-image :src="item.medalIcon"/>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>

    <!-- 修改密码弹出框 -->
    <div class="update-password-dialog-container">
        <el-dialog
            v-model="updatePasswordDialog"
        >
            <div class="update-password-title">修改密码</div>
            <div class="update-password-container">
                <div class="update-password-item">
                    <div class="update-password-item-text">密　　码:</div>
                    <el-input 
                        show-password
                        type="password"
                        v-model="updatePassword"
                    />
                </div>
                <div class="update-password-item">
                    <div class="update-password-item-text">确认密码:</div>
                    <el-input 
                        show-password
                        type="password"
                        v-model="updatePasswordConfirm"
                    />
                </div>
            </div>
            <div class="button-container">
                <el-button type="primary" @click="updatePasswordEvent()">确定</el-button>
                <el-button @click="updatePasswordDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>

    <!-- 修改基本信息弹出框 -->
    <div class="update-user-info-dialog-container">
        <el-dialog
            v-model="updateUserInfoDialog"
        >
            <div class="update-user-info-text">修改基本信息</div>
            <div class="update-user-info-container">
                <div class="update-user-info-item-container">
                    <div class="update-user-info-item">
                        <div class="update-user-info-item-text">用户邮箱:</div>
                        <el-input 
                            v-model="updateUser.userEmail"
                        />
                    </div>
                    <!-- 用户信息 -->
                    <div class="update-user-info-item">
                        <div class="update-user-info-item-text">性　　别:</div>
                        <el-radio-group 
                            v-model="updateUser.gender" 
                        >
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                            <el-radio label="3">未知</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="update-user-info-item">
                        <div class="update-user-info-item-text">登录名称:</div>
                        <el-input 
                            v-model="updateUser.username"
                        />
                    </div>
                    <div class="update-user-info-item">
                        <div class="update-user-info-item-text">用户昵称:</div>
                        <el-input 
                            v-model="updateUser.nickname"
                        />
                    </div>
                    <div class="update-user-info-signature">         
                        <div class="update-user-info-item-text">个性签名</div>
                        <el-input 
                            :rows="4"
                            type="textarea"
                            v-model="updateUser.signature"
                        />
                    </div>
                </div>
            </div>
            <div class="button-container">
                <el-button type="primary" @click="updateUserInfoOperation()">确定</el-button>
                <el-button @click="updateUserInfoDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userStore } from '@/stores/user';
import { userInfo, medalInfo, updatePwd, updateUserInfo } from '@/api/user';

// 用户信息
const user = ref({
    gender: '',
    nickname: '',
    username: '',
    signature: '',
    userEmail: '',
    headPortrait: '',
    viewVideoNumber: 0,
})
// 修改用户信息
const updateUser = ref({
    gender: '',
    username: '',
    nickname: '',
    signature: '',
    userEmail: '',
})
// 所有勋章信息
const allMedalInfo = ref()
const updatePassword = ref()
// 拥有勋章信息
const possessMedalInfo = ref()
// 用户存储信息
const userInfoStore = userStore()
const updatePasswordConfirm = ref()
// 弹出框标识
const userMedalDialog = ref(false)
const updatePasswordDialog = ref(false)
const updateUserInfoDialog = ref(false)
// 修改头像地址
const actionUrl = ref('http://localhost:8000/user-center-service/front/user/updateUserAvatar')


// 挂载函数
onMounted(() => {
    // 加载用户基本信息
    loadUserInfo()
})

// 展示勋章信息
function viewMedal() {
    // 加载所有勋章信息
    loadMedalInfo()
    // 展示弹出框
    userMedalDialog.value = true
}

// 加载用户基本信息  
function loadUserInfo() {
    userInfo().then(response => {
        if (response.data.code === 200) {
            // 基本信息赋值
            user.value = response.data.data
            userInfoStore.username = response.data.data.username
            userInfoStore.nickname = response.data.data.nickname
            
            // 判断性别
            if (response.data.data.gender === '男') {
                user.value.gender = '1'
            } else if (response.data.data.gender === '女') {
                user.value.gender = '2'
            } else {
                user.value.gender = '3'
            }

            // 可免费观看数
            if (response.data.data.viewVideoNumber != null) {
                user.value.viewVideoNumber = response.data.data.viewVideoNumber
            } else {
                user.value.viewVideoNumber = 0
            }

            // 获取拥有勋章信息
            possessMedalInfo.value = response.data.data.medalInfoVos
        } else {
            ElMessage.error('用户信息载入失败')
        }
    })
} 

// 加载所有勋章信息
function loadMedalInfo() {
    medalInfo().then(response => {
        if (response.data.code === 200) {
            allMedalInfo.value = response.data.data
        } else {
            ElMessage.error('勋章信息载入失败')
        }
    })
}
 
// 修改密码操作事件
function updatePasswordEvent() {
    // 判空
    if (updatePassword.value === '' || updatePassword.value === undefined || updatePassword.value === null) {
        ElMessage.info('请输入密码')
        return 
    }
    // 判断
    if (!(updatePassword.value.length >= 6 && updatePassword.value.length <= 15)) {
        ElMessage.info('密码的有效范围为6-15个字符')
        return
    }
    // 判断两个密码是否相同
    if (updatePassword.value === updatePasswordConfirm.value) {
        // 修改请求
        updatePwd(updatePassword.value).then(response => {
            console.log(response)
            if (response.data.code === 200) {
                ElMessage.success('修改密码成功')
                // 关闭弹出框
                updatePasswordDialog.value = false
                // 清空用户存储信息
                userInfoStore.resetParams()
                // 跳转首页
                userInfoStore.routerHome() 
            } else {
                ElMessage.error(response.data.message)
            }
        })
    } else {
        ElMessage.info('两次输入的密码不相同')
    }
}

// 修改用户信息事件
function updateUserInfoEvent() {
    // 数据回显
    updateUser.value.gender = user.value.gender
    updateUser.value.username = user.value.username
    updateUser.value.nickname = user.value.nickname
    updateUser.value.signature = user.value.signature
    updateUser.value.userEmail = user.value.userEmail

    // 弹出框
    updateUserInfoDialog.value = true
}

// 修改用户信息操作
function updateUserInfoOperation() {
    // 判断性别
    if (updateUser.value.gender === '1') {
        updateUser.value.gender = '男'
    } else if (updateUser.value.gender === '2') {
        updateUser.value.gender = '女'
    } else {
        updateUser.value.gender = '未知'
    }
    updateUserInfo(updateUser.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success(response.data.message)
            // 更新用户信息
            loadUserInfo()
            // 关闭弹出框
            updateUserInfoDialog.value = false
        } else {
            ElMessage.error(response.data.message)
        }
    })
}

// 上传头像之前的回调函数
function beforeAvatarUpload(file: any) {
    // 判断文件大小
    if ((file.size / 1024 / 1024 ) > 2) {
        ElMessage.info('图片大小不能超过2MB')
        return false;
    }

    // 判断文件类型
    if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        ElMessage.info('图片格式仅支持jpg、jpeg、png')
        return false;
    }

    return true;
}

// 上传头像成功回调函数
function handleAvatarSuccess(result: any) {
    // 头像
    user.value.headPortrait = result.data
    // 用户存储的头像
    userInfoStore.userAvatar = result.data
} 

</script>

<style lang="less" scoped>
// 用户基本信息
.user-base-info {
    width: 70rem;
    height: 34rem;
    margin-top: 2rem;
    background-color: #fff;
    // 文本
    .user-base-info-text {
        font-size: 20px;
        font-weight: 600;
        padding-left: 2rem;
        padding-top: 1.5rem;
    }

    // 用户基本信息视图
    .user-base-info-view {
        display: flex;
        color: #333;
        font-size: 13px;
        font-weight: 400;
        line-height: 35px;
        margin-left: 4rem;
        margin-top: 1.5rem;
        font-style: normal;
        align-items: center;
        justify-content: center;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\\5FAE软雅黑", Arial;
        // 用户基本信息容器
        .user-base-info-container {
            width: 48rem;
            height: 25rem;

            // 顶部容器
            .user-header-container {
                width: 100%;
                display: flex;
                align-items: center;
                margin-bottom: 1.5rem;

                // 头像容器
                .user-avatar-container {
                    width: 68%;
                    display: flex;

                    // 文本
                    .user-avatar-text {
                        display: flex;
                        margin-top: -1rem;
                        margin-right: 1rem;
                        align-items: center;
                        justify-content: center;
                    }

                    // 上传
                    .el-upload {

                        img {
                            width: 80px;
                            height: 80px;
                            border-radius: 10rem;
                        }
                    }

                    // 介绍文本
                    .instruction-text {
                        font-size: 12px;
                        color: #9b9b9b;
                        line-height: 25px;
                        margin-top: 1.8rem;
                        margin-left: 0.8rem;
                    }
                }
                
                // 免费次数
                .free-number-container {
                    margin-top: -1rem;

                    // 标签
                    .el-tag {
                        cursor: pointer;
                        margin-left: 2rem;
                    }
                }
                
            }

            // 基本信息容器
            .user-info-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;

                // 用户信息元素
                .user-info-item {
                    width: 20rem;
                    display: flex;
                    margin-right: 2rem;
                    margin-bottom: 2rem;

                    &:nth-child(2n) {
                        margin-right: 0rem;
                    }

                    // 文本
                    .user-info-item-text {
                        width: 4.5rem;
                        margin-right: 1rem;
                    }

                    .el-radio-group {
                        margin-left: -0.8rem;
                    }
                }

                // 个性签名
                .user-info-signature {
                    display: flex;
                    width: 87.5%;
                    .user-info-item-text {
                        width: 4.5rem;
                        margin-right: 0.5rem;
                    }

                    :deep(.el-textarea__inner) {
                        resize: none;
                    }
                }
            }

            // 底部容器
            .user-footer-container {
                width: 87.5%;
                display: flex;
                margin-top: 2rem;
                align-items: center;
                justify-content: center;

                // 按钮容器
                .button-container {
                    
                    .el-button {
                        margin-left: 5rem;

                        &:nth-child(1) {
                            margin-left: 0rem;
                        }
                    }
                }

            }
        }
    }
}

// 用户勋章弹出框
.user-medal-dialog-container {

    // 对话框
    :deep(.el-dialog) {
        width: 40%; 
        border-radius: 0.8rem;
    }

    // 对话框顶部
    :deep(.el-dialog__header) {
        padding: 0;
    }

    // 勋章视图
    .medal-info-view {
        margin-top: 1rem;

        // 勋章容器
        .medal-info-container {
            margin-bottom: 2rem;

            // 文本
            .medal-info-title {
                margin-bottom: 1rem;
                padding: 0 0 0.5rem 0;
                border-bottom: 1px solid #eee;
            }

            // 列表容器
            .medal-item-container {
                margin-left: 1.8rem;

                // 图片大小
                :deep(.el-image__inner) {
                    width: 80px;
                    height: 80px;
                    margin-right: 2rem;
                    
                }
            }   
        }

    }
}

// 修改密码弹出框
.update-password-dialog-container {

    // 对话框
    :deep(.el-dialog) {
        width: 30%; 
        border-radius: 0.8rem;
    }

    // 对话框顶部
    :deep(.el-dialog__header) {
        padding: 0;
    }

    // 修改密码容器
    .update-password-container {
        width: 60%;
        margin-top: 2rem;
        margin-left: 6rem;

        // 元素
        .update-password-item {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            
            // 文本
            .update-password-item-text {
                width: 5rem;
            }
        }
    }

    // 按钮容器
    .button-container {
        width: 100%;
        margin-top: 2rem;
        margin-left: 9.5rem;

        .el-button {
            width: 5rem;
            margin-right: 3rem;
            border-radius: 1rem;
        }
    }

}


// 修改基本信息弹出框
.update-user-info-dialog-container {
    // 对话框
    :deep(.el-dialog) {
        width: 40%; 
        border-radius: 0.8rem;
        
    }

    // 对话框顶部
    :deep(.el-dialog__header) {
        padding: 0;
    }

    // 修改信息容器
    .update-user-info-container {
        display: flex;
        margin-top: 1.5rem;
        align-items: center;
        justify-content: center;

        // 元素容器
        .update-user-info-item-container {
            width: 25rem;

            // 元素
            .update-user-info-item {
                display: flex;
                align-items: center;
                margin-bottom: 1rem;

                &:nth-child(2) {
                    // 元素文本
                    .update-user-info-item-text {
                        width: 4.2rem;
                        margin-right: 0.5rem;
                    }
                }

                // 元素文本
                .update-user-info-item-text {
                    width: 5rem;
                    margin-right: 0.5rem;
                }

            }

            // 个性签名
            .update-user-info-signature {
                .update-user-info-item-text {
                    margin-bottom: 0.5rem;
                }
                :deep(.el-textarea__inner) {
                    resize: none;
                }
            }
        }
    }

    // 按钮容器
    .button-container {
        width: 100%;
        margin-top: 2rem;
        margin-left: 14.5rem;

        .el-button {
            width: 5rem;
            margin-right: 3rem;
            border-radius: 1rem;
        }
    }
}
</style>