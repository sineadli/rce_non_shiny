#!/bin/bash
servernohup=$logs/rceserver.nohup
touch $servernohup
echo starting rceserver..........

nohup $rce/rceserver.sh >>$servernohup 2>&1 &

sleep 1
psout=($( ps -aux|grep rceserver[.]js |grep -v grep |grep -v $0 ))
if [[ ${#psout[@]} -eq 0 ]]
then
	sleep 2
	psout=($( ps -aux|grep rceserver[.]js |grep -v grep |grep -v $0 ))
	if [[ ${#psout[@]} -eq 0 ]]
	then
		echo failed to start rceserver, please check $servernohup and $logs/rceserver.log for errors!!!!
	else
		echo rceserver started.
	fi
else
	echo rceserver started.
fi
