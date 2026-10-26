export default function RequestQueueFilterCaptionSuccessful(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'RequestQueue', "$filter=(Status eq 'Successful')").then(count => {
        return context.localizeText('request_queue_successful_x', [count]);
    });
}
