@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 飘·黛玉重归 - 本地游戏服务
node "game-server.js"
if errorlevel 1 (
  echo.
  echo Node.js is required to start this game.
  pause
)
