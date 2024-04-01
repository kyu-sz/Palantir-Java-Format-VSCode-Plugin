# Palantir Java Format

Support using [palantir-java-format](https://github.com/palantir/palantir-java-format) as Java formatter in VSCode.

## Requirements

### Using the official repo

1. Clone [the official palantir-java-format Git repo](https://github.com/palantir/palantir-java-format).
2. Make sure this command works in the cloned git repo: `./gradlew run -i <your_java_file_path>`.
3. Set `palantir-java-format.repoPath` in VSCode to the path of this cloned repo.

### Using an all-deps jar file

1. Clone [this forked palantir-java-format Git repo](https://github.com/kyu-sz/palantir-java-format).
2. Compile an all-deps jar file: `./gradlew shadowJar`.
3. Set `palantir-java-format.allDepsJarPath` in VSCode to the path of the shadow jar file.

## Extension Settings

* `palantir-java-format.repoPath`: Path to the cloned repo of [palantir-java-format](https://github.com/palantir/palantir-java-format).
* `palantir-java-format.allDepsJarPath`: Path to the all-deps Jar file of `palantir-java-format`.
* `palantir-java-format.additionalArgs`: Additional arguments to pass to the formatter.

## Release Notes

### 0.3.2

Update readme to explain the way to use all-deps jar file.

### 0.3.1

Correct line range option passed to palantir-java-format.

### 0.3.0

Support formatting selected lines, hence supporting formatting modified lines.

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
