import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import { Checkbox, Row, Col, Form, Input, Button, Space, Select } from 'antd';
import { getStaffDetail, editStaffDetail, addStaff } from 'core/services/staff';
import { getRole, getRoleName } from 'core/services/role';
import { openNotification } from '@utils/Noti';

const { Option } = Select;
interface IStaffInfo {
  staffID?: string;
  showModal: boolean;
  onCloseModal?: () => void;
}
interface RoleItem {
  Name: string;
  RoleId: number;
  Role_Code: string;
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
const ModalEditStaffInfo: React.FC<IStaffInfo> = ({ showModal = false, staffID = '', onCloseModal }) => {
  const [form] = Form.useForm();
  const [rolesData, setRolesData] = useState<[RoleItem] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const LoadDetail = () => {
    getStaffDetail(staffID!.toString())
      .then((resp) => {
        const data = resp.data.Data.account;
        getAccountRole(staffID!, data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAccountRole = (id: string, data: {}) => {
    if (id) {
      getRole(id).then((res) => {
        const rolesAccount = res.data.Data.map((a: RoleItem) => a.RoleId);
        // const findAdmin = rolesAccount.includes(1);

        // let roles = rolesAccount;
        // if (findAdmin) {
        //   roles = rolesData.map((a: RoleItem) => a.RoleId);
        // }
        fillForm(data, rolesAccount);
      });
    }
  };

  const getRolesName = () => {
    getRoleName()
      .then((res) => {
        // console.log("res", res.data.Data);
        setRolesData(res.data.Data);
      })
      .catch((error) => {});
  };

  const fillForm = (data: any, role: [number]) => {
    form.setFieldsValue({
      AccountId: data?.AccountId,
      DisplayName: data?.DisplayName,
      LastName: data?.LastName,
      MidName: data.MidName,
      Email: data.Email,
      Address: data.Address,
      Mobile: data.Mobile,
      Intro: data.Intro,
      RoleIds: role,
    });
  };

  const handleEditProfile = (params: any) => {
    console.log('params', params);
    setLoading(true);

    if (staffID) {
      editStaffDetail(params)
        .then((resp) => {
          if (!resp.data.Success) {
            openNotification('C???p nh???t nh??n vi??n', resp.data.Message);
          } else {
            openNotification('C???p nh???t nh??n vi??n', 'C???p nh???t nh??n vi??n th??nh c??ng');
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('C???p nh???t nh??n vi??n', 'C?? l???i khi l???y c???p nh???t nh??n vi??n');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      addStaff(params)
        .then((resp) => {
          if (!resp.data.Success) {
            openNotification('Th??m m???i nh??n vi??n', resp.data.Message);
          } else {
            openNotification('Th??m m???i nh??n vi??n', 'Th??m m???i nh??n vi??n th??nh c??ng');
          }
        })
        .catch((error) => {
          console.log('error', error);
          openNotification('Th??m m???i nh??n vi??n', 'C?? l???i khi l???y c???p nh???t nh??n vi??n');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (showModal) {
      getRolesName();
    }
  }, [showModal]);

  useEffect(() => {
    if (staffID && showModal) {
      setLoading(true);
      try {
        LoadDetail();
        getRolesName();
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    }
  }, [showModal, staffID]);

  return (
    <>
      <Form {...formItemLayout} form={form} name="register" onFinish={handleEditProfile} scrollToFirstError>
        {staffID && (
          <Form.Item name="AccountId" label="ID">
            <Input disabled={true} />
            {/* <Input /> */}
          </Form.Item>
        )}
        {!staffID && (
          <React.Fragment>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'T??n ????ng nh???p kh??ng th??? tr???ng!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="M???t kh???u"
              rules={[
                {
                  required: true,
                  message: 'M???t kh???u kh??ng th??? tr???ng',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label="X??c nh???n m???t kh???u"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Nh???p x??c nh???t m???t kh???u',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('X??c nh???n m???t kh???u kh??ng kh???p'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </React.Fragment>
        )}
        <Form.Item
          name="DisplayName"
          label="T??n nh??n vi??n"
          rules={[{ required: true, message: 'T??n kh??ng th??? tr???ng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="Email" label="Email" rules={[{ type: 'email', message: 'E-mail kh??ng h???p l???' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="Mobile"
          label="S??? ??i???n tho???i"
          rules={[{ required: true, message: 'S??? ??i???n tho???i kh??ng th??? tr???ng!' }]}
        >
          <Input
            addonBefore={
              <Form.Item name="prefix" noStyle>
                <Select style={{ width: 70 }}>
                  <Option value="84">+84</Option>
                </Select>
              </Form.Item>
            }
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item name="Address" label="?????a ch???" rules={[{ required: true, message: '?????a ch??? kh??ng th??? tr???ng!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="RoleIds" label="Quy???n" extra="Quy???n Admin c?? t???t c??? c??c quy???n kh??c.">
          {rolesData && rolesData.length > 0 && (
            <Checkbox.Group>
              {rolesData.map((item: RoleItem) => {
                return (
                  <Row>
                    <Checkbox value={item.RoleId}>{item.Name}</Checkbox>
                  </Row>
                );
              })}
            </Checkbox.Group>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Space>
            {staffID ? (
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                C???p Nh???t
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                Th??m m???i
              </Button>
            )}
            <Button htmlType="button" onClick={onCloseModal}>
              Hu???
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ModalEditStaffInfo;
