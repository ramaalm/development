/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default async function RequestQueueDetails(context) {

    const binding = context.getActionBinding() || {};
    const shortURL = (binding.URL || '').replace(/\(.*$/, '');
    const page_metadata = {
        'Caption': `${binding.RequestID} - ${shortURL}`,
        'Controls': [
            {
                '_Type': 'Control.Type.SectionedTable',
                '_Name': 'SectionTable',
                'Sections': [{
                    '_Type': 'Section.Type.KeyValue',
                    'Header': {
                        'Caption': context.localizeText('request_queue_request_details'),
                    },
                    'KeyAndValues': [{
                        'KeyName': 'Method',
                        'Value': '',
                    }, {
                        'KeyName': 'Status',
                        'Value': '',
                    }, {
                        'KeyName': 'URL',
                        'Value': '',
                        'TextWrapping': true,
                    }],
                }, {
                    '_Type': 'Section.Type.KeyValue',
                    '_Name': 'SectionKeyValue1',
                    'Header': {
                        'Caption': context.localizeText('request_queue_entity_headers'),
                    },
                    'EmptySection': {
                        'FooterVisible': false,
                        'Caption': context.localizeText('request_queue_no_headers'),
                    },
                    'KeyAndValues': [],
                    'MaxItemCount': 200,
                    'Layout': {
                        'NumberOfColumns': 1,
                    },
                },
                {
                    'Header': {
                        'Caption': context.localizeText('request_queue_entity_properties'),
                    },
                    '_Type': 'Section.Type.KeyValue',
                    '_Name': 'SectionKeyValue0',
                    'Visible': true,
                    'Separators': {
                        'TopSectionSeparator': false,
                        'BottomSectionSeparator': true,
                        'HeaderSeparator': true,
                        'FooterSeparator': true,
                        'ControlSeparator': true,
                    },
                    'KeyAndValues': [],
                    'MaxItemCount': 200,
                    'Layout': {
                        'NumberOfColumns': 2,
                    },
                },
                {
                    '_Type': 'Section.Type.ObjectTable',
                    '_Name': 'SectionObjectTable0',
                    'Visible': true,
                    'Header': {
                        'Caption': context.localizeText('request_queue_dependent_requests'),
                    },
                    'Separators': {
                        'TopSectionSeparator': false,
                        'BottomSectionSeparator': true,
                        'HeaderSeparator': true,
                        'FooterSeparator': true,
                        'ControlSeparator': true,
                    },
                    'ObjectCell': {
                        'Title': '{RequestID} - {URL}',
                        'Subhead': context.localizeText('request_queue_method_x', [binding.Method]),
                        'Footnote': context.localizeText('request_queue_status_x', [binding.Status]),
                        'OnPress': '/SAPAssetManager/Actions/Troubleshooting/RequestQueue/RequestQueueDetailsNav.action',
                        '_Type': 'ObjectTable.Type.ObjectCell',
                    },
                    'EmptySection': {
                        'Caption': context.localizeText('request_queue_no_dependent_requests'),
                        'FooterVisible': false,
                    },
                    'Target': {
                        'EntitySet': `${context.getActionBinding()['@odata.readLink']}/DependentRequests`,
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                    },
                },
                ],
            },
        ],
        '_Type': 'Page',
        '_Name': 'RequestQueueDetails',
        'ActionBar': {
            'Items': [],
            '_Name': 'ActionBar1',
            '_Type': 'Control.Type.ActionBar',
        },
    };

    const entity = await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getActionBinding()['@odata.readLink']}/AffectedEntity`, [], '').then(res => res._array[0]).catch(() => { });

    const headers = await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getActionBinding()['@odata.readLink']}/CustomHeaders`, [], '').then(res => res._array).catch(() => []);

    for (const header of headers) {
        page_metadata.Controls[0].Sections[1].KeyAndValues.push({
            '_Type': 'KeyValue.Type.Item',
            'KeyName': header.Name,
            'Value': String(header.Value),
            'TextWrapping': true,
        });
    }

    if (entity) {
        for (const property in entity) {
            page_metadata.Controls[0].Sections[2].KeyAndValues.push({
                'Value': entity[property],
                '_Type': 'KeyValue.Type.Item',
                'KeyName': property,
            });
        }
    }

    page_metadata.Controls[0].Sections[0].KeyAndValues[0].Value = context.getActionBinding().Method;
    page_metadata.Controls[0].Sections[0].KeyAndValues[1].Value = context.getActionBinding().Status;
    page_metadata.Controls[0].Sections[0].KeyAndValues[2].Value = context.getActionBinding().URL;


    return page_metadata;
}
