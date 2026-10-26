export default function LogEntryDetailPage(clientAPI) {
    const binding = clientAPI.getActionBinding() || {};
    const entry = {
        Level: binding.Level || '',
        Timestamp: binding.Timestamp || '',
        Category: binding.Category || '',
        Message: binding.FullMessage || binding.Message || '',
        Raw: binding.Raw || '',
    };

    const items = [
        { Key: clientAPI.localizeText('log_field_level'), Value: entry.Level },
        { Key: clientAPI.localizeText('log_field_timestamp'), Value: entry.Timestamp },
        { Key: clientAPI.localizeText('log_field_category'), Value: entry.Category },
        { Key: clientAPI.localizeText('log_field_message'), Value: entry.Message },
        { Key: clientAPI.localizeText('log_field_raw'), Value: entry.Raw },
    ];

    return {
        '_Type': 'Page',
        '_Name': 'LogEntryDetail',
        'Caption': clientAPI.localizeText('log_entry_detail'),
        'Controls': [
            {
                '_Type': 'Control.Type.SectionedTable',
                '_Name': 'LogEntryDetailTable',
                'Sections': [
                    {
                        '_Type': 'Section.Type.KeyValue',
                        '_Name': 'LogEntryDetailKV',
                        'KeyAndValues': items.map(it => ({
                            '_Type': 'KeyValue.Type.Item',
                            'KeyName': it.Key,
                            'Value': it.Value,
                        })),
                        'Layout': {
                            'NumberOfColumns': 1,
                        },
                    },
                ],
            },
        ],
    };
}
