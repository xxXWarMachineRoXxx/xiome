
import {UserTables} from "../../../tables/types/table-groups/user-tables"
import {Permit} from "../../../types/permit.js"
import {find, or} from "../../../../../toolbox/dbby/dbby-helpers.js"

import {isCurrentlyWithinTimeframe} from "./utils/is-currently-within-timeframe.js"
import {AuthTables} from "../../../tables/types/auth-tables.js"

export async function fetchPermit({userId, tables}: {
			userId: string
			tables: AuthTables
		}): Promise<Permit> {

	const userHasRoleRows = await tables.permissions.userHasRole
		.read(find({userId}))

	const roleIds = userHasRoleRows
		.filter(isCurrentlyWithinTimeframe)
		.map(({roleId}) => roleId)

	const roleHasPrivilegeRows = await tables.permissions.roleHasPrivilege
		.read({
			conditions: or(...roleIds.map(roleId => ({equal: {roleId}})))
		})

	return {
		privileges: roleHasPrivilegeRows.map(({privilegeId}) => privilegeId),
	}
}
