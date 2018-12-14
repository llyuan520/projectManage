import React,{ Component, Fragment } from 'react'
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    InputNumber,
    Modal,
    message,
    Divider,
  } from 'antd';
import { connect } from 'dva';
//import { routerRedux } from 'dva/router';
import StandardTable from 'components/StandardTable'
import styles from './styles.less';
const FormItem = Form.Item;

const columns = context => [{
    title: '序号',
    dataIndex: 'id'
}, {
    title: '项目名称',
    dataIndex: 'name',
}, {
    title: '法人公司名称',
    dataIndex: 'corporateName',
}, {
    title: '所属关系',
    dataIndex: 'affiliation',
}, {
    title: '操作',
    dataIndex:'action',
    render: (text, record) => (
        <Fragment>
            <a onClick={() => context.handleModalVisible(true, 'edit', record)}>修改</a>
        <Divider type="vertical" />
            <a onClick={() => context.handleRemoveClick(record)}>删除</a>
        </Fragment>
    ),
}];

const CreateFormModal = Form.create()(props => {
    const { modalVisible, form, handleAdd, handleModalVisible, modalType, modalFormValues } = props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        const params = modalType === 'add' ? fieldsValue : {
            ...fieldsValue,
            id:modalFormValues.id
        }
        handleAdd(params);
      });
    };
    return (
      <Modal
        destroyOnClose
        title="新增"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属关系">
          {form.getFieldDecorator('affiliation', {
                initialValue: modalType==='edit' ? modalFormValues && modalFormValues.affiliation : undefined,
                rules: [{ required: true, message: '请输入至少五个字符的规则所属关系！', min: 5 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
});


@Form.create()
@connect(({ project, loading }) => ({
    project,
    loading: loading.models.project,
}))
class Project extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            expandForm: false,
            formValues: {},
            modalType:'add',
            modalFormValues: {},
            selectedRows: [],
        };

        this.formLayout = {
          labelCol: { span: 7 },
          wrapperCol: { span: 13 },
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'project/fetch',
        });
      }

    handleTableChange=(params)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'project/fetch',
            payload: params
        })
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
        });
        dispatch({
          type: 'project/fetch',
          payload: {},
        });
    };
    
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
          expandForm: !expandForm,
        });
    };

    handleRemoveClick = (record) => {
        const { dispatch } = this.props;
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                dispatch({
                    type: 'project/remove',
                    payload: {
                        id: record.id,
                    },
                });
            },
            onCancel() {
                modalRef.destroy()
            },
        });
    };
    handleRemoveLotClick = () => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;
        if (!selectedRows) return;
        const modalRef = Modal.confirm({
            title: '友情提醒',
            content: '该删除后将不可恢复，是否删除？',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=>{
                modalRef && modalRef.destroy();
                dispatch({
                    type: 'project/removeLot',
                    payload: {
                      id: selectedRows.map(row => row.id),
                    },
                    callback: () => {
                      this.setState({
                        selectedRows: [],
                      });
                    },
                });
            },
            onCancel() {
                modalRef.destroy()
            },
        });

      };
    
    handleSelectRows = rows => {
        this.setState({
          selectedRows: rows,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
    
        const { dispatch, form } = this.props;
    
        form.validateFields((err, fieldsValue) => {
          if (err) return;
    
          const values = {
            ...fieldsValue,
            updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
          };
    
          this.setState({
            formValues: values,
          });
    
          dispatch({
            type: 'project/fetch',
            payload: values,
          });
        });
      };
    
    handleModalVisible = (flag, modalType, record) => {
        this.setState({
          modalVisible: !!flag,
          modalType,
          modalFormValues: record || {},
        });
    };
    
    handleAdd = fields => {
        const { modalType } = this.state;
        const { dispatch } = this.props;
        switch (modalType) {
            case 'add':
                    dispatch({
                        type: 'project/add',
                        payload: {
                            affiliation: fields.affiliation,
                        },
                    });
                    message.success('添加成功');
                break;
            case 'edit':
                    dispatch({
                        type: 'project/update',
                        payload: {
                            affiliation: fields.affiliation,
                            id: fields.id,
                        },
                    });
                    message.success('修改成功');
                break;
            default:
              break;
        }
        this.handleModalVisible();
    };

    renderSimpleForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        return (
          <Form onSubmit={this.handleSubmit} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="项目名称">
                  {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="使用状态">
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      <Option value="0">关闭</Option>
                      <Option value="1">运行中</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                  <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                    展开 <Icon type="down" />
                  </a>
                </span>
              </Col>
            </Row>
          </Form>
        );
    }

    renderAdvancedForm() {
        const { form: { getFieldDecorator }, } = this.props;
        return (
            <Form onSubmit={this.handleSubmit} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="项目名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status')(
                            <Select placeholder="请选择" style={{ width: '100%' }}>
                                <Option value="0">关闭</Option>
                                <Option value="1">运行中</Option>
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="法人公司名称">
                            {getFieldDecorator('corporateName')(<InputNumber style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ float: 'right', marginBottom: 24 }}>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                        重置
                    </Button>
                    <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                        收起 <Icon type="up" />
                    </a>
                    </div>
                </div>
            </Form>
        );
    }

    renderForm() {
        const { expandForm } = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    render() {
        const { project: { data }, loading } = this.props;
        const { selectedRows, modalVisible, modalType, modalFormValues } = this.state;
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        const rowSelection = {
            type: 'checkbox',
        }
        return (
            <Fragment>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                         <div className={styles.tableListForm}>{this.renderForm()}</div>
                         <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, 'add')}>
                                新建
                            </Button>
                            {
                                selectedRows.length > 0 && (
                                    <Button icon="delete" type="danger" ghost onClick={this.handleRemoveLotClick}>
                                        批量删除
                                    </Button>
                                )
                            }
                        </div>
                        <StandardTable
                            selectedRows={selectedRows}
                            loading={loading}
                            rowSelection={rowSelection}
                            data={data}
                            columns={columns(this)}
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>
                <CreateFormModal {...parentMethods} modalVisible={modalVisible} modalType={modalType} modalFormValues={modalFormValues}/>
            </Fragment>
        );
    }
}
export default Project;