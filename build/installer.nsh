!macro customInstall
  ; 检测是否有旧版本正在运行，如果有则提示关闭
  nsExec::Exec 'taskkill /F /IM "System Shutdown Manager.exe"'
  
  ; 如果检测到已安装的版本，先静默卸载
  ReadRegStr $0 HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${UNINSTALL_APP_KEY}" "UninstallString"
  ${If} $0 != ""
    DetailPrint "检测到已安装版本，正在卸载..."
    ; 执行静默卸载，保留用户数据
    ExecWait '"$0" /S'
    Delete "$0"
  ${EndIf}
!macroend

!macro customUnInstall
  ; 卸载时关闭正在运行的应用
  nsExec::Exec 'taskkill /F /IM "System Shutdown Manager.exe"'
!macroend
