// src/Sticker.js

import React from 'react';
import styled, { keyframes } from 'styled-components';
import DescriptionIcon from '@material-ui/icons/Description';
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
    box-shadow: 0 4px 8px 0 rgba(187, 187, 187, 1);
    background-color: #ffffff;
    visibility: ${(props) => (props.isEditingMode ? 'visible' : 'hidden')};
    animation: ${(props) => (props.isEditingMode ? showAnim : hideAnim)} 0.5s
        ease-in-out;
    -webkit-transition: -webkit-visibility 0.5s ease-in-out;
    transition: visibility 0.5s ease-in-out;
`;

const Content = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
`;

const MenuContainer = styled.div`
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
`;

const MenuButton = styled.button`
    width: 100%;
    padding: 4px 8px;
    &:not(:last-child) {
        margin-bottom: 8px;
    }
    font-size: 16px;
    color: #333333;
`;

const WriteInfo = styled(DescriptionIcon)`
    position: absolute;
    z-index: 8;
    display: flex;
    top: 10px;
    left: 5px;
    cursor:pointer;
`

const Container = styled.span`
    display: flex;
    margin-top: 30px;
    width: calc(100%);
    height: calc(100% - 50px);
`

const TextArea = styled.textarea`
    width: 100%;
    height: 100%;
    padding: 10px;
    resize: none;
    margin-top: 30px;
    border-radius: 10px;
    outline: none;
    margin: 10px;
    z-index: 2;
`

class Sticker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            isMemoOn: false,        
            isMoving: false,
        };
    }

    memoClick = (e) => {
        this.setState({isMoving: !this.state.isMoving});
        e.stopPropagation();
    }

    wrapperMouseDown = (e) => {
        !this.state.isMemoOn && this.props.onMouseDown(e);
    }

    textClick = (e) => {
        this.setState({isMemoOn: true})
        e.stopPropagation();
    }
    
    wrapperClick = (e) => {
        this.setState({isMemoOn: false});
    }

    componentDidMount() {
        this.setState({content: this.props.description[this.props.name]});
    }

    memoChange = (e) => {
        this.setState({content: e.target.value});
        this.props.descriptionChange(e);
    }

    render() {
        const {
            children,
            name,
            description,
            descriptionChange,
            className,
            onChange,
            onDelete,
            ...other
        } = this.props;

        const isEditingMode = className && className.includes('react-resizable');
        const {isMoving, content} = this.state;

        return (
            <Wrapper 
                {...other} 
                className={className} 
                onClick={this.wrapperClick} 
                onMouseDown={this.wrapperMouseDown}>
                { isEditingMode && <WriteInfo onClick={this.memoClick}/> }
                    <Shadow isEditingMode={isEditingMode}/>
                    <Content>
                        {children}
                        {isEditingMode && (
                            <MenuContainer>
                                <MenuButton onClick={onChange}>Change</MenuButton>
                                <MenuButton onClick={onDelete}>Delete</MenuButton>
                            </MenuContainer>
                        )}
                    </Content>
                    {
                        isMoving &&
                        <Container>
                            <TextArea
                                value={content}
                                name={name}
                                onMouseDown={this.textClick}
                                onChange={this.memoChange}/>
                        </Container>
                    }
            </Wrapper>
        );
    }
}

export default Sticker;
