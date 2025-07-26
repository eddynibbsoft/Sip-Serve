import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'menu', title: 'Menu', href: paths.dashboard.menu, icon: 'plugs-connected' },
  { key: 'sales', title: 'Sales', href: paths.dashboard.sales, icon: 'plugs-connected' },
  { key: 'customer', title: 'Customers', href: paths.dashboard.customer, icon: 'users' },
  { key: 'product', title: 'Products', href: paths.dashboard.product, icon: 'gear-six' },
  { key: 'category', title: 'Categories', href: paths.dashboard.category, icon: 'gear-six' },
  
  { key: 'inventory_transaction', title: 'Inventory Transactions', href: paths.dashboard.inventory_transaction, icon: 'x-square' },
  { key: 'supplier', title: 'Suppliers', href: paths.dashboard.supplier, icon: 'x-square' },
  { key: 'purchase_order', title: 'Purchase Orders', href: paths.dashboard.purchase_order, icon: 'x-square' },
  

  { key: 'currency', title: 'Currencies', href: paths.dashboard.currency, icon: 'plugs-connected' },
  { key: 'payment_method', title: 'Payment Methods', href: paths.dashboard.payment_method, icon: 'plugs-connected' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'user' },

] satisfies NavItemConfig[];
