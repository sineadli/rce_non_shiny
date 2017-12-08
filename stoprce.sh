#!/bin/bash

echo stoppping rceserver............
ps -aux |grep rceserver[.]sh |grep -v grep |grep -v $0 |awk '{print $2}' |xargs kill 1>/dev/null 2>&1

ps -aux |grep rceserver[.]js |grep -v grep |grep -v $0 |awk '{print $2}' |xargs kill 1>/dev/null 2>&1
sleep 1
psout=($(ps -aux |grep rceserver[.]js|grep -v grep |grep -v $0))

if [[ ${#psout[@]} -eq 0 ]]
then
	echo stopped rceserver!
else
	echo kill it forcibly----
	ps -aux |grep rceserver[.]js |grep -v grep |grep -v $0 |awk '{print $1}' |xarg kill -9
	sleep 1
	psout=($(ps -aux |grep rceserver[.]js|grep -v grep |grep -v $0))
	if [[ ${#psout[@]} -eq 0 ]]
	then
		echo stoppped rceserver forcibly, check log for errors!!!!
	fi
fi

exit 0
		
