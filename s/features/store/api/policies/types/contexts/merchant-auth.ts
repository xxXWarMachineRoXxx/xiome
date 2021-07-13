
import {DamnId} from "../../../../../../toolbox/damnedb/damn-id.js"
import {StoreAuthSpecifics} from "./specifics/pay-auth-specifics.js"
import {AppOwnerAuth} from "../../../../../auth/policies/types/app-owner-auth.js"
import {StripeLiaisonForPlatform} from "../../../../stripe2/types/stripe-liaison-for-platform.js"

export type MerchantAuth = {
	stripeLiaisonForPlatform: StripeLiaisonForPlatform
	getTablesNamespacedForApp: (appId: DamnId) => Promise<StoreAuthSpecifics["tables"]>
} & StoreAuthSpecifics & AppOwnerAuth
