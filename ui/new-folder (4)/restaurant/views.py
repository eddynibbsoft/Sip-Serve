from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Customer, Product, Sale, PurchaseOrder, Menu, InventoryTransaction , PaymentMethod,Category,Currency,SaleItem,Supplier,MenuItem,PurchaseOrderItem
from .serializers import CustomerSerializer, ProductSerializer, SaleSerializer, CurrencySerializer,PurchaseOrderItemSerializer,PurchaseOrderSerializer, MenuSerializer, InventoryTransactionSerializer,CategorySerializer,MenuItemSerializer,PaymentMethodSerializer,SaleItemSerializer,SupplierSerializer
from rest_framework.permissions import IsAuthenticated

class CustomerListAPIView(APIView):
    def get(self, request):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Customer, pk=pk)

    def get(self, request, pk):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def put(self, request, pk):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        customer = self.get_object(pk)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class ProductListAPIView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Product, pk=pk)

    def get(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
  
class CategoryListAPIView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Category, pk=pk)

    def get(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, pk):
    #     category = self.get_object(pk)
    #     category.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
    def delete(self, request, pk):
        try:
            category = self.get_object(pk)
            category.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
        # Log the error or return a more specific error response
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class SaleListAPIView(APIView):
    def get(self, request):
        sales = Sale.objects.all()
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SaleDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Sale, pk=pk)

    def get(self, request, pk):
        sale = self.get_object(pk)
        serializer = SaleSerializer(sale)
        return Response(serializer.data)

    def put(self, request, pk):
        sale = self.get_object(pk)
        serializer = SaleSerializer(sale, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sale = self.get_object(pk)
        sale.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SaleItemListAPIView(APIView):
    def get(self, request):
        sale_items = SaleItem.objects.all()
        serializer = SaleItemSerializer(sale_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SaleItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SaleItemDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(SaleItem, pk=pk)

    def get(self, request, pk):
        sale_item = self.get_object(pk)
        serializer = SaleItemSerializer(sale_item)
        return Response(serializer.data)

    def put(self, request, pk):
        sale_item = self.get_object(pk)
        serializer = SaleItemSerializer(sale_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sale_item = self.get_object(pk)
        sale_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class InventoryTransactionListAPIView(APIView):
    def get(self, request):
        transactions = InventoryTransaction.objects.all()
        serializer = InventoryTransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InventoryTransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InventoryTransactionDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(InventoryTransaction, pk=pk)

    def get(self, request, pk):
        transaction = self.get_object(pk)
        serializer = InventoryTransactionSerializer(transaction)
        return Response(serializer.data)

    def put(self, request, pk):
        transaction = self.get_object(pk)
        serializer = InventoryTransactionSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        transaction = self.get_object(pk)
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SupplierListAPIView(APIView):
    def get(self, request):
        suppliers = Supplier.objects.all()
        serializer = SupplierSerializer(suppliers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SupplierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SupplierDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Supplier, pk=pk)

    def get(self, request, pk):
        supplier = self.get_object(pk)
        serializer = SupplierSerializer(supplier)
        return Response(serializer.data)

    def put(self, request, pk):
        supplier = self.get_object(pk)
        serializer = SupplierSerializer(supplier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        supplier = self.get_object(pk)
        supplier.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PurchaseOrderListAPIView(APIView):
    def get(self, request):
        purchase_orders = PurchaseOrder.objects.all()
        serializer = PurchaseOrderSerializer(purchase_orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PurchaseOrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PurchaseOrderDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(PurchaseOrder, pk=pk)

    def get(self, request, pk):
        purchase_order = self.get_object(pk)
        serializer = PurchaseOrderSerializer(purchase_order)
        return Response(serializer.data)

    def put(self, request, pk):
        purchase_order = self.get_object(pk)
        serializer = PurchaseOrderSerializer(purchase_order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        purchase_order = self.get_object(pk)
        purchase_order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class PurchaseOrderItemListAPIView(APIView):
    def get(self, request):
        purchase_order_items = PurchaseOrderItem.objects.all()
        serializer = PurchaseOrderItemSerializer(purchase_order_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PurchaseOrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PurchaseOrderItemDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(PurchaseOrderItem, pk=pk)

    def get(self, request, pk):
        purchase_order_item = self.get_object(pk)
        serializer = PurchaseOrderItemSerializer(purchase_order_item)
        return Response(serializer.data)

    def put(self, request, pk):
        purchase_order_item = self.get_object(pk)
        serializer = PurchaseOrderItemSerializer(purchase_order_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        purchase_order_item = self.get_object(pk)
        purchase_order_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class MenuListAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Require authentication for this view

    def get(self, request):
        menus = Menu.objects.all()
        serializer = MenuSerializer(menus, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MenuDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Menu, pk=pk)

    def get(self, request, pk):
        menu = self.get_object(pk)
        serializer = MenuSerializer(menu)
        return Response(serializer.data)

    def put(self, request, pk):
        menu = self.get_object(pk)
        serializer = MenuSerializer(menu, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        menu = self.get_object(pk)
        menu.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MenuItemListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        menu_items = MenuItem.objects.all()
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MenuItemDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(MenuItem, pk=pk)

    def get(self, request, pk):
        menu_item = self.get_object(pk)
        serializer = MenuItemSerializer(menu_item)
        return Response(serializer.data)

    def put(self, request, pk):
        menu_item = self.get_object(pk)
        serializer = MenuItemSerializer(menu_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        menu_item = self.get_object(pk)
        menu_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#Filter Menu Items by Menu ID

class MenuItemsByMenuAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, menu_id):
        menu_items = MenuItem.objects.filter(menu__menu_id=menu_id)
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)


class CurrencyListAPIView(APIView):
    def get(self, request):
        currencies = Currency.objects.all()
        serializer = CurrencySerializer(currencies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CurrencySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrencyDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(Currency, pk=pk)

    def get(self, request, pk):
        currency = self.get_object(pk)
        serializer = CurrencySerializer(currency)
        return Response(serializer.data)

    def put(self, request, pk):
        currency = self.get_object(pk)
        serializer = CurrencySerializer(currency, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        currency = self.get_object(pk)
        currency.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class PaymentMethodListAPIView(APIView):
    def get(self, request):
        payment_methods = PaymentMethod.objects.all()
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PaymentMethodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaymentMethodDetailAPIView(APIView):
    def get_object(self, pk):
        return get_object_or_404(PaymentMethod, pk=pk)

    def get(self, request, pk):
        payment_method = self.get_object(pk)
        serializer = PaymentMethodSerializer(payment_method)
        return Response(serializer.data)

    def put(self, request, pk):
        payment_method = self.get_object(pk)
        serializer = PaymentMethodSerializer(payment_method, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        payment_method = self.get_object(pk)
        payment_method.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
