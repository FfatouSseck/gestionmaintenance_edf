export interface Notification extends NotificationLight {
    color?: string;
}

export interface NotificationLight {
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

export interface NotifHeader {
    Attachments?: string;
    Breakdown?: boolean;
    CatalogProfile?: string;
    CauseCode?: string;
    CauseCodeDescr?: string;
    CauseDescr?: string;
    CauseGroup?: string;
    CauseGroupDescr?: string;
    CauseLongText?: string;
    Complete?: boolean;
    Components?: string;
    CreatedBy?: string;
    CreatedDate?: string;
    DamageCode?: string;
    DamageCodeDescr?: string;
    DamageDescr?: string;
    DamageGroup?: string;
    DamageGroupDescr?: string;
    DamageLongText?: string;
    Effect?: string;
    EffectDescr?: string;
    EquipCustWarranty?: boolean;
    EquipCustWarrantyDescr?: string;
    EquipCustWarrantyEndDate?: string;
    EquipCustWarrantyStartDate?: string;
    EquipUnderWarranty?: boolean;
    EquipVendWarranty?: boolean;
    EquipVendWarrantyDescr?: string;
    EquipVendWarrantyEndDate?: string;
    EquipVendWarrantyStartDate?: string;
    Equipment?: string;
    EquipmentDescr?: string;
    FlocCustWarranty?: boolean;
    FlocCustWarrantyDescr?: string;
    FlocCustWarrantyEndDate?: string;
    FlocCustWarrantyStartDate?: string;
    FlocUnderWarranty?: boolean;
    FlocVendWarranty?: boolean;
    FlocVendWarrantyDescr?: string;
    FlocVendWarrantyEndDate?: string;
    FlocVendWarrantyStartDate?: string;
    FunctLoc?: string;
    FunctLocDescr?: string;
    InProcess?: boolean;
    LongText?: string;
    LongTextNew?: string;
    NotifDate?: string;
    NotifNo?: string;
    NotifType?: string;
    NotifTypeDescr?: string;
    ObjectPartCode?: string;
    ObjectPartCodeDescr?: string;
    ObjectPartGroup?: string;
    ObjectPartGroupDescr?: string;
    PlanPlant?: string;
    Priority?: string;
    PriorityDescr?: string;
    ShortText?: string;
    StartDate?: string;
    Status?: string;
    StatusDescr?: string;
    StatusShort?: string;
    Tasks?: string;


    color?: string;
}
