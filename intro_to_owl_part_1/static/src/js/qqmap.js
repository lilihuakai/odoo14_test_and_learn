odoo.define('qqmap_widget.qqmap', function (require) {
    "use strict";

    var registry = require('web.field_registry'); //注册
    var AbstractField = require('web.AbstractField'); //字段顶级父类

    //通过AbstractField创建子类
    var QQMap = AbstractField.extend({
        // 使用模板，与上述xml对应
        template: "QQMap",
        // 引用腾讯地图api
        jsLibs: ["/qqmap_widget/static/src/js/qqmap_api.js"],

        // 初始化待使用的全局参数
        init: function (parent, field_name, record, options) {
            this._super.apply(this, arguments);
            this.model = this.record.model;
            this.res_id = Number(this.record.id.split("_").pop());
            this.field_name = this.name;
            this.lfte = 35.406891;
            this.right = 123.537758;
            this.options = options
        },

        // 数据准备阶段
        willStart: function () {
            var self = this;
            // 获取对应模型中字段的值
            var def = self._rpc({
                model: self.model,
                method: 'search_read',
                args: [
                    [
                        ['id', '=', self.res_id]
                    ],
                    [self.field_name]
                ],
            }).then(function (data) {
                console.log(data);
                // 当没有参数时返回null
                if (data && data[0] && data[0][self.field_name]) {
                    self.container = data[0][self.field_name];
                } else {
                    self.container = null
                }
            });
            return $.when(this._super.apply(this, arguments), def);
        },

        // 渲染完成后
        start: function () {
            // 找到要显示和隐藏的元素
            var $info = this.$el.filter('#qqmap_widget');
            var $span = this.$el.filter('span');
            var self = this;
            // 仿照正常字段显示
            $span.attr('name', self.field_name);
            $span.text(self.container);
            // 控制显示和隐藏，此处有个小坑，readonly断点看看就明白了
            if (self.options.mode == "readonly") {
                $($info[0]).css({
                    'display': 'none'
                });
                // <span class="o_field_char o_field_widget o_force_ltr" name="phone">“是发士大夫士大夫打撒发， 士大夫发打算”</span>
                $($span[0]).css({
                    'display': 'block'
                });
            } else {
                $($info[0]).css({
                    'display': 'block'
                });
                $($span[0]).css({
                    'display': 'none'
                });
            }
            return this._super.apply(this, arguments);
        },

        // 执行编辑/保存触发
        destroy: function () {
            var self = this;
            // 查找到地图下方元素
            var position = document.getElementById("position");
            var txt = document.getElementById("txt");
            // 将字段储存的值进行分割使用
            if (self.container) {
                self.lfte = Number(self.container.split(", ")[0])
                self.right = Number(self.container.split(", ")[1])
            }
            // 当表单处于编辑时，渲染地图当等于readonly时才是编辑状态，F12断电看一下
            if (position && txt && self.options.mode == "readonly") {
                var center = new TMap.LatLng(self.lfte, self.right); //设置中心点坐标
                // //初始化地图
                var map = new TMap.Map("container", {
                    zoom: 17, //设置地图缩放级别
                    center: center, //设置地图中心点坐标
                });

                // location.innerHTML = map.getCenter().toString();

                //监听地图开始平移
                map.on("panstart", function () {
                    txt.innerHTML = "地图开始平移"
                })
                //监听地图平移
                map.on("pan", function () {
                    txt.innerHTML = "地图正在平移";
                    position.innerHTML = map.getCenter().toString(); //获取地图中心点
                })
                //监听地图平移结束
                map.on("panend", function () {
                    txt.innerHTML = "地图结束平移";
                    // 拿去当前中心点位置
                    self.center_now = map.getCenter().toString();
                    console.log(self.center_now)
                    // 创建要返回的字典
                    var datas = {};
                    datas[self.field_name] = self.center_now
                    // 如果当前位置不等于上次位置,传至后端修改其值
                    if (self.center_now != self.container) {
                        self._rpc({
                            model: self.model,
                            method: 'write',
                            args: [
                                [self.res_id], datas
                            ],
                            context: self.record.context
                        }).then(function (data) {
                            console.log('ok');
                            // self.trigger_up('reload');
                        });
                        // .catch(function (error) {
                        //     alert('错误：无法修改')
                        // })
                        // 此处应接收异常
                    }
                })
            }
        },

    });

    registry.add('qqmap', QQMap);
});