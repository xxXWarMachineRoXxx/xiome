
import {makeChatModel} from "../../models/chat-model.js"
import {renderChatPost} from "./renderers/render-chat-post.js"
import {chatPostCoolOff} from "../../common/chat-constants.js"
import {makeChatRoom} from "../../models/room/make-chat-room.js"
import {renderOp} from "../../../../framework/op-rendering/render-op.js"
import {ChatDraft, ChatStatus} from "../../common/types/chat-concepts.js"
import {renderChatAuthorship} from "./renderers/render-chat-authorship.js"
import {XioTextInput} from "../../../xio-components/inputs/xio-text-input.js"
import {whenOpReady} from "../../../../framework/op-rendering/when-op-ready.js"
import {ModalSystem} from "../../../../assembly/frontend/modal/types/modal-system.js"
import {ComponentWithShare, html, mixinStyles, property, query} from "../../../../framework/component.js"

import styles from "./xiome-chat.css.js"

@mixinStyles(styles)
export class XiomeChat extends ComponentWithShare<{
		modals: ModalSystem
		chatModel: ReturnType<typeof makeChatModel>
	}> {

	@property({type: String})
	room: string = "default"

	get #model() {
		return this.share.chatModel
	}

	#room: ReturnType<typeof makeChatRoom>
	#dispose = () => {}

	subscribe() {

		this.#model.session(this.room)
			.then(({room, dispose}) => {
				this.#room = room
				this.#dispose = dispose
			})
			.then(() => this.requestUpdate())

		const unsubs = [
			super.subscribe(),
			() => this.#dispose(),
			this.#subscribeTooSoon(),
		]

		return () => {
			for (const unsub of unsubs)
				unsub()
		}
	}

	#renderModerationHeader() {
		const status = this.#room.status
		const toggleStatus = () => {
			this.#room.setRoomStatus(
				this.#room.status === ChatStatus.Offline
					? ChatStatus.Online
					: ChatStatus.Offline
			)
		}
		return this.#model.allowance.moderateAllChats
			? html`
				<header>
					<p>room="${this.room}"</p>
					<p>
						<xio-button @press=${toggleStatus}>
							set status
							${status === ChatStatus.Offline ? "online" : "offline"}
						</xio-button>
						<xio-button @press=${() => this.#room.unmuteAll()}>
							unmute all (${this.#room.muted.length})
						</xio-button>
					</p>
				</header>
			`
			: null
	}

	#renderHistory() {
		return html`
			<div class=history>
				${this.#model.allowance.viewAllChats
					? html`
						${this.#room.posts.length
							? html`
								<ol>
									${this.#room.posts.map(post => renderChatPost({
										post,
										isModerator: this.#model.allowance.moderateAllChats,
										mute: () => this.#room.mute(post.userId),
										remove: () => this.#room.remove([post.postId]),
									}))}
								</ol>
							`
							: html`
								<slot name=no-messages>
									no messages
								</slot>
							`}
					`
					: html`
						<slot name=cannot-view>
							you are not privileged to view the chat
						</slot>
					`}
			</div>
		`
	}

	@property()
	private draftValid = false

	@query(".authorship xio-text-input")
	private authorshipInput: XioTextInput

	@property()
	private tooSoon: boolean = false
	private lastSend: number = Date.now()
	#subscribeTooSoon() {
		const interval = setInterval(
			() => {
				const since = Date.now() - this.lastSend
				this.tooSoon = since < chatPostCoolOff
			},
			1000,
		)
		return () => clearInterval(interval)
	}

	#postToChat = () => {
		const {value} = this.authorshipInput
		const draft: ChatDraft = {content: value}
		this.lastSend = Date.now()
		this.authorshipInput.text = ""
		this.#room.post(draft)
	}

	#renderParticipation() {
		return html`
			<xiome-login-panel>
				${whenOpReady(this.#model.state.accessOp, () => html`
					<div slot=logged-out>
						<slot name=logged-out>
							login to participate in the chat
						</slot>
					</div>
					<div class=participation>
						${this.#model.allowance.participateInAllChats
							? renderChatAuthorship({
								sendable: !!this.draftValid && !this.tooSoon,
								onSendClick: this.#postToChat,
								onEnterPress: this.#postToChat,
								onValidityChange: valid => this.draftValid = valid,
							})
							: html`
								<slot name=cannot-participate>
									you do not have privilege to participate in the chat
								</slot>
							`}
					</div>
				`)}
			</xiome-login-panel>
		`
	}

	render() {
		return renderOp(this.#model.state.connectionOp, () => html`
			<div class=chatbox>
				${this.#renderModerationHeader()}
				${this.#room?.status === ChatStatus.Online
					? [
						this.#renderHistory(),
						this.#renderParticipation(),
					]
					: html`
						<slot name=offline>
							chat is offline
						</slot>
					`}
			</div>
		`)
	}
}
