import { Page } from '@repo/ui'
import { Form } from '@repo/modules'
import React from 'react'
import { ApplicationTypes } from '@repo/types'

const page = ({params}: {params: ApplicationTypes.Params}) => {
  return (
    <Page title='Form'>
        <Form formId={params.form_id} />
    </Page>
  )
}

export default page 