export default function EntitySetRowSelected(clientAPI) {
    return clientAPI.executeAction({ 'Name': '/SAPAssetManager/Actions/Troubleshooting/EntitySet/EntitySetRecordsNav.action' });
}
