
import {asTopic} from "renraku/x/identities/as-topic.js"
import {find} from "../../../toolbox/dbby/dbby-helpers.js"
import {resolveQuestions} from "./helpers/resolve-questions.js"
import {QuestionReaderAuth} from "../api/types/questions-persona.js"
import {fetchUsers} from "../../auth/topics/login/user/fetch-users.js"
import {PlatformConfig} from "../../../assembly/backend/types/platform-config.js"
import {makePermissionsEngine} from "../../../assembly/backend/permissions2/permissions-engine.js"

export const questionReadingTopic = ({config, generateNickname}: {
		config: PlatformConfig
		generateNickname: () => string
	}) => asTopic<QuestionReaderAuth>()({

	async fetchQuestions(
			{questionsTables, tables, access},
			{board}: {board: string}
		) {
		
		const posts = await questionsTables.questionPosts
			.read(find({board, archive: false}))

		const permissionsEngine = makePermissionsEngine({
			isPlatform: access.appId === config.platform.appDetails.appId,
			permissionsTables: tables.permissions,
		})

		const users = await fetchUsers({
			permissionsEngine,
			authTables: tables,
			userIds: posts.map(p => p.authorUserId),
		})

		const questions = await resolveQuestions({
			posts,
			questionsTables,
			userId: access?.user?.userId,
		})

		return {questions, users}
	},
})
