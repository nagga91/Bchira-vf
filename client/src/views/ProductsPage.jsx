import React, { useState } from 'react'
import { Row, Col, Form, Input, Select, Slider, Divider } from 'antd'
import ProductCard from '../components/ProductCard'
import bannerProducts from '../assets/images/banner-products.png'
import { useLoaderData } from 'react-router-dom'
const sampleProducts = [
  {
    id: 1,
    name: 'Elegant Blackout Curtain',
    category: 'Blackout',
    color: 'Black',
    material: 'Cotton',
    price: 49.99,
    popularity: 100,
    description: 'A sleek, classic blackout curtain for complete light blockage.'
  },
  {
    id: 2,
    name: 'Flowing Sheer Curtain',
    category: 'Sheer',
    color: 'White',
    material: 'Silk',
    price: 39.99,
    popularity: 80,
    description: 'Let the light gently filter through with this airy sheer curtain.'
  },
  {
    id: 3,
    name: 'Luxurious Velvet Drape',
    category: 'Velvet',
    color: 'Red',
    material: 'Polyester',
    price: 59.99,
    popularity: 120,
    description: 'Deep, rich velvet curtains that exude luxury.'
  },
  {
    id: 4,
    name: 'Modern Linen Panel',
    category: 'Linen',
    color: 'Blue',
    material: 'Cotton',
    price: 44.99,
    popularity: 90,
    description: 'A modern take on the classic linen curtain.'
  },
  {
    id: 5,
    name: 'Classic Blackout Elegance',
    category: 'Blackout',
    color: 'Gray',
    material: 'Polyester',
    price: 54.99,
    popularity: 110,
    description: 'Timeless design meets modern functionality.'
  }
]

const prices = sampleProducts.map((p) => p.price)
const absoluteMinPrice = Math.min(...prices)
const absoluteMaxPrice = Math.max(...prices)

const ProductsPage = () => {
  const productslist = useLoaderData();
  const [products] = useState(sampleProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [priceRange, setPriceRange] = useState([absoluteMinPrice, absoluteMaxPrice])
  const [sortOption, setSortOption] = useState('')

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    const matchesColor = selectedColor ? product.color.toLowerCase() === selectedColor.toLowerCase() : true
    const matchesMaterial = selectedMaterial ? product.material.toLowerCase() === selectedMaterial.toLowerCase() : true
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesColor && matchesMaterial && matchesPrice
  })

  let sortedProducts = [...filteredProducts]
  if (sortOption === 'priceAsc') {
    sortedProducts.sort((a, b) => a.price - b.price)
  } else if (sortOption === 'priceDesc') {
    sortedProducts.sort((a, b) => b.price - a.price)
  } else if (sortOption === 'popularity') {
    sortedProducts.sort((a, b) => b.popularity - a.popularity)
  }

  return (
    <div className='products-page'>
      <Row gutter={[16, 16]} style={{margin:'2rem 0rem' , display:'flex' , justifyContent:'space-between'}}>
          <h1 className='text-4xl font-bold'>All Products</h1>
          <img src={bannerProducts} alt="products outdoor" />
      </Row>
              <Divider />
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Search">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Category">
              <Select
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="Blackout">Blackout</Select.Option>
                <Select.Option value="Sheer">Sheer</Select.Option>
                <Select.Option value="Velvet">Velvet</Select.Option>
                <Select.Option value="Linen">Linen</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Color">
              <Input
                placeholder="e.g. Red"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Material">
              <Select
                value={selectedMaterial}
                onChange={(value) => setSelectedMaterial(value)}
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="Cotton">Cotton</Select.Option>
                <Select.Option value="Polyester">Polyester</Select.Option>
                <Select.Option value="Silk">Silk</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Sort By">
              <Select
                value={sortOption}
                onChange={(value) => setSortOption(value)}
              >
                <Select.Option value="">None</Select.Option>
                <Select.Option value="priceAsc">Price: Low to High</Select.Option>
                <Select.Option value="priceDesc">Price: High to Low</Select.Option>
                <Select.Option value="popularity">Popularity</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={12}>
            <Form.Item label={`Price Range: TND${priceRange[0]} - TND${priceRange[1]}`}>
              <Slider
                range
                min={absoluteMinPrice}
                max={absoluteMaxPrice}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={[16, 16]}>
        {productslist.length > 0 ? (
          productslist.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8}>
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: 'center', color: '#888' }}>
            No products found matching the criteria.
          </Col>
        )}
      </Row>
    </div>
  )
}

export default ProductsPage