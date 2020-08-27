$(function () {
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在1~6个字符之间";
      }
    },
  });
  initUserInfo();
  //初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        form.val("formUserInfo", res.data);
      },
    });
  }
  //重置按钮绑定点击事件
  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败");
        }
        return layer.msg("更新用户信息成功");
        window.parent.getUserInfo();
      },
    });
  });
});
