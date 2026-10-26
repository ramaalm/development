export default async function EntitySetQueryOptions(clientAPI) {
    const entitySet = clientAPI.binding && clientAPI.binding.Name;
    const search = clientAPI.searchString || '';
    const qob = clientAPI.dataQueryBuilder();
    qob.top(50);

    if (!entitySet) {
        return qob;
    }

    const data = clientAPI.getPageProxy().getClientData();
    if (!Array.isArray(data.stringFields) || data.stringFields.length === 0) {
        try {
            // Use $metadata to find only Edm.String properties — runtime JS types
            // are unreliable (dates are serialized as strings in the offline store).
            const provider = clientAPI.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
            const xml = provider && provider.getMetadata && provider.getMetadata().getOriginalText();
            const stringSet = new Set();
            if (xml) {
                // Find the EntitySet's EntityType name
                const esMatch = xml.match(new RegExp(`<EntitySet[^>]*Name="${entitySet}"[^>]*EntityType="[^.]*\\.([^"]+)"`));
                const typeName = esMatch && esMatch[1];
                if (typeName) {
                    const typeMatch = xml.match(new RegExp(`<EntityType\\s+Name="${typeName}"[^>]*>([\\s\\S]*?)</EntityType>`));
                    if (typeMatch) {
                        const propMatches = typeMatch[1].match(/<Property\s[^>]*>/g) || [];
                        for (const prop of propMatches) {
                            const nameM = prop.match(/Name="([^"]+)"/);
                            const typeM = prop.match(/Type="([^"]+)"/);
                            if (nameM && typeM && typeM[1] === 'Edm.String') {
                                stringSet.add(nameM[1]);
                            }
                        }
                    }
                }
            }
            data.stringFields = Array.from(stringSet);
        } catch (err) {
            clientAPI.getLogger().log(`[InspectEntities] probe failed: ${String(err)}`, 'Error');
            data.stringFields = [];
        }
    }

    if (search && data.stringFields.length > 0) {
        const escaped = search.toLowerCase().replace(/'/g, "''");
        const clauses = data.stringFields.map(f => `substringof('${escaped}', tolower(${f}))`);
        const filter = '(' + clauses.join(' or ') + ')';
        qob.filter(filter);
        data.lastSearch = search;
        data.lastFilter = filter;
    } else {
        data.lastSearch = '';
        data.lastFilter = '';
    }

    return qob;
}
