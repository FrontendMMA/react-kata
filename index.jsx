import React from 'react';
import ReactDOM from 'react-dom';

import DemoUseNotEmptyNode from './useNotEmptyNode/demo';


ReactDOM.render((
    <>
        <DemoUseNotEmptyNode/>
    </>
), document.getElementById('app'));

module.hot.accept();
