import { useState } from "react"

const Togglable = (props) => {
    const [visable, setVisable] = useState(false)

    const hideWhenVisable = {display: visable? 'none': ''}
    const showWhenVisable = {display: visable? '': 'none'}
    return (
        <div>
            <div style={hideWhenVisable}>
                {props.header}
                <button onClick={() => setVisable(true)}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisable}>
                {props.children}
                <button onClick={() => setVisable(false)}>hide</button>
            </div>
        </div>
    )
}

export default Togglable