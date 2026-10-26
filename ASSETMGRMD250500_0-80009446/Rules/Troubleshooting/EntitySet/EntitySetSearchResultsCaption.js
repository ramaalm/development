// Header caption above the records list.
//   - Search hidden or empty:  hidden (returns '')
//   - Search active with text: "{filtered} of {total} records"
//                              (e.g., "2 of 4 records")
//
// Why we read from page client data (data.entitySet, data.lastSearch,
// data.lastFilter) instead of clientAPI.binding / clientAPI.searchString:
//   - This rule runs in SectionHeaderProxy context, where clientAPI.binding is
//     the section's binding (no Name property) and clientAPI.searchString is
//     being deprecated and doesn't reliably re-fire this rule.
//   - EntitySetRecordsListOnLoaded.js caches data.entitySet at load time.
//   - EntitySetQueryOptions.js (runs on every keystroke in ObjectTableProxy
//     context) caches data.lastSearch + data.lastFilter. MDK re-fires this
//     header rule naturally after each search-driven read settles, so no
//     explicit redraw is needed (an earlier attempt to redraw the section
//     here caused recursion back into QueryOptions and an infinite loop).
export default function EntitySetSearchResultsCaption(clientAPI) {
    const logger = clientAPI.getLogger();
    let entitySet = '';
    let search = '';
    let filter = '';
    try {
        const data = clientAPI.getPageProxy().getClientData();
        entitySet = (data && data.entitySet) || '';
        search = (data && data.lastSearch) || '';
        filter = (data && data.lastFilter) || '';
    } catch (e) {
        logger.log(`[InspectEntities] SearchResultsCaption getClientData threw: ${String(e)}`, 'Error');
    }

    if (!entitySet) return '';
    if (!search) return '';

    const service = '/SAPAssetManager/Services/AssetManager.service';
    const totalP = clientAPI.count(service, entitySet, '');
    const filteredP = filter ? clientAPI.count(service, entitySet, '$filter=' + filter) : Promise.resolve(0);

    return Promise.all([filteredP, totalP])
        .then(([filtered, total]) => clientAPI.localizeText('n_of_n_records', [filtered, total]))
        .catch(err => {
            logger.log(`[InspectEntities] SearchResultsCaption count failed: ${String(err)}`, 'Error');
            return '';
        });
}
