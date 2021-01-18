
import {AccessPayload} from "../../../../features/auth/auth-types.js"

export type AccessEventListener = (access: AccessPayload) => void | Promise<void>
