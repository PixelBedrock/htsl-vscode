import * as vscode from 'vscode';
import { convertEditorAction } from './commands/convertEditorAction';

export function activate(context: vscode.ExtensionContext) {
    const openSyntaxGuide = vscode.commands.registerCommand('htsl-vscode.openSyntaxGuide', () => {
        vscode.env.openExternal(vscode.Uri.parse("https://hypixel.net/threads/updated-guide-htsl.5555038/"));
    });

    context.subscriptions.push(openSyntaxGuide);
    context.subscriptions.push(vscode.commands.registerCommand('htsl-vscode.convertEditorAction', convertEditorAction));
}

export function deactivate() {}