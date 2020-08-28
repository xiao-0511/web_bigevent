$(function () {
  let layer = layui.layer;
  let form = layui.form;
  // 获取文章分类的方法
  initCate();
  // 初始化富文本编辑器
  initEditor();
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  }
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });
  $("#coverFile").on("change", function (e) {
    let files = e.target.files;
    if (files.length === 0) {
      return;
    }
    let imgURL = URL.createObjectURL(files[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", imgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  let art_state = "已发布";
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    let fd = new FormData($(this)[0]);
    fd.append("state", art_state);
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append("cover_img", blob);
        publishArticle(fd);
      });
  });
  function publishArticle(fd) {
    $.ajax({
      type: "POST",
      url: "/my/article/add",
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        location.href = "/article/art_list.html";
      },
    });
  }
});
