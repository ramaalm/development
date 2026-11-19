export default function DuplicateNotificationsFilter(context) {

const funcLoc = context.getAppClientData().DuplicateFuncLoc;
const equipment = context.getAppClientData().DuplicateEquipment;

let filter = '';

if (funcLoc && equipment) {

filter =
`HeaderFunctionLocation eq '${funcLoc}' and HeaderEquipment eq '${equipment}'`;

} else if (funcLoc) {

filter =
`HeaderFunctionLocation eq '${funcLoc}'`;

} else if (equipment) {

filter =
`HeaderEquipment eq '${equipment}'`;
}

return `$filter=${filter}&$expand=NotifMobileStatus_Nav`;
}