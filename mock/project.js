import mockjs from 'mockjs';

// - 正确返回
//     {"code":1,"msg":"成功","data":{"id":1,"userName":"zhangsan","phone":"13800138000","edu":"本科","major":"软件工程","gradSchool":"深圳大学"}}

// - 正确返回（带分页信息）
//     {"code":1,"msg":"成功","data":{"pageNum":2,"pageSize":2,"pages":4,"total":8,"list":[{"id":3},{"id":4}]}}
//     pageNum：当前页数
//     pageSize：每页的数量
//     pages：总页数
//     total：总的记录数
//     list：数据数组

// - 出错返回：
//     {"code":10004,"msg":"系统繁忙，请稍后重试","data":null}

// const data = [];
// for (let i = 1; i < 46; i++) {
//   data.push({
//     id: i,
//     name: `Edward King ${i}`,
//     corporateName: 32,
//     affiliation: `London, Park Lane no. ${i}`,
//   });
// }


// export default {
//     'GET /api/list' : {
//       code:1,
//       msg:"成功",
//       data:{
//         pageNum:1, //当前页数
//         pageSize:10, //每页的数量
//         pages:Math.ceil(data.length/10), //总页数
//         total:data.length, //总的记录数
//         list:data
//       }
//     },
//     'GET /api/currentUser': {
//       name: 'momo.zxy',
//       avatar: 'imgMap.user',
//       userid: '00000001',
//       notifyCount: 12,
//     },
// };

import { parse } from 'url';

let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `TradeCode ${i}`,
    corporateName: `一个任务名称 ${i}`,
    affiliation: '这是一段描述',
  });
}

function getRule(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    code:1,
    msg:"成功",
    data:{
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.pageNum, 10) || 1,
      },
    }
  }

  return res.json(result);
}

function postRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, affiliation, id } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => id !== item.id);
      break;
    case 'lotDelete':
      tableListDataSource = tableListDataSource.filter(item => id.indexOf(item.id) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        id: i,
        name: `TradeCode ${i}`,
        corporateName: `一个任务名称 ${i}`,
        affiliation,
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.id === id) {
          Object.assign(item, { affiliation, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    code:1,
    msg:"成功",
    data:{
      list: tableListDataSource,
      pagination: {
        total: tableListDataSource.length,
      },
    }
  }

  return res.json(result);
}

// const result = {
//   code:1,
//   msg:"成功",
//   data:{
//     list: tableListDataSource,
//     pagination: {
//       pages:Math.ceil(tableListDataSource.length/10), //总页数
//       total: tableListDataSource.length, //总的记录数
//       pageSize:10, //每页的数量
//       pageNum: 1, //当前页数
//     },
//     // pageNum:1, //当前页数
//     // pageSize:10, //每页的数量
//     // pages:Math.ceil(data.length/10), //总页数
//     // total:data.length, //总的记录数
//   }
// }

export default {
  'GET /api/list': getRule,
  'POST /api/list': postRule,
};