export default async function CheckDuplicateNotification(context) {

const pageProxy = context.getPageProxy();
const formCellContainer = pageProxy.getControl('FormCellContainer');

const funcLocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
const funcLocValue = funcLocControl ? funcLocControl.getValue() : '';

const equipmentControl = formCellContainer.getControl('EquipHierarchyExtensionControl');

let equipmentValue = '';

if (equipmentControl) {
const rawEquipmentValue = equipmentControl.getValue();

console.log('Equipment Raw Value = ' + JSON.stringify(rawEquipmentValue));
console.log('Equipment Value Type = ' + typeof rawEquipmentValue);

equipmentValue = rawEquipmentValue || '';
}

console.log('Selected Functional Location = ' + funcLocValue);
console.log('Selected Equipment = ' + JSON.stringify(equipmentValue));

try {

let filter = '';

// FL + Equipment selected => both must match
if (funcLocValue && equipmentValue) {

filter =
`HeaderFunctionLocation eq '${funcLocValue}' and HeaderEquipment eq '${equipmentValue}'`;

// Only FL selected => all notifications for same FL
} else if (funcLocValue) {

filter =
`HeaderFunctionLocation eq '${funcLocValue}'`;

// Only Equipment selected
} else if (equipmentValue) {

filter =
`HeaderEquipment eq '${equipmentValue}'`;
}

console.log('Filter = ' + filter);

const queryOptions =
`$filter=${filter}&$expand=NotifMobileStatus_Nav`;

console.log('QueryOptions = ' + queryOptions);

const result = await context.read(
'/SAPAssetManager/Services/AssetManager.service',
'MyNotificationHeaders',
[],
queryOptions
);

console.log('READ SUCCESS');
console.log('Duplicate Count = ' + result.length);

let openNotificationFound = false;

const openSystemStatuses = [
'APOK',
'APRQ',
'ORAS',
'OSNO',
'NOPR',
];

for (let i = 0; i < result.length; i++) {

const row = result.getItem(i);

const systemStatus = row.NotifMobileStatus_Nav ?
(row.NotifMobileStatus_Nav.SystemStatus || '') :
'';

console.log(
'Notification=' +
row.NotificationNumber +
' | FunctionalLocation=' +
row.HeaderFunctionLocation +
' | HeaderEquipment=' +
row.HeaderEquipment +
' | SystemStatus=' +
systemStatus
);

// Open notification rules:
// 1. APOK/APRQ/ORAS/OSNO/NOPR
// 2. Blank status (LOCAL notifications)
const isDuplicate =
!systemStatus ||
openSystemStatuses.some(
status => systemStatus.includes(status)
);

if (isDuplicate) {

openNotificationFound = true;

console.log(
'OPEN DUPLICATE FOUND = ' +
row.NotificationNumber +
' | SystemStatus=' +
systemStatus
);

break;
}
}

if (openNotificationFound) {

context.getAppClientData().DuplicateFuncLoc = funcLocValue;
context.getAppClientData().DuplicateEquipment = equipmentValue;

return context.executeAction(
'/ZSAPAssetManager/Actions/Notifications/DuplicateNotificationWarning.action'
);
}

return context.executeAction(
'/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateUpdateRequired.action'
);

} catch (error) {

console.log('========================');
console.log('DUPLICATE CHECK ERROR');
console.log('ERROR = ' + error);
console.log('ERROR JSON = ' + JSON.stringify(error));

if (error && error.message) {
console.log('ERROR MESSAGE = ' + error.message);
}

console.log('========================');

return context.executeAction(
'/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateUpdateRequired.action'
);
}
}