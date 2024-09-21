const Order = require("../models/order.model");

const createOrder = async (req, res) => {
    try {
        console.log("I am hit ", req.body);

        // Create a new order object from request body
        const newOrder = new Order({
            user: req.body.user,
            cartItems: req.body.cartItems.map(item => ({
                product: item.product._id, // Assuming you receive full product object, extract the _id
                quantity: item.quantity,
                variant: {
                    color: item.variant.color,
                    size: item.variant.size,
                    price: item.variant.price,
                    mrp: item.variant.mrp,
                    weight: item.variant.weight,
                    dimension: item.variant.dimension
                }
            })),
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode,
            state: req.body.state,
            paymentMethod: req.body.paymentMethod.toUpperCase(), // Ensure it's in the proper format 'COD' or 'ONLINE'
            totalPrice: req.body.totalPrice,
            couponCode: req.body.couponCode || "", // Handle empty coupon code
            isDelivered: false
        });

        
        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Send back a success response
        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAllOrder = async (req, res) => {
    try {
        
        const orders = await Order.find({})
            .populate('user', 'name email phoneNumber') 
            .populate('cartItems.product', 'name productImage'); 

        if (orders.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order Not Found Yet"
            });
        }

        // If orders found, return the list of orders
        return res.status(201).json({
            success: true,
            message: 'Orders Found',
            data: orders
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phoneNumber')
            .populate('cartItems.product', 'name productImage');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order found",
            data: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data:order
        });

    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateOrderDeliveryStatus = async (req, res) => {
    const { orderId } = req.params; // Assume you pass the order ID as a URL parameter
    const { orderStatus } = req.body; // The new status is passed in the request body

    try {
        // Find the order by ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update the order status
        order.orderStatus = orderStatus;

        // If the order is marked as 'Delivered', update the isDelivered and deliveredAt fields
        if (orderStatus === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }

        // Save the updated order
        const updatedOrder = await order.save();

        // Send a success response with the updated order
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getOrdersByUserId = async (req, res) => {
    const { userId } = req.params; // The user ID is passed as a URL parameter

    try {
        // Find orders by user ID
        const orders = await Order.find({ user: userId })
            .populate('user', 'name email phoneNumber') 
            .populate('cartItems.product', 'name productImage');

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user"
            });
        }

        // If orders found, return the list of orders
        return res.status(200).json({
            success: true,
            message: 'Orders found for user',
            data: orders
        });

    } catch (error) {
        console.error('Error fetching orders by user ID:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createOrder,
    getAllOrder,
    getOrderById,
    deleteOrder,
    updateOrderDeliveryStatus,
    getOrdersByUserId
};
