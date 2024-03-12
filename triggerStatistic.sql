CREATE OR REPLACE TRIGGER update_transactions_statistic
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transaction_statistic()

DROP TRIGGER update_transactions_statistic on transactions

SELECT  event_object_table AS table_name ,trigger_name         
FROM transactions.triggers   GROUP BY tab_name,   trigger_name 
 ORDER BY tab_name,trigger_name ;

INSERT INTO transaction_statistic (block_date, total_transactions)
    VALUES (DATE(NEW.block_timestamp), 1)
    ON DUPLICATE KEY UPDATE total_transactions = total_transactions + 1;
    


CREATE OR REPLACE FUNCTION update_transaction_statistic()
RETURNS TRIGGER AS $$
BEGIN 
	INSERT INTO transaction_statistic(block_date, total_transaction)
	VALUES (DATE(NEW.block_timestamp), 1)
	ON CONFLICT (block_date) DO UPDATE SET total_transaction = transaction_statistic.total_transaction + 1;
	
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
	
DELETE FROM transactions where block_timestamp > '2024-03-12 00:00'
SELECT * FROM transaction_statistic

INSERT INTO transactions VALUES ('0xe142792813f3f0c3f6783086978658e7140464a4c9291419c0c0243fefaa0cb7', 138, 0, '0x5d393976b4b2a3c19de0b5e2aa919428fe05ba41', '0x2c872c2dbeea9f8b802d14cf02183586cb875cb4', 0, 8000000, 0, '0xb61d27f6000000000000000000000000363a251ab72c602cb83a98c53918b16b1cdf7f27000000000000000000000000000000000000000000000000000000000000000000000000000 ... (2016 characters truncated) ... 0000000000000000000000000001331322d30332d323032342031303a33303a31320000000000000000000000000000000000000000000000000000000000000000000000000000000000', 757672, 757672, NULL, NULL, 1, '2024-03-12 03:30:10', 7898590, '0x2593ca9a787faed72f1d4931abe2d6abf101f2ca516b92012cf94be15a1bf878', NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL)
ON CONFLICT (hash) DO UPDATE SET "decodeInput" = excluded."decodeInput"


SELECT * FROM contracts
select * from token_transfers where token_address = '0x92cfeda9b1465cdc55c862e4e5e724c0fc42ebc6'

select * from transaction_statistic

SELECT
    (DATE_TRUNC('hour', block_date)) AS start_of_month,
    SUM(total_transaction) AS total_transactions
FROM transaction_statistic
GROUP BY start_of_month
ORDER BY start_of_month;


create table transactions_statistic_in_one_month (
	block_timestamp timestamp primary key,
	total_transaction Integer
)

create index block_timestamp_transactions_statistic_in_one_month on transactions_statistic_in_one_month (block_timestamp DESC) 


select * from transactions_statistic_in_one_month

insert into transactions_statistic_in_one_month (SELECT block_timestamp,
       COUNT(*) AS total_transactions from transactions
	   GROUP BY block_timestamp)
	   ON CONFLICT (block_timestamp)
	   DO Nothing
	   
CREATE table trans2024_Q1 PARTITION OF transactions_statistic FOR values from ('2024-01-01 00:00:00') TO ('2024-07-01 00:00:00');
CREATE table trans2024_Q2 PARTITION OF transactions_statistic FOR values from ('2024-07-01 00:00:00') TO ('2025-01-01 00:00:00');

CREATE OR REPLACE TRIGGER delete_transactions_statistic_one_month
AFTER INSERT ON transactions
FOR EACH STATEMENT
EXECUTE FUNCTION delete_transactions_statistic_one_month()


CREATE OR REPLACE FUNCTION update_transactions_statistic_one_month()
RETURNS TRIGGER AS $$
BEGIN 
	INSERT INTO transactions_statistic_in_one_month(block_timestamp, total_transaction)
	VALUES ((NEW.block_timestamp), 1)
	ON CONFLICT (block_timestamp) DO UPDATE SET total_transaction = transactions_statistic_in_one_month.total_transaction + 1;
	
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION delete_transactions_statistic_one_month()
RETURNS TRIGGER AS $$
BEGIN 
	DELETE FROM transactions_statistic_in_one_month WHERE block_timestamp < (now() - interval '30 day');
	
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;
		
		