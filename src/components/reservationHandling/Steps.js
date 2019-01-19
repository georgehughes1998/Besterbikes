import React from 'react'
import {withRouter} from 'react-router-dom'
import {Icon, Step} from "semantic-ui-react";

const Steps = (props) => {

    //Change functionality of clicking steps to work with redux form
    const handleClick = (link) => props.history.push(link);

    const renderSteps = (Object.values(props.steps).map((key, index) => {
        return (
            <Step
                key={index}
                link
                onClick={() => handleClick(key.link)}
            >
                <Icon name={key.icon}/>
                <Step.Content>
                    <Step.Title>{key.title}</Step.Title>
                    <Step.Content>{key.content}</Step.Content>
                </Step.Content>
            </Step>
        )
    }))

    return (
        <Step.Group
            fluid
            widths={4}
            size="small"
            attached='bottom'
        >
            {renderSteps}
        </Step.Group>
    )
}

export default withRouter(Steps)