
// 动态拼接图片地址
export function combineImageUrl(url: String) {
    return import.meta.env.VITE_IMAGE_URL + url
}


// 动态拼接视频地址
export function combineVideoUrl(url: String) {
    return import.meta.env.VITE_IMAGE_URL + url
}

// 去除富文本中的标签
export function htmlToString(htmlStr: any){
	return htmlStr.replace(/<\/?.+?\/?>|\r|\n|\s*/g,'')
}