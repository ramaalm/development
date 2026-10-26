import CommonLibrary from '../Common/Library/CommonLibrary';

export default function IsTroubleshootingToolsEnabled(context) {
    const value = CommonLibrary.getAppParam(context, 'TROUBLESHOOTING_TOOLS', 'Enable.TroubleshootingTools');
    return value === 'Y';
}
