import * as vscode from 'vscode';
const { exec } = require('child_process');

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
	outputChannel = vscode.window.createOutputChannel('Palantir Java Format Output');

	let disposable = vscode.commands.registerCommand('extension.formatJavaFile', () => {
		const config = vscode.workspace.getConfiguration('palantir-java-format');
		const repoPath = config.get<string>('repoPath');
		const additionalArgs = config.get<string>('additionalArgs') || '';

		if (!repoPath) {
			vscode.window.showErrorMessage('Palantir Java Format repo path is not set. Please configure "palantir-java-format.repoPath" in settings.');
			return;
		}

		formatJavaFile(repoPath, additionalArgs);
	});

	context.subscriptions.push(disposable);

	vscode.languages.registerDocumentFormattingEditProvider('java', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const config = vscode.workspace.getConfiguration('palantir-java-format');
			const repoPath = config.get<string>('repoPath');
			const additionalArgs = config.get<string>('additionalArgs') || '';

			if (!repoPath) {
				vscode.window.showErrorMessage('Palantir Java Format repo path is not set. Please configure "palantir-java-format.repoPath" in settings.');
				return [];
			}

			formatJavaFile(repoPath, additionalArgs);
			return [];
		}
	});
}

function formatJavaFile(repoPath: string, additionalArgs: string) {
	vscode.window.activeTextEditor?.edit((editBuilder) => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const filePath = document.uri.fsPath;

			const command = `cd ${repoPath} && ./gradlew run --args="-i ${additionalArgs} ${filePath}"`;
			outputChannel.appendLine(`Running command: ${command}`);

			exec(command, (error: any, stdout: any, stderr: any) => {
				outputChannel.appendLine(stderr);
				outputChannel.appendLine(stdout);
				if (error) {
					vscode.window.showErrorMessage(`Error occurred during formatting: ${error.message}\n${stderr}`);
					outputChannel.appendLine(`Error occurred during formatting: ${error.message}\n${stderr}`);
					return;
				}
				editBuilder.replace(document.validateRange(new vscode.Range(0, 0, document.lineCount, 0)), stdout);
			});
		}
	});
}
