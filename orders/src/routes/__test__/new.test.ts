import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { OrderStatus } from '@olegtickets/common'

import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('returs an errror if ticket doesnt exist', async () => {
    const ticketId = new mongoose.Types.ObjectId()
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404)
})

it('returns an error if ticket is already reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    const order = Order.build({
        ticket,
        userId: 'gfdfklgfhdls',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(400)
})

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)
})

it('emits an order created events', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})