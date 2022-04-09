import mongoose from "mongoose";
import { OrderStatus, ExpirationCompleteEvent } from "@olegtickets/common";
import { Message } from 'node-nats-streaming'

import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'agdsdl',
        expiresAt: new Date(),
        ticket
    })
    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, order, data, msg }
}

it('updated an order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toBe(OrderStatus.Cancelled)
})

it('emit an OrderCancelled event', async () => {
    const { listener, order, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    expect(eventData.id).toBe(order.id)
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})