let userInfo = null;
//调用获取用户信息的函数
getUserInfo();
$(function () {
  if (userInfo) {
    renderAvatar(userInfo);
  }
  let layer = layui.layer;
  $("#btnLogout").on("click", function () {
    layer.confirm("确定退出登录?", { icon: 3, title: "提示" }, function (
      index
    ) {
      localStorage.removeItem("token");
      location.href = "/login.html";
      layer.close(index);
    });
  });
});
//定义获取用户信息的函数
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    async: false,
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.message);
      }
      userInfo = res.data;
      renderAvatar(res.data);
    },
  });
}
//渲染用户头像的函数
function renderAvatar(user) {
  //获取用户的名字
  let name = user.nickname || user.username;
  //设置欢迎文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  //按需渲染用户头像
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    $(".layui-nav-img").hide();
    let first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
