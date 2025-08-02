from django.urls import path
from . import views

urlpatterns = [
    path('customers/', views.CustomerListAPIView.as_view(), name='customer-list'),
    path('customers/<int:pk>/', views.CustomerDetailAPIView.as_view(), name='customer-detail'),

   
    path('products/', views.ProductListAPIView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailAPIView.as_view(), name='product-detail'),
    
   
    path('categories/', views.CategoryListAPIView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.CategoryDetailAPIView.as_view(), name='category-detail'),

   
    path('sales/', views.SaleListAPIView.as_view(), name='sale-list'),
    path('sales/<int:pk>/', views.SaleDetailAPIView.as_view(), name='sale-detail'),


    path('sale-items/', views.SaleItemListAPIView.as_view(), name='saleitem-list'),
    path('sale-items/<int:pk>/', views.SaleItemDetailAPIView.as_view(), name='saleitem-detail'),

   
    path('inventory-transactions/', views.InventoryTransactionListAPIView.as_view(), name='inventorytransaction-list'),
    path('inventory-transactions/<int:pk>/', views.InventoryTransactionDetailAPIView.as_view(), name='inventorytransaction-detail'),


    path('suppliers/', views.SupplierListAPIView.as_view(), name='supplier-list'),
    path('suppliers/<int:pk>/', views.SupplierDetailAPIView.as_view(), name='supplier-detail'),

   
    path('purchase-orders/', views.PurchaseOrderListAPIView.as_view(), name='purchaseorder-list'),
    path('purchase-orders/<int:pk>/', views.PurchaseOrderDetailAPIView.as_view(), name='purchaseorder-detail'),

   
    path('purchase-order-items/', views.PurchaseOrderItemListAPIView.as_view(), name='purchaseorderitem-list'),
    path('purchase-order-items/<int:pk>/', views.PurchaseOrderItemDetailAPIView.as_view(), name='purchaseorderitem-detail'),

  
    path('menus/', views.MenuListAPIView.as_view(), name='menu-list'),
    path('menus/<int:pk>/', views.MenuDetailAPIView.as_view(), name='menu-detail'),

  
    path('menu-items/', views.MenuItemListAPIView.as_view(), name='menuitem-list'),
    path('menu-items/<int:pk>/', views.MenuItemDetailAPIView.as_view(), name='menuitem-detail'),
    path('menus/<int:menu_id>/items/', views.MenuItemsByMenuAPIView.as_view(), name='menu-items-by-menu'),


 
    path('currencies/', views.CurrencyListAPIView.as_view(), name='currency-list'),
    path('currencies/<int:pk>/', views.CurrencyDetailAPIView.as_view(), name='currency-detail'),

    path('payment-methods/', views.PaymentMethodListAPIView.as_view(), name='paymentmethod-list'),
    path('payment-methods/<int:pk>/', views.PaymentMethodDetailAPIView.as_view(), name='paymentmethod-detail'),

]
