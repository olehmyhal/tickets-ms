import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 15,
        userId: '123'
    })
    await ticket.save()

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    firstInstance!.set({ price: 10 })
    secondInstance!.set({ price: 20 })

    await firstInstance!.save()

    try {
        await secondInstance!.save() 
    } catch(err) {
        return
    }
})

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 15,
        userId: '123'
    })
    await ticket.save()
    expect(ticket.version).toBe(0)
    await ticket.save()
    expect(ticket.version).toBe(1)
    await ticket.save()
    expect(ticket.version).toBe(2)
})