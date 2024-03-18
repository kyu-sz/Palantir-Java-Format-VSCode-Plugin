import * as vscode from 'vscode';
const { exec } = require('child_process');

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.formatJavaFile', () => {
		const config = vscode.workspace.getConfiguration('palantir-java-format');
		const configPath = config.get<string>('configPath');
		const additionalArgs = config.get<string>('additionalArgs') || '';

		if (!configPath) {
			vscode.window.showErrorMessage('Palantir Java Format repo path is not set. Please configure "palantir-java-format.configPath" in settings.');
			return;
		}

		formatJavaFile(configPath, additionalArgs);
	});

	context.subscriptions.push(disposable);

	vscode.languages.registerDocumentFormattingEditProvider('java', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			const config = vscode.workspace.getConfiguration('palantir-java-format');
			const configPath = config.get<string>('configPath');
			const additionalArgs = config.get<string>('additionalArgs') || '';

			if (!configPath) {
				vscode.window.showErrorMessage('Palantir Java Format repo path is not set. Please configure "palantir-java-format.configPath" in settings.');
				return [];
			}

			formatJavaFile(configPath, additionalArgs);
			return [];
		}
	});
}

function formatJavaFile(configPath: string, additionalArgs: string) {
	vscode.window.activeTextEditor?.edit((editBuilder) => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const filePath = document.uri.fsPath;

			const command = `cd ${configPath} && ./gradlew run --args="-i ${additionalArgs} ${filePath}"`;
			vscode.window.showInformationMessage(`Running command: ` + command);
			exec(command, (error: any, stdout: any, stderr: any) => {
				if (error) {
					vscode.window.showErrorMessage(`Error: ${error.message}`);
					return;
				}
				if (stderr) {
					vscode.window.showErrorMessage(`Error occurred while formatting: ${stderr}`);
					vscode.window.showErrorMessage(`stderr: ${stderr}`);
					return;
				}
				editBuilder.replace(document.validateRange(new vscode.Range(0, 0, document.lineCount, 0)), stdout);
			});
		}
	});
}
