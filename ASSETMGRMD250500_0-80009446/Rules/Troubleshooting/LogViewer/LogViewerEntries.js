/**
 * Reads SAMLog.txt, parses lines, reverses to newest-first, applies the level
 * filter (appData.logViewerLevelFilter: 'all' | 'debug' | 'info' | 'warning' | 'error') set by
 * the ActionBar filter rules, and the table search string.
 */
export default async function LogViewerEntries(clientAPI) {
    const logger = clientAPI.getLogger();
    const appData = clientAPI.getAppClientData();
    if (!appData.logViewerLevelFilter) appData.logViewerLevelFilter = 'all';

    const fs = clientAPI.nativescript.fileSystemModule;
    const docsPath = fs.knownFolders.documents().path;
    const logPath = fs.path.join(docsPath, 'SAMLog.txt');

    let entries = [];
    try {
        const file = fs.File.fromPath(logPath);
        const text = await file.readText();
        const lines = (text || '').split(/\r?\n/);
        const levelRegex = /\b(Trace|Debug|Info|Warning|Warn|Error|Fatal)\b/i;
        for (let i = 0; i < lines.length; i++) {
            const raw = lines[i];
            if (!raw || !raw.trim()) continue;
            const tsMatch = raw.match(/^(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:[.,]\d+)?(?:Z|[+-]\d{2}:?\d{2})?)/);
            const timestamp = tsMatch ? tsMatch[1] : '';
            const catMatch = raw.match(/\[([^\]]+)\]/);
            const category = catMatch ? catMatch[1] : '';
            const lvlMatch = raw.match(levelRegex);
            let level = lvlMatch ? lvlMatch[1] : 'Info';
            if (level.toLowerCase() === 'warn') level = 'Warning';
            level = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
            let message = raw;
            if (timestamp) message = message.slice(timestamp.length).trimStart();
            if (catMatch) message = message.replace(catMatch[0], '').trimStart();
            if (lvlMatch) message = message.replace(lvlMatch[0], '').trimStart();
            message = message.replace(/^[-:|\s]+/, '').trim();
            if (!message) message = raw.trim();
            entries.push({
                Message: message.length > 200 ? message.slice(0, 200) + '…' : message,
                FullMessage: message,
                Raw: raw,
                Timestamp: timestamp,
                Category: category,
                Level: level,
                Subhead: [timestamp, category].filter(Boolean).join(' · '),
            });
        }
    } catch (err) {
        logger.log(`[LogViewer] Could not read SAMLog.txt: ${String(err)}`, 'Error');
        return [];
    }

    entries.reverse();

    const filter = (appData.logViewerLevelFilter || 'all').toLowerCase();
    if (filter !== 'all') {
        entries = entries.filter(e => (e.Level || '').toLowerCase() === filter);
    }

    const search = (clientAPI.searchString || '').toLowerCase();
    if (search) {
        entries = entries.filter(e =>
            (e.Raw && e.Raw.toLowerCase().indexOf(search) !== -1)
            || (e.Category && e.Category.toLowerCase().indexOf(search) !== -1),
        );
    }

    return entries;
}
