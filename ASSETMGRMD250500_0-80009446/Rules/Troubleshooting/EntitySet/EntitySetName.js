export default function EntitySetName(clientAPI) {
    return (clientAPI.binding && clientAPI.binding.Name) || '';
}
