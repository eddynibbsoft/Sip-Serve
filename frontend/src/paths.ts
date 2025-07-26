export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password'},
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customer: '/dashboard/customer',
    product: '/dashboard/product',
    sales: '/dashboard/sales',
    menu: '/dashboard/menu',
    category: '/dashboard/category',
    supplier: '/dashboard/supplier',
    purchase_order: '/dashboard/purchase_order',
    currency: '/dashboard/currency',
    payment_method: '/dashboard/payment_method',
    inventory_transaction: '/dashboard/inventory_transaction',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    
  },
  errors: { notFound: '/errors/not-found' },
} as const;
