
import {css} from "../../../../framework/component.js"
export default css`

:host {
	display: block;
}

iframe {
	width: 100%;
	height: 100%;
	border: none;
}

	xio-button div {
		display: flex;
		padding: 5px;
	}

.open {
	transform: rotate(180deg);
	--_border: none;

}
xio-button {
--_padding: var(--xio-button-padding, 0.0em 0.0em);
--_border: none;
}
h2 {

}
h2 span {
	font-size: 40px;
	margin-right: 40px;
}

`
