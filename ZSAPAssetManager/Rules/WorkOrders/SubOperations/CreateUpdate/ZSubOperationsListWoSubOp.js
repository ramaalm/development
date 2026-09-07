

import libCom from '../../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
export default function ZSubOperationsListWoEqFnLoc(context) {
    const binding = context.binding;
    let subOperation = binding.SubOperationNo;
    let woNum = binding.OrderId;
    let equip = context.binding.OperationEquipment;
    let fnloc = context.binding.OperationFunctionLocation;
    let equipDescription = context.binding.OperationShortText;
    
        return `${subOperation} / ${woNum}`;
    
    

}