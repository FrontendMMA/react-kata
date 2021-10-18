import React, {useCallback, useEffect, useMemo} from 'react';
import ReactDOM from 'react-dom';

/**
 *  Рендерит children, если в указанной ноде есть контент
 *
 *  @param {ReactNode} children
 *  @param {HTMLElement} contentElement - dom элемент,
 *                                     если он пустой, то children не рендерится
 *                                     если он содержит html, то children рендерится
 */
export function NotEmptyWrapper({children, contentElement}) {
    const [visible, setVisible] = React.useState(false);
    const portalRef = React.useRef(document.createElement('div'));
    /* ренедерит children в портале */
    const portal = React.useMemo(() => ReactDOM.createPortal(children, portalRef.current), []);

    React.useEffect(() => {
        if (contentElement && contentElement.innerHTML) {
            /* отображает children если есть контент в указанной ноде */
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [contentElement]);

    return (
        <>
            {portal}
            {visible && children}
        </>
    );
}

/**
 * @param {ReactElement} node
 * @param {string} refPropertyName имя параметра, передаваемого в targetNode отвечающего за ссылку (ref)
 *
 * Пример использования:
 function Example({children}) {
    const [NotEmptyWrapper, notEmptyNode] = useNotEmptyNode(children, 'contentRef');

    return (
        <NotEmptyWrapper>
            <div id="example">
                этот блок (div[id=example]) покажется
                только если в children после рендеринга будет html
                {notEmptyNode}
            </div>
        </NotEmptyWrapper>
    );
  }
 */
export function useNotEmptyNode(node, refPropertyName) {
    /* нельзя воспользоваться createRef/useRef - они не передают изменение ссылки из дочернего компонента */
    const [element, setElement] = React.useState(null);
    const onRefChange = React.useCallback(node => setElement(node), []);
    /* хак, для того чтобы не пересоздавать компонент wrapper при изменении element */
    const elementRef = React.useRef(null);
    elementRef.current = element;

    let WrapperComponent = useCallback(({children}) => (
        <NotEmptyWrapper contentElement={elementRef.current}>
            {children}
        </NotEmptyWrapper>
    ), [])

    /* нужно использовать вместо переданного ReactElement */
    const notEmptyNode = React.useMemo(() => (
        /* проброс ссылки в node, для того чтобы заполучить ссылку на dom элемент */
        React.cloneElement(node, {[refPropertyName]: onRefChange})
    ), []);

    return [WrapperComponent, notEmptyNode];
}
