export default function RequestQueueFilterCaptionPending(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'RequestQueue', "$filter=(Status eq 'Unsent')").then(count => {
        return context.localizeText('request_queue_pending_x', [count]);
    });
}
