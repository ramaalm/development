export default function LogViewerSetFilterError(clientAPI) {
    clientAPI.getAppClientData().logViewerLevelFilter = 'error';
    const page = clientAPI.getPageProxy();
    return page && page.redraw ? page.redraw() : null;
}
