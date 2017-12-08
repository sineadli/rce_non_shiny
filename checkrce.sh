#!/bin/bash
psout=($( ps -aux|grep rceserver[.]js |grep -v grep |grep -v $0 ))
if [[ ${#psout[@]} -eq 0 ]]
then
	echo rceserver.js stopped, please check rceserver.log and rceserver.nohup for errors!!
else
	echo rceserver.js is running.
fi

