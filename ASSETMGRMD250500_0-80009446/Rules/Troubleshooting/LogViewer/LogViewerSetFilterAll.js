export default function LogViewerSetFilterAll(clientAPI) {
    clientAPI.getAppClientData().logViewerLevelFilter = 'all';
    const page = clientAPI.getPageProxy();
    return page && page.redraw ? page.redraw() : null;
}
