#!/bin/bash

cd $rce
psout=($( ps -aux|grep rceserver[.]js |grep -v grep |grep -v $0 ))
if [[ ${#psout[@]} -eq 0 ]]
then
	until node rceserver.js >>$logs/rceserver.log 2>&1 ; do

	echo `date` rceserver exited with $?, will restart automatically in 5 sec

	sleep 2

	echo `date` restarting rceserver 
	done
else
	echo rceserver.js already started!!!
fi

exit 0
