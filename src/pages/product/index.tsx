import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Table, Row, Col, Pagination, Modal, Input, Button, Select, Space } from 'antd';
import { ProductList, DeleteProduct, CategoryList } from 'core/services/product';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatNumber } from '@utils/StringUtil';
import ModalProduct from './ModalProduct';
import { openNotification } from '@utils/Noti';

const { Option } = Select;

function index() {
  const [productData, setProductData] = useState<any>();
  const [categoryData, setCategoryData] = useState<any>();
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [pageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [role, setRole] = useState<any>();
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('ProductCode+asc');
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [productId, setProductId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    CategoryList(1, 20)
      .then((resp: any) => {
        const data = resp.data;
        setCategoryData(data?.Data);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    let value = localStorage.getItem('roles') ?? '';
    setRole(JSON.parse(value));

    if (!showModal) {
      getProductList();
    }
  }, [showModal, currentPage, sort, categoryId]);

  const openDetailModal = (id: string) => {
    setProductId(id);
    setShowModal(true);
  };

  const getProductList = async () => {
    ProductList(search, sort, currentPage, pageSize, categoryId)
      .then((resp) => {
        setProductData(resp.data?.Data);
        setTotalRecord(resp.data?.TotalRecord);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const deleteProduct = (id: string) => {
    DeleteProduct(id)
      .then((resp) => {
        if (resp.data.Success) {
          openNotification('Xo?? s???n ph???m', 'X??a s???n ph???m th??nh c??ng');
          getProductList();
        } else {
          openNotification('Xo?? s???n ph???m', resp.data.Message);
        }
      })
      .catch((error) => {
        openNotification('Xo?? s???n ph???m', '???? c?? l???i');
        console.log('error', error);
      });
  };

  const imgStyle = {
    width: 60,
    height: 'auto',
    maxHeight: 90,
  };

  const columns = [
    {
      title: '???nh',
      key: 'image',
      render: (text: any, record: any) => (
        <Space size="middle">
          {/* <Image src={record?.ProductImage ? record.ProductImage : '/img/blank-img.jpg'} width={90} height={60} alt={record.Title} /> */}
          <img
            src={record?.ProductImage ? record.ProductImage : '/img/blank-img.jpg'}
            style={imgStyle}
            alt={record.Title}
          />
          {/* <Link href={`product/${record.ProductId}`}>
            <a>Detail</a>
          </Link> */}
        </Space>
      ),
    },
    {
      title: 'M?? SP',
      dataIndex: 'ProductCode',
    },
    {
      title: 'T??n SP',
      dataIndex: 'Title',
    },
    {
      title: 'Gi??',
      dataIndex: 'Price',
      render: (text: any) => (
        <text>
          {formatNumber(text)}
          {'??'}
        </text>
      ),
    },
    {
      title: 'S??? l?????ng',
      dataIndex: 'Quantity',
    },
    {
      title: 'GI???m gi??',
      dataIndex: 'Discount',
      render: (text: any) => (
        <text>
          {text} {'%'}
        </text>
      ),
    },
    {
      title: 'T??y ch???n',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <FormOutlined onClick={() => openDetailModal(record.ProductId)} />
          {role && role[0]?.RoleId === 1 ? <DeleteOutlined onClick={() => deleteProduct(record.ProductId)} /> : <></>}
        </Space>
      ),
    },
  ];

  const onPagingChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddNew = () => {
    setProductId('');
    setShowModal(true);
  };

  return (
    <Layout title={'S???n Ph???m'}>
      <div>
        <Row>
          <Col span={18}>
            <Input placeholder={'T??m ki???m'} onChange={({ target }: any) => setSearch(target.value)} width="50%" />
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={getProductList}>
              T??m ki???m
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <Select
              defaultValue={'ProductCode+asc'}
              style={{ width: 120 }}
              onChange={(value) => {
                setCurrentPage(1);
                setSort(value);
              }}
            >
              <Option value={'ProductCode+asc'}>M?? SP 0-9</Option>
              <Option value={'ProductCode+desc'}>M?? SP 9-0</Option>
              <Option value={'Title+asc'}>T??n 0-9</Option>
              <Option value={'Title+desc'}>T??n 9-0</Option>
              <Option value={'Price+asc'}>Gi?? 0-9</Option>
              <Option value={'Price+desc'}>Gi?? 9-0</Option>
              <Option value={'Quantity+asc'}>S??? l?????ng 0-9</Option>
              <Option value={'Quantity+desc'}>S??? l?????ng 9-0</Option>
            </Select>
          </Col>
          <Col span={3}>
            <Select
              style={{ width: 120 }}
              onChange={(value: string) => {
                setCurrentPage(1);
                setCategoryId(value);
              }}
            >
              <Option value={''}>{'All'}</Option>
              {categoryData &&
                categoryData.map((item: any) => {
                  return <Option value={item.CategoryId}>{item.Title}</Option>;
                })}
            </Select>
          </Col>
          <Col span={18}>
            <Button type="primary" onClick={handleAddNew}>
              {/* <Button type="primary" onClick={() => router.push('/product/product-create')}> */}
              Th??m m???i
            </Button>
          </Col>
        </Row>
      </div>
      <div>
        <Table columns={columns} dataSource={productData} pagination={false} />
        <Pagination defaultCurrent={currentPage} onChange={onPagingChange} current={currentPage} total={totalRecord} />
        <Modal
          width={755}
          bodyStyle={{ height: 'max-content' }}
          title={productId ? 'S???a th??ng tin s???n ph???m' : 'Th??m m???i s???n ph???m'}
          visible={showModal}
          onCancel={() => setShowModal(false)}
          onOk={() => setShowModal(false)}
          destroyOnClose
          footer={null}
          className="edit-profile-modal"
        >
          <ModalProduct showModal={showModal} productId={productId} onCloseModal={() => setShowModal(false)} />
        </Modal>
      </div>
    </Layout>
  );
}

export default withAuth(index);
