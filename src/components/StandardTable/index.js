import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps && nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {

      const { onChange } = this.props;
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
          newObj[key] = getValue(filtersArg[key]);
          return newObj;
      }, {});
      
      // pageNum:2, //当前页数
      // pageSize:2, //每页的数量
      // pages:4, //总页数
      // total:data.length, //总的记录数
      const params = {
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
          ...filters,
      };
      if (sorter.field) {
          params.sorter = `${sorter.field}_${sorter.order}`;
      }

      if (onChange) {
        onChange(params);
      }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys } = this.state;
    const {props} = this;
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      bordered,
    } = props;
    
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal:total => `共 ${total} 条记录`,
      //pageSizeOptions:['10','20','30','40','50'],
      ...pagination,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      // getCheckboxProps: record => ({
      //   disabled: record.disabled,
      // }),
      fixed:true,
      ...props.rowSelection
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record=>record[rowKey] || record.id}
          bordered={bordered ? bordered : true}
          rowSelection={(props.rowSelection || props.rowSelection) ? rowSelection : null}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
