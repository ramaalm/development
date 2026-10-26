export default async function EntitySetRecordsListOnLoaded(clientAPI) {
    const data = clientAPI.getPageProxy().getClientData();
    const entitySet = clientAPI.binding && clientAPI.binding.Name;
    if (entitySet) data.entitySet = entitySet;

    if (!entitySet) {
        data.stringFields = [];
        return;
    }

    // Populate stringFields from $metadata if not already done
    if (!Array.isArray(data.stringFields) || data.stringFields.length === 0) {
        try {
            const provider = clientAPI.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
            const xml = provider && provider.getMetadata && provider.getMetadata().getOriginalText();
            const stringSet = new Set();
            if (xml) {
                const esMatch = xml.match(new RegExp(`<EntitySet[^>]*Name="${entitySet}"[^>]*EntityType="[^.]*\\.([^"]+)"`));
                const typeName = esMatch && esMatch[1];
                if (typeName) {
                    const typeMatch = xml.match(new RegExp(`<EntityType\\s+Name="${typeName}"[^>]*>([\\s\\S]*?)</EntityType>`));
                    if (typeMatch) {
                        const propMatches = typeMatch[1].match(/<Property\s[^>]*>/g) || [];
                        for (const prop of propMatches) {
                            const nameM = prop.match(/Name="([^"]+)"/);
                            const typeM = prop.match(/Type="([^"]+)"/);
                            if (nameM && typeM && typeM[1] === 'Edm.String') stringSet.add(nameM[1]);
                        }
                    }
                }
            }
            data.stringFields = Array.from(stringSet);
        } catch (err) {
            clientAPI.getLogger().log(`[InspectEntities] OnLoaded metadata parse failed: ${String(err)}`, 'Error');
            data.stringFields = [];
        }
    }

    // Auto-select the first record so the detail pane shows content on load
    try {
        const probe = await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$top=1');
        let samples = [];
        if (probe && Array.isArray(probe._array)) {
            samples = probe._array;
        } else if (probe && typeof probe.getItem === 'function' && typeof probe.length === 'number') {
            for (let i = 0; i < probe.length; i++) samples.push(probe.getItem(i));
        } else if (probe && Array.isArray(probe.value)) {
            samples = probe.value;
        } else if (Array.isArray(probe)) {
            samples = probe;
        }
        if (samples.length > 0) {
            clientAPI.executeAction({
                'Name': '/SAPAssetManager/Actions/Troubleshooting/EntitySet/EntitySetRecordDetailNav.action',
                'Properties': { 'ActionBinding': samples[0] },
            });
        }
    } catch (err) {
        clientAPI.getLogger().log(`[InspectEntities] OnLoaded auto-select failed: ${String(err)}`, 'Error');
    }
}
