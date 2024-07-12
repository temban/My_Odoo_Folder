/** @odoo-module **/

import { browser } from "@web/core/browser/browser";
import { registry } from "@web/core/registry";

function shinTheoLinkItem(env) {
    const shintheoUrl = "https://www.shintheo.com";
    return {
        type: "item",
        id: "shintheo_link",
        description: env._t("About Shin Theo"),
        href: shintheoUrl,
        callback: () => {
            browser.open(shintheoUrl, "_blank");
        },
        sequence: 1,
    };
}

registry.category("user_menuitems").add("shintheoLink", shinTheoLinkItem, { force: true });




