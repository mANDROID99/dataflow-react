import React from 'react';
import Pickr from '@simonwep/pickr';
import { InputProps } from "../types/graphInputTypes";

export default class ColorPickerInput extends React.Component<InputProps<string>> {
    private ref: React.RefObject<HTMLDivElement>;
    private picker!: Pickr;

    constructor(props: InputProps<string>) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.picker = Pickr.create({
            theme: 'nano',
            el: this.ref.current!,
            swatches: ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99'],
            default: this.props.value,
            components: {
                // Main components
                preview: true,
                opacity: true,
                hue: true,
        
                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: true,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });

        this.picker.on('save', this.handlePickerSave.bind(this));
    }

    componentDidUpdate(prevProps: InputProps<string>) {
        const value = this.props.value;
        if (value && value !== prevProps.value) {
            this.picker.setColor(value);
        }
    }

    componentWillUnmount() {
        this.picker.destroyAndRemove();
    }

    render() {
        return (
            <div className="ngraph-color-picker">
                <div ref={this.ref}/>
            </div>
        );
    }

    private handlePickerSave() {
        const color = this.picker.getColor().toHEXA();
        this.props.onChanged('' + color);
    }
}
