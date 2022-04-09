import { TicketUpdatedEvent } from "@olegtickets/common"
import mongoose from "mongoose"
import { Message } from 'node-nats-streaming'

import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'new concert',
        version: ticket.version + 1,
        price: 999,
        userId: 'gkdslgd'
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
}

it('finds, updates, and saves a ticket', async () => {
    const { listener, ticket, data, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toBe(data.title)
    expect(updatedTicket!.price).toBe(data.price)
    expect(updatedTicket!.version).toBe(data.version)
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('doesnt call ack if the event is in the future', async () => {
    const { listener, data, msg } = await setup()

    data.version = 10

    try {
        await listener.onMessage(data, msg)
    } catch(err) {}

    expect(msg.ack).not.toHaveBeenCalled()
})