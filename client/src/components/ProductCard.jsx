import React from 'react'
import { Card, Button } from 'antd'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const cover = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        marginTop : '2rem',
        background: '#f0f2f5'
      }}
    >
    </div>
  )

  return (
    <Card
      hoverable
      title={product.name}
      extra={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>TND{product.price.toFixed(2)}</span>}
      actions={[
        <Link to={`/shop/${product._id}`}>
          <button className='cta-button' key="buy">
               Add to cart
          </button>
        </Link>

]}
>
<img height={"100px"} src={product.images[0]} alt="" />
      <p>{product.description}</p>
    </Card>
  )
}

export default ProductCard