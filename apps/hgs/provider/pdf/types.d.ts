
export type HtmlType = 'invoice'

export type InvoiceProps = {
    name: string,
    street: string,
    areacode: string,
    city: string,
    email: string 
    date: string,
    tax: string,
    no_tax: string,
    total: string,
    objectId: string,
    products: Array< {
        objectId: string,
        title: string,
        subtitle: string 
        short_description: string,
        icon:string,
        id: string,
        amount: string,
        subtotal: string
    }>
}

export type HtmlProps<T> = T extends 'invoice' ? InvoiceProps : null

export type PdfContent = {
    content: string | null
}


export type RenderHtmlType = (htmlType: HtmlType, props: HTMLProps<T>  ) => PdfContent
