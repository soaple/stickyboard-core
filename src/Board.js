// src/Board.js

import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

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
    margin: [15, 20],
    measureBeforeMount: false,
    useCSSTransforms: true,
};

const NUM_OF_ROWS = 24;

class Board extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            currentBreakpoint: 'lg',
            layoutUpdateFlag: true,
        }
    }

    componentWillReceiveProps(nextProps) {
        // Check if the editing mode is changed or not
        // if (this.props.isEditingMode !== nextProps.isEditingMode) {
        //     this.toggleEditingMode(nextProps.isEditingMode);
        // }
    }

    toggleEditingMode = (editingMode) => {
        let layouts = this.getLayouts(editingMode);
        this.setState({
            layouts: {},
            layoutUpdateFlag: false,
        }, () => {
            this.setState({
                layouts: layouts,
                layoutUpdateFlag: true,
            })
        });
    }

    getLayouts = (isEditingMode) => {
        let layouts = this.props.layouts;

        for (let key in layouts) {
            let layout = layouts[key];
            layout.forEach((block) => {
                block.static = !isEditingMode;
                block.isDraggable = isEditingMode;
                block.isResizable = isEditingMode;
                block.minW = 3;
                block.maxW = 12;
                block.minH = 4;
                block.maxH = 16;
            });
        }

        return layouts;
    }

    onBreakpointChange = (breakpoint) => {
        this.setState({
            currentBreakpoint: breakpoint,
        });
    }

    onLayoutChange = (currentLayout, allLayouts) => {
        // console.log('onLayoutChange', currentLayout, allLayouts);

        if (this.state.layoutUpdateFlag) {
            this.setState({
                layouts: allLayouts,
            }, () => {
                // Generate tiny layout for saving to the server
                let newLayouts = {};

                let breakpoints = Object.keys(allLayouts);
                breakpoints.map((breakpoint) => {
                    let newLayout = [];
                    let layout = allLayouts[breakpoint];
                    layout.map((block) => {
                        let newBlock = {};
                        newBlock.i = block.i;
                        newBlock.x = block.x;
                        newBlock.y = block.y;
                        newBlock.w = block.w;
                        newBlock.h = block.h;

                        newLayout.push(newBlock);
                    });

                    newLayouts[breakpoint] = newLayout;
                });
            });
        }
    }

    render () {
        const { isEditingMode } = this.props;

        const rowHeight = window.innerHeight / NUM_OF_ROWS;

        return (
            <ResponsiveReactGridLayout
                {...RGL_LAYOUT_PROPS}
                rowHeight={rowHeight}
                layouts={this.getLayouts(isEditingMode)}
                onBreakpointChange={this.onBreakpointChange}
                onLayoutChange={this.onLayoutChange}>
                {this.props.children}
            </ResponsiveReactGridLayout>
        )
    }
}

export default Board;
