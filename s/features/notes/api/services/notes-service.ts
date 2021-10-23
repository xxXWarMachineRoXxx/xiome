
import {apiContext} from "renraku/x/api/api-context.js"
import {Policy} from "renraku/x/types/primitives/policy.js"

import {DamnId} from "../../../../toolbox/damnedb/damn-id.js"
import {UserAuth, UserMeta} from "../../../auth/types/auth-metas.js"
import {SecretConfig} from "../../../../assembly/backend/types/secret-config.js"
import {UnconstrainedTables} from "../../../../framework/api/types/table-namespacing-for-apps.js"

import {Notes, NotesStats, Pagination} from "../../types/notes-concepts.js"
import {NotesTables} from "../tables/notes-tables.js"
import {NotesAuth, NotesMeta} from "../types/notes-auth.js"
import {find} from "../../../../toolbox/dbby/dbby-helpers.js"
import {timeLog} from "console"
import {timestamp} from "../../../../toolbox/logger/timestamp.js"

export const makeNotesService = ({
		config, basePolicy,
		notesTables: rawNotesTables,
	}: {
		config: SecretConfig
		notesTables: UnconstrainedTables<NotesTables>
		basePolicy: Policy<UserMeta, UserAuth>
	}) => apiContext<NotesMeta, NotesAuth>()({

	async policy(meta, request) {
		const auth = await basePolicy(meta, request)
		const appId = DamnId.fromString(auth.access.appId)
		return {
			...auth,
			notesTables: rawNotesTables.namespaceForApp(appId),
		}
	},

	expose: {

		async getNotesStats({notesTables, access}): Promise<NotesStats> {
			const {userId} = access.user
			const newCount = await notesTables.notes.count(find({
				userId: DamnId.fromString(userId),
				old: false
		}))
		const oldCount = await notesTables.notes.count(find({
			userId: DamnId.fromString(userId),
			old: true
	}))
			return {newCount, oldCount}
		},

		async getNewNotes(
					{notesTables, access},
					{offset, limit}: Pagination
				): Promise<Notes.Any[]> {
			const {userId} = access.user
			const newNotes = await notesTables.notes.read({
				...find({userId: DamnId.fromString(userId),
				old: false}),
				offset: 0,
				limit: 10,
				order: {time: "descend"}
			})
			return newNotes.map(note => ({
				noteId: note.noteId.toString(),
				type: "message",
				to: note.to.toString(),
				from: note.from.toString(),
				title: note.title,
				text: note.text,
				old: note.old,
				time: note.time,
				details: {},
			}))
		},

		async getOldNotes(
				{notesTables, access},
				{offset, limit}: Pagination
			): Promise<Notes.Any[]> {
					const {userId} = access.user
					const oldNotes = await notesTables.notes.read({
						...find({userId: DamnId.fromString(userId),
						old: true}),
						offset: 0,
						limit: 10,
						order: {time: "ascend"}
					})
			return [
				{
					type: "message",
					noteId: undefined,
					time: Date.now(),
					old: false,
					from: undefined,
					to: undefined,
					text: "text",
					title: "title",
					details: {},
				}
			]
		},
	},
})
