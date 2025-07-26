from django.shortcuts import render
from rest_framework import generics
from .models import Order, OrderItem
from .serializers import OrderSerializer
from canteen.models import MenuItem
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from datetime import datetime
from django.utils import timezone
from django.db import transaction

class OrderView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = OrderSerializer(data=request.data)
        
        if serializer.is_valid():
            # Start a database transaction
            with transaction.atomic():
                order = serializer.save()  # This saves the order

                # Prepare receipt details
                receipt = {
                    'order_number': order.order_number,
                    'customer_name': order.customer_name,
                    'order_date': order.order_date.strftime("%Y-%m-%d %H:%M:%S"),
                    'items': [],
                    'total_amount': order.total_amount
                }

                # Initialize total amount for receipt
                total_amount = 0

                # List to hold menu items with insufficient stock
                insufficient_stock_items = []

                # Loop through order items to check stock
                for order_item in order.orderitem_set.all():
                    menu_item = order_item.menu_item
                    quantity = order_item.quantity

                    # Check if enough stock is available
                    if menu_item.quantity < quantity:
                        insufficient_stock_items.append({
                            'menu_item_name': menu_item.product.name,
                            'requested_quantity': quantity,
                            'available_quantity': menu_item.quantity
                        })
                    else:
                        # If stock is sufficient, prepare item data for receipt
                        subtotal = order_item.price * quantity
                        receipt['items'].append({
                            'menu_item_name': menu_item.product.name,  # Assuming Product model has a name field
                            'quantity': quantity,
                            'price': order_item.price,
                            'subtotal': subtotal
                        })
                        total_amount += subtotal

                # If there are insufficient stock items, return an error response
                if insufficient_stock_items:
                    return Response({
                        'error': 'Not enough stock for the following items.',
                        'insufficient_stock_items': insufficient_stock_items
                    }, status=status.HTTP_400_BAD_REQUEST)

                # All quantities are available, proceed with stock deduction
                for order_item in order.orderitem_set.all():
                    menu_item = order_item.menu_item
                    quantity = order_item.quantity

                    # Deduct the quantity from the menu item's stock
                    menu_item.quantity -= quantity
                    menu_item.save()

                # Update total amount in receipt
                receipt['total_amount'] = total_amount

                # Return the receipt in the response
                return Response(receipt, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
