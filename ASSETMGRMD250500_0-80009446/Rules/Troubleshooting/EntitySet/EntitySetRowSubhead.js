export default function EntitySetRowSubhead(clientAPI) {
    const binding = clientAPI.binding;
    if (!binding) return '';
    const count = binding.RecordCount;
    if (typeof count !== 'number' || count < 0) return '';
    return clientAPI.localizeText('n_records', [count]);
}
