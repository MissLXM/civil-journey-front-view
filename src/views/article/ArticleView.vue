<template>
    <!-- 文章容器 -->
    <div 
        class="article-view-container"
        v-infinite-scroll="articleLoad"
    >
        <!-- 文章视图 -->
        <div class="article-body-view">
            <!-- 文章顶部布局 -->
            <div class="article-header-container">
                <!-- 分类信息 -->
                <div class="article-header-nav">
                    <div class="article-header-nav-text">分类</div>
                    <div 
                        :key="index"
                        v-for="(item, index) in articleCategory"
                        class="article-header-nav-content"
                    >
                        <span 
                            tabindex="0" 
                            class="nav-name"
                            :v-bind="checkCategoryId"
                            @click="checkArticleCategory(item.categoryId)" 
                            :class="{ 'check-span': checkCategoryId === item.categoryId}"
                        >{{ item.categoryName }}</span>
                    </div>
                </div>

                <!-- 专区信息 -->
                <div class="article-header-nav">
                    <div class="article-header-nav-text">专区</div>
                    <div 
                        :key="index"
                        v-for="(item, index) in articleZone"
                        class="article-header-nav-content"
                    >
                        <span 
                            tabindex="0" 
                            class="nav-name" 
                            :v-bind="checkZoneId"
                            @click="checkArticleZone(item.zoneId)" 
                            :class="{ 'check-span': checkZoneId === item.zoneId}"
                        >{{ item.zoneName }}</span>
                    </div>
                </div>
            </div> 

            <!-- 文章内容布局 -->
            <div class="article-body-container">

                <!-- 精选文章区域 -->
                <div class="choice-article">
                    <!-- 精选文章顶部 -->
                    <div class="choice-article-header"> 
                        <!-- 标题文本 -->
                        <div class="choice-article-text">精选文章</div>
                        <div class="choice-article-other">共计{{ choiceArticleNumber }}条</div>
                    </div>

                    <el-empty v-if="choiceArticle == undefined" />
                    <!-- 精选文章容器 -->
                    <el-card 
                        v-else
                        :key="index"
                        @click="routerArticleInfo(item.articleId)"
                        v-loading="choiceArticleLoading"
                        v-for="(item, index) in choiceArticle" 
                    >
                        <el-image class="article-img" v-if="item.articleImage"  :src="item.articleImage"/>
                        <el-image class="article-img" v-else  :src="'../../public/favicon.ico'"/>
                        <div class="article-title"> {{ item.articleTitle }} </div>
                        <div class="article-content" v-html="htmlToString(item.articleContent)" />
                        
                        <!-- 精选文章底部布局 -->
                        <div class="article-bottom">
                            <div class="article-author"> 作者:&nbsp;&nbsp;{{ item.creatorName }} </div>
                            <div class="article-time"> 发布日期: {{ item.createTime }} </div>

                            <div class="article-sundry-number">
                                <div class="article-view sundry-number"> 
                                    <svg-icon icon-class="view" class="sundry-number-icon"/>
                                    <div class="sundry-number-text"> {{ item.browseNumber }} </div>
                                </div>
                                <div class="article-praise-number sundry-number"> 
                                    <svg-icon icon-class="praise" class="sundry-number-icon"/>
                                    <div class="sundry-number-text"> {{ item.likeNumber }} </div>
                                </div>
                                <div class="article-comment-number sundry-number">
                                    <svg-icon icon-class="article-collection" class="sundry-number-icon"/> 
                                    <div class="sundry-number-text"> {{ item.collectionNumber }} </div>
                                </div>
                            </div>
                            
                        </div>
                    </el-card>
                </div>

                <!-- 文章顶部内容布局 -->
                <div class="article-base-info-header">
                    <!-- 排序栏 -->
                    <div class="article-sort-container">
                        <div 
                            :key="index"
                            class="article-sort"
                            v-for="(item, index) in articleSort"
                        >
                            <span 
                                tabindex="0" 
                                class="nav-name" 
                                :v-bind="checkSortId"
                                @click="checkArticleSort(item.sortId)" 
                                :class="{ 'check-sort': checkSortId === item.sortId}"
                            >{{ item.sortName }}</span>
                        </div>
                    </div>
                    
                    <!-- 搜索栏 -->
                    <div class="article-search">
                        <el-input 
                            type="text" 
                            v-model="articleSearch"
                            placeholder="请输入" 
                            class="article-input" 
                        />
                        <el-icon @click="searchArticle()"><Search /></el-icon>
                    </div>
                </div>

                <!-- 所有文章区域 -->
                <div class="all-article-body-container">
                    <!-- 文章左侧布局容器 -->
                    <div class="all-article-body-left-container">
                        <el-empty v-if="allArticle == undefined" />
                        <el-card 
                            v-else
                            :key="index"
                            class="all-article-body"
                            @click="routerArticleInfo(item.articleId)"
                            v-loading="articleLoading"
                            v-for="(item, index) in allArticle" 
                        >
                            <!-- 所有文章左侧布局 -->
                            <div class="all-article-left">
                                <div class="article-title"> {{ item.articleTitle }} </div>
                                <div class="article-content" v-html="htmlToString(item.articleContent)" />
                                <div 
                                    :class="item.articleImg == null || item.articleImg == '' ? 'all-article-left-bottom-imgNull' : 'all-article-left-bottom'"
                                >
                                    <div class="article-sundry-number">
                                        <div class="article-view sundry-number"> 
                                            <svg-icon icon-class="view" class="sundry-number-icon"/>
                                            <div class="sundry-number-text"> {{ item.browseNumber }} </div>
                                        </div>
                                        <div class="article-praise-number sundry-number"> 
                                            <svg-icon icon-class="praise" class="sundry-number-icon"/>
                                            <div class="sundry-number-text"> {{ item.likeNumber }} </div>
                                        </div>
                                        <div class="article-comment-number sundry-number">
                                            <svg-icon icon-class="article-collection" class="sundry-number-icon"/> 
                                            <div class="sundry-number-text"> {{ item.collectionNumber }} </div>
                                        </div>
                                    </div>
                                    <div class="article-author-time">
                                        <div class="article-author"> {{ item.creatorName }} </div>
                                        <div class="article-time"> {{ item.createTime }} </div>       
                                    </div> 
                                </div>
                                
                            </div>

                            <!-- 所有文章右侧布局 -->
                            <div class="all-article-right" v-if="item.articleImage != null && item.articleImage != ''">
                                <el-image class="article-img" :src="item.articleImage"/>
                            </div>

                        </el-card>

                        <!-- 文章加载 -->
                        <div 
                            class="article-loading"
                            v-loading="countLoading"
                        >
                            <div v-if="isLoadMax" style="text-align: center;">到底啦！！！兄嘚</div>
                        </div>
                    </div>

                    <!-- 文章右侧布局容器 -->
                    <div class="all-article-body-right-container">
                        <el-affix target=".all-article-body-right-container" :offset="50">
                            <!-- 热门学习笔记 -->
                            <div class="hot-article-sort-container">
                                <div class="hot-article-container-header">
                                    <div class="hot-article-title">学习笔记</div>
                                </div>
                                <div class="hot-article-body">
                                    <div 
                                        :key="index"
                                        @click="routerArticleInfo(item.articleId)"
                                        v-for="(item, index) in hotNoteArticle"
                                        class="hot-article-content"
                                    >
                                        <div class="hot-article-content-title">{{ item.articleTitle }}</div>
                                        <div class="hot-article-content-view">
                                            <svg-icon icon-class="view" class="view-icon"/> 
                                            <div class="view-number">{{ item.browseNumber }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 热门解题技巧 -->
                            <div class="hot-article-sort-container">
                                <div class="hot-article-container-header">
                                    <div class="hot-article-title">解题技巧</div>
                                </div>
                                <div class="hot-article-body">
                                    <div 
                                        :key="index"
                                        class="hot-article-content"
                                        @click="routerArticleInfo(item.articleId)"
                                        v-for="(item, index) in hotSkillArticle"
                                    >
                                        <div class="hot-article-content-title">{{ item.articleTitle }}</div>
                                        <div class="hot-article-content-view">
                                            <svg-icon icon-class="view" class="view-icon"/> 
                                            <div class="view-number">{{ item.browseNumber }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-affix>
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
</template>

<script setup lang="ts">
import router from '@/router';
import { htmlToString } from '@/global'
import { ref, watch, onMounted } from 'vue';
import { showCategory } from '@/api/category';
import { Search } from '@element-plus/icons-vue'
import { showAllArticle, showChoiceArticle, showHotNoteArticle, showHotSkillArticle } from '@/api/article'

// 专区信息
const articleZone = [
    {
        "zoneId": 0,
        "zoneName": "全部"
    },
    {
        "zoneId": 1,
        "zoneName": "解题技巧"
    },
    {
        "zoneId": 2,
        "zoneName": "学习笔记"
    },
]
// 排序信息
const articleSort = [
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
// 全部文章
const allArticle = ref()
// 选中专区
const checkZoneId = ref(0)
// 选中排序
const checkSortId = ref(0)
// 加载文章参数
const articleParams = ref({
    sortId: 0,
    zoneId: 0,
    pageSize: 8,
    categoryId: 0,
    currentPage: 1,
    articleTitle: ''
})
// 精选文章
const choiceArticle = ref()
// 搜索信息
const articleSearch = ref()
// 是否加载完毕
const isLoadMax = ref(false)
// 热门学习笔记
const hotNoteArticle = ref()
// 分类信息
const articleCategory = ref()
// 热门解题技巧
const hotSkillArticle = ref()
// 选中分类
const checkCategoryId = ref(0)
// 加载动画
const countLoading = ref(false)
// 精选文章数量
const choiceArticleNumber = ref()
// 文章加载动画
const articleLoading = ref(false)
// 精选文章加载
const choiceArticleLoading = ref(false)
 


// 挂载函数
onMounted(()=>{
    // 加载分类
    loadCategory()
    // 挂载搜索框事件
    showSearchInput()
    // 加载精选文章
    loadChoiceArticle()
    // 加载热门解题技巧
    loadHotNoteArticle()
    // 加载所有文章
    loadAllArticle(false)
    // 加载热门学习笔记
    loadHotSkillArticle()
})

// 加载分类信息
function loadCategory() {
    showCategory().then(response => {
        if (response.data.code === 200) {
            articleCategory.value = response.data.data
        }
    })
}

// 展开搜索框事件
let showSearchInput=()=>{
    let item = document.querySelector(".article-search") as any
    item.addEventListener("mouseenter",() => {
        setTimeout(() => {
            if (articleSearch.value == "") {
                item.style.width = "2.5rem"
            }
        }, 3000)
        item.style.width = "12rem"
    })

}

// 查询文章信息
function searchArticle() {
    articleParams.value.pageSize = 8
    articleParams.value.currentPage = 1
    articleParams.value.articleTitle = articleSearch.value
    loadAllArticle(false)
}

// 加载文章信息
const articleLoad = () => {
    countLoading.value = true
    setTimeout(() => {
        articleParams.value.currentPage++
        loadAllArticle(true)
        countLoading.value = false
    }, 1000)
}

// 加载精选文章 
function loadChoiceArticle() {
    choiceArticleLoading.value = true
    showChoiceArticle({ currentPage: 1, pageSize: 6 }).then(response => {
        if (response.data.code === 200) {
            choiceArticle.value = response.data.data.records
            choiceArticleNumber.value = response.data.data.total
            setTimeout(() =>{
                choiceArticleLoading.value = false
            }, 1000)
        }
    })
}

// 加载热门学习笔记
function loadHotNoteArticle() {
    showHotNoteArticle().then(response => {
        if (response.data.code === 200) {
            hotNoteArticle.value = response.data.data
        }
    })
}

// 监听输入框内容
watch(articleSearch,(newVal)=>{
    let item = document.querySelector(".article-search") as any
    if(newVal == "") {
        item.style.width = "2.5rem"
    }
})

// 加载热门解题技巧
function loadHotSkillArticle() {
    showHotSkillArticle().then(response => {
        if (response.data.code === 200) {
            hotSkillArticle.value = response.data.data
        }
    })
}

// 跳转文章详细界面 
function routerArticleInfo(id: any) {
    router.push({
        name: 'articleInfo',
        params: {
            articleId: id
        }
    })
}

// 切换/选择专区信息
function checkArticleZone(zoneId: any) {
    checkZoneId.value = zoneId
    articleParams.value.currentPage = 1
    loadAllArticle(false)
}

// 切换/选择排序信息
function checkArticleSort(sortId: any) {
    checkSortId.value = sortId
    articleParams.value.currentPage = 1
    loadAllArticle(false)
}
 
// 加载所有文章
function loadAllArticle(isLoad: boolean) {
    // 加载
    if (isLoad == false) {
        articleLoading.value = true
    }

    // 封装查询参数
    articleParams.value.sortId = checkSortId.value
    articleParams.value.zoneId = checkZoneId.value
    articleParams.value.categoryId = checkCategoryId.value

    showAllArticle(articleParams.value).then(response => {
        if (response.data.code === 200) {
            isLoadMax.value = false
            if (isLoad) {
                allArticle.value = allArticle.value.concat(response.data.data.records)
            } else {
                allArticle.value = response.data.data.records
            }
            setTimeout(() =>{
                articleLoading.value = false
            }, 2000)
        } else {
            if (isLoad) {
                isLoadMax.value = true
            } else {
                allArticle.value = undefined
            }
        }
    })
    
}

// 切换/选择类别信息
function checkArticleCategory(categoryId: any) {
    articleParams.value.currentPage = 1
    checkCategoryId.value = categoryId
    loadAllArticle(false)
}

</script>

<style lang="less" scoped>
@searchColor: #eee;
@searchTextColor: #ffb300e8;
// 文章容器
.article-view-container {
    width: 100%;
    height: 980px;
    margin-top: 0.4rem;

    // 文章视图
    .article-body-view {

        // 文章顶部布局
        .article-header-container {
            height: 6rem;
            border-bottom: 1px solid #ddd;

            // 导航栏
            .article-header-nav {
                width: 74.5%;
                display: flex;
                margin-top: 2rem;
                margin-left: 14.5rem;

                // 导航栏文本
                .article-header-nav-text {
                    font-size: 14px;
                    font-weight: 700;
                    font-style: normal;
                    margin-right: 3rem;
                    font-family: "Microsoft YaHei UI";
                }

                // 导航栏内容
                .article-header-nav-content {
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
                .article-header-nav-content:hover {
                    cursor: pointer;
                    color: #f6bb51;
                }
            }
        }

        // 文章内容布局
        .article-body-container {
            width: 75%;
            margin: 1.5rem 0;
            font-style: normal;
            margin-left: 14.5rem;
            font-family: 'Microsoft YaHei UI';

            // 精选文章布局
            .choice-article {
                margin-left: -0.1rem;
                margin-bottom: 1.5rem;

                // 精选文章头部
                .choice-article-header {
                    display: flex;
                    justify-content: space-between;
                    // 精选文章文本
                    .choice-article-text {
                        color: #333;
                        font-size: 24px;
                        font-weight: 500;
                        line-height: 34px;
                    }

                    //  精选文章文本(其他)
                    .choice-article-other {
                        color: #333;
                        line-height: 34px;
                        margin-right: 0.5rem;
                    }
                }

                // 精选文章容器
                .el-card {
                    width: 11vw;
                    height: 28vh;
                    cursor: pointer;
                    box-shadow: none;
                    margin-top: 0.5rem;
                    position: relative;
                    
                    // 行内块元素 -- 顶部对齐
                    vertical-align: top;
                    display: inline-block;

                    border-radius: 5px;
                    background-color: #fff;

                    // 精选文章图片
                    .article-img {
                        width: 9vw; 
                        height: 11vh; 
                        margin-left: -0.2vh;
                        margin-top: -0.5vh; 
                        border-radius: 5px;
                        // background-color: #f0f0f0;
                    }

                    // 精选文章标题
                    .article-title {
                        width: 9vw;
                        font-size: 15px;
                        margin: 0.3rem 0;
                        font-weight: bolder;

                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                        
                    }

                    // 精选文章内容
                    .article-content {
                        zoom: 0.7;
                        line-height: 1.5;

                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                        
                    }

                    // 精选文章内容(悬停)
                    .article-content:hover {
                        text-decoration: underline;
                    }

                    // 精选文章底部
                    .article-bottom {
                        bottom: 0.95rem;
                        font-size: 12px;
                        font-weight: 400;
                        font-style: normal;
                        position: absolute;

                        // 精选文章作者
                        .article-author {
                            zoom: 0.95;
                            margin-bottom: 0.2rem;
                        }

                        // 精选文章发布时间
                        .article-time {
                            zoom: 0.95;
                            margin-bottom: 0.6rem;
                        }
 
                        // 精选文章各种数量显示
                        .article-sundry-number {
                            width: 9vw;
                            display: flex;
                            font-size: 10px;
                            text-align: center;
                            
                            justify-content: space-between;

                            // 精选文章各种数量数量
                            .sundry-number {
                                display: flex;

                                // 图标
                                .sundry-number-icon {
                                    width: 16px;
                                    height: 16px;
                                    margin-right: 0.3rem;
                                }   

                                // 文本
                               .sundry-number-text {
                                    font-size: 12px;
                                    font-style: normal;
                                    padding-top: 0.08rem;
                                }
                            }
                        }
                    }

                }

                .el-card:hover {
                    box-shadow: 0px 0px 20px 4px rgba(0,0,0,0.1);
                }

                .el-card:not(:last-child) {
                    margin-right: 1.8rem;
                }
            }

            // 文章内容头部布局
            .article-base-info-header {
                display: flex;
                justify-content: space-between;

                // 课程排序栏容器
                .article-sort-container {
                    display: flex;
                    margin-top: 0.5rem;

                    // 课程排序栏
                    .article-sort {
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

                    .article-sort:hover {
                        cursor: pointer;
                    }
                }
                
                // 课程搜索栏
                .article-search {
                    zoom: 0.9;
                    width: 2.5rem;
                    height: 2.5rem;
                    padding: 0.7rem;
                    margin-right: 0.3rem;
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

            // 所有文章布局
            .all-article-body-container {
                display: flex;
                margin-top: 1rem;
                margin-bottom: 3rem;

                // 文章左侧布局容器
                .all-article-body-left-container {
                    width: 80%;

                    // 卡片容器
                    .el-card {
                        cursor: pointer;
                        box-shadow: none;
                    }

                    // 卡片容器(悬停)
                    .el-card:hover {
                        box-shadow: 0px 0px 15px 4px rgba(0,0,0,0.1);
                    }

                    // 所有文章主体
                    .all-article-body {
                        height: 11.5rem;
                        position: relative;
                        margin-bottom: 2vh;

                        // 卡片布局
                        :deep(.el-card__body) {
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                        }

                        // 所有文章左侧布局
                        .all-article-left {
                            
                            // 文章标题
                            .article-title {
                                font-size: 18px;
                                font-weight: 700;
                                margin-bottom: 1rem;
                            }

                            // 文章内容
                            .article-content {
                                font-size: 14px;
                                color: #626262;
                                margin-bottom: 1vh;

                                overflow: hidden;
                                display: -webkit-box;
                                -webkit-line-clamp: 3;
                                text-overflow: ellipsis;
                                -webkit-box-orient: vertical;
                            }

                            // 文章内容(悬停)
                            .article-content:hover {
                                text-decoration: underline;
                            }

                            // 有图片时
                            .all-article-left-bottom {
                                width: 79%;
                            }

                            // 无图片时
                            .all-article-left-bottom-imgNull {
                                width: 95%;
                            }
                            
                            // 有无图片的公共样式
                            .all-article-left-bottom, .all-article-left-bottom-imgNull {
                                bottom: 0;
                                zoom: 0.85;
                                position: absolute;
                                padding-bottom: 1.7rem;

                                // 弹性布局
                                display: flex;
                                justify-content: space-between;

                                // 各种数量布局
                                .article-sundry-number {
                                    width: 17rem;
                                    display: flex;
                                    justify-content: space-between;

                                    // 各种数量
                                    .sundry-number {
                                        display: flex;
                                    }

                                    // 文本
                                    .sundry-number-text {
                                        margin-left: 0.5rem;
                                    }
                                    
                                }

                                // 作者和时间布局
                                .article-author-time {
                                    display: flex;

                                    // 作者
                                    .article-author {
                                        margin-right: 1.5vw;
                                    }
                                }
                            }
                        }
                        
                        // 所有文章右侧布局
                        .all-article-right {
                            width: 9vw;
                            height: 9vh;
                            border-radius: 5px;

                            // 图片
                            .article-img {
                                width: 9vw;
                                height: 10vh;
                                margin-top: 0.5rem;
                                border-radius: 5px;
                            }
                        }
                    }

                    // 文章载入样式
                    .article-loading {
                        margin-top: 3rem;
                    }
                }

                // 文章右侧布局容器
                .all-article-body-right-container {
                    margin-left: 1rem;

                    // 固定布局
                    :deep(.el-affix--fixed) {
                        margin-top: 1.5rem;
                    }
                    
                    // 热门排行
                    .hot-article-sort-container {
                        width: 15vw; 
                        height: 26rem; 
                        border-radius: 5px;
                        margin-bottom: 1rem;
                        background-color: #ffffff;
                        box-shadow: var(--el-box-shadow-light);

                        // 热门文章顶部布局
                        .hot-article-container-header {
                            color: #fff;
                            margin-bottom: 2vh;
                            font-weight: bolder;
                            padding: 0.7vw 0.8vw;
                            border-radius: 3px 3px 0 0;
                            background-color: #f6bb51;

                            display: flex;
                            flex-wrap: wrap;
                            justify-content: space-between;


                        }

                        // 热门文章内容布局
                        .hot-article-body {
                            width: 13vw;
                            padding-left: 1vw;
                            border-radius: 3px 3px 0 0;
                            
                            // 热门文章内容
                            .hot-article-content {
                                margin-bottom: 1rem;

                                display: flex;
                                flex-wrap: wrap;
                                justify-content: space-between;

                                // 热门文章文本
                                .hot-article-content-title {
                                    width: 12rem;
                                    cursor: pointer;
                                    font-size: 14px;
                                    overflow: hidden;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 1;
                                    text-overflow: ellipsis;
                                    -webkit-box-orient: vertical;
                                }

                                // 热门文章文本(悬停)
                                .hot-article-content-title:hover {
                                    text-decoration: underline;
                                }

                                // 热门文章浏览量
                                .hot-article-content-view {
                                    display: flex;
                                    font-size: 12px;

                                    // 图标
                                    .view-icon {
                                        zoom: 0.8;
                                        margin-right: 0.5rem;
                                    }

                                    // 数量
                                    .view-number {
                                        margin-top: 0.05rem;
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }

        // 底部信息
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
</style>