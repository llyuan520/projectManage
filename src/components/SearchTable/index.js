import React,{ Component, Fragment } from 'react'
import { Card, Row, Col, Form, Button, Icon } from 'antd';
import { getFields } from 'utils'
import StandardTable from 'components/StandardTable'
import moment from 'moment'
import styles from './styles.less';

@Form.create({
    onValuesChange:(props,values)=>{
        //给外部一个获得搜索条件的回调
        props.searchOption.getFieldsValues && props.searchOption.getFieldsValues(values)
        props.searchOption.onFieldsChange && props.searchOption.onFieldsChange(values)
    }
})
 class SearchTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expandForm: false,
            formValues: {},
        };
    }

    handleFormReset = () => {
        const { form, searchOption } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
        },()=>{
            searchOption.handleFormReset && searchOption.handleFormReset()

            //手动触发一下是因为使用resetFields()不会触发form的onValuesChange
            searchOption.getFieldsValues && searchOption.getFieldsValues({})
            searchOption.onFieldsChange && searchOption.onFieldsChange({})
        });
    };
    
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
          expandForm: !expandForm,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { form, searchOption } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          for(let key in fieldsValue){
            if(Array.isArray( fieldsValue[key] ) && fieldsValue[key].length === 2 && moment.isMoment(fieldsValue[key][0])){
                //当元素为数组&&长度为2&&是moment对象,那么可以断定其是一个rangePicker
                fieldsValue[`${key}Start`] = fieldsValue[key][0].format('YYYY-MM-DD');
                fieldsValue[`${key}End`] = fieldsValue[key][1].format('YYYY-MM-DD');
                delete fieldsValue[key]
            }

            /**
             * 判断如果是时间控件 rangePicker 只是值为空的时候需要把双值设为undefined，因为下一次的filter
             * 会与上一次的filter合并，这一次的rangePicker值为空的时候就会导致合并后留下上次选择过的值，导致条件出错
             * */
            if(Array.isArray( fieldsValue[key] ) && fieldsValue[key].length === 0){
                fieldsValue[`${key}Start`] = undefined;
                fieldsValue[`${key}End`] = undefined;
            }

            if(moment.isMoment(fieldsValue[key])){
                //格式化一下时间 YYYY-MM类型
                if(moment(fieldsValue[key].format('YYYY-MM'),'YYYY-MM',true).isValid()){
                    fieldsValue[key] = fieldsValue[key].format('YYYY-MM');
                }
            }
        }
          const values = {
            ...fieldsValue,
            updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
          };
          this.setState({
            formValues: values,
          },()=>{
              searchOption.handleSubmit && searchOption.handleSubmit(this.state.formValues)
          });
        });
      };

    renderSimpleForm() {
        const { form, searchOption:{fieldsData, slices } } = this.props;
        const fields = fieldsData.slice(0, slices || 2);
        return (
            <Fragment>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    {
                        getFields(form,fields)
                    }
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
            </Fragment>
        );
    }

    renderAdvancedForm() {
        const { form, searchOption:{fieldsData} } = this.props;
        const fields = fieldsData.slice(0, fieldsData.length);
        return (
            <Fragment>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    {
                        getFields(form,fields)
                    }
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
            </Fragment>
        );
    }

    renderForm() {
        const { expandForm } = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }
    render() {
        const {searchOption, tableOption, tableListOperator, children} = this.props;
        return (
            <Fragment>
                <div className={styles.tableList}>
                    <Card 
                        bordered={false}
                        {...searchOption.cardProps}
                    >
                        <div className={styles.tableListForm}>
                            
                                <Form onSubmit={this.handleSubmit}>
                                    <div className={styles.tableList}>
                                        <div className={styles.tableListForm}>
                                            {
                                                this.renderForm()
                                            }
                                        </div>
                                    </div>
                                </Form>
                            
                        </div>
                        {
                            tableListOperator ? <div className={styles.tableListOperator}>{ tableListOperator }</div> : null
                        }

                        <StandardTable
                            selectedRows={tableOption.selectedRows}
                            loading={tableOption.loading}
                            rowSelection={tableOption.rowSelection}
                            data={tableOption.data}
                            columns={tableOption.columns}
                            onSelectRow={tableOption.onSelectRow}
                            onChange={tableOption.onChange}
                        />
                    </Card>
                </div>
                {
                    children ? children : null
                }
            </Fragment>
        );
    }
}

export default SearchTable