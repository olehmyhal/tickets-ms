import { Publisher, Subjects, TicketUpdatedEvent } from '@olegtickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
}