from rest_framework import serializers
from .models import Customer, Product, Category, Sale, SaleItem, InventoryTransaction, Supplier, PurchaseOrder, PurchaseOrderItem, Menu, MenuItem, Currency, PaymentMethod


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['customer_id', 'first_name', 'last_name', 'email', 'phone_number', 'address', 'created_at']

#Define Products
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_id', 'name', 'description', 'category', 'unit', 'created_at', 'updated_at']

#Define Categories
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name']


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ['sale_id', 'user', 'customer', 'total_amount', 'description']


class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = ['sale_item_id', 'sale', 'product', 'quantity']


class InventoryTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryTransaction
        fields = ['transaction_id', 'product', 'quantity', 'transaction_type', 'transaction_date', 'price']


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['supplier_id', 'name', 'contact_person', 'phone_number', 'email', 'address']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = ['purchase_order_id', 'supplier', 'order_date', 'created_at', 'updated_at']


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ['purchase_order_item_id', 'purchase_order', 'product', 'quantity', 'price', 'status']


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['menu_id', 'name', 'description', 'created_at', 'updated_at']


class MenuItemSerializer(serializers.ModelSerializer):
    menu = serializers.PrimaryKeyRelatedField(queryset=Menu.objects.all())  # Make menu writable

    class Meta:
        model = MenuItem
        fields = ['menu_item_id', 'menu', 'product', 'quantity', 'unit', 'price']




class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['currency_id', 'currency_name']


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['payment_method_id', 'payment_method_name']
