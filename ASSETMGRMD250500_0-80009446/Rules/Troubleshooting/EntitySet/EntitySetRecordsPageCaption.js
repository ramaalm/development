// Page caption for the FCL records page. Shows "EntitySetName (total)".
// The FCL parent's caption rule cannot see the inner list page's live
// searchString, so filtered-count display happens in the list section
// header rule (EntitySetSearchResultsCaption.js) instead.
export default function EntitySetRecordsPageCaption(clientAPI) {
    const entitySet = (clientAPI.binding && clientAPI.binding.Name) || '';
    if (!entitySet) return 'Entity Set';
    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', entitySet, '')
        .then((count) => `${entitySet} (${count})`)
        .catch(() => entitySet);
}
