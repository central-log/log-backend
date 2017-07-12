ps -ef |grep [m]ongo | awk '{print $2}' | xargs kill -2
