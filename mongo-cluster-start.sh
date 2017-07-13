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
		$workingdir/bin/mongod --configsvr --replSet cloudConfigSever --dbpath=$workingdir/mongo-nodes/$nodeid/data --logpath=$workingdir/mongo-nodes/$nodeid/log/mongo.log --logappend --fork --port=$mongo_port
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

cd $workingdir
./bin/mongos --configdb cloudConfigSever/$currentHost:$((basePort+1)),$currentHost:$((basePort+2)),$currentHost:$((basePort+3)) --fork --logappend --logpath ./mongo-nodes/shardedcluster.log --port $mongosPort
# mongo --host <hostname> --port <port>
# sh.addShard( "<replSetName>/s1-mongo1.example.net:27017")
# sh.shardCollection("<database>.<collection>", { <key> : <direction> } )
# cd /home/nb073/benlv/cloudLog/binary/mongodb-linux-x86_64-ubuntu1404-3.4.2

# for (var i=0; i<100000; i++) {  db.logs.insert( { "username" : "user"+i, "created at" : new Date() } );  }

# ./bin/mongos --configdb R9P6XYZ:27001,R9P6XYZ:27002,R9P6XYZ:27003 --fork --logappend --logpath ./mongo-nodes/shardedcluster.log
