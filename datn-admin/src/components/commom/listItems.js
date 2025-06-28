import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import CategoryIcon from "@mui/icons-material/Category";
import ImportExportIcon from "@mui/icons-material/ImportExport";
export const listItems = [
  {
    id: 1,
    name: "Báo cáo thống kê",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    id: 2,
    name: "Quản lý danh mục",
    icon: <CategoryIcon />,
    children: [
      {
        id: 3,
        name: "Danh sách danh mục",
        path: "/category",
      },
      {
        id: 4,
        name: "Kích cỡ",
        path: "/category/sizes",
      },
      {
        id: 5,
        name: "Màu sắc",
        path: "/category/colors",
      },
      {
        id: 6,
        name: "Nhà cung cấp",
        path: "/category/supplier",
      },
    ],
  },
  {
    id: 7,
    name: "Quản lý nhập hàng",
    icon: <ImportExportIcon />,

    children: [
      {
        id: 8,
        name: "Danh sách nhập hàng",
        path: "/import/list",
      },
      {
        id: 9,
        name: "Nhập hàng",
        path: "/product/import",
      },
    ],
  },
  {
    id: 10,
    name: "Quản lý sản phẩm",
    icon: <LayersIcon />,
    children: [
      {
        id: 11,
        name: "Danh sách sản phẩm",
        path: "/product",
      },
      {
        id: 12,
        name: "Chương trình khuyến mãi",
        path: "/product/voucher",
      },
      // {
      //   id: 13,
      //   name: "Danh sách kiểm kê",
      //   path: "/product/inventory",
      // },
    ],
  },
  {
    id: 14,
    name: "Quản lý bán hàng",
    icon: <ShoppingCartIcon />,
    children: [
      {
        id: 15,
        name: "Danh sách đơn hàng",
        path: "/order",
      },
    ],
  },
  {
    id: 16,
    name: "Quản lý tài khoản",
    icon: <PeopleIcon />,
    children: [
      {
        id: 17,
        name: "Danh sách tài khoản",
        path: "/account",
      },
      {
        id: 18,
        name: "Phân quyền",
        path: "/account/role",
      },
      {
        id: 19,
        name: "Vai trò",
        path: "/account/role-management",
      },
    ],
  },
];
