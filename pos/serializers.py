from rest_framework import serializers
from .models import Order, OrderItem
import uuid
from rest_framework import serializers
from .models import Order, OrderItem
import uuid

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.product.name', read_only=True)
    price = serializers.DecimalField(source='menu_item.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['menu_item', 'menu_item_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, source='orderitem_set')
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'order_date', 'total_amount', 'items']  # Removed order_number here

    def create(self, validated_data):
        items_data = validated_data.pop('orderitem_set')
        order_number = str(uuid.uuid4())[:8]  # Generate a short unique order number
        order = Order.objects.create(order_number=order_number, **validated_data)  # Pass the generated order_number

        total_amount = 0  # Initialize total amount
        for item_data in items_data:
            menu_item = item_data['menu_item']  # Ensure you are passing an instance or ID
            quantity = item_data['quantity']
            price = menu_item.price  # Assuming menu_item is an instance of MenuItem

            item_total = price * quantity
            total_amount += item_total

            # Create OrderItem
            OrderItem.objects.create(order=order, menu_item=menu_item, quantity=quantity, price=price)

        # Set the total amount in the order before saving
        order.total_amount = total_amount
        order.save()

        return order
