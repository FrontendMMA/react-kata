import React from 'react';

import {useNotEmptyNode} from './useNotEmptyNode';

function CompRefUnsupported() {
    const [empty, setEmpty] = React.useState(false);

    if (empty) {
        return null;
    }

    return (
        <>
            <div>Пример компонента без поддержки REF</div>
            <button onClick={() => setEmpty(true)}>скрыть</button>
        </>
    );
}

function CompWithChildren({children}) {
    return (
        <>
            <div>comp1</div>
            {children}
        </>
    );
}

function CompSimple() {
    return <div>comp2</div>;
}

function NullComponent() {
    return null;
}

const ExampleWithRefSupported = ({contentRef}) => {
    const [empty, setEmpty] = React.useState(false);

    if (empty) {
        return null;
    }

    return (
        <div ref={contentRef}>
            <div>Пример компонента c поддержкой REF</div>
            <button onClick={() => setEmpty(true)}>скрыть</button>
            <CompWithChildren>
                <CompSimple/>
            </CompWithChildren>
        </div>
    );
};

const ExampleWithRefSupported2 = ({contentRef}) => {
    const [empty, setEmpty] = React.useState(false);

    return (
        <>
            <div>Пример компонента с поддержкой REF на внутреннем элементе</div>
            <div>Как вариант можно кинуть в самый низ дерева ссылку, и при её уничтожении будет скрываться всё с самого
                верха
            </div>
            <button onClick={() => setEmpty(true)}>скрыть</button>

            {/* как только скрываем - ref уничтожается и весь компонент схлопывается */}
            {!empty && (
                <div ref={contentRef}>
                    <CompWithChildren>
                        <CompSimple/>
                    </CompWithChildren>
                </div>
            )}
        </>
    );
};


const ExampleUseReference2 = ({children}) => {
    const [Wrapper, node] = useNotEmptyNode(children, 'contentRef');

    return (
        <Wrapper>
            <div>
                ололо, этот текст покажется только для not null children.
                {node}
            </div>
        </Wrapper>
    );
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

const NotEmptyLvl1 = () => {
    const [Wrapper, node] = useNotEmptyNode(<NotEmptyLvl2/>, 'contentRef');

    return (
        <Wrapper>
            <div style={{marginLeft: 20}}>
                Текст на первом уровне
                {node}
            </div>
        </Wrapper>
    );
};

const NotEmptyLvl2 = ({contentRef}) => {
    const [Wrapper, node] = useNotEmptyNode(<NotEmptyLvl3/>, 'contentRef');

    return (
        <Wrapper>
            <div ref={contentRef} style={{marginLeft: 20}}>
                Текст на втором уровне
                {node}
            </div>
        </Wrapper>
    );
};

const NotEmptyLvl3 = ({contentRef}) => {
    const [visible, setVisible] = React.useState(true)

    if (!visible) {
        return false;
    }

    return (
        <div ref={contentRef} style={{marginLeft: 20}}>
            <button onClick={() => setVisible(false)}>скрыть</button>
            Текст на третьем уровне
        </div>
    );
};

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

export default function UseNotEmptyDemo() {
    return (
        <>
            UseNotEmptyDemo
            <p>---ref UNsupport</p>
            <ExampleUseReference2>
                <CompRefUnsupported/>
            </ExampleUseReference2>
            <p>---ref support</p>
            <ExampleUseReference2>
                <ExampleWithRefSupported/>
            </ExampleUseReference2>
            <p>---ref support2</p>
            <ExampleUseReference2>
                <ExampleWithRefSupported2/>
            </ExampleUseReference2>
            <p>---null</p>
            <ExampleUseReference2>
                <NullComponent/>
            </ExampleUseReference2>
            <p>---recursive destroy</p>
            <NotEmptyLvl1/>
        </>
    );
}
