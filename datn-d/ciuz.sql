SELECT months.month AS 'MONTH', COALESCE(SUM(o.total), 0) AS totalAmount
FROM (
         SELECT 1 AS month UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6
         UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
     ) AS months
         LEFT JOIN `order` o ON MONTH(o.created_date) = months.month AND YEAR(o.created_date) = '2024'
GROUP BY months.month;