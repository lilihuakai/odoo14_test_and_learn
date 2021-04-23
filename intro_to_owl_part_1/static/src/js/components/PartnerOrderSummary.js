odoo.define("intro_to_owl_part_1.PartnerOrderSummary", function (require) {
    const FormRenderer = require("web.FormRenderer");
    const { Component } = owl;
    const { ComponentWrapper } = require("web.OwlCompatibility");
    const { useState } = owl.hooks;
    /**
    * OWL组件负责显示合作伙伴订单摘要小部件
    * 它将显示特定客户的订单历史详细信息。
    */
    class PartnerOrderSummary extends Component {
        partner = useState({});
        constructor(self, partner) {
            super();
            this.partner = partner;
        }
    };
    /**
    * 将属性注册到我们的小部件。
    */
    Object.assign(PartnerOrderSummary, {
        template: "intro_to_owl_part_1.PartnerOrderSummary"
    });
    /**
    * 重写窗体渲染器，以便我们可以在渲染时挂载组件
    * 给任何一个class属性为o_partner_order_summary的div。
    */
    FormRenderer.include({
        // async _render() {
        //     await this._super(...arguments);
        //     for(const element of this.el.querySelectorAll(".o_partner_order_summary")) {
        //         (new ComponentWrapper(this, PartnerOrderSummary))
        //             .mount(element)
        //     }
        // }
        async _renderView() {
            await this._super(...arguments);
            for(const element of this.el.querySelectorAll(".o_partner_order_summary")) {
                this._rpc({
                    model: "res.partner",
                    method: "read",
                    args: [[this.state.data.partner_id.res_id]]
                }).then(data => {
                    (new ComponentWrapper(
                        this,
                        PartnerOrderSummary,
                        useState(data[0])
                    )).mount(element);
                });
            }
        }
    });
});