import React,{ Component, Fragment } from 'react'
import {
    Form,
    Input,
    Button,
    Modal,
    message,
    Divider,
  } from 'antd';
import { connect } from 'dva';
import SearchTable from 'components/SearchTable'
const FormItem = Form.Item;

const formItemStyle = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 18
    }
};

const fieldsData = (context) => [
    {
        label: '序号',
        fieldName: 'id',
        type: 'input',
        span: 8,
        formItemStyle,
        componentProps:{
        },
        fieldDecoratorOptions:{
            //initialValue:  undefined,
            rules:[
                {
                    required:true,
                    message:'请选择序号'
                }
            ]
        }
    },
    {
        label: '项目名称',
        fieldName: 'name',
        type: 'input',
        span: 8,
        formItemStyle,
        componentProps:{
        },
        fieldDecoratorOptions:{
            //initialValue: undefined,
            rules:[
                {
                    required:true,
                    message:'请选择项目名称'
                }
            ]
        }
    },
    {
        label: '法人公司名称',
        fieldName: 'corporateName',
        type: 'input',
        span: 8,
        formItemStyle,
    },
    {
        label: '所属关系',
        fieldName: 'affiliation',
        type: 'input',
        span: 8,
        formItemStyle,
    },

]

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

    handleSubmit = values => {
        console.log(values)
        debugger
        const { dispatch } = this.props;
        this.setState({
          formValues: values,
        });
  
        dispatch({
          type: 'project/fetch',
          payload: values,
        });
    };

    handleFormReset = () => {
        const { dispatch } = this.props;
        this.setState({
          formValues: {},
        });
        dispatch({
          type: 'project/fetch',
          payload: {},
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

  
    render() {
        const { form, project: { data }, loading } = this.props;
        const { selectedRows, modalVisible, modalType, modalFormValues } = this.state;
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        return (
            <SearchTable
                searchOption={{
                    form,
                    fieldsData: fieldsData(this),
                    handleSubmit: values => this.handleSubmit(values),
                    handleFormReset: this.handleFormReset 
                }}
                tableListOperator={(
                    <Fragment>
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
                    </Fragment>
                )}
                tableOption={{
                    selectedRows: selectedRows,
                    loading: loading,
                    rowSelection: {
                        type: 'checkbox',
                    },
                    data: data,
                    columns: columns(this),
                    onSelectRow: this.handleSelectRows,
                    onChange: this.handleTableChange,
                }}
            >
                <CreateFormModal {...parentMethods} modalVisible={modalVisible} modalType={modalType} modalFormValues={modalFormValues}/>
            </SearchTable>
        );
    }
}
export default Project;