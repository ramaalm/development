export default function LogViewerSetFilterWarning(clientAPI) {
    clientAPI.getAppClientData().logViewerLevelFilter = 'warning';
    const page = clientAPI.getPageProxy();
    return page && page.redraw ? page.redraw() : null;
}
