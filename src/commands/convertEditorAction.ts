import * as vscode from 'vscode';
import axios from 'axios';
import { readActions } from '../convertAction';

export async function convertEditorAction() {
    let startTime: number;

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Converting action...',
        cancellable: false
    }, (progress, token) => {
        return new Promise<void>(async (resolve, reject) => {
            const actionId = await vscode.window.showInputBox({ prompt: "Enter Housing Editor Action ID" });
            if (!actionId) return reject("You didn't provide a valid Action ID.");

            axios.request({
                url: `https://api.housingeditor.com/actions/${actionId}`,
                method: "GET"
            }).then((response) => {
                const actionList = response.data.actionData;
                let scriptData: string[] = [];

                vscode.window.showInformationMessage(`Are you sure you want to import "${response.data.post.title}" by ${response.data.author.name}?`, 'Import Action', 'Cancel')
                    .then(async (choice) => {
                        if (choice === 'Import Action') {
                            startTime = performance.now();
                            for (let i = 0; i < actionList.length; i++) {
                                if (actionList[i] && actionList[i].length > 0) {
                                    let actionType = actionList[i][0];
                                    let actionData = actionList[i][1];
                                    scriptData.push(readActions(actionType, actionData));
                                }
                            }

                            const editor = await vscode.workspace.openTextDocument({ language: 'htsl', content: scriptData.join('\n') });
                            await vscode.window.showTextDocument(editor);

                            return resolve();
                        } else if (choice == 'Cancel') {
                            return reject('Operation cancelled by user.');
                        }
                    });
            }).catch((error) => {
                return reject(`${error.message}: ${error.response.data.message}`);
            });
        }).then(() => {
            vscode.window.showInformationMessage(`Action successfully converted and loaded. (in ${Math.round(performance.now() - startTime)}ms)`);
        }).catch((error) => {
            vscode.window.showErrorMessage(`Error: ${error}`);
        });
    });
}