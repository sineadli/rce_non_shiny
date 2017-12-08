
psout=($(ps -aux|grep rcaserver[.]js |grep -v grep |grep -v $0))
if [[ ${#psout[@]} -eq 0 ]]
then
