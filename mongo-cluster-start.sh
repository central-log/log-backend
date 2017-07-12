workingdir='/home/nb073/benlv/cloudLog/binary/mongodb-linux-x86_64-ubuntu1404-3.4.2'
nodedirectory='node-'

for i in {1..10}
	do
    cd $workingdir
		mongo_port=`expr 10000 + $i`
		nodeid=$nodedirectory$i
		echo "$workingdir/bin/mongod --dbpath=$workingdir/mongo-nodes/$nodeid/data --logpath=$workingdir/mongo-nodes/$nodeid/log/mongo.log --fork --port=$mongo_port --replSet cloudlog"
		$workingdir/bin/mongod --dbpath=$workingdir/mongo-nodes/$nodeid/data --logpath=$workingdir/mongo-nodes/$nodeid/log/mongo.log --fork --port=$mongo_port --replSet cloudlog
	done
