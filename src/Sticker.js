// src/Sticker.js

import React from 'react';
import styled, { keyframes } from 'styled-components';

const showShadowAnim = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const hideShadowAnim = keyframes`
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
`;

const Wrapper = styled.div``;

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
    animation: ${(props) =>
            props.isEditingMode ? showShadowAnim : hideShadowAnim}
        0.5s ease-in-out;
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
    border: 1px solid #bbbbbb;
    border-radius: 8px;
    font-size: 16px;
    color: #333333;
    background-color: #ffffff;
`;

const showInfoAnim = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 0.9;
    }
`;

const hideInfoAnim = keyframes`
    from {
        opacity: 0.9;
    }
    to {
        opacity: 0;
    }
`;

const InfoContainer = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    border-radius: 8px;
    background-color: #ffffff;
    opacity: 0.9;
    visibility: ${(props) => (props.isShowInfo ? 'visible' : 'hidden')};
    animation: ${(props) => (props.isShowInfo ? showInfoAnim : hideInfoAnim)}
        0.5s ease-in-out;
    -webkit-transition: -webkit-visibility 0.5s ease-in-out;
    transition: visibility 0.5s ease-in-out;
`;

const InfoContentContainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
`;

const Name = styled.div`
    font-size: 20px;
    font-weight: 900;
    text-align: center;
`;

const Description = styled.div`
    margin-top: 16px;
    font-size: 16px;
    text-align: center;
`;

class Sticker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowInfo: false,
        };
    }

    showInfo = () => {
        this.setState({
            isShowInfo: true,
        });
    };

    hideInfo = () => {
        this.setState({
            isShowInfo: false,
        });
    };

    render() {
        const { isShowInfo } = this.state;
        const {
            name,
            description,
            children,
            className,
            onChange,
            onDelete,
            ...other
        } = this.props;

        const isEditingMode =
            className && className.includes('react-resizable');

        return (
            <Wrapper {...other} className={className}>
                <Shadow isEditingMode={isEditingMode} />
                <Content>{children}</Content>

                {/* Menu */}
                {isEditingMode && (
                    <MenuContainer>
                        {name && description && (
                            <MenuButton onClick={this.showInfo}>
                                Info
                            </MenuButton>
                        )}
                        {onChange && (
                            <MenuButton onClick={onChange}>Change</MenuButton>
                        )}
                        {onDelete && (
                            <MenuButton onClick={onDelete}>Delete</MenuButton>
                        )}
                    </MenuContainer>
                )}

                {/* Info */}
                <InfoContainer isShowInfo={isShowInfo}>
                    <MenuContainer>
                        <MenuButton onClick={this.hideInfo}>Close</MenuButton>
                    </MenuContainer>

                    <InfoContentContainer>
                        <Name>{name}</Name>
                        <Description>{description}</Description>
                    </InfoContentContainer>
                </InfoContainer>
            </Wrapper>
        );
    }
}

export default Sticker;
