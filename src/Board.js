// src/Board.js

import React from 'react';
import PropTypes from 'prop-types';
import {
    Responsive as ResponsiveGridLayout,
    WidthProvider,
} from 'react-grid-layout';
// const ResponsiveReactGridLayout = WidthProvider(Responsive);
import { SizeMe } from 'react-sizeme';

require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');
require('./static/css/react-grid-layout.css');

/**
 * React-Grid-Layout layout props
 */
const RGL_LAYOUT_PROPS = {
    className: 'layout',
    rowHeight: 40,
    cols: { lg: 12, md: 12, sm: 8, xs: 6, xxs: 4 },
    breakpoints: { lg: 1280, md: 996, sm: 768, xs: 480, xxs: 0 },
    margin: [16, 16],
    measureBeforeMount: true,
    useCSSTransforms: true,
};

const NUM_OF_ROWS = 18;
const MIN_ROW_HEIGHT = 32;

const normalModeStyle = {};

const tvModeStyle = {
    minHeight: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1500,
    backgroundColor: 'inherit',
};

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBreakpoint: 'lg',
            isEditingMode: false,
            isTvMode: false,
        };
    }

    componentDidMount() {
        this.setEscKeyListener();
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     const { currentBreakpoint, isEditingMode, isTvMode } = this.state;
    //     const { children, layouts } = this.props;
    //
    //     return (
    //         // Compare state
    //         currentBreakpoint !== nextState.currentBreakpoint ||
    //         isEditingMode !== nextState.isEditingMode ||
    //         isTvMode !== nextState.isTvMode ||
    //         // Compare props
    //         children.length !== nextProps.children.length ||
    //         layouts[currentBreakpoint].length !==
    //             nextProps.layouts[currentBreakpoint].length
    //     );
    // }

    componentWillUnmount() {
        this.removeEscKeyListener();
    }

    toggleEditingMode = () => {
        this.setState(
            (prevState) => ({
                isEditingMode: !prevState.isEditingMode,
            }),
            () => {
                if (!this.state.isEditingMode && this.props.onSaveLayout) {
                    this.props.onSaveLayout();
                }
            }
        );
    };

    setEditingMode = (editingMode) => {
        this.setState({
            isEditingMode: editingMode,
        });
    };

    toggleTvMode = () => {
        this.setState((prevState) => ({
            isTvMode: !prevState.isTvMode,
        }));
    };

    setEscKeyListener = () => {
        window.onkeydown = (event) => {
            const { isTvMode } = this.state;
            if (event.key === 'Escape' && isTvMode) {
                this.setState({
                    isTvMode: false,
                });
            }
        };
    };

    removeEscKeyListener = () => {
        window.onkeypress = null;
    };

    getLayouts = (isEditingMode) => {
        const { layouts } = this.props;

        for (let key in layouts) {
            let layout = layouts[key];
            layout.forEach((block) => {
                block.i = block.i.toString();
                block.static = !isEditingMode;
                block.isDraggable = isEditingMode;
                block.isResizable = isEditingMode;
                block.minW = 2;
                block.maxW = 12;
                block.minH = 1;
                block.maxH = NUM_OF_ROWS;
            });
        }

        return JSON.parse(JSON.stringify(layouts));
        // return layouts;
    };

    onBreakpointChange = (breakpoint) => {
        this.setState({
            currentBreakpoint: breakpoint,
        });
    };

    onLayoutChange = (currentLayout, allLayouts) => {
        // console.log('onLayoutChange', currentLayout, allLayouts);

        // Generate tiny layout for saving to the server
        let newLayouts = {};

        let breakpoints = Object.keys(allLayouts);
        breakpoints.map((breakpoint) => {
            let newLayout = [];
            let layout = allLayouts[breakpoint];
            layout.map((block) => {
                newLayout.push({
                    i: block.i.toString(),
                    x: block.x,
                    y: block.y,
                    w: block.w,
                    h: block.h,
                });
            });

            newLayouts[breakpoint] = newLayout;
        });

        if (this.props.onLayoutChange) {
            this.props.onLayoutChange(newLayouts);
        }
    };

    render() {
        const { isEditingMode, isTvMode } = this.state;
        const { children } = this.props;

        const mainElem = document.getElementById('stickyboard-container');
        const height = mainElem ? mainElem.clientHeight : window.innerHeight;
        const rowHeight = Math.max(
            Math.floor((height - 16 * (NUM_OF_ROWS + 2)) / NUM_OF_ROWS),
            MIN_ROW_HEIGHT
        );

        let filteredChilren = [];
        if (children && Array.isArray(children)) {
            filteredChilren = children.filter((child) => {
                return !!child;
            });
        }

        return (
            <SizeMe monitorHeight>
                {({ size }) => {
                    if (size.width && filteredChilren.length > 0) {
                        return (
                            <ResponsiveGridLayout
                                width={size.width}
                                style={isTvMode ? tvModeStyle : normalModeStyle}
                                {...RGL_LAYOUT_PROPS}
                                rowHeight={rowHeight}
                                layouts={this.getLayouts(isEditingMode)}
                                onBreakpointChange={this.onBreakpointChange}
                                onLayoutChange={this.onLayoutChange}>
                                {filteredChilren}
                            </ResponsiveGridLayout>
                        );
                    } else {
                        return null;
                    }
                }}
            </SizeMe>
        );
    }
}

Board.propTypes = {
    layouts: PropTypes.array.isRequired,
    onLayoutChange: PropTypes.func,
    onSaveLayout: PropTypes.func,
};

export default Board;
