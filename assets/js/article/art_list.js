$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: "",
    state: "",
  };
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());
    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
  initTable();
  initCate();
  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // 调用渲染分页的方法
        renderPage(res.total);
      },
    });
  }
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  }
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    let cate_id = $("[name=cate_id]").val();
    let state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });
  //定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: "pageBox",
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }
  //通过事件委托的方式为删除按钮绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    let len = $(".btn-delete").length;
    let id = $(this).attr("data-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          layer.msg(res.message);
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          layer.close(index);
          initTable();
        },
      });
    });
  });
});
