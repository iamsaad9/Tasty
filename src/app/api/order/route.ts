// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Order from "@/../models/order";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    await connectDB();

    const orderData = await request.json();

    // Validate required fields
    if (
      !orderData.customer ||
      !orderData.items ||
      orderData.items.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid order data: Customer and items are required" },
        { status: 400 }
      );
    }

    // Generate unique identifiers
    const orderId = nanoid();
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`; // Last 8 digits of timestamp

    // Calculate estimated delivery time
    const currentTime = new Date();
    const estimatedMinutes = orderData.deliveryMode === "delivery" ? 45 : 25;
    const estimatedDeliveryTime = new Date(
      currentTime.getTime() + estimatedMinutes * 60000
    );

    // Create order object
    const newOrder = {
      id: orderId,
      orderNumber,
      customer: orderData.customer,
      items: orderData.items,
      pricing: orderData.pricing,
      deliveryMode: orderData.deliveryMode,
      paymentMethod: orderData.paymentMethod,
      selectedLocation: orderData.selectedLocation,
      paymentStatus:
        orderData.paymentMethod === "Card" ? "completed" : "pending",
      orderStatus: "pending",
      orderDate: new Date(),
      estimatedDeliveryTime,
    };

    // Save to database
    const savedOrder = await Order.create(newOrder);
    console.log("Order created successfully:", savedOrder.orderNumber);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        orderId: savedOrder.id,
        orderNumber: savedOrder.orderNumber,
        estimatedDeliveryTime: savedOrder.estimatedDeliveryTime,
        orderStatus: savedOrder.orderStatus,
        message: "Order created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Order number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Fetch all orders, sorted by creation date (newest first)
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    console.log(`Fetched ${orders.length} orders from DB`);

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Add this to your existing /api/orders/route.ts file (after your GET method)

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing id for update" },
        { status: 400 }
      );
    }

    const { id, ...updateData } = body;

    console.log("Updating order with ID:", id, "Data:", updateData);

    // Find by your custom 'id' field, not MongoDB's '_id'
    const updatedOrder = await Order.findOneAndUpdate(
      { id: id }, // Using your custom id field from nanoid
      {
        ...updateData,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Order updated successfully:", updatedOrder.orderNumber);

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
