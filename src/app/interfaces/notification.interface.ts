export interface Notification{
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
    color?:string;
    notifNumber?: string;
}
