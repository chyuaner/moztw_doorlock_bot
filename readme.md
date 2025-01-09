摩滋工寮 開門機器人
===

username: moztw_doorlock_bot

建置
===
1. git clone
2. `yarn` 安裝相關套件
3. 複製 `.env.sample` 檔案成 `.env`，並視情況改參數
4. `yarn run start`

正式佈署時，請搭配pm2做always restart。


commands
===
```
doorstatus - 取得電量狀態
opendoor - 開門
debug - 測試
```