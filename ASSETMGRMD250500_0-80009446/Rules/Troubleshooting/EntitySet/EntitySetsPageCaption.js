export default function EntitySetsPageCaption(clientAPI) {
    const data = clientAPI.getPageProxy().getClientData();
    let names = Array.isArray(data.allEntitySetNames) ? data.allEntitySetNames : null;

    if (!names) {
        try {
            const provider = clientAPI.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
            const xml = provider && provider.getMetadata && provider.getMetadata().getOriginalText();
            if (xml) {
                const matches = xml.match(/<EntitySet[^>]*Name="([^"]+)"/g) || [];
                names = matches.map(m => m.match(/Name="([^"]+)"/)[1]);
                data.allEntitySetNames = names;
            }
        } catch (err) {
            clientAPI.getLogger().log(`[InspectEntities] Caption parse failed: ${String(err)}`, 'Error');
        }
    }

    const total = Array.isArray(names) ? names.length : 0;

    if (total > 0) {
        return clientAPI.localizeText('entity_set_with_count', [total]);
    }
    return clientAPI.localizeText('entity_set');
}
