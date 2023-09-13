const stripe = require('../config/stripe');
const OrderModel = require('../models/Order');

const createOrder = async (customer, data) => {
    const Items = JSON.parse(customer.metadata.cart);
    console.log('test');
    const products = Items.map((item) => {
        return {
            productId: item.id,
        };
    });

    const newOrder = new OrderModel({
        userId: data.client_reference_id,
        customerId: data.customer,
        products,
        total: data.amount_total / 100,
    });

    try {
        const savedOrder = await newOrder.save();
    } catch (err) {
        console.log(err);
    }
};
module.exports = {
    createCheckoutSession: async (req, res) => {
        const customer = await stripe.customers.create({
            metadata: {
                userId: req.user._id,
                cart: JSON.stringify(
                    req.body.cartItems.map(({ id }) => ({ id }))
                ),
            },
        });
        const userId = `${req.user._id}`;

        const line_items = req.body.cartItems.map((item) => {
            return {
                price_data: {
                    currency: 'pln',
                    product_data: {
                        name: `${item.brand} - ${item.name} (${item.size})`,

                        description: item.desc,
                        metadata: {
                            id: item.id,
                        },
                    },
                    unit_amount: item.price * 100,
                },
                quantity: 1,
            };
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['PL'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'pln',
                        },
                        display_name: 'Dostawa',

                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
            ],

            line_items,
            mode: 'payment',
            customer: customer.id,
            client_reference_id: userId,
            success_url: `http://localhost:3000/account/orders`,
        });
        res.send({ url: session.url });
    },
    webhook: async (request, response) => {
        const sig = request.headers['stripe-signature'];

        const data = request.body.data.object;
        const eventType = request.body.type;

        if (eventType === 'checkout.session.completed') {
            stripe.customers
                .retrieve(data.customer)
                .then(async (customer) => {
                    try {
                        createOrder(customer, data);
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch((err) => console.log(err.message));
        }

        response.send();
    },
};
