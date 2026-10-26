export default function LogViewerSetFilterInfo(clientAPI) {
    clientAPI.getAppClientData().logViewerLevelFilter = 'info';
    const page = clientAPI.getPageProxy();
    return page && page.redraw ? page.redraw() : null;
}
