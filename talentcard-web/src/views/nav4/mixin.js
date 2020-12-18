export default {
  data() {
    return {
      isIE: false
    }
  },
  created() {
    const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    const isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE || isEdge || isIE11) {
      this.isIE = true
    } else {
      this.isIE = false
    }
  },
  methods: {
    downloadIamge(imgsrc, name) {
      if (/^http/.test(imgsrc)) {
        imgsrc = imgsrc
      } else {
        imgsrc = `${window.location.origin}${imgsrc}`
      }
      // 下载图片地址和图片名
      if (/\.(png|jpg|PNG|JPG)$/.test(imgsrc)) {
        const image = new Image();
        // 解决跨域 canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const context = canvas.getContext("2d");
          console.log(`width: ${image.width}`, `height: ${image.height}`)
          context.drawImage(image, 0, 0, image.width, image.height);
          //得到图片的base64编码数据
          const url = canvas.toDataURL("image/jpeg", 0.6);
          // 生成一个 a 标签
          const a = document.createElement("a");
          // 创建一个点击事件
          const event = new MouseEvent("click");
          // 将 a 的 download 属性设置为我们想要下载的图片的名称，若 name 不存在则使用'图片'作为默认名称
          a.download = name || "图片";
          // 将生成的 URL 设置为 a.href 属性
          a.href = url;
          // 触发 a 的点击事件
          a.dispatchEvent(event);
          // return a;
        };
        image.src = imgsrc;
      } else if (/\.doc$/.test(imgsrc)) {
        var elemIF = document.createElement("iframe");
        elemIF.src = imgsrc;
        elemIF.style.display = "none";
        document.body.appendChild(elemIF);
      } else if (/\.pdf$/.test(imgsrc)) {
        window.open(imgsrc);
      } else {
        var downloadElement = document.createElement("a");
        downloadElement.setAttribute("target", "_blank");
        // 　　var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = imgsrc;
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        // 　　window.URL.revokeObjectURL(href); //释放掉blob对象
      }
    }
  }
}