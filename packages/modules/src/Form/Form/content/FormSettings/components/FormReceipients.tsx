import React from 'react'

const FormReceipients = ({receipients = []}) => {
  const 
  return (
    <div className='content_element'>
      <h3>Empfänger</h3>
      {receipients.map(receipient => (
        <div>
          <p>{receipient.name}</p>
          <p>{receipient.email}</p>
          </div>
      ))}

    </div>
  )
}

export default FormReceipients