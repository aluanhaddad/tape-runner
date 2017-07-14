'use strict';
import 'flat-map-polyfill';
import 'core-js';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {TextDocument, Range, CodeActionContext, CancellationToken, ProviderResult, Command} from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "tape-runner" is now active!');
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider(
        {
            language: 'typescript',
            scheme: 'file',
            pattern: `*.{ts,js}`
        },
        {
            provideCodeActions: async (v: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken) => {

                const providerResults: Command[] = [
                    {
                        title: 'Run Test',
                        command: 'extension.runTapeTests'

                    }
                ];
                return providerResults;
            }
        }));
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const command =

        vscode.commands.registerTextEditorCommand('extension.runTapeTests', async (textEditor, edit, ...args) => {
            console.info(textEditor, edit);
            console.info(args);
            const {selection, document: {fileName}, options: {lineNumbers}, viewColumn} = textEditor;
            const segmentToMatch = function () {
                const segements = fileName && fileName.split(/\/|\\/).flatMap(s => [s.split('.')[0]]);
                return segements[segements.length - 1];
            }().split('.');
            const testFiles = await vscode.workspace.findFiles(`**/${segmentToMatch}.spec.{ts,js}`, undefined, Infinity, undefined);
            console.info(testFiles);
            testFiles.forEach(file => {
                vscode.commands.executeCommand('run test');
            })
        });




    context.subscriptions.push(command);
}

// this method is called when your extension is deactivated
export function deactivate() {
}