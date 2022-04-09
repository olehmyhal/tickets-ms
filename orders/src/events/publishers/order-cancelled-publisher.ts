import { Publisher, OrderCancelledEvent, Subjects } from "@olegtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}