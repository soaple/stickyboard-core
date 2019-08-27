// src/Sticker.js

import React from 'react';
import styled, { keyframes } from 'styled-components';

const showAnim = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const hideAnim = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`;

const Wrapper = styled.div`
`;

const Shadow = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(187,187,187,1);
    background-color: #ffffff;
    visibility: ${props => props.isEditMode ? 'visible' : 'hidden'};
    animation: ${props => props.isEditMode ? showAnim : hideAnim} 0.5s ease-in-out;
    -webkit-transition: -webkit-visibility 0.5s ease-in-out;
    transition: visibility 0.5s ease-in-out;
`;

// const Content = styled.div`
//     position: absolute;
//     left: 0;
//     top: 0;
//     right: 0;
//     bottom: 0;
//     padding: 16px;
//     z-index: 1;
// `;

class Sticker extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
        }
    }

    render () {
        const { children, ...other } = this.props;

        const isEditMode = this.props.className.includes('react-resizable');

        return (
            <Wrapper
                {...other}>
                <Shadow isEditMode={isEditMode} />
                {children}
            </Wrapper>
        )
    }
}

export default Sticker;
