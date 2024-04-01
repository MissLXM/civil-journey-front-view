<template>
    <!-- 发布文章视图 -->
    <div class="article-release-view">
        <!-- 发布文章容器 -->
        <div class="article-release-container">
            <!-- 顶部容器 -->
            <el-affix :offset="65">
                <div class="article-release-header-container">
                    <Toolbar
                        :mode="mode"
                        :editor="editorRef"
                        :defaultConfig="toolbarConfig"
                        class="article-release-header-toolbar"
                    />
                </div>
            </el-affix>

            <!-- 文章主体 -->
            <div class="article-release-content-container">
                <el-card>
                    <div class="el-card-content">
                        <el-input 
                            v-model="articleTitle"
                            placeholder="请输入文章标题" 
                        />
                        <hr>
                        <Editor
                            :mode="mode"
                            v-model="articleContent"
                            @onCreated="handleCreated"
                            :defaultConfig="editorConfig"
                            class="article-release-content-editor"
                        >
                        </Editor> 
                    </div>
                </el-card>
                
            </div>

            <!-- 底部容器 -->
            <div class="article-release-footer-container">
                <!-- 卡片布局 -->
                <el-card>
                    <!-- 分类容器 -->
                    <div class="article-category-container">
                        <div class="category-title">文章分类</div>
                        <el-radio-group v-model="checkCategoryId">
                            <el-radio 
                                :key="index"
                                :label="item.categoryId"
                                v-for="(item, index) in articleCategory"
                            >
                                {{ item.categoryName }}
                            </el-radio>
                        </el-radio-group>
                    </div>

                    <!-- 标签容器 -->
                    <div class="article-tag-container">
                        <div class="tag-title">文章标签</div>
                        <el-radio-group v-model="checkTagId">
                            <el-radio 
                                :key="index"
                                :label="item.tagId"
                                v-for="(item, index) in articleTag"
                            >
                                {{ item.tagName }}
                            </el-radio>
                        </el-radio-group>
                    </div>

                    <!-- 封面布局 -->
                    <div class="article-cover-container">
                        <div class="cover-title">添加封面</div>
                        <el-upload
                            :action="actionUrl"
                            :data="uploadParams"
                            class="cover-upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                        >
                            <!-- img -->
                            <el-image
                                v-if="articleCover.newPath" 
                                :src="articleCover.newPath" 
                                class="cover-image"
                            />
                            <el-icon v-else class="cover-icon"><Plus /></el-icon>
                            <div class="cover-text">添加文章封面</div>
                        </el-upload>
                    </div>

                </el-card>
            </div>
        </div>

        <!-- 发布按钮容器 -->
        <el-affix 
            :offset="60"
            position="bottom" 
            class="release-button-container" 
        >
            <el-button @click="articleReleaseEvent">发布</el-button>
        </el-affix>

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
import { Plus } from '@element-plus/icons-vue'
import { releaseArticle } from '@/api/article';
import { ref, onBeforeUnmount, shallowRef } from 'vue';

// WangEditor的样式和 Vue 的配合模块
import '@wangeditor/editor/dist/css/style.css'
import type { IEditorConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// WangEditor开启MarkDown语法
Boot.registerModule(markdownModule)
import { Boot } from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'




// 'default' / 'simple'
const mode ='default'
// 选中标签
const checkTagId = ref()
// 工具栏配置
const toolbarConfig = {
    // 自定义工具栏,显示哪些菜单
    toolbarKeys: [
        // 标题
        // "head",
        // 正文
        "headerSelect",  
        // 引号
        "blockquote", 
        // 分隔线
        "|", 
        // 加粗
        "bold",  
        // 下划线
        "underline",  
        // 倾斜
        "italic",   
        
        
        // 更多
        {
            // 菜单组别 -- 更多样式 
            "key": "group-more-style",
            // 标题
            "title": "更多",
            // 图标
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
            // 菜单组内容
            "menuKeys": [
                // 删除线
                "through",
                // 行内代码
                "code",
                // 上标
                "sup",
                // 下标
                "sub",
                // 清除格式
                "clearStyle"
            ]
        },

        // 字体颜色
        "color",
        // 背景颜色
        "bgColor",
        // 分割线
        "|",
        // 字号
        "fontSize",
        // 字体
        "fontFamily",
        // 行高
        "lineHeight",
        // 分割线
        "|",
        // 无序列表
        "bulletedList",
        // 有序列表
        "numberedList",
        // 待办事项
        "todo",


        // 对齐方式
        {
            // 菜单组别 -- 对齐
            "key": "group-justify",
            // 标题
            "title": "对齐",
            // 图标
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
            // 菜单组内容
            "menuKeys": [
                // 左对齐
                "justifyLeft",
                // 右对齐
                "justifyRight",
                // 居中对齐
                "justifyCenter",
                // 两端对齐
                "justifyJustify"
            ]
        },


        // 缩进
        {
            // 菜单组别 -- 缩进
            "key": "group-indent",
            // 标题
            "title": "缩进",
                // 图标
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>",
            // 菜单组内容
            "menuKeys": [
                // 增加缩进
                "indent",
                // 减少缩进
                "delIndent"
            ]
        },


        // 分割线
        "|",
        // 颜表情
        "emotion",
        // 超链接
        "insertLink",


        // 图片
        {
            // 菜单组别 -- 图片
            "key": "group-image",
            // 标题
            "title": "图片",
            // 图标
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
            // 菜单组内容
            "menuKeys": [
                // 网络图片
                "insertImage",
                // 本地图片
                "uploadImage"
            ]
        },

        // 表格
        "insertTable",
        // 代码块
        "codeBlock",
        // 横分割线
        "divider",
        // 分割线
        "|",
        // 撤销
        "undo",
        // 重做
        "redo",
        // 分割线
        "|",
        // 全屏
        "fullScreen"
    ]
}  
// 组件销毁时,也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return 
    editor.destroy()
})
// 文章标签
const articleTag = ref([
    {
        "tagId": 1,
        "tagName": "解题技巧"
    },
    {
        "tagId": 2,
        "tagName": "学习笔记"
    }
])
// 文章标题
const articleTitle = ref()
// 文章内容
var articleContent = ref()
// 图片地址
const articleCover = ref({
    newPath: '',
    oldPath: ''
})
// 上传参数
const uploadParams = ref({
    username: '',
    tagName: '解题技巧'
})
// 选中标签
const checkCategoryId = ref()
// 文章分类
const articleCategory = ref([
    {
        "categoryId": 1,
        "categoryName": "公考笔试"
    },
    {
        "categoryId": 2,
        "categoryName": "公考面试"
    },
    {
        "categoryId": 3,
        "categoryName": "军队文职"
    },
    {
        "categoryId": 4,
        "categoryName": "事业单位"
    },
    {
        "categoryId": 5,
        "categoryName": "三支一扶"
    },
    {
        "categoryId": 6,
        "categoryName": "公安招警"
    }
])
// 编辑器实例
const editorRef = shallowRef()
// 创建工具栏实例
const handleCreated = (editor: any) => {
    editorRef.value = editor
}
// 编辑器(内容)
const editorConfig : Partial<IEditorConfig> = { 
    // 默认显示文本
    placeholder: '<p style="font-style: normal; margin-bottom: 0.5vh;">#开始您的创作#</p> ' + 
                 '<p style="font-style: normal; margin-bottom: 0.5vh;">&nbsp;&nbsp;&nbsp;• 分享您的学习心得</p>' +  
                 '<p style="font-style: normal; margin-bottom: 0.5vh;">&nbsp;&nbsp;&nbsp;• 分享您的解题技巧</p>',
    // 滚动条
    scroll: false,
    MENU_CONF: {
        uploadImage: {
            // 自定义回调来处理图片上传结果
            customInsert: (response: any, insertFun: any) => {
                if (response.code === 200) {
                    insertFun(response.data.newPath)
                } else {
                    console.log('上传失败')
                }
            },
            // 服务器地址
            server: import.meta.env.VITE_BASE_URL + '/article-center-service/front/article/uploadArticleImage',
            // 文件参数
            fieldName: 'file',
            // 其他参数
            meta: {
                uploadParams: uploadParams.value
            }
        }

    }
}
// 上传文章地址
const actionUrl = ref(import.meta.env.VITE_BASE_URL + '/article-center-service/front/article/uploadArticleImage')


 
// 文章发布事件  
function articleReleaseEvent() {

    // 获取选中类型名称
    const checkTagName = ref();
    for (var i = 0; i < articleTag.value.length; i++) {
        if (articleTag.value[i].tagId == checkTagId.value) {
            checkTagName.value = articleTag.value[i].tagName
        }
    }

    // 获取选中类别名称
    const checkCategoryName = ref();
    for (var j = 0; j < articleCategory.value.length; j++) {
        if (articleCategory.value[j].categoryId == checkCategoryId.value) {
            checkCategoryName.value = articleCategory.value[j].categoryName
        }
    }

    // 判空
    if (
        articleTag.value == undefined ||
        checkTagName.value == undefined ||
        articleTitle.value == undefined ||
        checkCategoryId.value == undefined ||
        checkCategoryName.value == undefined ||
        articleContent.value == '<p><br></p>' ||
        articleCover.value.oldPath == undefined
    ) {
        ElMessage.info('全部均需要填写')
    } else {
        const articleParams = ref({
            articleType: checkTagName.value,
            articleTitle: articleTitle.value,
            categoryId: checkCategoryId.value,
            articleContent: articleContent.value,
            categoryName: checkCategoryName.value,
            articleImage: articleCover.value.oldPath
        })
        releaseArticle(articleParams.value).then(response => {
            console.log(response.data)
            if(response.data.code === 200) {
                ElMessage.success('发布成功')
                // 跳转已发布课程界面
                router.push({
                    name: 'userCenterParams',
                    params: {
                        navId: 2
                    }
                })
            } else {
                ElMessage.error('发布失败')
            }
        }) 
    }
}

// 上传图片之前的回调函数
function beforeAvatarUpload(file: any) {
    console.log(file)
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
    articleCover.value = result.data
}



</script>

<style lang="less" scoped>
// 发布文章视图
.article-release-view {
    width: 100%;
    height: 980px;

    // 发布文章容器
    .article-release-container {

        // 顶部容器
        .article-release-header-container {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ededed;

            // 工具栏
            .article-release-header-toolbar {
               
                :deep(.w-e-toolbar) {
                    background-color: #ededed;
                }
            }
        }

        // 文章主体
        .article-release-content-container {
            display: flex;
            margin-top: 3rem;
            align-items: center;
            justify-content: center;

            // 卡片布局
            .el-card {
                width: 60%;
                margin-bottom: 1.5vh;

                // 元素水平居中
                display: flex;
                align-items: center;
                justify-content: center;

                // 内容
                .el-card-content {
                    width: 50vw;

                    .el-input {
                        font-size: 28px;
                        color: #c0c7d3;
                        
                        :deep(.el-input__wrapper) {
                            // 清空 el-input 的边框
                            padding: 0;
                            box-shadow: none;
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
                    }

                    // 内容编辑器
                    .article-release-content-editor {
                        min-height: 80rem; 
                        :deep(.w-e-text-container [data-slate-editor]) {
                            padding: 0;
                        }
                    }
                }
            }
        }

        // 底部布局
        .article-release-footer-container {
            // 元素水平居中
            display: flex;
            align-items: center;
            justify-content: center;

            // 卡片布局
            .el-card {
                width: 60%;
                font-size: 14px;
                margin-bottom: 2vh;
                
                // 容器
                .article-tag-container,
                .article-cover-container,
                .article-category-container {
                    display: flex;
                    margin-left: 2vw;
                    margin-bottom: 2vh;

                    .el-radio {
                        font-weight: 400;
                    }

                    // 标题
                    .tag-title, .category-title {
                        font-weight: 600;
                        margin-right: 1vw;
                        margin-top: 0.5vh;
                    }
                } 

                // 封面布局
                .article-cover-container {
                    height: 122px;
                    margin-top: 1.4rem;
                    
                    .cover-title {
                        font-weight: 600;
                        margin-right: 1vw;
                    }

                    :deep(.el-upload) {
                        display: unset;
                    }

                    .cover-upload {
                        width: 120px;
                        cursor: pointer;
                        border-radius: 6px;
                        border: 1px dashed var(--el-border-color);
                    }

                    .cover-upload:hover {
                        border-color: var(--el-color-primary);
                    }

                    .cover-image {
                        width: 120px; 
                        height: 120px;
                        display: block;
                    }

                    .cover-icon {
                        width: 120px;
                        height: 95px;
                        font-size: 28px;
                        color: #8c939d;
                        text-align: center;
                    }

                    .cover-text {
                        font-size: 10px;
                        color: #8c939d;
                        margin-top: -3vh;
                        text-align: center;
                    }
                }

            }
        }
    }

    // 发布按钮
    .release-button-container {
        margin-left: 93rem;
        margin-bottom: 1rem;
        .el-button {
            width: 8rem;
            height: 2.5rem;
            margin-top: -6.5rem;
            border-radius: 3rem;
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