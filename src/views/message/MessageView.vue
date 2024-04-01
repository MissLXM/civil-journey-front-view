<template>
    <!-- 资讯容器 -->
    <div class="message-view-container">
        <!-- 资讯视图 -->
        <div class="message-body-view">

            <!-- 考试时间 -->
            <div class="examination-time-container">
                <div class="examination-time-header">
                    <div class="examination-time-header-left">
                        <svg-icon icon-class="calendar" class="examination-icon"/>
                        <div class="examination-time-header-text">考试时间</div>
                    </div>
                    
                </div>

                <div class="examination-time-body">
                    <div class="examination-time-content-container">
                        <div 
                            :key="index"
                            v-for="(item, index) in examTimeInfo"
                            class="examination-time-content"
                        >
                            <div class="examination-time-content-line"></div>
                            <div class="examination-time-content-text">
                                <div class="examination-province">
                                    {{ item.examYear }}{{ item.examProvince }}
                                </div>
                                <div class="examination-time" >
                                    <div class="sign-up-time">
                                        开始报名: {{ item.applyTime }}
                                    </div>
                                    <div class="write-exam-time">
                                        笔试时间: {{ item.examTime }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 招考信息 -->
            <div class="examination-message-container">
                <div class="examination-message-header">
                    <div class="examination-message-header-left">
                        <svg-icon icon-class="information" class="examination-icon"/>
                        <div class="examination-message-header-text">招考信息</div>
                    </div>
                    
                </div>

                <div  class="examination-message-body">
                    <div class="examination-message-body-content-container">
                        <div 
                            :key="index"
                            @click="routerMessageInfo(item.technicalId)"
                            v-for="(item, index) in writeExamMessage"
                            class="examination-message-body-content"
                        >
                            <div class="examination-category">{{ item.categoryName }}</div>
                            <div>&nbsp;|</div>
                            <div class="examination-title">{{ item.technicalContent }}</div>
                        </div>
                    </div>
                    
                    <div class="examination-message-body-content-container">
                        <div 
                            :key="index"
                            @click="routerMessageInfo(item.technicalId)"
                            v-for="(item, index) in interviewMessage"
                            class="examination-message-body-content"
                        >
                            <div class="examination-category">{{ item.categoryName }}</div>
                            <div>&nbsp;|</div>
                            <div class="examination-title">{{ item.technicalContent }}</div>
                        </div>
                    </div>
                    
                    <div class="examination-message-body-content-container">
                        <div 
                            :key="index"
                            @click="routerMessageInfo(item.technicalId)"
                            v-for="(item, index) in armyPostMessage"
                            class="examination-message-body-content"
                        >
                            <div class="examination-category">{{ item.categoryName }}</div>
                            <div>&nbsp;|</div>
                            <div class="examination-title">{{ item.technicalContent }}</div>
                        </div>
                    </div>
                   
                </div>
            </div>

            <!-- 备考资料 -->
            <div class="examination-material-container">
                <div class="examination-material-header">
                    <div class="examination-material-header-left">
                        <svg-icon icon-class="resource" class="examination-icon"/>
                        <div class="examination-material-header-text">备考资料</div>
                    </div>
                </div>

                <div class="examination-material-body">
                    <div class="examination-material-content-container">
                        <div class="examination-material-container-header">
                            <div class="examination-material-container-header-text">
                                公考笔试
                            </div>
                        </div>
                        <div class="examination-material-container-body">
                            <div 
                                :key="index"
                                @click="routerMessageInfo(item.technicalId)"
                                class="examination-material-content"
                                v-for="(item, index) in writeExamMessage.slice(0, 5)"
                            >
                                <el-image
                                    v-if="index == 0" 
                                    :src="item.technicalCover"
                                />
                                <div class="content-text-container">
                                    <div 
                                        :class="index == 0 ? 'first-content-text' : 'content-text'"
                                    >
                                        {{ item.technicalTitle }}
                                    </div>
                                </div>
                                    
                            </div>
                        </div>
                    </div>
                    
                    <div class="examination-material-content-container">
                        <div class="examination-material-container-header">
                            <div class="examination-material-container-header-text">
                                公考面试
                            </div>
                        </div>
                        <div class="examination-material-container-body">
                            <div 
                                :key="index"
                                @click="routerMessageInfo(item.technicalId)"
                                class="examination-material-content"
                                v-for="(item, index) in interviewMessage.slice(0, 5)"
                            >
                                <el-image
                                    v-if="index == 0" 
                                    :src="item.technicalCover"
                                />
                                <div class="content-text-container">
                                    <div 
                                        :class="index == 0 ? 'first-content-text' : 'content-text'"
                                    >
                                    {{ item.technicalTitle }}
                                    </div>
                                </div>
                                    
                            </div>
                        </div>
                    </div>

                    <div class="examination-material-content-container">
                        <div class="examination-material-container-header">
                            <div class="examination-material-container-header-text">
                                军队文职
                            </div>
                        </div>
                        <div class="examination-material-container-body">
                            <div 
                                :key="index"
                                @click="routerMessageInfo(item.technicalId)"
                                class="examination-material-content"
                                v-for="(item, index) in armyPostMessage.slice(0, 5)"
                            >
                                <el-image
                                    v-if="index == 0" 
                                    :src="item.technicalCover"
                                />
                                <div class="content-text-container">
                                    <div 
                                        :class="index == 0 ? 'first-content-text' : 'content-text'"
                                    >
                                    {{ item.technicalTitle }}
                                    </div>
                                </div>
                                    
                            </div>
                        </div>
                    </div>
                </div>
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
import { ref, onMounted } from 'vue'
import { showExamTime, showExamMessage } from '@/api/message'

// 考试时间信息
const examTimeInfo = ref()
// 招考信息军队文职
const armyPostMessage = ref([
    {
        technicalId: '',
        categoryName: '',
        technicalCover: '',
        technicalTitle: '',
        technicalContent: '',
    }
])
// 招考信息公考面试
const interviewMessage = ref([
    {
        technicalId: '',
        categoryName: '',
        technicalCover: '',
        technicalTitle: '',
        technicalContent: '',
    }
])
// 招考信息公考笔试
const writeExamMessage = ref([
    {
        technicalId: '',
        categoryName: '',
        technicalCover: '',
        technicalTitle: '',
        technicalContent: '',
    }
])

// 挂载函数
onMounted(() => {
    // 加载考试时间信息
    loadExamTime()
    // 加载招考信息
    loadExamMessage()
})

// 加载考试时间信息
function loadExamTime() {
    showExamTime().then(response => {
        if (response.data.code === 200) {
            examTimeInfo.value = response.data.data
        } else {
            ElMessage.error('考试时间信息载入失败')
        }
    })
}

// 加载招考信息
function loadExamMessage() {
    showExamMessage().then(response => {
        writeExamMessage.value = response.data.data.technicalOne
        interviewMessage.value = response.data.data.technicalTwo
        armyPostMessage.value = response.data.data.technicalThree
    })
}

// 跳转资讯详情页 
function routerMessageInfo(id: any) {
    // 拼接地址
    // router.push({ path: `/messageInfo/${id}` })

    // params传递
    router.push({
        name: 'messageInfo',
        params: {
            technicalId: id
        }
    })
}
</script>

<style lang="less" scoped>
// 资讯容器
.message-view-container {
    width: 100%;
    height: 980px;
    margin-top: 0.4rem;

    // 资讯视图
    .message-body-view {
        margin-left: 14.5rem;

        // 图标
        .examination-icon {
            width: 30px;
            height: 30px;
        }

        // 考试时间
       .examination-time-container {
            margin-top: 2rem;

            // 考试时间顶部
           .examination-time-header {
                width: 84.5%;
                padding-bottom: 1rem;
                border-bottom: 1px solid #ddd;

                // 顶部左侧
                .examination-time-header-left {
                    display: flex;

                    // 文本
                    .examination-time-header-text {
                        font-size: 24px;
                        font-weight: 400;
                        line-height: 26px;
                        margin-top: 0.2rem;
                        font-style: normal;
                        margin-left: 0.5rem;
                    }
                }
            }

            // 考试时间内容
            .examination-time-body {
                margin-top: 1rem;

                // 内容容器
                .examination-time-content-container {
                    width: 84.5%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;

                    // 时间内容
                    .examination-time-content {
                        width: 17rem;
                        cursor: pointer;
                        position: relative;
                        padding: 0 1.5rem;
                        margin-right: 1.8rem;
                        margin-bottom: 1.5rem;
                        border-radius: 0.3rem;
                        background-color: #e2e2e2;

                        &:nth-child(4n) {
                            margin-right: 0rem;
                        }

                        // 竖线
                        .examination-time-content-line {
                            top: 20px;
                            left: 20px;
                            width: 3px;
                            height: 37px;
                            position: absolute;
                            border-radius: 2.5px;
                            background-color: #f58d23;
                        }

                        // 文本
                        .examination-time-content-text {
                            display: flex;
                            padding: 1.2rem 0;
                            margin-left: 0.7rem;

                            // 考试省份
                            .examination-province {
                                width: 8rem;
                                font-size: 20px;
                                margin-top: 0.5rem;
                            }

                            // 考试时间
                            .examination-time {
                                width: 10rem;
                                font-size: 14px;
                                // 开始时间
                                .sign-up-time {
                                    margin-bottom: 0.5rem;
                                }
                            }
                        }
                    }
                }
            }

        }

        // 招考信息
        .examination-message-container {
            margin-top: 1rem;

            // 招考信息顶部
            .examination-message-header {
                width: 84.5%;
                padding-bottom: 1rem;
                border-bottom: 1px solid #ddd;
                // 顶部左侧
                .examination-message-header-left {
                    display: flex;

                    .examination-message-header-text {
                        font-size: 24px;
                        font-weight: 400;
                        line-height: 26px;
                        margin-top: 0.2rem;
                        font-style: normal;
                        margin-left: 0.5rem;
                    }
                }
            }

            // 招考信息内容
            .examination-message-body {
                width: 84%;
                color: #666;
                display: flex;
                margin-top: 1rem;
                justify-content: space-between;

                .examination-message-body-content {
                    display: flex;
                    font-size: 18px;
                    cursor: pointer;
                    line-height: 34px;
                    font-style: normal;
                    font-family: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", STHeiTi, "Microsoft Sans Serif", sans-serif;

                    .examination-category {
                        
                        font-weight: 600;
                    }
                        
                    .examination-title {
                        margin-top: 0.1rem;
                        margin-left: 0.5rem;

                        width: 20rem;
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                    }
                }

                .examination-message-body-content:hover {
                    color: #f58d23;
                }
            }
        }

        // 备考资料
       .examination-material-container {
            margin-top: 2rem;

            // 备考资料顶部
           .examination-material-header {
                width: 84.5%;
                padding-bottom: 1rem;
                border-bottom: 1px solid #ddd;
                // 顶部左侧
                .examination-material-header-left {
                    display: flex;

                    // 顶部文本
                    .examination-material-header-text {
                        font-size: 24px;
                        font-weight: 400;
                        line-height: 26px;
                        margin-top: 0.2rem;
                        font-style: normal;
                        margin-left: 0.5rem;
                    }
                }

            }

            // 备考资料内容
            .examination-material-body {
                display: flex;
                margin-top: 1.5rem;

                // 备考资料内容容器
                .examination-material-content-container {
                    width: 26rem;
                    color: #666;
                    margin-right: 3.5rem;

                    // 备考资料内容容器顶部
                    .examination-material-container-header {
                        height: 2rem;
                        position: relative;
                        margin-bottom: 1rem;
                        border-bottom: 1px dashed #ddd;

                        ::after {
                            content: "";
                            left: 0;
                            right: 5;
                            width: 5rem;
                            height: 3px;
                            margin: auto;
                            bottom: -0.1rem;
                            position: absolute;
                            border-radius: 3px;
                            background-color: #f58d23;
                        }
                        // 文本
                        .examination-material-container-header-text {
                            font-size: 20px;
                            cursor: pointer;
                            color: #f58d23;
                            font-weight: 400;
                            line-height: 26px;
                        }
                    }

                    // 备考资料内容容器内容
                    .examination-material-container-body {
                        margin-bottom: 3rem;

                        // 备考资料内容
                        .examination-material-content {
                            display: flex;
                            cursor: pointer;
                            margin-bottom: 1rem;

                            // 图片
                            .el-image {
                                width: 15rem;
                                height: 8rem;
                                border-radius: 0.5rem;
                            }

                            // 文本容器
                            .content-text-container {

                                // 文本
                                .content-text {
                                    font-size: 16px;
                                    font-weight: 400;
                                    line-height: 24px;
                                    font-style: normal;

                                    overflow: hidden;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 1;
                                    text-overflow: ellipsis;
                                    -webkit-box-orient: vertical;
                                    
                                }

                                // 第一个文本
                                .first-content-text {
                                    color: #000;
                                    line-height: 24px;
                                    padding-left: 0.8rem;

                                    overflow: hidden;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 3;
                                    text-overflow: ellipsis;
                                    -webkit-box-orient: vertical;
                                }

                                // 文本(悬停)
                                .content-text:hover, .first-content-text:hover {
                                    cursor: pointer;
                                    color: #f58d23;
                                }

                            }
                            
                        }
                    }
                }
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