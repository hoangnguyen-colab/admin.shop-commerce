import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProductAdd, CategoryList } from 'core/services/product';
import Layout from 'Layouts';
import withAuth from '@hocs/withAuth';
import { Form, Input, Space, Cascader, Select, Row, Col, Checkbox, Button, notification, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { handleCloudinaryUpload } from 'core/services/cloudinaryUpload';
import { string_to_slug } from '@utils/StringUtil';
import { openNotification } from '@utils/Noti';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

interface ProductMeta {
  Id: string;
  ProductId: string;
  KeyMeta: string;
  Url: string;
  Content: string;
}

interface Product {
  categories: Array<object>;
  product: object;
  product_meta: Array<ProductMeta>;
  product_review: Array<object>;
  tags: Array<object>;
}

const imgStyle = {
  width: 100,
  height: 'auto',
  // maxHeight: 150,
};

function index() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [productMeta, setProductMeta] = useState<Array<ProductMeta>>();
  const [categoryData, setCategoryData] = useState([]);
  const [imgFile, setImgFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imgMultiple] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    CategoryList(0, 10)
      .then((resp: any) => {
        const data = resp.data;
        setCategoryData(data?.Data);
      })
      .catch((error: any) => {
        console.log('error', error);
      });
  };

  const handleAddProduct = (values: any) => {
    let params: object = {
      ...values,
    };
    setLoading(true);
    ProductAdd(params)
      .then((resp) => {
        if (resp.data.Success) {
          openNotification('Th??m s???n ph???m', 'Th??m s???n ph???m th??nh c??ng');
          router.push('/product');
        } else {
          openNotification('Th??m s???n ph???m', resp.data.Message);
        }
      })
      .catch((error) => {
        console.log('error', error);
        openNotification('Th??m s???n ph???m', 'Th??m s???n ph???m th???t b???i');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //   const handleProductImage = (params: object[]) => {
  //     console.log('params', Object.keys(params));
  //     const item = Object.keys(params).filter((item) => item.includes('ProductImage-'));
  //   };

  const handleTitleChange = ({ target }: any) => {
    console.log(target.value);
    form.setFieldsValue({
      Slug: string_to_slug(target.value),
    });
  };

  const handleSelectChange = (value: any) => {};

  const handleUpload = () => {
    setLoading(true);
    handleCloudinaryUpload(imgFile)
      .then((res: any) => {
        form.setFieldsValue({
          ProductImage: res.url,
        });
        setImageUrl(res.url);
      })
      .catch((err: any) => {
        console.error(err);
        openNotification('Upload ???nh', '???? c?? l???i');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageTxtChange = ({ target }: any) => {
    setImageUrl(target.value);
  };

  return (
    <Layout title={'Th??m S???n Ph???m'}>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleAddProduct} scrollToFirstError>
        <Form.Item
          name="ProductCode"
          label="M?? s???n sh???m"
          rules={[{ required: true, message: 'M?? s???n ph???m kh??ng th??? tr???ng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="Title"
          label="T??n s???n ph???m"
          rules={[{ required: true, message: 'T??n s???n ph???m kh??ng th??? tr???ng!' }]}
        >
          <Input onChange={handleTitleChange} />
        </Form.Item>
        <Form.Item name="ProductCategories" label="Ph??n lo???i">
          {categoryData && categoryData.length > 0 && (
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Ch???n ph??n lo???i s???n ph???m"
              defaultValue={[]}
              onChange={handleSelectChange}
            >
              {categoryData &&
                categoryData.map((item: any) => (
                  <Select.Option key={item.CategoryId} value={item.CategoryId}>
                    {item.Title}
                  </Select.Option>
                ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          name="ImportPrice"
          label="Gi?? Nh???p"
          rules={[{ required: true, message: 'Gi?? nh???p kh??ng th??? tr???ng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="Price" label="Gi?? b??n" rules={[{ required: true, message: 'Gi?? b??n kh??ng th??? tr???ng!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="Quantity" label="S??? l?????ng" rules={[{ required: true, message: 'S??? n?????ng kh??ng th??? tr???ng!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="Slug" label="Slug" preserve>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="Discount" label="Gi???m gi?? (%)">
          <Input />
        </Form.Item>
        <Form.Item
          name="ProductImage"
          label="???nh hi???n th???"
          rules={[{ required: true, message: '???nh hi???n th??? kh??ng th??? tr???ng!' }]}
          extra={'Ch??n link ???nh ho???c t???i l??n'}
        >
          <Input onChange={handleImageTxtChange} />
        </Form.Item>
        <Form.Item>
          <div>
            <img src={imageUrl && imageUrl} style={imgStyle} alt={imageUrl} />
          </div>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={!imgFile || loading}
            loading={uploading || loading}
            style={{ marginTop: 16 }}
          >
            {uploading ? '??ang t???i' : 'T???i ???nh l??n'}
          </Button>
          <Upload
            multiple={false}
            beforeUpload={(file: any) => setImgFile(file)}
            name="logo"
            listType="picture"
            accept="image/png, image/gif, image/jpeg"
          >
            <Button icon={<UploadOutlined />}>Ch???n File</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="Content" label="N???i dung">
          <Input />
        </Form.Item>
        <Form.Item name="Summary" label="T??m t???t">
          <Input />
        </Form.Item>

        {imgMultiple && (
          <div>
            <h4>???nh ph???</h4>
            <Form.List name="ProductMeta">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <>
                      <Form.Item {...field} label={`???nh ${index + 1}`} name={[field.name, 'product_meta']}>
                        <Input style={{ width: '60%' }} />
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Form.Item>
                    </>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      style={{ width: '100px' }}
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        )}

        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Th??m m???i
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default withAuth(index);
