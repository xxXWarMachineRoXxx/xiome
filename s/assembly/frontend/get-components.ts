
import {Await} from "../../types/fancy.js"
import {assembleModels} from "./assemble-models.js"
import {share2, themeComponents} from "../../framework/component.js"

import theme from "../../framework/theme.css.js"

import {XioButton} from "../../features/xio-components/button/xio-button.js"
import {XioExample} from "../../features/xio-components/example/xio-example.js"
import {XioLoading} from "../../features/xio-components/loading/xio-loading.js"
import {XioTextInput} from "../../features/xio-components/inputs/xio-text-input.js"
import {XiomeAppManager} from "../../features/auth/components/apps/xiome-app-manager.js"
import {XiomeMyAvatar} from "../../features/auth/components/my-avatar/xiome-my-avatar.js"
import {XiomeMyAccount} from "../../features/auth/components/my-account/xiome-my-account.js"
import {XioProfileCard} from "../../features/xio-components/profile-card/xio-profile-card.js"
import {XiomeLoginPanel} from "../../features/auth/components/login-panel/xiome-login-panel.js"
import {XiomePermissions} from "../../features/auth/components/permissions/xiome-permissions.js"

export function getComponents(models: Await<ReturnType<typeof assembleModels>>) {
	const {authModel, appModel, personalModel} = models
	return themeComponents(theme, {
		XioButton,
		XioExample,
		XioLoading,
		XioTextInput,
		XioProfileCard,
		XiomeMyAvatar: share2(XiomeMyAvatar, {authModel}),
		XiomeAppManager: share2(XiomeAppManager, {appModel}),
		XiomeLoginPanel: share2(XiomeLoginPanel, {authModel}),
		XiomePermissions: share2(XiomePermissions, {authModel}),
		XiomeMyAccount: share2(XiomeMyAccount, {authModel, personalModel}),
	})
}
