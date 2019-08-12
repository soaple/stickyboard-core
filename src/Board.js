// src/Board.js

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
    },
});

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

class Board extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            isEditingMode: false
        }
    }

    toggleEditingMode = () => {
        let currentEditingMode = this.state.isEditingMode;

        let layouts = this.getLayouts(!currentEditingMode);
        this.setState({
            layouts: {},
            layoutUpdateFlag: false,
            isEditingMode: !currentEditingMode,
        }, () => {
            this.setState({
                layouts: layouts,
                layoutUpdateFlag: true,
            })
        });
    }

    getLayouts = (isEditingMode) => {
        let layouts = this.state.layouts;
        _.each(layouts, (layout) => {
            layout.forEach((block) => {
                block.static = !isEditingMode;
                block.isDraggable = isEditingMode;
                block.isResizable = isEditingMode;
                block.minW = 3;
                block.maxW = 12;
                block.minH = 4;
                block.maxH = 16;
            });
        });

        return layouts;
    }

    onBreakpointChange = (breakpoint) => {
        // console.log('onBreakpointChange', breakpoint);

        this.setState({
            currentBreakpoint: breakpoint,
            isEditingMode: breakpoint === 'lg' || breakpoint === 'md',
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
                    _.each(layout, (block) => {
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
        const { isEditingMode } = this.state;
        const { classes, theme } = this.props;

        return (
            <ResponsiveReactGridLayout
                {...RGL_LAYOUT_PROPS}
                layouts={this.getLayouts(isEditingMode)}
                onBreakpointChange={this.onBreakpointChange}
                onLayoutChange={this.onLayoutChange}>
                {this.props.children.map((child, index) => {

                })}
            </ResponsiveReactGridLayout>
        )
    }
}

Board.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Board);
