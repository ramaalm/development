// Builds the detail page for a single entity record.
//
// Pattern mirrors RequestQueueDetails.js:
//   - Scalar properties → KeyValue section, captioned with the entity type
//     name (from @odata.type), read-only.
//   - Each navigation property → its own ObjectTable section whose Target is
//     `{parentReadLink}/{NavPropName}`. The OData server resolves the nav
//     link natively, so we don't need to parse $metadata, build $filters
//     from primary keys, or know the target entity set name. Tapping a row
//     re-uses EntitySetRecordDetailNav.action → recursive drill-down.
//
// Nav properties are detected from the row binding itself: any non-`@`/`#`
// key whose value is an object/array (the unexpanded nav placeholder) is
// treated as a nav property.
export default function EntitySetRecordDetailPage(context) {
    const binding = context.getActionBinding() || {};
    const readLink = binding['@odata.readLink'];
    const rawType = binding['@odata.type'];
    const typeName = typeof rawType === 'string' ? rawType.replace(/^#?[^.]*\./, '') : '';

    const scalarRows = [];
    const navPropNames = [];
    for (const property in binding) {
        if (property.startsWith('@') || property.startsWith('#')) continue;
        const v = binding[property];
        if (v !== null && typeof v === 'object') {
            navPropNames.push(property);
        } else {
            scalarRows.push({
                'Value': v === null || v === undefined ? '' : String(v),
                '_Type': 'KeyValue.Type.Item',
                'KeyName': property,
            });
        }
    }

    const sections = [
        {
            'Header': { 'Caption': typeName || context.localizeText('entity_properties') },
            '_Type': 'Section.Type.KeyValue',
            '_Name': 'EntityPropertiesSection',
            'Visible': true,
            'Separators': {
                'TopSectionSeparator': false,
                'BottomSectionSeparator': true,
                'HeaderSeparator': true,
                'FooterSeparator': true,
                'ControlSeparator': true,
            },
            'KeyAndValues': scalarRows,
            'MaxItemCount': 200,
            'Layout': { 'NumberOfColumns': 2 },
        },
    ];

    if (readLink) {
        for (const navName of navPropNames) {
            sections.push({
                '_Type': 'Section.Type.ObjectTable',
                '_Name': `RelatedSection_${navName}`,
                'Visible': true,
                'Header': { 'Caption': navName },
                'Separators': {
                    'TopSectionSeparator': false,
                    'BottomSectionSeparator': true,
                    'HeaderSeparator': true,
                    'FooterSeparator': true,
                    'ControlSeparator': true,
                },
                'ObjectCell': {
                    '_Type': 'ObjectTable.Type.ObjectCell',
                    'Title': '/SAPAssetManager/Rules/Troubleshooting/EntitySet/EntitySetCellTitle.js',
                    'Subhead': '/SAPAssetManager/Rules/Troubleshooting/EntitySet/EntitySetCellSubhead.js',
                    'Footnote': '/SAPAssetManager/Rules/Troubleshooting/EntitySet/EntitySetCellFootnote.js',
                    'StatusText': '/SAPAssetManager/Rules/Troubleshooting/EntitySet/EntitySetCellStatus.js',
                    'AccessoryType': 'DisclosureIndicator',
                    'OnPress': '/SAPAssetManager/Actions/Troubleshooting/EntitySet/EntitySetRecordDetailNav.action',
                },
                'EmptySection': {
                    'Caption': '$(L,entityset_empty)',
                    'FooterVisible': false,
                },
                'Target': {
                    'EntitySet': `${readLink}/${navName}`,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                },
            });
        }
    }

    return {        '_Type': 'Page',
        '_Name': 'EntitySetRecordDetail',
        'Caption': context.localizeText('entity_details'),
        'Controls': [
            {
                '_Type': 'Control.Type.SectionedTable',
                '_Name': 'EntitySetRecordDetailTable',
                'Sections': sections,
            },
        ],
    };
}
