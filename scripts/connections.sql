-- queries to check open connection for a db
-- https://stackoverflow.com/questions/1248423/how-do-i-see-active-sql-server-connections

-- shows count of open connections
SELECT 
    DB_NAME(dbid) as DBName, 
    COUNT(dbid) as NumberOfConnections,
    loginame as LoginName
FROM
    sys.sysprocesses
WHERE 
    dbid > 0
GROUP BY 
    dbid, loginame;

-- show details
EXEC sp_who
EXEC sp_who2