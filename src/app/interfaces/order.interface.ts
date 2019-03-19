export interface Order{

    EquipUnderWarranty?: boolean;
    WorkCenter?: string;
    OrderNo?: string;
    WorkCenterShort?: string;
    PlanPlantDescr?: string;
    WorkCenterDescr?: string;
    EquipCustWarranty?: boolean;
    PriorityDescr?: string;
    EquipCustWarrantyDescr?: string;
    Mine?: boolean;
    EquipCustWarrantyStartDate?: string;
    OrderType?: string;
    EquipCustWarrantyEndDate?: string;
    PmActivityType?: string;
    EquipVendWarranty?: boolean;
    PmActivityTypeDescr?: string;
    EquipVendWarrantyDescr?: string;
    PlanPlant?: string;
    EquipVendWarrantyStartDate?: string;
    FunctLoc?: string;
    EquipVendWarrantyEndDate?: string;
    FunctLocDescr?: string;
    Equipment?: string;
    FlocUnderWarranty?: string;
    EquipmentDescr?: string;
    FlocCustWarranty?: boolean;
    FlocCustWarrantyDescr?: string;
    NotifNo?: string;
    FlocCustWarrantyStartDate?: string;
    ShortText?: string;
    FlocCustWarrantyEndDate?: string;
    LongText?: string;
    FlocVendWarranty?: boolean;
    Priority?: string;
    Assignee?: string;
    FlocVendWarrantyDescr?: string;
    AssigneeName?: string;
    FlocVendWarrantyStartDate?: string;
    FlocVendWarrantyEndDate?: string;
    Status?: string;
    StatusShort?: string;
    StatusDescr?: string;
    CreationDate?: string;
    InProcess?: boolean;
    Complete?: boolean;
    Confirmed?: boolean;
    TecoRefDate?: string;
    TasklistGroup?: string;
    TasklistGroupCounter?: string;
    TasklistDescr?: string;


    color?: string;
}