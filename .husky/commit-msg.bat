@echo off
setlocal enabledelayedexpansion

REM Get the commit message from the file
set /p commit_message=<"%1"

REM Check if commit message starts with allowed prefixes
echo !commit_message! | findstr /r "^add:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^chore:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^fix:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^feat:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^docs:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^style:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^refactor:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^test:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^perf:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^ci:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^build:" >nul
if !errorlevel! equ 0 goto valid

echo !commit_message! | findstr /r "^revert:" >nul
if !errorlevel! equ 0 goto valid

REM Invalid commit message
echo ❌ Invalid commit message format!
echo.
echo Commit message must start with one of the following prefixes followed by a colon:
echo   • add: for adding new features or files
echo   • chore: for maintenance tasks
echo   • fix: for bug fixes
echo   • feat: for new features
echo   • docs: for documentation changes
echo   • style: for formatting changes
echo   • refactor: for code refactoring
echo   • test: for adding or modifying tests
echo   • perf: for performance improvements
echo   • ci: for CI/CD changes
echo   • build: for build system changes
echo   • revert: for reverting changes
echo.
echo Example: 'add: new user authentication feature'
echo Your message: '!commit_message!'
echo.
exit /b 1

:valid
echo ✅ Commit message format is valid!
exit /b 0
