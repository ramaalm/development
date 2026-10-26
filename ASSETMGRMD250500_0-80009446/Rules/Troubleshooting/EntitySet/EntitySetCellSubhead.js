// Cell subhead: the VALUE of the primary key column on this row (e.g.
// "4008602"). Pairs with EntitySetCellTitle.js (column NAME) to give:
//   line 1: "OrderId"
//   line 2: "4008602"
// Reuses the data.primaryKey list cached by EntitySetCellTitle.js.
export default function EntitySetCellSubhead(clientAPI) {
    const b = clientAPI.binding;
    if (!b || typeof b !== 'object') return '';
    const data = clientAPI.getPageProxy().getClientData();
    const keys = Array.isArray(data.primaryKey) ? data.primaryKey : [];
    if (keys.length === 0) return '';
    const v = b[keys[0]];
    return v === null || v === undefined ? '' : String(v);
}
