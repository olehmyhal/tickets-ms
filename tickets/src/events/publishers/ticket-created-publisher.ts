import { Publisher, Subjects, TicketCreatedEvent } from '@olegtickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}