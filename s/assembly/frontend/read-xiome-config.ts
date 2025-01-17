
import {configReading} from "./tools/config-reading.js"
import {XiomeConfig} from "./types/xiome-config-connected.js"

export function readXiomeConfig(): XiomeConfig {
	const {attr} = configReading("xiome-config")
	return {
		appId: attr("app"),
		apiOrigin: attr("api"),
		platformOrigin: attr("platform"),
	}
}
