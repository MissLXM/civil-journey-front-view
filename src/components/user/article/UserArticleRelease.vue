<template>
    <!-- 已发布文章视图 -->
    <div class="user-article-release-view">
        <!-- 已发布文章区域 -->
        <div 
            v-infinite-scroll="articleLoad"
            class="user-article-release-container"
            :infinite-scroll-disabled="articleDisabled"
        >
            <el-empty v-if="articleReleaseInfo.records.length == 0"/>
            <el-card 
                v-else
                :key="index"
                class="user-article-release"
                v-for="(item, index) in articleReleaseInfo.records" 
            >
                <!-- 已发布文章左侧布局 -->
                <div class="user-article-left"  @click="routerArticleInfo(item)">
                    <div class="article-title"> {{ item.articleTitle }} </div>
                    <div class="article-content" v-html="htmlToString(item.articleContent)"/>
                    <div 
                        :class="item.articleImage == null || item.articleImage == '' ? 'all-article-left-bottom-imgNull' : 'all-article-left-bottom'"
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
                            <div class="article-collection-number sundry-number">
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

                <!-- 已发布文章右侧布局 -->
                <div class="user-article-right" v-if="item.articleImage != null && item.articleImage != ''"  @click="routerArticleInfo(item)">
                    <el-image class="article-img" :src="item.articleImage"/>
                </div>

                <!-- 右侧布局 -->
                <div class="right-container">
                    <el-button disabled type="info" v-if="item.status == 0">审核中</el-button>
                    <el-popconfirm 
                        cancel-button-text="取消"
                        confirm-button-text="确认"
                        title="是否删除文章,此操作不可逆,是否执行?"
                        @confirm="deleteArticleEventSuccess(item.articleId)"
                    >
                        <template #reference>
                            <el-button type="primary" v-if="item.status == 1" >审核成功--可删除</el-button>
                        </template>
                    </el-popconfirm>
                    
                    <el-tooltip 
                        effect="light"
                        placement="bottom" 
                    >
                        <template #content>
                            <span>点击删除</span>
                        </template>
                        <el-button type="danger" v-if="item.status == 2" @click="applyFailureEvent(item)">审核失败</el-button>
                    </el-tooltip>
                    
                </div>
                
            </el-card>
            

            <!-- 文章加载 -->
            <div 
                class="article-loading"
                v-loading="articleLoading"
            >
            </div>
        </div>
    </div>

    <!-- 审核失败弹出框 -->
    <div class="apply-failure-dialog-container">
        <el-dialog v-model="applyFailureDialog">
            <div class="dialog-title">审核失败原因</div>
            <el-input 
                :rows="4"
                disabled
                type="textarea"
                v-model="applyFailureReason"
            />
            <el-button type="primary" @click="deleteArticleEvent">删除该文章</el-button>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { htmlToString } from '@/global'
import { ref, computed, onMounted } from 'vue';
import { showUserReleaseArticle, deleteArticle } from '@/api/article';


// 选中文章ID
const articleId = ref()
// 加载最大数
const isLoadMax = ref(false)
// 分页参数
const pageParams = ref({
    currentPage: 1,
    pageSize: 4
})
// 发布的文章信息 
const articleReleaseInfo = ref({
    total: 0,
    records: [
        {
            status: 0,
            articleId: 0,
            likeNumber: 0,
            createTime: '',
            creatorName: '',
            browseNumber: 0,
            articleImage: '',
            articleTitle: '',
            creatorAvatar: '',
            articleContent: '',
            collectionNumber: 0,
        }
    ]
})
// 审核失败原因
const applyFailureReason = ref()
// 文章加载
const articleLoading = ref(false)
// 审核失败弹出框
const applyFailureDialog = ref(false)
// 是否允许加载数据
const articleDisabled = computed(() => articleLoading.value)



// 挂载函数
onMounted(() => {
    // 加载用户已发布文章
    loadUserReleaseArticle(false)
})

// 文章加载 
const articleLoad = () => {
    if (articleReleaseInfo.value.records.length >= 4) {
        if (isLoadMax.value) {
            articleLoading.value = false
        } else {
            articleLoading.value = true
            setTimeout(() => {
                // 加载数据
                loadUserReleaseArticle(true)
                articleLoading.value = false
            }, 1500)
        }
    }
} 

// 删除文章事件(发布失败)
function deleteArticleEvent() {
    deleteArticle(articleId.value).then(response => {
        if (response.data.code === 200) {
            applyFailureDialog.value = false
            loadUserReleaseArticle(false)
            ElMessage.success('删除成功')
        } else {
            ElMessage.error('删除失败')
        }
    })
}

// 审核失败事件
function applyFailureEvent(item: any) {
    // 设置ID
    articleId.value = item.articleId
    // 失败原因
    applyFailureReason.value = item.auditFailureReason
    applyFailureDialog.value = true
}

// 跳转文章详情页 
function routerArticleInfo(item: any) {
    if (item.status == 1) {
        router.push({
            name: 'articleInfo',
            params: {
                articleId: item.articleId
            }
        })
    }
    
}

// 加载用户已发布文章 
function loadUserReleaseArticle(isLoad: boolean) {
    if (!isLoad) {
        pageParams.value.currentPage = 1
    } else {
        pageParams.value.currentPage ++
    }

    showUserReleaseArticle(pageParams.value).then(response => {
        console.log(response.data)
        if (response.data.code === 200) {
            if (isLoad) {
                articleReleaseInfo.value.records = articleReleaseInfo.value.records.concat(response.data.data.records) 
            } else {
                articleReleaseInfo.value = response.data.data
            }
        } else {
            articleReleaseInfo.value.records = []
            isLoadMax.value = true
            articleLoading.value = false
        }
    })
} 

// 删除文章事件(发布成功)
function deleteArticleEventSuccess(articleId: any) {
    deleteArticle(articleId).then(response => {
        if (response.data.code === 200) {
            applyFailureDialog.value = false
            loadUserReleaseArticle(false)
            ElMessage.success('删除成功')
        } else {
            ElMessage.error('删除失败')
        }
    })
}

</script>

<style lang="less" scoped>
// 已发布文章视图
.user-article-release-view {
    margin-top: 2rem;
    margin-left: 2rem;
    padding-bottom: 2rem;

    // 已发布文章区域
    .user-article-release-container {
        width: 97%;
        height: 51rem;
        overflow-y: auto;
        padding-right: 1rem;


        // 卡片容器
        .el-card {
            cursor: pointer;
            box-shadow: none;
        }

        // 卡片容器(悬停)
        .el-card:hover {
            box-shadow: 0px 0px 15px 4px rgba(0,0,0,0.1);
        }

        // 已发布文章主体
        .user-article-release {
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
            .user-article-left {
                
                // 文章标题
                .article-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                // 文章内容
                .article-content {
                    font-size: 14px;
                    width: 48rem;
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
                    width: 74%;
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
            .user-article-right {
                width: 9vw;
                height: 9rem;
                margin: 0 1rem;
                border-radius: 5px;

                // 图片
                .article-img {
                    width: 9vw;
                    height: 9rem;
                }
            }

            // 右侧容器
            .right-container {

                .el-button {
                    width: 1rem;
                    height: 100%;
                }
                :deep(.el-button>span) {
                    writing-mode: vertical-rl;
                }
            }
        }

        // 文章载入样式
        .article-loading {
            margin-top: 3rem;
        }
    }
}


// 文章左侧布局容器
.all-article-body-left-container {
    width: 80%;
}

// 对话框
:deep(.el-dialog) {
    width: 40%; 
    border-radius: 0.8rem;
}
// 对话框(顶部)
:deep(.el-dialog__header) {
    padding: 0;
}
// 文本输入框
:deep(.el-textarea__inner) {
    resize: none;
}

// 弹出框标题
.dialog-title {
    text-align: center;
    margin-bottom: 1.5rem;
}

// 审核失败弹出框
.apply-failure-dialog-container {

    .teacher-introduction {
        margin-top: 1rem;
    }

    .el-button {
        width: 8rem;
        margin-top: 1rem;
        margin-left: 18rem;
        border-radius: 1rem;
    }
}
</style>