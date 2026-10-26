export default async function EntitySetsList(clientAPI) {
    const logger = clientAPI.getLogger();
    const data = clientAPI.getPageProxy().getClientData();

    let names = data.allEntitySetNames;
    if (!Array.isArray(names) || names.length === 0) {
        try {
            const provider = clientAPI.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
            const xml = provider && provider.getMetadata && provider.getMetadata().getOriginalText();
            if (xml) {
                const matches = xml.match(/<EntitySet[^>]*Name="([^"]+)"/g) || [];
                names = matches.map(m => m.match(/Name="([^"]+)"/)[1]);
                data.allEntitySetNames = names;
            } else {
                names = [];
            }
        } catch (err) {
            logger.log(`[InspectEntities] Could not parse entity sets: ${String(err)}`, 'Error');
            names = [];
        }
    }

    const search = (clientAPI.searchString || '').toLowerCase();
    const filtered = search
        ? names.filter(n => n.toLowerCase().indexOf(search) !== -1)
        : names;

    data.recordCounts = data.recordCounts || {};
    const cache = data.recordCounts;

    const CHUNK = 20;
    const results = [];
    for (let i = 0; i < filtered.length; i += CHUNK) {
        const chunk = filtered.slice(i, i + CHUNK);
        const chunkResults = await Promise.all(chunk.map(async (name) => {
            if (typeof cache[name] === 'number') {
                return { Name: name, RecordCount: cache[name] };
            }
            try {
                const count = await clientAPI.count('/SAPAssetManager/Services/AssetManager.service', name, '');
                cache[name] = count;
                return { Name: name, RecordCount: count };
            } catch (err) {
                return { Name: name, RecordCount: -1 };
            }
        }));
        results.push(...chunkResults);
    }

    const populated = [];
    const empty = [];
    for (const r of results) {
        if (r.RecordCount <= 0) {
            empty.push(r);
        } else {
            populated.push(r);
        }
    }

    return populated.concat(empty);
}
