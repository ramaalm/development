// Cell title: the primary key COLUMN NAME of the entity type (e.g.
// "OrderId"). For entity types with a composite key, only the first key
// column name is shown — matches the Thursday-era display. Key column
// names are parsed once per page from $metadata and cached on
// data.primaryKey.
export default function EntitySetCellTitle(clientAPI) {
    const b = clientAPI.binding;
    if (!b || typeof b !== 'object') return '';
    const keys = resolvePrimaryKey(clientAPI, b);
    return keys[0] || '';
}

function resolvePrimaryKey(clientAPI, b) {
    const data = clientAPI.getPageProxy().getClientData();
    if (Array.isArray(data.primaryKey) && data.primaryKey.length > 0) return data.primaryKey;

    const rawType = b['@odata.type'];
    if (typeof rawType !== 'string') return [];
    const typeName = rawType.replace(/^#?[^.]*\./, '');

    try {
        const provider = clientAPI.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
        const xml = provider && provider.getMetadata && provider.getMetadata().getOriginalText();
        if (!xml) return [];
        const typeMatch = xml.match(new RegExp(`<EntityType\\s+Name="${typeName}"[^>]*>([\\s\\S]*?)</EntityType>`));
        if (!typeMatch) return [];
        const keyBlockMatch = typeMatch[1].match(/<Key>([\s\S]*?)<\/Key>/);
        if (!keyBlockMatch) return [];
        const propRefs = keyBlockMatch[1].match(/<PropertyRef\s+Name="([^"]+)"/g) || [];
        const keys = propRefs.map(p => p.match(/Name="([^"]+)"/)[1]);
        data.primaryKey = keys;
        return keys;
    } catch (err) {
        clientAPI.getLogger().log(`[InspectEntities] CellTitle key parse failed: ${String(err)}`, 'Error');
        return [];
    }
}
