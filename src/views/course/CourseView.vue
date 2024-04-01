<template>
    <!-- 课程容器 -->
    <div class="course-view-container">
        <!-- 课程视图 -->
        <div class="course-body-view">
            <!-- 课程顶部布局 -->
            <div class="course-header-container">
                <!-- 分类信息 -->
                <div class="course-header-nav">
                    <div class="course-header-nav-text">分类</div>
                    <div 
                        :key="index"
                        v-for="(item, index) in courseCategory"
                        class="course-header-nav-content"
                    >
                        <span 
                            tabindex="0" 
                            class="nav-name"
                            :v-bind="checkCategoryId"
                            @click="checkCourseCategory(item.categoryId)" 
                            :class="{ 'check-span': checkCategoryId === item.categoryId}"
                        >{{ item.categoryName }}</span>
                    </div>
                </div>

                <!-- 专区信息 -->
                <div class="course-header-nav">
                    <div class="course-header-nav-text">专区</div>
                    <div 
                        :key="index"
                        v-for="(item, index) in courseZone"
                        class="course-header-nav-content"
                    >
                        <span 
                            tabindex="0" 
                            class="nav-name" 
                            :v-bind="checkZoneId"
                            @click="checkCourseZone(item.zoneId)" 
                            :class="{ 'check-span': checkZoneId === item.zoneId}"
                        >{{ item.zoneName }}</span>
                    </div>
                </div>
            </div>

            <!-- 课程内容布局 -->
            <div class="course-body-container">
                <!-- 课程内容头部布局 -->
                <div class="course-base-info-header">
                    <!-- 排序栏 -->
                    <div class="course-sort-container">
                        <div 
                            :key="index"
                            class="course-sort"
                            v-for="(item, index) in courseSort"
                        >
                            <span 
                                tabindex="0" 
                                class="nav-name" 
                                :v-bind="checkSortId"
                                @click="checkCourseSort(item.sortId)" 
                                :class="{ 'check-sort': checkSortId === item.sortId}"
                            >{{ item.sortName }}</span>
                        </div>
                    </div>
                    

                    <!-- 搜索栏 -->
                    <div class="course-search">
                        <el-input 
                            type="text" 
                            v-model="courseSearch"
                            placeholder="请输入" 
                            class="course-input" 
                        />
                        <el-icon @click="searchCourse()"><Search /></el-icon>
                    </div>
                </div>

                <!-- 课程内容布局 -->
                <div class="course-base-info-container">
                    <!-- 内容 -->
                    <div class="course-base-info-item-container" >
                        <el-empty v-if="courseInfo == undefined"/>
                        <div
                            v-else
                            v-loading="courseLoading"
                            class="course-base-info-item" 
                            @click="routerCourseVideoPlay(item)"
                            v-for="(item, index) in courseInfo" :key="index"
                        >
                            <el-image :src="item.courseImage"/>
                            <div class="course-instruction-text">
                                <div class="course-title">
                                    {{ item.courseDescription }}
                                </div>
                                <div class="course-base">
                                    <div class="course-money">
                                        <div v-if="item.payMoney" class="course-how-money">￥{{ item.payMoney }}</div>
                                        <div v-else class="course-no-money">免费</div>
                                    </div>
                                    <div class="course-creator">{{ item.creatorName }}</div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <!-- 分页 -->
                    <div class="course-page-container">
                        <el-config-provider :locale="zhCn">
                            <el-pagination
                                background
                                style="float: right;"
                                :total="courseParams.courseTotal"
                                :page-count="courseParams.coursePages"
                                @current-change="handleCurrentChange"
                                layout="total, prev, pager, next,jumper"
                            >
                            </el-pagination>
                        </el-config-provider>
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
    </div>

    <!-- 购买课程弹出框 -->
    <div class="pay-course-dialog-container">
        <PayCourseDialog
            :payMoney="payMoney"
            :payCourseId="payCourseId"
            :isDialogShow="payCourseDialog"
            @update:isDialogShow="(val) => payCourseDialog = val"
        />
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { isPayCourse } from '@/api/pay';
import { userStore } from '@/stores/user';
import { ref, onMounted, watch } from 'vue';
import { showCategory } from '@/api/category';
import { Search } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { showCourseInCourseView } from '@/api/course';
import PayCourseDialog from '@/components/dialog/PayCourseDialog.vue';


// 专区信息 
const courseZone = [
    {
        "zoneId": 0,
        "zoneName": "全部"
    },
    {
        "zoneId": 1,
        "zoneName": "免费专区"
    },
    {
        "zoneId": 2,
        "zoneName": "付费专区"
    },
]
// 排序信息
const courseSort = [
    {
        "sortId": 0,
        "sortName": "综合排序"
    },
    {
        "sortId": 1,
        "sortName": "最新排序"
    },
    {
        "sortId": 2,
        "sortName": "热门排序"
    },
] 
// 购买金额
const payMoney = ref()
// 用户信息
const user = userStore()
// 课程信息
const courseInfo = ref()
// 购买的课程ID
const payCourseId = ref()
// 搜索信息
const courseSearch = ref()
// 选中分区
const checkZoneId = ref(0)
// 选中排序
const checkSortId = ref(0)
// 课程参数
const courseParams = ref({
    zoneId: 0,
    sortId: 0,
    pageSize: 16,
    categoryId: 0,
    currentPage: 1,
    courseName: '',
    courseTotal: 0,
    coursePages: 0
})
// 分类信息
const courseCategory = ref()
// 选中分类
const checkCategoryId = ref(0)
// 课程加载状态
const courseLoading = ref(false)
// 购买课程弹出框
const payCourseDialog = ref(false)


// 挂载函数
onMounted(()=>{
    // 加载课程信息
    loadCourse()
    // 加载类别信息
    loadCategory()
    // 挂载搜索框事件
    showSearchInput()
})

// 加载课程信息
function loadCourse() {
    // 加载
    courseLoading.value = true
    // 封装查询参数
    courseParams.value.sortId = checkSortId.value
    courseParams.value.zoneId = checkZoneId.value
    courseParams.value.categoryId = checkCategoryId.value

    // 发送请求
    showCourseInCourseView(courseParams.value).then(response => {
        if (response.data.code === 200) {
            courseInfo.value = response.data.data.records
            courseParams.value.courseTotal = response.data.data.total
            courseParams.value.coursePages = response.data.data.pages
            setTimeout(() =>{
                courseLoading.value = false
            }, 2000)
        } else {
            courseInfo.value = undefined
        }
    })
}

// 展开搜索框事件
let showSearchInput=()=>{
    let item = document.querySelector(".course-search") as any
    item.addEventListener("mouseenter",() => {
        setTimeout(() => {
            if (courseSearch.value == "") {
                item.style.width = "2.5rem"
            }
        }, 3000)
        item.style.width = "12rem"
    })

}

// 搜索课程信息
function searchCourse() {
    courseParams.value.currentPage = 1
    courseParams.value.coursePages = 1
    courseParams.value.courseName = courseSearch.value
    loadCourse()
}

// 加载类别信息
function loadCategory() {
    showCategory().then(response => {
        if (response.data.code === 200) {
            courseCategory.value = response.data.data
        } else {
            ElMessage.error('类别信息载入失败')
        }
    })
}

// 监听输入框内容
watch(courseSearch,(newVal)=>{
    let item = document.querySelector(".course-search") as any
    if(newVal == "") {
        item.style.width = "2.5rem"
    }
})

// 切换/选择分区信息
function checkCourseSort(sortId: any) {
    checkSortId.value = sortId
    courseParams.value.currentPage = 1
    courseParams.value.coursePages = 1
    loadCourse()
}

// 切换/选择分区信息
function checkCourseZone(zoneId: any) {
    checkZoneId.value = zoneId
    courseParams.value.currentPage = 1
    courseParams.value.coursePages = 1
    loadCourse()
}
 
// 分页事件
function handleCurrentChange(val: any) {
    // 设置当前页
    courseParams.value.currentPage = val
    loadCourse()
}

// 存在金额操作  
function existPayMoneyEvent(item: any) {
    // 赋值
    payMoney.value = item.payMoney
    payCourseId.value = item.courseId
    // 是否存在有效订单
    isPayCourse(item.courseId).then(response => {
        if (response.data.code === 200) {
            router.push({
                name: 'courseVideoPlay',
                params: {
                    courseId: item.courseId
                }
            })
        } else {
            // 是否本人发布的课程
            if (response.data.data) {
                router.push({
                    name: 'courseVideoPlay',
                    params: {
                        courseId: item.courseId
                    }
                })
            } else {
                payCourseDialog.value = true
            }
        }
    })

}
 
// 跳转课程视频播放界面  
function routerCourseVideoPlay(item: any) {
    if (user.isLogin) {
            if (item.payMoney > 0) {
                existPayMoneyEvent(item)
            } else {
                router.push({
                    name: 'courseVideoPlay',
                    params: {
                        courseId: item.courseId
                    }
                })
            }
    } else {
        ElMessage.info('请先登录')
    }
}

// 切换/选择类别信息
function checkCourseCategory(categoryId: any) {
    checkCategoryId.value = categoryId
    courseParams.value.currentPage = 1
    courseParams.value.coursePages = 1
    loadCourse()
}

</script>

<style lang="less" scoped>
@searchColor: #fff;
@searchTextColor: #ddd;

// 课程容器
.course-view-container {
    width: 100%;
    height: 980px;
    margin-top: 0.4rem;
    
    // 课程视图
    .course-body-view {
        // 课程顶部布局
        .course-header-container {
            height: 6rem;
            border-bottom: 1px solid #ddd;

            // 导航栏
            .course-header-nav {
                width: 74.5%;
                display: flex;
                margin-top: 2rem;
                margin-left: 14.5rem;

                // 导航栏文本
                .course-header-nav-text {
                    font-size: 14px;
                    font-weight: 700;
                    font-style: normal;
                    margin-right: 3rem;
                    font-family: "Microsoft YaHei UI";
                }

                // 导航栏内容
                .course-header-nav-content {
                    font-size: 13px;
                    font-style: normal;
                    margin-right: 2.5rem;
                    border-radius: 0.2rem;
                    
                    // 导航栏元素
                    .nav-name {
                        border-radius: 0.3rem;
                        padding: 0.3rem 0.7rem;
                        font-family: "Microsoft YaHei UI";
                    }

                    // 导航栏元素(选中)
                    .check-span {
                        color: #fff;
                        background-color: #f6bb51;
                    }
                }

                // 导航栏内容(悬停)
                .course-header-nav-content:hover {
                    cursor: pointer;
                    color: #f6bb51;
                }

                
            }
        }

        // 课程内容布局
        .course-body-container {
            width: 74.5%;
            margin-top: 1.5rem;
            margin-left: 14.5rem;

            // 课程内容头部布局
            .course-base-info-header {
                display: flex;
                justify-content: space-between;

                // 课程排序栏容器
                .course-sort-container {
                    display: flex;
                    margin-top: 0.5rem;

                    // 课程排序栏
                    .course-sort {
                        font-size: 12px;
                        font-style: normal;
                        font-family: "Microsoft YaHei UI";

                        // 课程排序文本
                        .nav-name {
                            border-radius: 1rem;
                            margin-right: 1.5rem;
                            padding: 0.4rem 0.8rem;
                        }

                        // 课程排序文本(选中)
                        .check-sort {
                            color: #fff;
                            background-color: #4f5156;
                        }
                    }

                    .course-sort:hover {
                        cursor: pointer;
                    }
                }
                
                // 课程搜索栏
                .course-search {
                    zoom: 0.9;
                    width: 2.5rem;
                    height: 2.5rem;
                    padding: 0.7rem;
                    margin-top: -0.5rem;
                    margin-right: 0.6rem;
                    border-radius: 10rem;
                    background-color: @searchColor;
                    
                    display: flex;
                    overflow: hidden;
                    align-items: center;
                    box-sizing: border-box;
                    justify-content: flex-end;
                    
                    z-index: 1;
                    transition: .8s;

                    :deep(.el-icon) {
                        color: @searchTextColor;
                    }
                }

                // 输入框样式
                :deep(.el-input__wrapper) {
                    box-shadow: none;
                    background-color: @searchColor;
                }

                // 输入框文本
                :deep(.el-input__inner) {
                    color: @searchTextColor !important;
                }
                :deep(.el-input__inner::placeholder) {
                    color: @searchTextColor !important;
                }
            }

            // 课程基本信息布局
            .course-base-info-container {

                // 课程基本信息容器
                .course-base-info-item-container {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 1.5rem;
                    justify-content: flex-start;
                    // 课程基本信息项
                    .course-base-info-item {
                        width: 20rem;
                        position: relative;
                        margin: 0 2rem 1.8rem 0;
                        &:nth-child(4n) {
                            margin-right: 0rem;
                        }

                        .el-image {
                            width: 20rem;
                            height: 10rem;
                            display: block;
                            
                        }

                        :deep(.el-image__inner) {
                            border-radius: 0.3rem 0.3rem 0 0;
                        }

                        // 课程文本
                        .course-instruction-text {
                            height: 5rem;
                            padding: 1rem;
                            border-top: none;
                            border: 1px solid #dedede;
                            border-radius: 0 0 0.2rem 0.2rem;

                            // 课程标题
                            .course-title {
                                color: #222;
                                font-size: 14px;
                                font-weight: 400;
                                line-height: 24px;
                                font-style: normal;
                                font-family: "Microsoft YaHei UI";

                                overflow: hidden;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                text-overflow: ellipsis;
                                -webkit-box-orient: vertical;
                            }

                            // 课程标题(悬停)
                            .course-title:hover {
                                cursor: pointer;
                                text-decoration: underline;
                            }

                            // 课程基本信息
                            .course-base {
                                width: 90%;
                                display: flex;
                                bottom: 0.2rem;
                                position: absolute;
                                padding-bottom: 0.7rem;
                                justify-content: space-between;

                                // 课程价格
                                .course-money {
                                    color: #df404a;
                                    font-size: 16px;
                                    font-weight: 700;
                                    font-style: normal;
                                    font-family: "Microsoft YaHei UI";

                                    // 免费
                                    .course-no-money {
                                        font-size: 18px;
                                        color: #f58d23;
                                        margin-top: -0.25rem;
                                    }
                                }

                                // 课程发布者
                                .course-creator {
                                    color: #999;
                                    font-size: 14px;
                                    font-weight: 400;
                                    font-style: normal;
                                    
                                    font-family: "Microsoft YaHei UI";
                                }
                            }
                            
                        }
                    }

                    // 课程基本信息项(悬停)
                    .course-base-info-item:hover {
                        box-shadow: 0px 28px 17px 0px rgba(0,0,0,0.1);
                    }

                    .el-empty {
                        width: 100%;
                    }
                }
                

                // 分页容器
                .course-page-container {
                    display: flex;
                    margin-top: 1rem;
                    margin-bottom: 2.5rem;
                    justify-content: center;
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
}

// 购买课程对话框
.pay-course-dialog-container {
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
}

</style>