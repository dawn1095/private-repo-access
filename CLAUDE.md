# 插件/模块格式说明
.plugin：适用于iOS应用Loon

.sgmodule：适用于iOS应用Surge

.yaml：适用于iOS应用Egern

.stoverride：适用于iOS应用Stash

Stash 约束：覆写无参数设置面板，Token 不得写入可订阅的公开文件；
本仓库 Stash 为单文件覆写 github-private.stoverride（mitm + http.script 触发项
+ script-providers，argument 为空零 Token）；Token 由用户在本机另建本地覆写，
覆盖同名触发项的 argument 传入（$argument 为空时脚本回退读 $persistentStore）。

特别注意：不要用错了文件格式。