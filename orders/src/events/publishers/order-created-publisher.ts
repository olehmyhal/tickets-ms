import { Subjects, Publisher, OrderCreatedEvent } from "@olegtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}