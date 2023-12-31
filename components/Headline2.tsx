import React from 'react';

export function Headline2(props: { children: string; className?: string; hidden?: boolean }) {
    return (
        <h2
            hidden={props.hidden}
            className={
                'pt-5 md:pt-7 pb-1 md:pb-2 mb-4 text-xl md:text-3xl border-solid border-b border-lime-500 ' +
                props.className
            }
        >
            {props.children}
        </h2>
    );
}
