
import {Validator} from "../../../../toolbox/darkvalley.js"
import {html} from "../../../../framework/component.js"
import {ValueChangeEvent} from "../../inputs/events/value-change-event.js"

export function renderText({field, initial, input}: {
		field: string
		initial: string
		input?: {
			label: string
			draftIsChanged: boolean
			readonly: boolean
			validator: Validator<string>
			onvaluechange: (event: ValueChangeEvent<string>) => void
		}
	}) {
	return input
		? html`
			<xio-text-input
				data-field="${field}"
				initial="${initial}"
				part="xiotextinput"
				exportparts="${`
					label: xiotextinput-label,
					textinput: xiotextinput-textinput,
					problems: xiotextinput-problems,
				`}"
				show-validation-when-empty
				?readonly=${input.readonly}
				?hide-validation=${!input.draftIsChanged}
				.validator=${input.validator}
				@valuechange=${input.onvaluechange}>
					<span>${input.label}</span>
			</xio-text-input>
		`
		: html`
			<p part="textfield" data-field="${field}">${initial}</p>
		`
}
