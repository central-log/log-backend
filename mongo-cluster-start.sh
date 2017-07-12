workingdir='/home/nb073/benlv/cloudLog/binary/mongodb-linux-x86_64-ubuntu1404-3.4.2'
nodedirectory='node-'
basePort=27000
mongosPort=26061
currentHost='R9P6XYZ'
for i in {1..3}
	do
    cd $workingdir
		mongo_port=$((basePort+i))
		echo $mongo_port
		nodeid=$nodedirectory$i
		$workingdir/bin/mongod --configsvr --dbpath=$workingdir/mongo-nodes/$nodeid/data --logpath=$workingdir/mongo-nodes/$nodeid/log/mongo.log --logappend --fork --port=$mongo_port
	done

for i in {4..6}
	do
    cd $workingdir
		mongo_port=$((basePort+i))
		echo $mongo_port
		nodeid=$nodedirectory$i
		$workingdir/bin/mongod --shardsvr --replSet cloudlog-a --dbpath=$workingdir/mongo-nodes/$nodeid/data --logpath=$workingdir/mongo-nodes/$nodeid/log/mongo.log --fork --port=$mongo_port
	done

for i in {7..9}
	do
    cd $workingdir
		mongo_port=$((basePort+i))
		echo $mongo_port
		nodeid=$nodedirectory$i
		$workingdir/bin/mongod --shardsvr --replSet cloudlog-b --dbpath=$workingdir/mongo-nodes/$nodeid/data --logpath=$workingdir/mongo-nodes/$nodeid/log/mongo.log --fork --port=$mongo_port
	done

$workingdir/bin/mongos --configdb $currentHost:$((basePort+1)),$currentHost:$((basePort+2)),$currentHost:$((basePort+3)) --fork --logappend --logpath $workingdir/mongo-nodes/shardedcluster.log --port $mongosPort
