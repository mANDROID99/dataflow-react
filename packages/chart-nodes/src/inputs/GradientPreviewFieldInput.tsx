import { InputProps } from "@react-ngraph/core";
import React, { useEffect, useReducer, useRef } from 'react';

export const PARAM_SCALE = 'scale';

declare const ResizeObserver: any;

const NUM_SAMPLES = 100;

export default function GradientPreviewFieldInput({ params }: InputProps<null>) {
    const scale = params[PARAM_SCALE] as chroma.Scale<chroma.Color>;
    const canvas = useRef<HTMLCanvasElement>(null);
    const [,forceRender] = useReducer((c) => c + 1, null);

    useEffect(() => {
        const canvasEl = canvas.current;
        if (!canvasEl) return;

        const parentEl = canvasEl.parentNode! as HTMLElement;
        const observer = new ResizeObserver(() => {
            forceRender();
        });
        
        observer.observe(parentEl);
        return () => {
            observer.unobserve(parentEl);
        }
    }, []);
    
    useEffect(() => {
        const canvasEl = canvas.current;
        if (!canvasEl) return;

        const parentEl = canvasEl.parentNode! as HTMLElement;
        const parentBounds = parentEl.getBoundingClientRect();
        const width = parentBounds.width;
        const height = parentBounds.height;

        canvasEl.width = width;
        canvasEl.height = height;

        const canvasCtx = canvasEl.getContext('2d');
        if (!canvasCtx) return;
        
        const w = width / NUM_SAMPLES;
        for (let i = 0; i < NUM_SAMPLES; i++) {
            const sample = scale(i / NUM_SAMPLES).hex();
            canvasCtx.fillStyle = sample;
            canvasCtx.fillRect(i * w, 0, w + 1, height);
        }
    });

    return (
        <div className="ngraph-gradient-preview">
            <canvas className="ngraph-gradient-canvas" ref={canvas}/>
        </div>
    );

}
