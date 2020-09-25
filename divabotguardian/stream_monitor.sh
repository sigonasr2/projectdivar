cd /home/sigonasr2/divar/divabotguardian
ffmpeg -y -ss 00:00:16 -i `curl http://projectdivar.com/streamdata/$1` -vf fps=10,setpts=N/FRAME_RATE/TB -updatefirst 1 streams/output$1.png &
echo $! > processes/$1.ffmpeg
java -jar DivaBotGuardian/DivaBotGuardian/DivaBotGuardian.jar $1 &
echo $! > processes/$1.divabotguardian