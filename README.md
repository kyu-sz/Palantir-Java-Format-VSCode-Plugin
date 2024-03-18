# Palantir Java Format

Support using [palantir-java-format](https://github.com/palantir/palantir-java-format) as Java formatter in VSCode.

## Requirements

1. Clone [the palantir-java-format Git repo](https://github.com/palantir/palantir-java-format).
2. Make sure this command works in the cloned git repo: `./gradlew -i <your_java_file_path>`
3. Set `palantir-java-format.repoPath` in VSCode to the path of this cloned repo.

## Extension Settings

* `palantir-java-format.repoPath`: Path to the cloned repo of [palantir-java-format](https://github.com/palantir/palantir-java-format).
* `palantir-java-format.additionalArgs`: Additional arguments to pass to the formatter.

## Release Notes

### 0.2.0

Allow using all-deps jar instead of `./gradlew run`.

### 0.1.4

Show logs in output channel.

### 0.1.3

Add license.

### 0.1.2

Fix configuration declaration.

### 0.1.1

Only show error messages when error occurs.

### 0.1.0

Change repo path setting key to "repoPath".

### 0.0.1

Initial release.

---
