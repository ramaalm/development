/* eslint-disable no-undef */
export default function LogViewerShare(context) {
    const filePath = context.nativescript.fileSystemModule.knownFolders.documents().path + '/SAMLog.txt';
    const platform = context.nativescript.platformModule;

    if (platform.isIOS) {
        const fileURL = NSURL.fileURLWithPath(filePath);
        const activityVC = UIActivityViewController.alloc().initWithActivityItemsApplicationActivities([fileURL], null);
        const rootVC = UIApplication.sharedApplication.keyWindow.rootViewController;
        // On iPad, a sourceView is required to anchor the popover
        if (activityVC.popoverPresentationController) {
            activityVC.popoverPresentationController.sourceView = rootVC.view;
            activityVC.popoverPresentationController.sourceRect = CGRectMake(0, 0, 1, 1);
        }
        rootVC.presentViewControllerAnimatedCompletion(activityVC, true, null);
    } else {
        // Android: use the OpenDocument action which invokes an external viewer/share chooser
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Documents/DocumentOpen.action', 'Properties': {
            'Path': filePath,
            'UseExternalViewer': true,
        }});
    }
}
