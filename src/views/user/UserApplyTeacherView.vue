<template>
    <!-- 申请讲师视图 -->
    <div class="user-apply-teacher-view">
        <div class="apply-teacher-text">申请讲师</div>
        <el-steps :active="stepId" align-center>
            <el-step title="填写信息" :icon="Edit" />
            <el-step title="等待审批" :icon="Upload" />
            <el-step title="审批结束" :icon="Picture" />
        </el-steps>
        <!-- 申请讲师容器 -->
        <div class="user-apply-teacher-container">
            <div 
                v-if="stepId == 1"
                class="user-apply-teacher-item-container"
            >

                <div class="teacher-certificate-number-container">
                    <div class="certificate-text">教师个人简介:</div>
                    <el-input 
                        :rows="4"
                        type="textarea"
                        v-model="teacherInfo.teacherIntroduction"
                    />
                </div>
                <!-- 教资证书图片容器 -->
                <div class="teacher-certificate-picture-container">
                    <div class="certificate-text">教资证书照片:</div>
                    <el-upload
                            :data="user"
                            :action="actionUrl"
                            :show-file-list="false"
                            class="certificate-picture-upload"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                        <!-- img -->
                        <el-image
                            v-if="showImageUrl" 
                            :src="showImageUrl" 
                            class="certificate-picture-image"
                        />
                        <el-icon v-else class="certificate-picture-icon"><Plus /></el-icon>
                        <div class="certificate-picture-text">上传教资证书</div>
                    </el-upload>
                </div>

                <!-- 教资证书编号容器 -->
                <div class="teacher-certificate-number-container">
                    <div class="certificate-text">教资证书编号:</div>
                    <el-input v-model="teacherInfo.certificateNumber" />
                </div>
                
                <el-button @click="applyTeacher">提交</el-button>
            </div>
            <div 
                v-else-if="stepId == 3"
                class="user-apply-teacher-item-container"
            >
                <div v-if="applyReason == 1" class="apply-success-text">申请成功</div>
                <div v-else-if="applyReason == 2" class="apply-fail-container">
                    <div class="apply-fail-text">申请失败</div>
                    <div class="apply-fail-reason-container">
                        <div class="apply-fail-reason-text">失败原因</div>
                        <el-input 
                            disabled
                            :rows="5"
                            type="textarea"
                            v-model="applyFailReason"
                        />
                    </div>
                    <el-button @click="resetApply">是否重新申请</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { userStore } from '@/stores/user';
import { Edit, Picture, Upload, Plus } from '@element-plus/icons-vue'
import { deleteApply, applyTeacherRole, showApplyTeacherReason } from '@/api/user';

const stepId = ref()
const applyReason = ref(1)

// 用户信息
const user = userStore()
// 图片地址
const showImageUrl = ref()
// 讲师信息
const teacherInfo = ref({
    // 教师资格证照片
    certificatePhoto: '',
    // 教师资格证编号
    certificateNumber: '',
    // 讲师简介
    teacherIntroduction: ''
})
// 失败原因
const applyFailReason = ref()
// 上传证件地址
const actionUrl = ref('http://localhost:8000/user-center-service/front/user/submitTeacherCertificatePhoto')



// 挂载函数
onMounted(() => {
    // 加载申请进度
    loadApplyReason()
}) 

// 重新申请
function resetApply() {
    deleteApply().then(response => {
        if (response.data.code === 200) {
            // 重新加载
            loadApplyReason()
        }
    })
}

// 提交讲师申请
function applyTeacher() {
    // 判空
    if (teacherInfo.value.certificatePhoto == '' ||
        teacherInfo.value.certificateNumber == '' ||
        teacherInfo.value.teacherIntroduction == ''
    ) {
        ElMessage.info('所有信息均需填写')
        return 
    } 

    applyTeacherRole(teacherInfo.value).then(response => {
        if (response.data.code === 200) {
            ElMessage.success('申请已提交')
            
            // 重新加载
            loadApplyReason()
        } 
    })
}

// 加载申请进度
function loadApplyReason() {
    showApplyTeacherReason().then(response => {
        console.log(response.data)
        if (response.data.code === 200) {
            if (response.data.data.status === 0) {
                stepId.value = 2
            } else if (response.data.data.status === 1) {
                stepId.value = 3
                applyReason.value = 1
            } else if (response.data.data.status === 2) {
                stepId.value = 3
                applyReason.value = 2
                // 失败原因
                applyFailReason.value = response.data.data.auditFailureReason
            }
        } else {
            stepId.value = 1
        }
    })
}

// 上传图片之前的回调函数
function beforeAvatarUpload(file: any) {
    // 判断文件大小
    if ((file.size / 1024 / 1024 ) > 5) {
        ElMessage.info('图片大小不能超过5MB')
        return false;
    }

    // 判断文件类型
    if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        ElMessage.info('图片格式仅支持jpg、jpeg、png')
        return false;
    }

    return true;
}

// 上传图片成功后的回调函数
function handleAvatarSuccess(result: any) {
    showImageUrl.value = result.data.newPath
    teacherInfo.value.certificatePhoto = result.data.oldPath
}

</script>

<style lang="less" scoped>
// 申请讲师视图
.user-apply-teacher-view {
    width: 70rem;
    height: 42rem;
    margin-top: 2rem;
    background-color: #fff;

     // 文本
    .apply-teacher-text {
        font-size: 18px;
        color: #9a9a9a;
        padding: 1rem 1.5rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid #eee;
    }

    // 申请讲师容器
    .user-apply-teacher-container {
        display: flex;
        height: 20rem;
        align-items: center;
        justify-content: center;

        .el-steps {
            margin-bottom: 4rem;
        }

        // 元素容器
        .user-apply-teacher-item-container {
            width: 23rem;
            height: 12rem;
            margin-left: -3.5rem;
            
            :deep(.el-textarea__inner) {
                resize: none;
            }

            // 教资证书图片容器
            .teacher-certificate-picture-container {
                display: flex;
                margin-top: 2rem;
                margin-bottom: 2rem;

                .certificate-text {
                    display: flex;
                    margin-right: 1rem;
                    align-items: center;
                    justify-content: center;
                }

                :deep(.el-upload) {
                    display: unset;
                }

                .certificate-picture-upload {
                    height: 10rem;
                    width: 15.5rem;
                    cursor: pointer;
                    border-radius: 6px;
                    border: 1px dashed var(--el-border-color);
                }

                .certificate-picture-upload:hover {
                    border-color: var(--el-color-primary);
                }

                .certificate-picture-image {
                    width: 15.5rem;
                    height: 10rem;
                    display: block;
                }

                .certificate-picture-icon {
                    width: 15.5rem;
                    height: 95px;
                    font-size: 28px;
                    color: #8c939d;
                    margin-top: 1.5rem;
                    text-align: center;
                }

                .certificate-picture-text {
                    height: 5.5vh;
                    font-size: 10px;
                    color: #8c939d;
                    margin-top: -2vh;
                    text-align: center;
                }
            }

            // 教资证书编号容器
            .teacher-certificate-number-container {
                display: flex;

                .certificate-text {
                    display: flex;
                    width: 10rem;
                    margin-right: 0.5rem;
                    align-items: center;
                    justify-content: center;
                }
            }

            // 文本
            .apply-success-text, .apply-fail-text {
                font-size: 36px;
                margin-left: 8.5rem;
                margin-bottom: 2rem;
            }

            // 成功文本
            .apply-success-text {
                color: red;
                margin-top: 3rem;
            }

            // 失败容器
            .apply-fail-container {
                // 失败文本
                .apply-fail-text {
                    margin-top: 0;
                    color: green;
                }

                // 失败容器
                .apply-fail-reason-container {
                    display: flex;
                
                    .apply-fail-reason-text {
                        width: 15rem;
                    }

                    :deep(.el-textarea__inner) {
                        width: 18rem;
                    }
                }
            }
            
            
        }

        .el-button {
            width: 8rem;
            margin-left: 9rem;
            margin-top: 1.5rem;
            border-radius: 1rem;
        }
    }
}
</style>