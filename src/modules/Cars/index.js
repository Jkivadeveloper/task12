import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Pagination, Input, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { ShoppingCartOutlined } from '@material-ui/icons';
import ReactPlayer from 'react-player';
import { useCartContext } from '../../components/CartContext';

const videos = [
  
  {
    url: 'https://www.youtube.com/live/KTVlaMfldEM?feature=share', 
    id: 1,
  },

  {
    url: 'https://youtu.be/XYy-v3_4K1Q',
    id: 2,
  },
  {
    url: 'https://youtu.be/Tuya5E86LCw',
    id: 3,
  },
  {
    url: 'https://youtu.be/XYy-v3_4K1Q',
    id: 4,
  },
  {
    url: 'https://www.youtube.com/live/KTVlaMfldEM?feature=share',
    id: 5,
  },
  
];

const videoDuration = 28000; 

const Cars = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const pageSize = 16;

  const { cartItems } = useCartContext(); 

  useEffect(() => {
    const db = getFirestore();
    const productsCollection = collection(db, 'products');

    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const updatedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(updatedProducts);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigateToHomeDetail = (productId) => {
    navigate(`/homedetail/${productId}`);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = products.slice(startIndex, endIndex);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const currentPageProducts =
    currentPage === 1
      ? filteredProducts.slice(0, pageSize)
      : filteredProducts.slice(startIndex, endIndex);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    let timeout;

    const playNextVideo = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    timeout = setTimeout(playNextVideo, videoDuration);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentVideoIndex]);

  return (
    <div>
       <Card
      title="Cars"
      style={{ margin: 20 }}
      extra={
        <React.Fragment>
          <Badge count={cartItems.length}>
            <ShoppingCartOutlined
              style={{ marginLeft: '8px', fontSize: '44px', color: 'orangered' }}
              onClick={handleCartClick}
            />
          </Badge>
        </React.Fragment>
      }
    >
      <ReactPlayer
        url={videos[currentVideoIndex].url}
        width="100%"
        style={{ marginBottom: 26 }}
        controls={false}
        playing
      />

      <Input.Search
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search by product name"
        style={{ width: '100%', height: 40, marginBottom: 16 }}
      />

      <Row gutter={[16, 16]} justify="center">
        {currentPageProducts.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} key={item.id}>
            <Card
              hoverable
              onClick={() => handleNavigateToHomeDetail(item.id)}
              cover={
                <img
                  src={item.image}
                  alt="Product"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />// let try this
              }
              style={{ marginBottom: 16 }}
            >
              <Card.Meta title={item.name} description={`Price: Ksh. ${item.price}`} />
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={filteredProducts.length}
        onChange={handlePageChange}
        style={{ marginTop: 20, textAlign: 'center' }}
        showSizeChanger={false}
        showQuickJumper={false}
        hideOnSinglePage={true}
        defaultPageSize={pageSize}
        defaultCurrent={1}
      />
    </Card>
    </div>
  );
};

export default Cars;
