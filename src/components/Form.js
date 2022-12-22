import React, { useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

const FormExampleForm = ({ addAsset }) => {

    const [symbol, setSymbol] = useState()
    const [quantity, setQuantity] = useState()

    const handleSubmit = () => {
        symbol && quantity && addAsset(symbol, quantity)
        setSymbol(null)
        setQuantity(null)
    }

    return (    
        <Form onSubmit={handleSubmit}>
            <Form.Field>
                <input 
                    style={{ background: '#111', color: '#999'}}
                    value={symbol || ''}
                    placeholder='Symbol'
                    onChange={e => setSymbol(e.target.value)}
                />
            </Form.Field>
            <Form.Field>
                <input 
                    style={{ background: '#111',  color: '#999'}}
                    value={quantity || ''}
                    type='number' 
                    placeholder='Quantity' 
                    onChange={e => setQuantity(e.target.value)}
                />
            </Form.Field>
            <Button style={{ background: '#333', color: '#999'}} type='submit'>Add</Button>
        </Form>
    )
}

export default FormExampleForm