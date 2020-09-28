kill `cat processes/$1.divabotguardian`
kill `cat processes/$1.ffmpeg`
cd /divabotguardian
echo [`date`]Started Guardian"["$1"]" >> monitor.log
ffmpeg -y -ss 00:00:16 -i `curl http://projectdivar.com/streamdata/$1` -vf fps=10,setpts=N/FRAME_RATE/TB -updatefirst 1 streams/output$1.png  > log/ffmpeg$1.log 2>&1 &
echo $! > processes/$1.ffmpeg
echo [`date`]ffmpeg:$!"["$1"]" >> monitor.log
java -jar DivaBotGuardian/DivaBotGuardian/DivaBotGuardian.jar $1   > log/guardian$1.log 2>&1 &
echo $! > processes/$1.divabotguardian
echo [`date`]guardian:$!"["$1"]" >> monitor.log

while true; do
	p1=`ps $(cat processes/$1.ffmpeg)|wc -l`
	p2=`ps $(cat processes/$1.divabotguardian)|wc -l`
	if [ $p1 -lt 2 ]; then
		echo "Missing ffmpeg process... Killing off the rest."
		kill `cat processes/$1.divabotguardian`
		kill `cat processes/$1.ffmpeg`
		echo [`date`]"Killed off "`cat processes/$1.ffmpeg`" and "`cat processes/$1.divabotguardian`"["$1"]" >> monitor.log
		break;
	fi
	if [ $p2 -lt 2 ]; then
		echo "Missing java process... Killing off the rest."
		kill `cat processes/$1.divabotguardian`
		kill `cat processes/$1.ffmpeg`
		echo [`date`]"Killed off "`cat processes/$1.divabotguardian`" and "`cat processes/$1.ffmpeg`"["$1"]" >> monitor.log
		break;
	fi
	sleep 5
done