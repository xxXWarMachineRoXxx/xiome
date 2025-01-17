
import {SecretConfig} from "./secret-config.js"
import {Configurators} from "./configurators.js"
import {Rando} from "../../../toolbox/get-rando.js"

export interface AssimilatorOptions extends Configurators {
	rando: Rando
	config: SecretConfig
}
