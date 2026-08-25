

import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function ZSubOperationsListWoEqFnLoc(context) {
    const binding = context.binding;
    let equip = binding.OperationEquipment;
    let equipDescription = binding.EquipmentSubOperation?.EquipDesc;

    let fnloc = binding.FunctionalLocationSubOperation?.FuncLocId;
    let fnlocDescription = binding.FunctionalLocationSubOperation?.FuncLocDesc;

    // Priority 1: Equipment
    if (equip && equip.trim() !== '') {
        return equipDescription
            ? `${equip} / ${equipDescription}`
            : `${equip}`;
    }

    // Priority 2: Functional Location
    if (fnloc && fnloc.trim() !== '') {
        return fnlocDescription
            ? `${fnloc} / ${fnlocDescription}`
            : `${fnloc}`;
    }

    // Priority 3: No data
    return '';
    

}