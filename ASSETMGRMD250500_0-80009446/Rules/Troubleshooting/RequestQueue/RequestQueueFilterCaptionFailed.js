export default function RequestQueueFilterCaptionFailed(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'RequestQueue', "$filter=(Status eq 'Failed')").then(count => {
        return context.localizeText('request_queue_failed_x', [count]);
    });
}
