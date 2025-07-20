import React, { useState } from 'react'
import { Row, Col, Form, Input, Select, Slider, Divider } from 'antd'
import ProductCard from '../components/ProductCard'
import bannerProducts from '../assets/images/banner-products.png'
import { useLoaderData } from 'react-router-dom'

const ProductsPage = () => {
  const productslist = useLoaderData() || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  // Calculer les bornes de prix dynamiquement sur productslist
  const prices = productslist.map((p) => p.price || 0);
  const absoluteMinPrice = prices.length ? Math.min(...prices) : 0;
  const absoluteMaxPrice = prices.length ? Math.max(...prices) : 1000;
  const [priceRange, setPriceRange] = useState([absoluteMinPrice, absoluteMaxPrice]);
  const [sortOption, setSortOption] = useState('');

  // Extraction unique des catégories, couleurs, matériaux
  const categories = Array.from(new Set(productslist.map(p => p.category).filter(Boolean)));
  const materials = Array.from(new Set(productslist.map(p => p.material).filter(Boolean)));
  const colors = Array.from(new Set(productslist.flatMap(p => p.colors ? p.colors.map(c => c.name) : (p.color ? [p.color] : []))));

  // Filtrage
  const filteredProducts = productslist.filter((product) => {
    const name = product.name || '';
    const category = product.category || '';
    const material = product.material || '';
    const color = product.color || (product.colors && product.colors.length ? product.colors.map(c => c.name).join(' ') : '');
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? category === selectedCategory : true;
    const matchesColor = selectedColor ? color.toLowerCase().includes(selectedColor.toLowerCase()) : true;
    const matchesMaterial = selectedMaterial ? material.toLowerCase() === selectedMaterial.toLowerCase() : true;
    const matchesPrice = (product.price || 0) >= priceRange[0] && (product.price || 0) <= priceRange[1];
    return matchesSearch && matchesCategory && matchesColor && matchesMaterial && matchesPrice;
  });

  // Tri
  let sortedProducts = [...filteredProducts];
  if (sortOption === 'priceAsc') {
    sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOption === 'priceDesc') {
    sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortOption === 'popularity') {
    sortedProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  return (
    <div className='products-page'>
      <Row gutter={[16, 16]} style={{margin:'2rem 0rem' , display:'flex' , justifyContent:'space-between'}}>
          <h1 className='text-4xl font-bold'>Tous les produits</h1>
          <img src={bannerProducts} alt="Bannière produits" />
      </Row>
      <Divider />
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Recherche">
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Catégorie">
              <Select
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
              >
                <Select.Option value="">Toutes</Select.Option>
                {categories.map((cat, idx) => (
                  <Select.Option key={idx} value={cat}>{cat}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Couleur">
              <Select
                value={selectedColor}
                onChange={(value) => setSelectedColor(value)}
                showSearch
                optionFilterProp="children"
                placeholder="Choisir une couleur"
                allowClear
              >
                <Select.Option value="">Toutes</Select.Option>
                {colors.map((col, idx) => (
                  <Select.Option key={idx} value={col}>{col}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Matière">
              <Select
                value={selectedMaterial}
                onChange={(value) => setSelectedMaterial(value)}
              >
                <Select.Option value="">Toutes</Select.Option>
                {materials.map((mat, idx) => (
                  <Select.Option key={idx} value={mat}>{mat}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Form.Item label="Trier par">
              <Select
                value={sortOption}
                onChange={(value) => setSortOption(value)}
              >
                <Select.Option value="">Aucun</Select.Option>
                <Select.Option value="priceAsc">Prix : croissant</Select.Option>
                <Select.Option value="priceDesc">Prix : décroissant</Select.Option>
                <Select.Option value="popularity">Popularité</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={12}>
            <Form.Item label={`Plage de prix : TND${priceRange[0]} - TND${priceRange[1]}`}>
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
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <Col key={product._id || product.id} xs={24} sm={12} md={8}>
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: 'center', color: '#888' }}>
            Aucun produit ne correspond à vos critères.
          </Col>
        )}
      </Row>
    </div>
  )
}

export default ProductsPage