
import styles from "./xiome-ecommerce.css.js"
import {StoreStatus} from "../../topics/types/store-status.js"
import {AuthModel} from "../../../auth/models/types/auth/auth-model.js"
import {makeEcommerceModel} from "../../models/ecommerce-model/ecommerce-model.js"
import {WiredComponent, mixinStyles, html} from "../../../../framework/component.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {renderWrappedInLoading} from "../../../../framework/loading/render-wrapped-in-loading.js"

@mixinStyles(styles)
export class XiomeEcommerce extends WiredComponent<{
		modals: ModalSystem
		authModel: AuthModel
		ecommerceModel: ReturnType<typeof makeEcommerceModel>
	}> {

	firstUpdated() {
		this.share.ecommerceModel.fetchStoreStatus(true)
	}

	render() {
		const {ecommerceModel} = this.share
		return renderWrappedInLoading(
			ecommerceModel.loadingViews.storeStatus,
			status => {
				switch (status) {

					case StoreStatus.Uninitialized:
						return html`<p>store uninitialized</p>`

					case StoreStatus.Unlinked:
						return html`<p>store banking info not linked</p>`

					default:
						const enabled = status === StoreStatus.Enabled
						async function save(checked: boolean) {
							return checked
								? ecommerceModel.enableEcommerce()
								: ecommerceModel.disableEcommerce()
						}
						return html`
							<p>store is configured properly</p>
							<p>
								<xio-checkbox
									?initially-checked=${enabled}
									.save=${save}
								></xio-checkbox>
								Ecommerce active
							</p>
						`
				}
			}
		)
	}
}