#!/bin/sh
mysql_db=`grep "DB_DATABASE" .env |awk -F'=' '{print $2}'`
mysql_user=`grep "DB_USERNAME" .env |awk -F'=' '{print $2}'`
mysql_pw=`grep "DB_PASSWORD" .env |awk -F'=' '{print $2}'`
mysqlshow=`which mysqlshow`
if [ "x"$mysqlshow = "x" ]
then
	echo "could not find mysqlshow."
	exit 1
fi

#check user password
ret=`${mysqlshow} -u ${mysql_user} -p${mysql_pw} > /dev/null 2>&1 ;echo $?`
if [ $ret != 0 ]
then
	echo "please check mysql user/password"
	exit 1
fi


#mysql_pw=`grep "DB_DATABASE" .env |awk -F'=' '{print $2}'`
ret=`${mysqlshow} -u ${mysql_user} -p${mysql_pw} ${mysql_db} users > /dev/null 2>&1;echo $?`
if [ $ret = "0" ]
then
	echo "DB already exists"
else
	echo "Initialize table"
	ret=`mysql -u${mysql_user} -p${mysql_pw} ${mysql_db} < simpl.sql`
	if [ $ret = "0" ]
	then
	else
		echo "There are some problems during DB initialization"
	fi
	exit 1
fi
