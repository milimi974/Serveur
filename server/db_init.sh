#!/bin/bash 

dbname=Poem
usr=poemuser
pass='shingeki'

echo -n "Please enter postgres password for $USER: "
read -s PGPASSWORD
echo

export PGPASSWORD

psql postgres -c "create user $usr with password '$pass'"
psql postgres -c "create database $dbname"
psql $dbname -c "alter user $usr with password '$pass'"
psql $dbname -c "grant all privileges on database $dbname to $usr"

unset PGPASSWORD

