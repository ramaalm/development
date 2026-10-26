export default function LogViewerSetFilterDebug(clientAPI) {
    clientAPI.getAppClientData().logViewerLevelFilter = 'debug';
    const page = clientAPI.getPageProxy();
    return page && page.redraw ? page.redraw() : null;
}
