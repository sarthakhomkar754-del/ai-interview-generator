@echo off
set MAVEN_DIR=%~dp0.mvn\apache-maven-3.9.6\bin\mvn.cmd
if exist "%MAVEN_DIR%" (
    call "%MAVEN_DIR%" %*
) else (
    echo Maven binary not found.
    exit /b 1
)
