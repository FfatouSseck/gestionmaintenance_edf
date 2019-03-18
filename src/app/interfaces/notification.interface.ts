export interface Notification extends NotificationLight{
    color?:string;
}

export interface NotificationLight{
    description: string;
    functloc: string;
    equipment?: string;
    productionEff: string;
    priority: string;
    startDate: string;
    damageCode: string;
    cause: string;
    objectPart: string;
    longText: string;
    breakdownIndic?: boolean;
    notifNumber?: string;
}
