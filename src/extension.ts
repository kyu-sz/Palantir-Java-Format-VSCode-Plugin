import * as vscode from 'vscode';
const { exec } = require('child_process');

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
	outputChannel = vscode.window.createOutputChannel('Palantir Java Format Output');

	let formatDocumentDisposable = vscode.commands.registerCommand('extension.formatJavaDocument', () => {
		formatJavaFile();
	});

	let formatSelectionDisposable = vscode.commands.registerCommand('extension.formatJavaSelection', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const { start, end } = editor.selection;
			formatJavaFile(start.line, end.line);
		}
	});

	context.subscriptions.push(formatDocumentDisposable, formatSelectionDisposable);

	vscode.languages.registerDocumentRangeFormattingEditProvider('java', {
		provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] | Thenable<vscode.TextEdit[]> {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const startLine = range.start.line;
				const endLine = range.end.line;
				return formatJavaFile(startLine, endLine);
			}
			return [];
		}
	});
}

function formatJavaFile(startLine?: number, endLine?: number): vscode.TextEdit[] {
	const config = vscode.workspace.getConfiguration('palantir-java-format');
	const allDepsJarPath = config.get<string>('allDepsJarPath');
	const repoPath = config.get<string>('repoPath');
	const additionalArgs = config.get<string>('additionalArgs') || '';
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showErrorMessage('Unable to format Java file. Check configuration and try again.');
		return [];
	}

	const document = editor.document;
	const filePath = document.uri.fsPath;

	let linesArgs = '';
	if (startLine !== undefined && endLine !== undefined) {
		// Line index for palantir-java-format `--line` option is 1-based, so need to add 1 to both start and end.
		// Also the range end is exclusive, so we need to add another 1 to it.
		linesArgs = `--line ${startLine + 1}:${endLine + 2}`;
	}

	let command = '';
	if (allDepsJarPath) {
		command = `java -jar ${allDepsJarPath} -i ${additionalArgs} ${linesArgs} ${filePath}`;
	} else if (repoPath) {
		command = `cd ${repoPath} && ./gradlew run --args="-i ${additionalArgs} ${linesArgs} ${filePath}"`;
	} else {
		vscode.window.showErrorMessage('Either "allDepsJarPath" or "repoPath" must be set in the configuration.');
		return [];
	}

	outputChannel.appendLine(`Running command: ${command}`);

	exec(command, (error: any, stdout: any, stderr: any) => {
		outputChannel.appendLine(stderr);
		outputChannel.appendLine(stdout);
		if (error) {
			vscode.window.showErrorMessage(`Error occurred during formatting: ${error.message}\n${stderr}`);
			outputChannel.appendLine(`Error occurred during formatting: ${error.message}\n${stderr}`);
			return [];
		}

		const formattedText = stdout.trim();
		if (formattedText) {
			if (startLine !== undefined && endLine !== undefined) {
				const startPos = new vscode.Position(startLine, 0);
				const endPos = new vscode.Position(endLine, document.lineAt(endLine).text.length);
				const range = new vscode.Range(startPos, endPos);
				const edit = vscode.TextEdit.replace(range, formattedText);
				vscode.window.activeTextEditor?.edit((editBuilder) => {
					editBuilder.replace(range, formattedText);
				});
				return [edit];
			} else {
				const fullRange = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
				const edit = vscode.TextEdit.replace(fullRange, formattedText);
				vscode.window.activeTextEditor?.edit((editBuilder) => {
					editBuilder.replace(fullRange, formattedText);
				});
				return [edit];
			}
		} else {
			return [];
		}
	});

	return [];
}
