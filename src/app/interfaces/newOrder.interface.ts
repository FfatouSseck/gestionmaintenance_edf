import { Order } from './order.interface';

export interface newOrder{
    orderPart?: Order;
    Operation?: string;
    Description?: string;
    Checklist?: any;
    prodStartDate?: string;
}