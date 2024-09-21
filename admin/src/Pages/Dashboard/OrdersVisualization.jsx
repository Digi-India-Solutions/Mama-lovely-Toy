import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import Loading from '../../Components/Loading/Loading';
import moment from 'moment';

const OrdersVisualization = () => {
    const [orders, setOrders] = useState([]);

    // Fetch orders from the API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-orders`);
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    // Count orders by payment method
    const paymentMethodData = () => {
        const methodCounts = {};
        orders.forEach((order) => {
            methodCounts[order.paymentMethod] = (methodCounts[order.paymentMethod] || 0) + 1;
        });
        return Object.keys(methodCounts).map((key) => ({
            name: key,
            value: methodCounts[key],
        }));
    };

    // Count orders by status
    const orderStatusData = () => {
        const statusCounts = {};
        orders.forEach((order) => {
            statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
        });
        return Object.keys(statusCounts).map((key) => ({
            name: key,
            value: statusCounts[key],
        }));
    };

    // Helper functions to filter data by time range (week, month, year)
    const filterByTimeRange = (startDate, endDate) => {
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startDate && orderDate <= endDate;
        });
    };

    // Weekly sales (last 7 days)
    const getWeeklySalesData = () => {
        const startOfWeek = moment().startOf('isoWeek').toDate();
        const endOfWeek = moment().endOf('isoWeek').toDate();
        const weeklyOrders = filterByTimeRange(startOfWeek, endOfWeek);

        const salesData = {};
        weeklyOrders.forEach(order => {
            const day = moment(order.createdAt).format('YYYY-MM-DD');
            salesData[day] = (salesData[day] || 0) + order.totalPrice;
        });

        return Object.keys(salesData).map(date => ({
            date,
            sales: salesData[date],
        }));
    };

    // Monthly sales (current month)
    const getMonthlySalesData = () => {
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
        const monthlyOrders = filterByTimeRange(startOfMonth, endOfMonth);

        const salesData = {};
        monthlyOrders.forEach(order => {
            const day = moment(order.createdAt).format('YYYY-MM-DD');
            salesData[day] = (salesData[day] || 0) + order.totalPrice;
        });

        return Object.keys(salesData).map(date => ({
            date,
            sales: salesData[date],
        }));
    };

    // Yearly sales (current year)
    const getYearlySalesData = () => {
        const startOfYear = moment().startOf('year').toDate();
        const endOfYear = moment().endOf('year').toDate();
        const yearlyOrders = filterByTimeRange(startOfYear, endOfYear);

        const salesData = {};
        yearlyOrders.forEach(order => {
            const month = moment(order.createdAt).format('YYYY-MM');
            salesData[month] = (salesData[month] || 0) + order.totalPrice;
        });

        return Object.keys(salesData).map(month => ({
            date: month,
            sales: salesData[month],
        }));
    };

     // Prepare data for the line chart
     const salesOverTimeData = () => {
        const salesData = {};

        orders.forEach((order) => {
            const date = moment(order.createdAt).format('YYYY-MM-DD');
            if (!salesData[date]) {
                salesData[date] = {
                    date,
                    sales: 0,
                };
            }
            salesData[date].sales += order.totalPrice;
        });

        return Object.values(salesData).sort((a, b) => new Date(a.date) - new Date(b.date));
    };
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div>
            {orders.length > 0 ? (
                <>

                    <div className="row g-5">
                        <div className="col-md-6">
                            <h2>Orders by Payment Method</h2>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={paymentMethodData()}
                                    cx={200}
                                    cy={200}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {paymentMethodData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                        <div className="col-md-6">
                            <h2>Orders by Status</h2>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={orderStatusData()}
                                    cx={200}
                                    cy={200}
                                    outerRadius={150}
                                    fill="#82ca9d"
                                    dataKey="value"
                                >
                                    {orderStatusData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                        <div className="col-md-6">
                            <h2>Weekly Sales</h2>
                            <BarChart width={600} height={300} data={getWeeklySalesData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#8884d8" />
                            </BarChart>
                        </div>
                        <div className="col-md-6">
                            <h2>Monthly Sales</h2>
                            <LineChart width={600} height={300} data={getMonthlySalesData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
                            </LineChart>
                        </div>
                        <div className="col-md-6">
                            <h2>Yearly Sales</h2>
                            <LineChart width={600} height={300} data={getYearlySalesData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#FF8042" />
                            </LineChart>
                        </div>
                    </div>
                </>
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default OrdersVisualization;
