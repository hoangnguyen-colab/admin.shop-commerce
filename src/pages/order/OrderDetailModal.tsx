import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';

import { Table, Row, Col, Form, Input, Button, Space, Menu, Select } from 'antd';
import { OrderDetail, OrderChangeStatus } from 'core/services/product';
import { ORDER_STATUS } from '@core/constants';
import { openNotification } from '@utils/Noti';
import { formatNumber } from '@utils/StringUtil';

const { Option } = Select;

interface IStaffInfo {
  showModal: boolean;
  ordersId?: string;
  onCloseModal?: () => void;
}

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

const imgStyle = {
  width: 60,
  height: 'auto',
  maxHeight: 90,
};

const ModalEditStaffInfo: React.FC<IStaffInfo> = ({ showModal = false, ordersId, onCloseModal = () => {} }) => {
  const [form] = Form.useForm();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const LoadDetail = () => {
    setLoading(true);
    OrderDetail(ordersId!.toString())
      .then((resp) => {
        const data = resp.data.Data;
        if (data) {
          setOrderItems(data.items);
          fillForm(data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fillForm = (data: any) => {
    form.setFieldsValue({
      orderId: data?.orderId,
      customerName: data?.customerName,
      customerPhone: data?.customerPhone,
      customerEmail: data.customerEmail,
      customerAddress: data.customerAddress,
      status: data.Status,
      Total: formatNumber(data.Total),
      Content: data.Content,
    });
  };

  const columns = [
    {
      title: 'Image',
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
      title: 'T??n SP',
      dataIndex: 'ProductName',
    },
    {
      title: '????n gi??',
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
      title: 'T???ng',
      dataIndex: 'Sub-Total',
      render: (text: any, record: any) => (
        <text>
          {formatNumber(record.Price * record.Quantity)}
          {'??'}
        </text>
      ),
    },
  ];

  const handleEditOrder = (params: any) => {
    setLoading(true);
    OrderChangeStatus(params)
      .then((resp) => {
        if (resp.data.Success) {
          openNotification('S???a th??ng tin ????n h??ng', resp.data.Message || 'S???a th??ng tin ????n h??ng th??nh c??ng');
          onCloseModal();
        } else {
          openNotification('S???a th??ng tin ????n h??ng', resp.data.Message || 'S???a th??ng tin ????n h??ng th???t b???i');
        }
      })
      .catch((error) => {
        openNotification('S???a th??ng tin ????n h??ng', 'S???a th??ng tin ????n h??ng th???t b???i');
        console.log('error', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (showModal && ordersId) {
      LoadDetail();
    }
  }, [showModal, ordersId]);

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleEditOrder} scrollToFirstError>
        {ordersId && (
          <Form.Item name="orderId" label="M?? Order" preserve={true}>
            <Input disabled={true} />
            {/* <Input /> */}
          </Form.Item>
        )}
        <Form.Item name="customerName" label="T??n" rules={[{ required: true, message: 'T??n kh??ng th??? tr???ng!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="customerPhone" label="S??T" rules={[{ required: true, message: 'S??T kh??ng th??? tr???ng!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="customerEmail" label="Email" rules={[{ type: 'email', message: 'E-mail kh??ng h???p l???' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="customerAddress"
          label="?????a ch???"
          rules={[{ required: true, message: '?????a ch??? ph???m kh??ng th??? tr???ng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Tr???ng th??i">
          <Select allowClear style={{ width: '100%' }} placeholder="Trang th??i ????n h??ng" defaultValue={[]}>
            {ORDER_STATUS.map((item: any) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Total" label="T???ng" preserve={true}>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name="Content" label="N???i dung">
          <Input />
        </Form.Item>
        {ordersId && <Table columns={columns} dataSource={orderItems} pagination={false} />}
        <br />
        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {ordersId ? 'C???p Nh???t' : 'Th??m M???i'}
            </Button>
            <Button htmlType="button" onClick={onCloseModal}>
              H???y
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalEditStaffInfo;
