'use client';

import { RenderHtmlType } from './types';
import { renderToStaticMarkup } from 'react-dom/server';
import Invoice from './html/Invoice';
import Header from './html/Header';

const renderHtml: RenderHtmlType = (htmlType, data) => {
    const pdfContent = {
        header: renderToStaticMarkup(Header()),
        content: null,
    };
    console.log(pdfContent);

    if (htmlType === 'invoice') {
        pdfContent.content = renderToStaticMarkup(Invoice(data));
    }

    return pdfContent;
};

export default renderHtml;
