import React, { useState, useEffect } from 'react'
import { Table, Icon, Form } from 'semantic-ui-react'

const TableRow = ({ symbol, quantity, price, value, removeAsset, editAsset }) => {
    const [color, setColor] = useState('#666')
    const [currentPrice, setCurrentPrice] = useState(price)
    const [editing, setEditing] = useState(false)
    const [quantityOwned, setQuantityOwned] = useState(quantity)

    useEffect(() => {
        if (price > currentPrice) setColor('green')
        else if (price < currentPrice) setColor('red')
        else setColor('#666')
        setCurrentPrice(price)
    }, [price])

    const handleQuantityChange = e => setQuantityOwned(e.target.value)
    const setNewQuantityOwned = () => {
        editAsset(symbol, quantityOwned)
        setEditing(false)
    }

    return (
        <Table.Row key={symbol}>
            <Table.Cell>{symbol}</Table.Cell>
            { !editing && <Table.Cell>{quantity}</Table.Cell> }
            { editing && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Form.Field>
                        <input type='number' value={quantityOwned} onChange={handleQuantityChange}/>
                    </Form.Field>
                    <Icon 
                        style={{ 
                          color: 'green',
                          lineHeight: '28px'
                        }}
                        name='checkmark' 
                        onClick={() => setNewQuantityOwned()}
                    />
                    <Icon 
                        style={{ 
                          color: 'red',
                          lineHeight: '28px'
                        }}
                        name='cancel' 
                        onClick={() => setEditing(false)}
                    />
                </span>
            )}
            <Table.Cell style={{ color: color }}>${Number(price).toFixed(price > 1 ? 2 : 6)}</Table.Cell>
            <Table.Cell>${Number(value).toFixed(2)}</Table.Cell>
            <Table.Cell style={{ display: 'flex', gap: '20px'}}>
                <Icon name='pencil' onClick={() => setEditing(true)}/>
                <Icon name='trash' onClick={() => removeAsset(symbol)}/>
            </Table.Cell>
        </Table.Row>
    )
}

const TableExamplePagination = ({ assets, removeAsset, editAsset }) => {

    const renderAssets = () => {
        return Object.keys(assets).map(symbol => (
            <TableRow
                symbol={symbol}
                quantity={assets[symbol].quantity}
                price={Number(assets[symbol].price).toFixed(assets[symbol].price > 1 ? 2 : 6)}
                value={Number(assets[symbol].value).toFixed(2)}
                removeAsset={removeAsset}
                editAsset={editAsset}
            />
        ))
    }

    return (
        <Table style={{ fontSize: '30px', background: '#111', color: '#666'}}>
            <Table.Body>
                { Object.keys(assets).length > 0 && renderAssets() }
            </Table.Body>
        </Table>
        )
}

export default TableExamplePagination