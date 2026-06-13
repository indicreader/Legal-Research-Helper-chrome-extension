@echo off
echo Adding all changes to Git...
git add .
echo.
set /p commitMsg="Enter commit message: "
echo.
echo Committing changes...
git commit -m "%commitMsg%"
echo.
echo Pushing to GitHub...
git push
echo.
echo Push Complete!
pause
