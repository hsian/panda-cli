const menuData = [
  {
    name: '首页',
    icon: 'dashboard',
    path: 'main',
    children: [
      {
        name: '分析页',
        path: '/',
      },
    ],
  },

  {
    name: '用户',
    icon: 'user',
    path: 'user',
    children: [
      {
        name: '所有用户',
        path: 'list',
      },
    ],
  }
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (path) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
