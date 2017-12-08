#!/bin/bash

stoprce.sh
sleep 1
startrce.sh
laststart=$(date +%s)
echo laststarteck $laststart
while :
do
	for fn in $code
	do
		pathname=$rce/$fn
		#echo $pathname
		modtime=$(date +%s -r $pathname )
		echo $modtime
		if [[ $modtime -gt $laststart ]]
		then
			echo $pathname has new code, restarting server...
			stoprce.sh
			sleep 1
			startrce.sh
			laststart=$(date +%s)
		else
			echo $pathname : no change since last restart
		fi	

	done  
	sleep 2
done
