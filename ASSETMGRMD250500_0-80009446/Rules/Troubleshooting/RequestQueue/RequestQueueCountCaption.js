export default function RequestQueueCountCaption(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'RequestQueue', '').then(count => {
        return context.localizeText('request_queue_count_x', [count]);
    });
}
